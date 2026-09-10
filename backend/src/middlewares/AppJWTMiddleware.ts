import jwt from "jsonwebtoken";
import { CONFIGS } from "../common/configs";
import { logger } from "../common/configs/logger";
import { AppError } from "../common/errors/appError";
import { UserRepository } from "@/devconsole/users/repositories/user.repository";

import { dynamic_messages } from "@/common/constants/messages";
import { AccountStatus } from "@/common/enums/user.enums";
import { AccessTokenRepository } from "@/devconsole/auth/repositories/accessToken.repository";

import { ACCESS_TOKEN_TYPES, SYS_MODELS } from "@/common/enums";
import { MoreThan } from "typeorm";
import ApiKeyService from "@/devconsole/api-key/apiKey.service";
import { ApiKeyRepository } from "@/devconsole/api-key/repositories/apiKey.repository";
export function expressAuthentication(req: any, securityName: string, scopes?: string[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
        if (securityName == "sdkBearerAuth") {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
            logger.error("No auth header found!")
            return reject(new AppError("Unauthorized access!",403));
        }

        if (typeof authHeader === 'string') {
            const headerParts = authHeader.trim().split(/\s+/);
            let sdkToken: string ='';
            if (headerParts.length === 2 && headerParts[0] === 'Bearer') {
              sdkToken = headerParts[1];
            }
            else if(headerParts.length === 1){
                sdkToken = authHeader
            }

            const apiKeyService =  new ApiKeyService();
            const apiKeyRepository =  new ApiKeyRepository();
            const hashSdkToken = apiKeyService.hashApiKey(sdkToken);
            const foundApiKey = await apiKeyRepository.getRepo().findOne({
                where: {
                    key_hash: hashSdkToken,
                }
            });
            
            if (!foundApiKey) {
                const message = dynamic_messages.NOT_FOUND("API KEY");
                logger.info(message)
                return reject(new AppError(message))
            }

            req.auth_sdk_details = foundApiKey;
            resolve(foundApiKey);
          }
        }
        else {
            const accessToken = req.cookies.access_token;

            let token: string = '';
            let secretKey;

            if (!accessToken) {
                logger.error("No auth cookies found!")
                return reject(new AppError("Unauthorized access!", 403));
            }

            const headerParts = accessToken.trim().split(/\s+/);
            if (headerParts.length === 2 && headerParts[0] === 'Bearer') {
                token = headerParts[1];
            }
            else if (headerParts.length === 1) {
                token = accessToken
            }

            secretKey = CONFIGS.JWT_TOKEN.SECRET
            jwt.verify(token, secretKey, async (error: any, decoded: any) => {
                const authData = decoded?.jwtData
                if (error || !decoded || !authData) {
                    logger.error(error)
                    return reject(new AppError("Invalid token!", 401));
                }

                const userRepository = new UserRepository();
                const existingUser = await userRepository.basicFindOneByConditions({
                    uuid: authData?.uuid
                });

                if (!existingUser) {
                    const message = dynamic_messages.NOT_FOUND("User");
                    logger.info(message)
                    return reject(new AppError(message))
                }

                if (existingUser.user_status !== AccountStatus.ACTIVE) {
                    const message = "User account is inactive!";
                    logger.info(message)
                    return reject(new AppError("Unauthorized access!", 401));
                }

                // if(authData?.ACCESS_TOKEN_TYPE && authData?.ACCESS_TOKEN_TYPE === ACCESS_TOKEN_TYPES.REFRESH_ACCESS_TOKEN){
                //     const accessTokenRepository = new AccessTokenRepository();
                //     const foundToken = await accessTokenRepository.getRepo().findOne({
                //         where:{
                //             expires_at: MoreThan(new Date()),
                //             token,
                //             accessable_id: existingUser.id,
                //             accessable_to: SYS_MODELS.USER_MODEL
                //         }
                //     });

                //     if(!foundToken){
                //         const message = "User token has expired!";
                //         logger.info(message)
                //         return reject(new AppError("Unauthorized access!",401));
                //     }
                // }

                // Attach user data to request
                req.auth_user_details = authData;
                resolve(authData);
            });
        }
    });
}
