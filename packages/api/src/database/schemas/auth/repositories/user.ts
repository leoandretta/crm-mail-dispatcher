import { BaseRepository } from "@/database/classes";
import { User } from "../models";
import { UserAttributes, UserCreationAttributes, UserUpdateAttributes} from "@shared/interfaces/user"

export class UserRepository extends BaseRepository<
    User,
    UserAttributes,
    UserCreationAttributes,
    UserUpdateAttributes
>
{
    constructor()
    {
        super(User);
    }
}