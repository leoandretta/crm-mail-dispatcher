export type EntityAttributes = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export type EntityCreationAttributes<E extends EntityAttributes, K extends keyof E = never> = Omit<E, 'id' | 'createdAt' | 'updatedAt' | K>

export type EntityUpdateAttributes<E extends EntityAttributes, K extends keyof E = never> = Partial<Omit<E, 'id' | 'createdAt' | 'updatedAt' | K>>
