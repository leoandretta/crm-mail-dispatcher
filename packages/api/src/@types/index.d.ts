import { AuthenticatedUser } from "@shared/interfaces/authentication";
import { Attachment } from "nodemailer/lib/mailer"

declare global
{
    namespace Express 
    {
        interface Request 
        {
            user?: AuthenticatedUser;
            attachments?: Attachment[]
        }
    }
}

export {};