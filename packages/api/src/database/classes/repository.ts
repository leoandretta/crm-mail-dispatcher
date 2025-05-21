import { FindOptions, FindOrCreateOptions, CreateOptions, BulkCreateOptions, UpdateOptions, DestroyOptions, CountOptions } from "sequelize";
import { MakeNullishOptional } from "sequelize/lib/utils";
import { IRepository } from "../interfaces/repository";
import { Entity } from "./entity";
import {  CustomModelStatic } from "./model";
import { FindAndCountOptions } from "sequelize/lib/model";
import { EntityAttributes, EntityCreationAttributes, EntityUpdateAttributes } from "@crm-mail-dispatcher/shared/interfaces/entity";

export abstract class BaseRepository<
    E extends Entity<A, C>,
    A extends EntityAttributes,
    C extends {} = EntityCreationAttributes<A>,
    U extends {} = EntityUpdateAttributes<A>,
> implements IRepository<E, A, C, U>
{
    private model: CustomModelStatic<E>;

    constructor(model: CustomModelStatic<E>)
    {
        this.model = model;
    }
    
    get model_name(): string {
        return this.model.name
    }
    
    unscoped(): IRepository<E, A, C, U> {
        const unscopedModel = this.model.unscoped();
        const ScopedRepository = this.constructor as any;
        const newInstance = new ScopedRepository(unscopedModel);
        newInstance.model = unscopedModel;
        return newInstance;
    }

    scope(scope: string): IRepository<E, A, C, U> {
        const scopedModel = this.model.scope(scope);
        const ScopedRepository = this.constructor as any;
        const newInstance = new ScopedRepository(scopedModel);
        newInstance.model = scopedModel;

        return newInstance;
    }

    async count(options?: CountOptions<A>): Promise<number> {
        return await this.model.count(options);
    }
    
    async find(options?: FindOptions<A>): Promise<E[]> {
        return await this.model.findAll(options);
    }

    async findAndCountAll(options: FindAndCountOptions<A>): Promise<{ rows: E[], count: number }> {
        return await this.model.findAndCountAll(options);
    }

    async findById(id: number | string, options?: FindOptions<A>): Promise<E | null> {
        return await this.model.findByPk(id, options);
    }

    async findOne(options?: FindOptions<A>): Promise<E | null> {
        return await this.model.findOne(options);
    }

    async findOrCreate(options: FindOrCreateOptions<A, MakeNullishOptional<C>>): Promise<[E, boolean]> {
        return await this.model.findOrCreate(options);
    }

    async create(data: MakeNullishOptional<C>, options?: CreateOptions<A>): Promise<E> {
        return await this.model.create(data, options);
    }

    async bulkCreate(data: MakeNullishOptional<C>[], options?: BulkCreateOptions<A>): Promise<E[]> {
        return await this.model.bulkCreate(data, options);
    }

    async update(data: Partial<A>, options: UpdateOptions<A>): Promise<[number, E[]]> {
        return await this.model.update(data, { ...options, returning: true });
    }

    async delete(options: DestroyOptions<A>): Promise<number> {
        return await this.model.destroy(options);
    }
}