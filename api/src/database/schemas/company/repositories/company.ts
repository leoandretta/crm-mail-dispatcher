import { BaseRepository } from "@/database/classes";
import { CompanyAttributes, CompanyCreationAttributes, CompanyUpdateAttributes } from "../interfaces";
import { Company } from "../models";

export class CompanyRepository extends BaseRepository<
    Company,
    CompanyAttributes,
    CompanyCreationAttributes,
    CompanyUpdateAttributes
>
{
    constructor() {
        super(Company)
    }
}