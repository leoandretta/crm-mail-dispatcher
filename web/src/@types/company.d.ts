declare global {
    
    export interface CompanyAttributes extends EntityAttributes
    {
        name: string;
        address?: string;

        contacts?: ContactAttributes[]
    }

    export type CompanyCreationAttributes = EntityCreationAttributes<CompanyAttributes>

    export type CompanyUpdateAttributes = EntityUpdateAttributes<CompanyAttributes>
}

export {};