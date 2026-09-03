import { Service } from 'typedi';
import { Tags, Route, Controller, Post, Body, Put, Get, Security, Query, Path, Request } from 'tsoa';
import { HttpResponseDTO } from '@common/types/HttpType';
import { errorResponse, successResponse } from '@/common/utils/responseHandlers';
import AuthService from '@/devconsole/auth/auth.service';
import { EmailVerificationDTO, LoginUserDto, OnlyEmailDTO, RegisterUserDto } from '@common/dtos/UserDto';
import { logger } from '@/common/configs/logger';
import { MESSAGES } from '@/common/constants/messages';
import { validateDto } from '@/common/utils/validator';
 
@Tags("Auth")
@Route("auth")
@Service()
export class AuthController extends Controller {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * Register a new candidate
   * @summary Register a new candidate 
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
   * Login a candidate
   * @summary Candidate login
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
   * Verify email of a candidate after account creation
   * @summary Verify email of a candidate after account creation
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
   * Google login a candidate
   * @summary Google login a candidate
   */
  @Post("/socials/google")
  public async loginWithGoogle(
    @Body() reqBody: { token: string }
  ): Promise<HttpResponseDTO> {
      const authUser = await this.authService.loginWithGoogle(reqBody.token);
      const { message, data } = authUser;
      logger.info(message);
      if (!authUser?.successful) {
        this.setStatus(400);
        return errorResponse({
          message: MESSAGES.AUTH.LOGIN.INVALID_LOGIN,
        });
      } else {
        this.setStatus(200);
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
}