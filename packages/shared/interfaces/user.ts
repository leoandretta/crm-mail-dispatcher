import { CompanyAttributes, CompanyCreationAttributes, CompanyUpdateAttributes } from "./company";
import { EntityAttributes, EntityCreationAttributes, EntityUpdateAttributes } from "./entity";

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