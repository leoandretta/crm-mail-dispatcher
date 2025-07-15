import { EntityAttributes, EntityCreationAttributes, EntityUpdateAttributes } from "@/database/interfaces";

export interface UserAttributes extends EntityAttributes
{
    name: string;
    email: string;
    password: string;

    active: boolean;
    refreshToken?: string | null;

}

export interface UserCreationAttributes extends EntityCreationAttributes<UserAttributes, "active" | "refreshToken">
{
}

export interface UserUpdateAttributes extends EntityUpdateAttributes<UserAttributes>
{
}