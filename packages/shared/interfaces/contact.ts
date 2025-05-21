import { EntityAttributes, EntityCreationAttributes, EntityUpdateAttributes } from "./entity"
import { CompanyAttributes, CompanyCreationAttributes, CompanyUpdateAttributes } from "./company";


export interface ContactAttributes extends EntityAttributes
{
    name: string;
    email: string;
    phone: string;

    companyId: number;
    
    company?: CompanyAttributes
}

export interface ContactCreationAttributes extends EntityCreationAttributes<ContactAttributes, "company" | "companyId" > 
{
    companyId?: number;
    company?: CompanyCreationAttributes;
}

export interface ContactUpdateAttributes extends EntityUpdateAttributes<ContactAttributes, "company">
{
    company?: CompanyUpdateAttributes
}