declare global {
    export interface UserAttributes extends EntityAttributes
    {
        name: string;
        email: string;
        password: string;

        active: boolean;
        refreshToken?: string | null;

    }

    export type UserCreationAttributes = EntityCreationAttributes<UserAttributes, "active" | "refreshToken">

    export type UserUpdateAttributes = EntityUpdateAttributes<UserAttributes>
}

export {} ;