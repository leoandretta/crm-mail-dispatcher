import { BaseRepository } from "@/database/classes";
import { Company } from "@/database/models";
import { CompanyAttributes, CompanyCreationAttributes, CompanyUpdateAttributes } from "@crm-mail-dispatcher/shared/interfaces/company";

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