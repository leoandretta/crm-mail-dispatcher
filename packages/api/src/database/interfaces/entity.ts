import { IndexesOptions, ModelAttributeColumnOptions } from "sequelize";
import { EntityAttributes } from "@shared/interfaces/entity";

// export type EntityAttributes = {
//     id: number;
//     createdAt: Date;
//     updatedAt: Date;
// }

// export type EntityCreationAttributes<E extends EntityAttributes, K extends keyof E = never> = Omit<E, 'id' | 'createdAt' | 'updatedAt' | K>

// export type EntityUpdateAttributes<E extends EntityAttributes, K extends keyof E = never> = Partial<Omit<E, 'id' | 'createdAt' | 'updatedAt' | K>>

export type EntityFields<T extends Exclude<EntityAttributes, keyof EntityAttributes>> = {
    [key in keyof T]: ModelAttributeColumnOptions;
};

export interface EntityOptions<T extends EntityAttributes> {	
    schema?: string;
    tableName: string;
    name?: {
        plural: string;
        singular: string;
    };
    fields: EntityFields<T>;
    timestamps?: boolean;
    underscored?: boolean;
    indexes?: IndexesOptions[];
}