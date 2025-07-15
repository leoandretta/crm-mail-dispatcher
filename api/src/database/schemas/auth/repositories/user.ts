import { BaseRepository } from "@/database/classes";
import { User } from "../models";
import { UserAttributes, UserCreationAttributes, UserUpdateAttributes } from "../interfaces";

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