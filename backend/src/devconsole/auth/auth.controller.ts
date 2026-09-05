import { Service } from 'typedi';
import { Tags, Route, Controller, Post, Body, Put, Get, Security, Query, Path, Request } from 'tsoa';
import { HttpResponseDTO } from '@/common/types/http.type';
import { errorResponse, successResponse } from '@/common/utils/httpResponse.util';
import AuthService from '@/devconsole/auth/auth.service';
import { EmailVerificationDTO, LoginUserDto, OnlyEmailDTO, RegisterUserDto } from '@/common/dtos/user.dto';
import { logger } from '@/common/configs/logger';
import { MESSAGES } from '@/common/constants/messages';
import { validateDto } from '@/common/utils/validator.util';
import { CONFIGS } from '@/common/configs';

@Tags("Auth")
@Route("auth")
@Service()
export class AuthController extends Controller {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * Register a new user
   * @summary Register a new user 
   */
  @Post("/register")
  public async registerUser(
    @Body() req: RegisterUserDto
  ): Promise<HttpResponseDTO> {
    await validateDto(RegisterUserDto, req);
    const newUser = await this.authService.registerUser(req);
    if (!newUser.successful) {
      logger.info(newUser?.message);
      this.setStatus(400);
      return errorResponse({
        message: newUser?.message as string,
        data: newUser.data,
      });
    }

    logger.info(newUser?.message);
    this.setStatus(201);
    return successResponse({
      message: newUser?.message as string,
      data: newUser.data,
      status_code: 201,
    });
  }

  /**
   * Login a user
   * @summary User login
   */
  @Post("/login")
  public async login(@Body() req: LoginUserDto)
    : Promise<HttpResponseDTO> {
    const authUser = await this.authService.loginUser(req);
    const { message, token, user } = authUser;
    logger.info(message);
    if (!authUser?.isSuccess) {
      this.setStatus(400);
      return errorResponse({
        message: MESSAGES.AUTH.LOGIN.INVALID_LOGIN,
      });
    } else {
      this.setStatus(200);
      const data = {
        user,
        token,
      };
      return successResponse({
        message: MESSAGES.AUTH.LOGIN.LOGIN_SUCCESSFUL,
        data,
        status_code: 200,
      });
    }
  }

  /**
   * Verify email of a user after account creation
   * @summary Verify email of a user after account creation
   */
  @Put("/email/verification/:verification_token")
  public async verifyEmail(
    @Query() hash: string,
    @Query() ref: string,
    @Path() verification_token: string
  ): Promise<HttpResponseDTO> {
    const verificationData: EmailVerificationDTO = {
      verification_token,
      hash,
      ref,
    };
    const user = await this.authService.validateEmail(verificationData);
    let message = null;
    if (user.successful) {
      message = MESSAGES.EMAIL_VERIFICATION.SUCCESS;
      logger.info(message);
      this.setStatus(200);
      return successResponse({
        message: user?.message as string,
        data: user.data,
      });
    } else {
      message = MESSAGES.EMAIL_VERIFICATION.FAILED;
      this.setStatus(400);
      return errorResponse({
        message: user?.message as string,
        data: user.data,
      });
    }
  }

  /**
   * Google login a user
   * @summary Google login a user
   */
  @Post("/socials/google")
  public async loginWithGoogle(
    @Body() reqBody: { token: string },
    @Request() req: any
  ): Promise<HttpResponseDTO> {
    const authUser = await this.authService.loginWithGoogle(reqBody.token);
    const { message, data } = authUser;
    const res = req.res;
    
    logger.info(message);
    if (!authUser?.successful) {
      this.setStatus(400);
      return errorResponse({
        message: MESSAGES.AUTH.LOGIN.INVALID_LOGIN,
      });
    } else {
      this.setStatus(200);
       res.cookie("access_token", data?.token, {
        httpOnly: true,
        secure: CONFIGS.IS_PRODUCTION,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refresh_token", data?.refresh_accesss_token, {
        httpOnly: true,
        secure: CONFIGS.IS_PRODUCTION,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return successResponse({
        message: MESSAGES.AUTH.LOGIN.LOGIN_SUCCESSFUL,
        data,
        status_code: 200,
      });
    }
  }

  /**
   * Resend email verification code
   * @summary Resend email verification code
   */
  @Put("/email/resend")
  public async resendAccountActivationMail(
    @Body() req: OnlyEmailDTO
  ): Promise<HttpResponseDTO> {
    const mailResent = await this.authService.resendAccountActivationMail(
      req
    );
    if (!mailResent.successful) {
      logger.info(mailResent?.message);
      this.setStatus(400);
      return errorResponse({
        message: mailResent?.message as string,
      });
    }

    logger.info(mailResent?.message);
    this.setStatus(200);
    return successResponse({
      message: MESSAGES.AUTH.LOGIN.LOGIN_SUCCESSFUL,
      status_code: 200,
    });
  }

  /**
  * Refresh user's access token
  * @summary Refresh user's access token
  */
  @Put("/refresh-token")
  public async refreshAccessToken(
    @Body() reqBody: { refresh_token: string }
  ): Promise<HttpResponseDTO> {
    const refreshAccessToken = await this.authService.refreshAccessToken(
      reqBody.refresh_token
    );
    if (!refreshAccessToken.successful) {
      logger.info(refreshAccessToken?.message);
      this.setStatus(403);
      return errorResponse({
        message: refreshAccessToken?.message as string,
        status_code: 403,
      });
    }

    logger.info(refreshAccessToken?.message);
    this.setStatus(200);
    return successResponse({
      message: MESSAGES.AUTH.LOGIN.LOGIN_SUCCESSFUL,
      status_code: 200,
      data: refreshAccessToken?.data
    });
  }

  /**
* Login a user with Github account
* @summary Login a user with Github account
*/
  @Get("/socials/github")
  public async loginWithGitHub(
    @Request() req: any
  ): Promise<HttpResponseDTO | void> {
    const authUser = await this.authService.loginWithGitHub();
    const res = req.res;
    const { message, data } = authUser;
    logger.info(message);
    if (!authUser?.successful) {
      this.setStatus(400);
      return errorResponse({
        message: MESSAGES.AUTH.LOGIN.INVALID_LOGIN,
      });
    } else {
      this.setStatus(200);
      res.redirect(data?.githubUrl);
    }
  }


/**
* Verify Github account auth code after redirection
* @summary Verify Github account auth code after redirection
*/
  @Get("/socials/github/callback")
  public async verifyWithGitHubCallback(
    @Request() req: any
  ): Promise<HttpResponseDTO | void> {
    const authUser = await this.authService.verifyWithGitHubCallback(req);
    const res = req.res;
    const { message, data } = authUser;
    logger.info(message);
    if (!authUser?.successful) {
      this.setStatus(400);
      return errorResponse({
        message: MESSAGES.AUTH.LOGIN.INVALID_LOGIN,
      });
    } else {
      this.setStatus(200);
      res.cookie("access_token", data?.token, {
        httpOnly: true,
        secure: CONFIGS.IS_PRODUCTION,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refresh_token", data?.refresh_accesss_token, {
        httpOnly: true,
        secure: CONFIGS.IS_PRODUCTION,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.redirect(data?.githubUrl);

    }
  }
}