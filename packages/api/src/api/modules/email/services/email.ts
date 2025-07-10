import { ContactRepository } from "@/database/schemas";
import MailDispatch from "@/services/mail";
import { DatabaseError } from "@/utils/exceptions";
import { EmailPayloadValues } from "@shared/interfaces/email"
import { Attachment } from "nodemailer/lib/mailer";
import { Op } from "sequelize";


class EmailServices 
{
    private contactsRepo: ContactRepository;
    
    constructor()
    {
        this.contactsRepo = new ContactRepository();
    }

    async send(payload: EmailPayloadValues, attachments?: Attachment[]): Promise<void> {
        try {
            const recipents = Array.isArray(payload.to) ? payload.to : [payload.to]
            
            const contacts = await this.contactsRepo.find({
                attributes: ["name", "email"],
                where: {
                    email: {
                        [Op.in]: recipents
                    }
                }
            })

            for await (const contact of contacts)
            {
                await MailDispatch.sendMail({
                    to: contact,
                    subject: payload.subject,
                    message: payload.message,
                    attachments
                })
            }
        } catch (error) {
            throw new DatabaseError(error.messsage)
        }
    }
}

export default new EmailServices();