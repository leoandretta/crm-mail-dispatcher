import { FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from "sequelize";
import { DatabaseError } from "@/utils/exceptions";
import { ICRUDService } from "@/config/interfaces";
import { Company, CompanyRepository } from "@/database/schemas";
import { CompanyAttributes, CompanyCreationAttributes } from "@crm-mail-dispatcher/shared/interfaces/company";

class CompanyServices implements ICRUDService<
    Company,
    CompanyAttributes,
    CompanyCreationAttributes
>
{
    private defaultRepo: CompanyRepository;

    constructor()
    {
        this.defaultRepo = new CompanyRepository();
    }
    
    async find(options?: FindOptions<CompanyAttributes> | undefined): Promise<Company[]> {
        return this.defaultRepo.find(options);
    }

    async findOne(options: FindOptions<CompanyAttributes>): Promise<Company | null> {
        return this.defaultRepo.findOne(options);

    }

    async findById(id: string | number, options?: FindOptions<CompanyAttributes> | undefined): Promise<Company | null> {
        return this.defaultRepo.findById(id, options);
    }

    async create(payload: CompanyCreationAttributes, options?: CreateOptions<CompanyAttributes> | undefined): Promise<Company> {
        return this.defaultRepo.create(payload, options);
    }

    async bulkCreate(payload: CompanyCreationAttributes[], options?: CreateOptions<CompanyAttributes> | undefined): Promise<Company[]> {
        return this.defaultRepo.bulkCreate(payload, options);
    }

    async update(id: string | number, payload: Partial<Omit<CompanyAttributes, "id" | "createdAt" | "updatedAt">>): Promise<[number, Company[]]> {
        if(!id) throw new DatabaseError(`ID não fornecido!`);
        
        return this.defaultRepo.update(payload, {
            where: { id }
        });
    }

    async delete(id: string | number, options?: DestroyOptions<CompanyAttributes> | undefined): Promise<number> {
        if(!id) throw new DatabaseError(`ID não fornecido!`);
        
        return await this.defaultRepo.delete({
            ...options,
            where: { id }
        })
    }
}

export default new CompanyServices();