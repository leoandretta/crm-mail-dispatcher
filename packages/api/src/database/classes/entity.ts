import { DataTypes, Sequelize } from "sequelize";
import { CustomModel } from "./model";
import { IModel } from "../interfaces/model";
import { EntityOptions } from "../interfaces";
import { EntityAttributes, EntityCreationAttributes } from "@crm-mail-dispatcher/shared/interfaces/entity";

export abstract class Entity<
    T extends EntityAttributes,
    C extends {} = EntityCreationAttributes<T>
> extends CustomModel<T, C> implements EntityAttributes
{
    declare id: number;
    declare createdAt: Date;
    declare updatedAt: Date;

    public static instantiate(DB: Sequelize): void {};

    public static initialize<
        E extends Entity<A,C>,
        A extends EntityAttributes,
        C extends {} = EntityCreationAttributes<A>
    >(options: EntityOptions<A>, database: Sequelize): void {
        const entity = this as unknown as typeof CustomModel & IModel<E>;

        entity.init(options.fields, {
            sequelize: database,
            schema: options.schema ?? 'public',
            tableName: options.tableName,
            name: options.name,
            timestamps: options.timestamps ?? false,
            underscored: false,
            indexes: options.indexes
        })
    }

    public static setAssociations(): void {};

    public static setScopes(): void {};

    public static setHooks(): void {};
}