import { ContactAttributes } from "@shared/interfaces/contact";
import { Attachment } from "nodemailer/lib/mailer";

export interface MailerConfig {
    host: string;
    port: number;
    from: string;
    auth: OAuth2MailerAuth | SMTPMailerAuth
}

export interface NodemailerSource {
    host: string;
    port: number;
    secure: boolean;
    auth: OAuth2MailerAuth | SMTPMailerAuth;
    service?: string;
    tls?: {
        rejectUnauthorized?: boolean;
        ciphers?: string;
    };
}

interface OAuth2MailerAuth {
    type: "OAuth2";
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}

interface SMTPMailerAuth {
    type: "SMTP";
    user: string;
    password: string;
}
  
export interface MailerOptions {
    subject?: string;
    to: ContactAttributes;
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
    message?: string;
    attachments?: Attachment[];
    content?: MailerContent;
    inReplyTo?: string;
    references?: string[];
    headers?: {
        'References'?: string;
        'In-Reply-To'?: string;
    }
}
  
export interface MailerContent {
    [key: string]: any;
}
