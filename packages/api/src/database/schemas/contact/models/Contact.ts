import { DataTypes, literal, Sequelize } from "sequelize";
import { Entity } from "@/database/classes";
import { Company } from "@/database/models"
import { ContactAttributes, ContactCreationAttributes } from "@crm-mail-dispatcher/shared/interfaces/contact";
import { CompanyAttributes } from "@crm-mail-dispatcher/shared/interfaces/company";

class Contact extends Entity<
    ContactAttributes,
    ContactCreationAttributes
> implements ContactAttributes
{
    declare name: string;
    declare email: string;
    declare phone: string;
    
    declare companyId: number;
    
    declare company?: CompanyAttributes;

    static instantiate(DB: Sequelize): void {
        Contact.initialize<Contact, ContactAttributes, ContactCreationAttributes>({
            tableName: "tb_contacts",
            name: {
                singular: "contact",
                plural: "contacts"
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
                email: {
                    type: DataTypes.STRING(100),
                    allowNull: false
                },
                phone: {
                    type: DataTypes.STRING(20),
                    allowNull: false
                },
                companyId: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DB.literal("NOW()")
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DB.literal("NOW()")
                }
            },
            indexes: [
                {
                    fields: ["email"],
                    unique: true
                }
            ]
            
        }, DB)
    }

    static setAssociations(): void {
        Contact.belongsTo(Company, { foreignKey: { field: 'companyId', allowNull: false }})
    }
}

export default Contact;