import { Service } from "typedi";
import { logger } from "../../common/configs/logger";
import { AppError } from "../../common/errors/appError";
import { UserRepository } from "../users/repositories/user.repository";
import { CONFIGS } from "../../common/configs";
import { ServiceResponseDTO } from "../../common/types/http.type";
import { capitalizeFirst, compareHash, decrypt, encrypt, generateJWT, generateOTP, generateUUID, hasExpired, hashString } from "../../common/utils";
import { EmailVerificationDTO, LoginUserDto, OnlyEmailDTO, RegisterUserDto } from "../../common/dtos/user.dto";
import { AccountStatus, ONBOARDING_MEDIUM } from "../../common/enums/user.enums";
import { dynamic_messages, MESSAGES } from "../../common/constants/messages";
import { makeApiCall } from "@/common/utils/axios.util";
import {
  sendAccountActivationEmail,
  sendWelcomeEmail,
} from "../../common/queues/producers/email.producer";
import { hasValidMX } from "@/common/utils/validator.util";
import { AccessTokenRepository } from "@/devconsole/auth/repositories/accessToken.repository";
import { LessThan, MoreThan } from "typeorm";
import { ACCESS_TOKEN_TYPES, SYS_MODELS } from "@/common/enums";
import jwt from "jsonwebtoken";

@Service()
export default class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async registerUser(req: RegisterUserDto): Promise<ServiceResponseDTO> {
    const { email, password, full_name, terms_and_conditions } =
      req;
    let whereConditions = {
      email,
    };
    let message = null;
    if (CONFIGS.IS_PRODUCTION) {
      const isEmailValid = await hasValidMX(email);
      if (!isEmailValid) {
        message = "Invalid email domain. Please use a valid domain.";
        logger.error(message);
        throw new AppError(message);
      }
    }

    const existingUser = await this.userRepository.basicFindOneByConditions(
      whereConditions
    );
    if (existingUser) {
      message = MESSAGES.COMMON.EMAIL_EXISTS;
      throw new AppError(message);
    }

    if (!terms_and_conditions) {
      message = "You must accept the terms and conditions to register";
      logger.error(message);
      throw new AppError(message);
    }

    if (!terms_and_conditions) {
      message = "You must accept the terms and conditions to register";
      logger.error(message);
      throw new AppError(message);
    }

    const hashedPassword = await hashString(password);
    const { otp, expireAt: verification_expires_at } = generateOTP(30);
    const { uuid } = generateUUID();

    const user = await this.userRepository.create({
      email,
      full_name,
      verification_expires_at,
      verification_token: uuid,
      password_hash: hashedPassword,
      terms_and_conditions,
    });

    const { iv: ivHex, encryptedData } = encrypt(email);
    const verification_link = `${CONFIGS.BASE_URL}/email/verification/${uuid}?hash=${ivHex}&ref=${encryptedData}`;
    const messageBody = {
      otp,
      verification_link,
      email,
      first_name: capitalizeFirst(full_name),
    };

    await sendAccountActivationEmail(messageBody);

    message = MESSAGES.AUTH.REGISTRATION.SUCCESSFUL;

    const jwtDetails = generateJWT(
      {
        email: user.email,
        user_id: user.id,
        uuid: user.uuid,
        ACCESS_TOKEN_TYPE: ACCESS_TOKEN_TYPES.ACCESS_TOKEN
      },
      "USER_ACCESS_TOKEN"
    );


