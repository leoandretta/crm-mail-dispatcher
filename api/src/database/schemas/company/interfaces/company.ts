import { EntityAttributes, EntityCreationAttributes, EntityUpdateAttributes } from "@/database/interfaces";
import { ContactAttributes } from "../../contact/interfaces";

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