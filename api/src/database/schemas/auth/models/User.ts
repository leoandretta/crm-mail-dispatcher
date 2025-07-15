import { Entity } from "@/database/classes";
import { DataTypes, Sequelize } from "sequelize";
import { UserAttributes, UserCreationAttributes } from "../interfaces";

class User extends Entity<UserAttributes, UserCreationAttributes> implements UserAttributes
{
    declare name: string;
    declare email: string;
    declare password: string;

    declare refreshToken?: string | null;

    declare active: boolean;

    static instantiate(DB: Sequelize): void {
        User.initialize<User, UserAttributes, UserCreationAttributes>({
            tableName: "tb_users",
            fields: {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                    autoIncrement: true
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: false
                },
                email: {
                    type: DataTypes.STRING(255),
                    allowNull: false
                },
                password: {
                    type: DataTypes.STRING(255),
                    allowNull: false
                },
                refreshToken: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true
                },
                createdAt: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    defaultValue: DB.literal("NOW()")
                },
                updatedAt: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    defaultValue: DB.literal("NOW()")
                }
            }
        }, DB)
    }
    
}


export default User;