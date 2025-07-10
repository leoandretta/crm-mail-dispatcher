import { EntityAttributes, EntityCreationAttributes, EntityUpdateAttributes } from "./entity"
import { ContactAttributes } from "./contact";

export interface CompanyAttributes extends EntityAttributes
{
    name: string;
    address?: string;

    contacts?: ContactAttributes[]
}

export interface CompanyCreationAttributes extends EntityCreationAttributes<CompanyAttributes>
{

}

export interface CompanyUpdateAttributes extends EntityUpdateAttributes<CompanyAttributes>
{

}