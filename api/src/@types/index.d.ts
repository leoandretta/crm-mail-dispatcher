import { AuthUser } from "@/config/interfaces/authentication";
import { Attachment } from "nodemailer/lib/mailer"

declare global
{
    namespace Express 
    {
        interface Request 
        {
            user?: AuthUser;
            attachments?: Attachment[]
        }
    }
}

export {};