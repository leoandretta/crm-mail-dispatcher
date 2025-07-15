import { BuildOptions } from "sequelize";

export interface IModel<E>
{
    new (values?: object, options?: BuildOptions): E;
}