    return {
      successful: true,
      data: { user, token: jwtDetails },
      message,
    };
  }

  public async loginUser(
    req: LoginUserDto
  ): Promise<{
    isSuccess: boolean;
    message?: string;
    user?: any;
    token?: string;
  }> {
    const { email, password } = req;

    const existingUser = await this.userRepository.findOneAndRelations({
      where: { email },
      relations: ["plan"],
    });
    if (!existingUser) {
      throw new AppError(MESSAGES.ACCOUNT.INVALID_CREDENTIALS);
    }

    const isPasswordCheckOK = await compareHash(
      password,
      existingUser.password_hash || ""
    );

    if (!isPasswordCheckOK) {
      if (
        !existingUser.password_hash ||
        existingUser.mode_of_sign_up !== ONBOARDING_MEDIUM.EMAIL_PASSWORD
      ) {
        throw new AppError(
          "We found your account but was created using a social media account!",
          400
        );
      }
      throw new AppError(MESSAGES.ACCOUNT.INVALID_CREDENTIALS);
    }
    if (existingUser.user_status !== AccountStatus.ACTIVE || !existingUser.is_verified) {
      throw new AppError(MESSAGES.ACCOUNT.INACTIVE_ACCOUNT)
    }
    const jwtDetails = generateJWT(
      {
        email: existingUser.email,
        user_id: existingUser.id,
        uuid: existingUser.uuid,
        ACCESS_TOKEN_TYPE: ACCESS_TOKEN_TYPES.ACCESS_TOKEN
      },
      "USER_ACCESS_TOKEN"
    );
    logger.debug(MESSAGES.AUTH.LOGIN.JWT_GENERATED);

    return {
      isSuccess: true,
      user: existingUser,
      token: jwtDetails,
      message: MESSAGES.AUTH.LOGIN.LOGIN_SUCCESSFUL,
    };
  }

  public async loginWithGoogle(token: string): Promise<ServiceResponseDTO> {
    const data = await makeApiCall(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
      {
        method: "GET",
      }
    );
    let user;
    if (data && data?.email && data?.email_verified === 'true') {
      user = await this.userRepository.findOneAndRelations({
        where: { email: data?.email },
      });

      if (!user) {
        if (data?.name) {
          const [first_name, last_name] = data?.name.split(" ");
          user = await this.userRepository.create({
            email: data?.email,
            picture: data?.picture,
            full_name: data?.name,
            user_status: AccountStatus.ACTIVE,
            is_verified: true,
            mode_of_sign_up: ONBOARDING_MEDIUM.GOOGLE,
            terms_and_conditions: true,
          });

          const messageBody = {
            email: data?.email,
            first_name: capitalizeFirst(first_name as string),
          };
          await sendWelcomeEmail(messageBody);
        } else {
          throw new AppError("Login with Google failed!", 400);
        }
      }

      const accessToken = generateJWT(
        {
          email: user.email,
          user_id: user.id,
          uuid: user.uuid,
          ACCESS_TOKEN_TYPE: ACCESS_TOKEN_TYPES.ACCESS_TOKEN
        },
        "USER_ACCESS_TOKEN",
        "31d"
      );

      const expires_in = '31d'
      const refreshAccessToken = generateJWT(
        {
          email: user.email,
          user_id: user.id,
          uuid: user.uuid,
          ACCESS_TOKEN_TYPE: ACCESS_TOKEN_TYPES.REFRESH_ACCESS_TOKEN
        },
        "USER_REFRESH_ACCESS_TOKEN",
        expires_in
      );

      logger.debug(MESSAGES.AUTH.LOGIN.JWT_GENERATED);

      await this.setAuthToken(refreshAccessToken, user.id, SYS_MODELS.USER_MODEL, expires_in)

      console.log({ accessToken })
      console.log({ refreshAccessToken })

      return {
        successful: true,
        data: {
          user,
          token: accessToken,
          refresh_accesss_token: refreshAccessToken,
        },
        message: MESSAGES.AUTH.LOGIN.LOGIN_SUCCESSFUL,
      };
    } else {
      throw new AppError("Login with Google failed!", 400);
    }
  }

  public async validateEmail(
    req: EmailVerificationDTO
  ): Promise<ServiceResponseDTO> {
    const { verification_token, hash, ref } = req;

    let whereConditions = {
      verification_token,
    };
    const user = await this.userRepository.basicFindOneByConditions(
      whereConditions
    );
    if (!user) {
      throw new AppError(MESSAGES.EMAIL_VERIFICATION.INVALID, 404);
    }

    if (user.user_status === AccountStatus.ACTIVE) {
      throw new AppError(
        MESSAGES.EMAIL_VERIFICATION.ALREADY_ACTIVATED,
        404
      );
    }

    // Check if OTP has expired
    const expectedOtpExpirationDate = user.verification_expires_at;
    const expectedTokenExpirationDate = user.reset_token_expires_at;
    const otpHasExpired = hasExpired(expectedOtpExpirationDate);
    const tokenHasExpired = hasExpired(expectedTokenExpirationDate);
    if (tokenHasExpired || otpHasExpired) {
      throw new AppError(MESSAGES.EMAIL_VERIFICATION.EXPIRED, 400);
    } else {
      await this.userRepository.updateOne(
        {
          email: user.email,
        },
        {
          is_verified: true,
          user_status: AccountStatus.ACTIVE,
          verification_token: null,
          verification_expires_at: new Date(),
        }
      );
      const messageBody = {
        email: user.email,
        first_name: capitalizeFirst(user.full_name as string),
      };
      await sendWelcomeEmail(messageBody);

      const jwtDetails = generateJWT(
        {
          email: user.email,
          user_id: user.id,
          uuid: user.uuid,
          ACCESS_TOKEN_TYPE: ACCESS_TOKEN_TYPES.ACCESS_TOKEN
        },
        "USER_ACCESS_TOKEN"
      );

      return {
        successful: true,
        data: {
          user,
          token: jwtDetails,
        },
        message: MESSAGES.EMAIL_VERIFICATION.SUCCESS,
      };
    }
  }

  public async resendAccountActivationMail(
    req: OnlyEmailDTO
  ): Promise<ServiceResponseDTO> {
    const { email } = req;
    let message = null;
    const existingMerchant = await this.userRepository.basicFindOneByConditions(
      {
        email,
      }
    );
    if (!existingMerchant) {
      message = dynamic_messages.NOT_FOUND("Account");
      throw new AppError(message);
    }

    if (existingMerchant.user_status == AccountStatus.INACTIVE) {
      message = "Account is inactive";
      logger.error(message);
      throw new AppError(message);
    }

    if (existingMerchant.user_status == AccountStatus.SUSPENDED) {
      message = "Account is was suspended";
      logger.error(message);
      throw new AppError(message);
    }

    if (existingMerchant.user_status == AccountStatus.BANNED) {
      message = "Account was banned";
      logger.error(message);
      throw new AppError(message);
    }

    const { full_name, uuid: userUUid } = existingMerchant;
    const { otp, expireAt: otp_expires_at } = generateOTP(30);
    const { uuid } = generateUUID();

    await this.userRepository.updateOne(
      { email, uuid: userUUid },
      { verification_token: uuid, verification_expires_at: otp_expires_at }
    );
    const verification_link = `${CONFIGS.BASE_URL}/email/verification/${uuid}`;
    const messageBody = {
      otp,
      verification_link,
      email,
      first_name: capitalizeFirst(full_name as string),
    };

    await sendAccountActivationEmail(messageBody);

    message = `Account activation link was resent to ${email}`;

    return { successful: true, data: null, message };
  }

  public async setAuthToken(token: string, user_id: number, accessable_type: SYS_MODELS, expires_in: "31d" | "1h" | "24h"): Promise<void> {
    if (!token || !user_id) {
      throw new AppError("Token or user is not found!", 404);
    }
    let expires_at = new Date();

    switch (expires_in) {
      case "31d":
        expires_at.setDate(expires_at.getDate() + 31);
        break;
      case "1h":
        expires_at.setHours(expires_at.getHours() + 1);
        break;
      case "24h":
        expires_at.setHours(expires_at.getHours() + 24);
        break;
      default:
        expires_at.setDate(expires_at.getDate() + 31);
        break;
    }

    const accessTokenRepository = new AccessTokenRepository();
    await accessTokenRepository.getRepo().delete({
      expires_at: LessThan(new Date())
    });

    await accessTokenRepository.create({
      accessable_id: user_id,
      token,
      expires_at,
      accessable_to: accessable_type
    })
  }

  public async refreshAccessToken(token: string): Promise<ServiceResponseDTO> {
    if (!token) {
      throw new AppError("Token is not found!", 404);
    }

    const secretKey = CONFIGS.JWT_TOKEN.REFRESH_JWT_SECRET
    let decoded: any;

    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      logger.error(error);
      throw new AppError("Invalid token!", 403);
    }

    const authData = decoded?.jwtData
    if (
      !authData ||
      authData.ACCESS_TOKEN_TYPE !== ACCESS_TOKEN_TYPES.REFRESH_ACCESS_TOKEN
    ) {
      throw new AppError("Invalid token!", 403);
    }

    const userRepository = new UserRepository();
    const existingUser = await userRepository.getRepo().findOne({
      where: {
        uuid: authData?.uuid
      },
      select: [
        'email',
        'uuid',
        'id',
      ]
    });

    if (!existingUser) {
      const message = dynamic_messages.NOT_FOUND("User");
      logger.info(message)
      throw new AppError(message);
    }

    const accessTokenRepository = new AccessTokenRepository();
    const foundToken = await accessTokenRepository.getRepo().findOne({
      where: {
        expires_at: MoreThan(new Date()),
        token,
        accessable_id: existingUser.id,
        accessable_to: SYS_MODELS.USER_MODEL
      },
    });

    if (!foundToken) {
      const message = "User token has expired!";
      logger.info(message)
      throw new AppError("Unauthorized access!", 401);
    }
    else {
      const expires_in = '31d'
      const accessToken = generateJWT(
        {
          email: existingUser.email,
          user_id: existingUser.id,
          uuid: existingUser.uuid,
          ACCESS_TOKEN_TYPE: ACCESS_TOKEN_TYPES.ACCESS_TOKEN
        },
        "USER_ACCESS_TOKEN",
        expires_in
      );

      const refreshAccessToken = generateJWT(
        {
          email: existingUser.email,
          user_id: existingUser.id,
          uuid: existingUser.uuid,
          ACCESS_TOKEN_TYPE: ACCESS_TOKEN_TYPES.REFRESH_ACCESS_TOKEN
        },
        "USER_REFRESH_ACCESS_TOKEN",
        expires_in
      );

      logger.debug(MESSAGES.AUTH.LOGIN.JWT_GENERATED);

      await this.setAuthToken(refreshAccessToken, existingUser.id, SYS_MODELS.USER_MODEL, expires_in)

      return {
        successful: true,
        data: {
          user: existingUser,
          token: accessToken,
          refresh_accesss_token: refreshAccessToken,
        },
        message: MESSAGES.AUTH.LOGIN.LOGIN_SUCCESSFUL,
      };
    }
  }

  public async loginWithGitHub(): Promise<ServiceResponseDTO> {
    const params = new URLSearchParams({
      client_id: CONFIGS.GITHUB.CLIENT_ID!,
      redirect_uri: CONFIGS.GITHUB.CALLBACK_URL!,
      scope: "read:user user:email",
    });

    const githubUrl =
      `https://github.com/login/oauth/authorize?${params.toString()}`;
    
    return {
      successful: true,
      data: {
        githubUrl
      },
      message: "Github Oauth URL computed successfully!",
    };

  }

  public async verifyWithGitHubCallback(req: any): Promise<ServiceResponseDTO> {
    if(!req?.query?.code){
      throw new AppError("Code is not found!", 404);
    }
  
    const response = await makeApiCall(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        data:{
          client_id: CONFIGS.GITHUB.CLIENT_ID,
          client_secret: CONFIGS.GITHUB.CLIENT_SECRET,
          code: req?.query?.code,
          redirect_uri: CONFIGS.GITHUB.CALLBACK_URL,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    if(!response?.access_token){
      throw new AppError("Github access token is not found!", 404);
    }

    const accessToken = response?.access_token;

    const gitHubUserResponse = await makeApiCall(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if(!gitHubUserResponse?.email){
      const gitHubUserEmailsRes = await makeApiCall(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const githubUserEmails = gitHubUserEmailsRes.find((email: any) => email.primary && email.verified);
    if(!githubUserEmails){
      throw new AppError("Github email is not found!", 404);
    }

    gitHubUserResponse.email = githubUserEmails.email;
    }

    const user = await this.userRepository.create({
      email: gitHubUserResponse?.email,
      picture: gitHubUserResponse?.avatar_url ,
      full_name: gitHubUserResponse?.name,
      social_account_id: gitHubUserResponse?.id,
      user_status: AccountStatus.ACTIVE,
      is_verified: true,
      mode_of_sign_up: ONBOARDING_MEDIUM.GITHUB,
      terms_and_conditions: true,
    });

    const [first_name, last_name] = gitHubUserResponse?.name.split(" ");
    const messageBody = {
      email: gitHubUserResponse?.email,
      first_name: capitalizeFirst(first_name as string),
    };
    await sendWelcomeEmail(messageBody);

    return {
      successful: true,
      data: {githubUrl: CONFIGS.GITHUB.FRONTEND_URL},
      message: "Github Oauth completed successfully!",
    };

  }
}