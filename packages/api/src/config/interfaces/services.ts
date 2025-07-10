import { FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from "sequelize";
import { BaseRepository, Entity } from "../../database/classes";
import { EntityAttributes, EntityCreationAttributes, EntityUpdateAttributes } from "@shared/interfaces/entity";

export interface ICRUDService<
    E extends Entity<T,C>,
    T extends EntityAttributes, 
    C extends {} = EntityCreationAttributes<T>,
    U extends {} = EntityUpdateAttributes<T>,
>
{
    
    find(options?: FindOptions<T> | undefined): Promise<E[]>;
    findOne(options: FindOptions<T>): Promise<E | null>;
    findById(id: string | number, options?: FindOptions<T> | undefined): Promise<E | null>;

    create(payload: C, options?: CreateOptions<T>): Promise<E>;

    update(id: string | number, payload: U): Promise<[number, E[]]>;

    delete(id: string | number): Promise<number>;
}