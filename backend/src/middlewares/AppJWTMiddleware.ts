import jwt from "jsonwebtoken";
import { CONFIGS } from "../common/configs";
import { logger } from "../common/configs/logger";
import { AppError } from "../common/errors/AppError";
import { UserRepository } from "@/devconsole/users/repositories/user.repository";

import { dynamic_messages } from "@/common/constants/messages";
import { AccountStatus } from "@/common/enums/UserEnums";
import { AccessTokenRepository } from "@/devconsole/auth/repositories/accessToken.repository";

import { ACCESS_TOKEN_TYPES, SYS_MODELS } from "@/common/enums/IndexEnum";
import { MoreThan } from "typeorm";
export function expressAuthentication(req: any, securityName: string, scopes?: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
        const authHeader = req.headers.authorization;
        
        let token: string = '';
        let secretKey;

        if (!authHeader) {
            logger.error("No auth header found!")
            return reject(new AppError("Unauthorized access!",403));
        }

        if (typeof authHeader === 'string') {
            const headerParts = authHeader.trim().split(/\s+/);
            if (headerParts.length === 2 && headerParts[0] === 'Bearer') {
              token = headerParts[1];
            }
            else if(headerParts.length === 1){
                token = authHeader
            }
          }

        secretKey = CONFIGS.JWT_TOKEN.SECRET
        
        jwt.verify(token, secretKey, async (error:any, decoded: any) => {
            const authData = decoded?.jwtData
            if (error || !decoded || !authData) {
                logger.error(error)
                return reject(new AppError("Invalid token!",401));
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

            if(existingUser.user_status !== AccountStatus.ACTIVE){
                const message = "User account is inactive!";
                logger.info(message)
                return reject(new AppError("Unauthorized access!",401));
            }

            if(authData?.ACCESS_TOKEN_TYPE && authData?.ACCESS_TOKEN_TYPE === ACCESS_TOKEN_TYPES.REFRESH_ACCESS_TOKEN){
                const accessTokenRepository = new AccessTokenRepository();
                const foundToken = await accessTokenRepository.getRepo().findOne({
                    where:{
                        expires_at: MoreThan(new Date()),
                        token,
                        accessable_id: existingUser.id,
                        accessable_to: SYS_MODELS.USER_MODEL
                    }
                });
    
                if(!foundToken){
                    const message = "User token has expired!";
                    logger.info(message)
                    return reject(new AppError("Unauthorized access!",401));
                }
            }
            
            // Attach user data to request
            req.auth_user_details = authData;
            resolve(authData);
        });
    });
}
