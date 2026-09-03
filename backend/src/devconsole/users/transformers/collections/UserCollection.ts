import UserModel from "@models/UserModel";
import { UserResource } from "@/devconsole/users/transformers/resources/UserResource";

export class UserCollection {
  static toJSON(users: UserModel[]) {
    return users.map((user) => UserResource.userToJSON(user));
  }
}