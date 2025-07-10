import { EntityAttributes, EntityCreationAttributes, EntityUpdateAttributes } from "@shared/interfaces/entity";
import { BulkCreateOptions, CountOptions, CreateOptions, DestroyOptions, FindAndCountOptions, FindOptions, FindOrCreateOptions, UpdateOptions } from "sequelize";
import { Entity } from "../classes";
import { MakeNullishOptional } from "sequelize/types/utils";

export interface IRepository<
    E extends Entity<A, C>, 
    A extends EntityAttributes, 
    C extends Partial<Omit<A, 'id' | 'createdAt' | 'updatedAt'>> = EntityCreationAttributes<A>,
    U extends Partial<Omit<A, 'id' | 'createdAt' | 'updatedAt'>> = EntityUpdateAttributes<A>,
> {
    unscoped(): IRepository<E, A, C, U>;
    scope(scope: string): IRepository<E, A, C, U>;

    // SELECT
    find(options?: FindOptions<A>): Promise<E[]>;
    findById(id: number | string, options?: FindOptions<A>): Promise<E | null>;
    findOne(options?: FindOptions<A>): Promise<E | null>;
    findOrCreate(options: FindOrCreateOptions<A, MakeNullishOptional<C>>): Promise<[E, boolean]>;
    findAndCountAll(options: FindAndCountOptions<A>): Promise<{ rows: E[], count: number }>;
  
    // INSERT
    create(data: MakeNullishOptional<C>, options?: CreateOptions<A>): Promise<E>;
    bulkCreate(data: MakeNullishOptional<C>[], options?: BulkCreateOptions<A>): Promise<E[]>;
  
    // UPDATE
    update(data: Partial<A>, options: UpdateOptions<A>): Promise<[number, E[] | null]>;
  
    // DELETE
    delete(options: DestroyOptions<A>): Promise<number>;
  
    // UTILS
    count(options?: CountOptions<A>): Promise<number>;
  }