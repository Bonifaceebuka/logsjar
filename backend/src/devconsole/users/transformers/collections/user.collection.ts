import UserModel from "@/devconsole/users/models/user.model";

import { UserResource } from "@/devconsole/users/transformers/resources/user.resource";

export class UserCollection {
  static toJSON(users: UserModel[]) {
    return users.map((user) => UserResource.userToJSON(user));
  }
}