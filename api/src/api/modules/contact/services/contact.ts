import { FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from "sequelize";
import { LoadOptions } from "devextreme/data";
import { LoadResultObject } from "devextreme/common/data/custom-store";
import AppDataSource from "@/database";
import { ICRUDService } from "@/config/interfaces";
import { Devextreme } from "@/services/devextreme";
import { Contact } from "@/database/schemas/models";
import { ContactRepository, CompanyRepository} from "@/database/schemas";
import { DatabaseError } from "@/utils/exceptions";
import { ContactAttributes, ContactCreationAttributes, ContactUpdateAttributes } from "@/database/schemas/contact/interfaces";

class ContactServices implements ICRUDService<
    Contact,
    ContactAttributes, 
    ContactCreationAttributes, 
    ContactUpdateAttributes
>
{
    private defaultRepo: ContactRepository;
    private companyRepo: CompanyRepository;
    private dx: Devextreme<Contact, ContactAttributes>;

    constructor(){
        this.defaultRepo = new ContactRepository();
        this.companyRepo = new CompanyRepository();

        this.dx = new Devextreme<Contact, ContactAttributes>(AppDataSource, {
            count: this.defaultRepo.unscoped().count.bind(this.defaultRepo),
            findAndCountAll: this.defaultRepo.unscoped().findAndCountAll.bind(this.defaultRepo),
            find: this.defaultRepo.unscoped().find.bind(this.defaultRepo),
        })
    }

    async devextreme(options: LoadOptions<ContactAttributes>): Promise<LoadResultObject<ContactAttributes>>
    {
        options.customQueryParams = JSON.stringify({
            ...JSON.parse(options.customQueryParams),
            entidade: this.defaultRepo.model_name
        })
        return await this.dx.find(options);
    }

    async find(options?: FindOptions<ContactAttributes> | undefined): Promise<Contact[]> {
        return await this.defaultRepo.find(options);
    }

    async findOne(options: FindOptions<ContactAttributes>): Promise<Contact | null> {
        return await this.defaultRepo.findOne(options);
    }

    async findById(id: string | number, options?: FindOptions<ContactAttributes> | undefined): Promise<Contact | null> {
        return await this.defaultRepo.findById(id, {
            attributes: ["id", "name", "email", "phone"],
            include: [
                { association: "company", attributes: ["name"], required: true }
            ]
        });
    }

    async create(payload: ContactCreationAttributes, options?: CreateOptions<ContactAttributes>): Promise<Contact> {
        if(Array.isArray(payload)) throw new DatabaseError(`Método de cadastro único, valor inválido recebido.`)
        const transaction = await AppDataSource.transaction()
        try {
            const { 
                company: p_company, 
                ...p_contact 
            } = payload
            

            if(p_company)
            {
                const [company] = await this.companyRepo.findOrCreate({
                    where: AppDataSource.where(
                        AppDataSource.fn("UNACCENT", AppDataSource.fn("LOWER", AppDataSource.col("name"))),
                        "=",
                        AppDataSource.fn("UNACCENT", AppDataSource.fn("LOWER", p_company.name)),
                    ),
                    defaults: p_company,
                    transaction
                })
                if(!company || !company.id) throw new DatabaseError("Não foi possível realizar o cadastro da empresa.");
                
                p_contact.companyId = company.id
            }
            
            const result = await this.defaultRepo.create(p_contact, {
                transaction
            });

            await transaction.commit();
            
            return result;
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

    async update(id: string | number, payload: ContactUpdateAttributes): Promise<[number, Contact[]]> {
        const transaction = await AppDataSource.transaction();
        try {
            const c_data = await this.defaultRepo.findById(id, {
                attributes: ["id", "name", "email", "phone"],
                include: [{ association: "company", attributes: ["id", "name"], required: true }],
                transaction
            });
            
            if(!c_data) throw new Error(`Contato não encontrado`);
            else if(!c_data.company) throw new Error(`Contato não retornou dados da empresa`);
            
            const { company: p_company, companyId, ...p_contact } = payload

            if(p_company && c_data.company.name !== p_company.name) {
                await this.companyRepo.update(p_company, {
                    where: { id: c_data.company.id },
                    transaction
                })
            }

            const u_values = await this.defaultRepo.update(p_contact, {
                where: { id },
                transaction
            });

            await transaction.commit();
            
            return u_values;

        } catch (error) {

            await transaction.rollback();

            throw new DatabaseError(error.message);
        }
    }

    async delete(id: string | number, options?: DestroyOptions<ContactAttributes> | undefined): Promise<number> {
        const transaction = await AppDataSource.transaction()
        try {
            if(!id) throw new DatabaseError(`ID não fornecido!`);

            const [updateCount] = await this.defaultRepo.update({
                active: false
            }, {
                where: { id },
                transaction
            })
            await transaction.commit();
            return updateCount
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

}

export default new ContactServices();