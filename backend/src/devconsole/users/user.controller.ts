import { Service } from 'typedi';
import { Tags, Route, Controller, Post, Body, Put, Get, Security, Query, Path, Request } from 'tsoa';
import { HttpResponseDTO } from '../../common/types/http.type';
import { errorResponse, successResponse } from '@/common/utils/httpResponse.util';
import { logger } from '@/common/configs/logger';
import UserService from '@/devconsole/users/user.service';
 
@Tags("Users")
@Route("users")
@Security("bearerAuth")
@Service()
export class UserController extends Controller {
  constructor(private readonly userService: UserService) {
    super();
  }

    /**
   * Get user's profile details
   * @summary Get user's profile details 
   */
    @Get("/")
    public async getUserProfile(
      @Request() req: any
    ): Promise<HttpResponseDTO> {
        const user_id = req?.auth_user_details?.user_id
        const user = await this.userService.getProfile(user_id);
        if (!user.successful) {
          logger.info(user?.message);
          this.setStatus(400);
          return errorResponse({
            message: user?.message as string,
            data: user.data,
          });
        }
  
        logger.info(user?.message);
        this.setStatus(200);
        return successResponse({
          message: user?.message as string,
          data: user.data,
          status_code: 200,
        });
    }
}