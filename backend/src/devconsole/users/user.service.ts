import { Service } from "typedi";
import { logger } from "../../common/configs/logger";
import { AppError } from "../../common/errors/AppError";
import { UserRepository } from "./repositories/user.repository";
import { ServiceResponseDTO } from "../../common/types/HttpType";
import { dynamic_messages, MESSAGES } from "../../common/constants/messages";

@Service()
export default class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async getProfile(user_id: number):
        Promise<ServiceResponseDTO> {
        let message;

        const existingUser = await this.userRepository.getRepo().findOne({
            where: {
                id: user_id
            },
            select: [
                "full_name",
                "created_at"
            ]
        });

        if (!existingUser) {
            message = dynamic_messages.NOT_FOUND("User");
            logger.info(message)
            throw new AppError(message)
        }

        message = dynamic_messages.FETCHED_SUCCESSFULLY("User");
        return {
            successful: true,
            data: {
                user: existingUser
            },
            message
        };
    }
}