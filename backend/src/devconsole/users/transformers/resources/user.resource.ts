import UserModel from "@/devconsole/users/models/user.model";

export class UserResource {
  static userToJSON(user: UserModel) {
    const { uuid, created_at, email, full_name, is_verified, user_status } = user;

    return {
      uuid, created_at, email, full_name, is_verified, user_status
    };
  }
}
