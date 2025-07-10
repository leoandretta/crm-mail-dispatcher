import { Entity } from '@/database/classes';
import { Sequelize, DataTypes, literal } from 'sequelize';
import { Contact } from '@/database/models';
import { CompanyAttributes, CompanyCreationAttributes } from '@shared/interfaces/company';
import { ContactAttributes } from '@shared/interfaces/contact';

class Company extends Entity<
    CompanyAttributes,
    CompanyCreationAttributes
> implements CompanyAttributes
{
    declare name: string;
    declare address?: string;

    declare contacts?: ContactAttributes[];

    static instantiate(DB: Sequelize): void {
        Company.initialize<Company, CompanyAttributes, CompanyCreationAttributes>({
            tableName: "tb_companies",
            name: {
                singular: "company",
                plural: "companies"
            },
            fields: {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: false
                },
                address: {
                    type: DataTypes.STRING(255),
                    allowNull: true
                },
                createdAt: {
                    type: DataTypes.DATE,
                    defaultValue: DB.literal("NOW()"),
                    allowNull: false
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    defaultValue: DB.literal("NOW()"),
                    allowNull: false
                }
            }
        }, DB)
    }   

    static setAssociations(): void {
        Company.hasMany(Contact, { foreignKey: { field: 'companyId', allowNull: false }})
    }
}

export default Company;