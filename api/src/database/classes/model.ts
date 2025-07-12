import { Model } from "sequelize";

export abstract class CustomModel<
    TModelAttributes extends {} = any, 
    TCreationAttributes extends {} = TModelAttributes
> extends Model<TModelAttributes, TCreationAttributes> 
{
}

type NonConstructorKeys<T> = ({[P in keyof T]: T[P] extends new () => any ? never : P })[keyof T];

type NonConstructor<T> = Pick<T, NonConstructorKeys<T>>;

export type CustomModelStatic<M extends CustomModel> = NonConstructor<typeof CustomModel> & { new(): M };