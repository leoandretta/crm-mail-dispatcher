import { createTransport, Transporter } from "nodemailer";
import { MailerConfig, MailerContent, MailerOptions } from "../interfaces";
import { MailError } from "@/utils/exceptions";
import { formatContactName } from "@/utils/format";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { google } from "googleapis";
import path from "path"
import Mail, { Attachment } from "nodemailer/lib/mailer";
import { AppConfig } from "@/config";

class Mailer {
    private transporter?: Transporter;
    private config: MailerConfig;

    constructor(config: MailerConfig) {
      this.config = this.validateConfig(config);
    }
    
    private validateConfig (config: MailerConfig) {
      if (!config.host) throw new MailError('Variável de ambiente MAILER_HOST não definida');
      else if (!config.port) throw new MailError('Variável de ambiente MAILER_PORT não definida');
      else if (!config.auth || !config.auth.type) throw new MailError('Variável de ambiente MAILER_AUTH_TYPE não definida');
      else if (config.auth.type == "SMTP" && !config.auth.user) throw new MailError('Variável de ambiente MAILER_USER não definida');
      else if (config.auth.type == "SMTP" && !config.auth.password) throw new MailError('Variável de ambiente MAILER_PASSWORD não definida');
      else if (config.auth.type == "OAuth2" && !config.auth.clientId) throw new MailError('Variável de ambiente MAILER_CLIENT_ID não definida');
      else if (config.auth.type == "OAuth2" && !config.auth.clientSecret) throw new MailError('Variável de ambiente MAILER_CLIENT_SECRET não definida');
      else if (config.auth.type == "OAuth2" && !config.auth.refreshToken) throw new MailError('Variável de ambiente MAILER_REFRESH_TOKEN não definida');
      else if (!config.from) throw new MailError('Variável de ambiente MAILER_FROM não definida');
      return config;
    }
    
    private async setTransporter(): Promise<Transporter> {
      let transporterOptions: SMTPTransport.Options = {
        service: "gmail",
        host: this.config.host,
        port: this.config.port,
        secure: true,
        tls: {
          rejectUnauthorized: false
        },
        from: this.config.from,
      }
      if(this.config.auth.type == "SMTP") {
        transporterOptions.auth = {
          user: this.config.auth.user,
          pass: this.config.auth.password
        }
      }
      else {
        const OAuth2 = google.auth.OAuth2
        const OAuth2Client = new OAuth2(this.config.auth.clientId, this.config.auth.clientSecret)
        OAuth2Client.setCredentials({ refresh_token: this.config.auth.refreshToken })
        const accessToken = await OAuth2Client.getAccessToken()

        if(!accessToken?.token) throw new MailError("Access token não recebido!");

        transporterOptions.auth = {
          type: "OAuth2",
          user: this.config.auth.user,
          accessToken: accessToken.token,
          clientId: this.config.auth.clientId,
          clientSecret: this.config.auth.clientSecret,
          refreshToken: this.config.auth.refreshToken
        }
      }
      
      const transporter = createTransport(transporterOptions);  
      return transporter;
    }

    private greetings(name: string): string {
      const current_hours = new Date().getHours()
      let message = ""
      if(current_hours < 12) message = "Bom dia";
      else if(current_hours >= 12 && current_hours < 18) message = "Boa tarde";
      else message = "Boa noite";
      
      const c_name = formatContactName(name)
      message += ` ${c_name},\r\n`

      return message
    }

    private signature(): {message: string, attachment: Attachment} {
      const filename = "signature.png"
      const assinatura: Attachment = {
        filename,
        path: path.join(AppConfig.paths.signatures, filename),
        cid: "assinatura"
      }

      const  message = `
      Atenciosamente,<br />
      <img src="cid:assinatura" alt="Assinatura" style="width: 400px; height: 200px;">
      ` ;

      return { message, attachment: assinatura }
    }

    public async sendMail(options: MailerOptions) {
      try {
        if (!options.to) throw new MailError("Destinatário não informado");
        
        this.transporter = await this.setTransporter();
        const greetings = this.greetings(options.to.name);
        const signature = this.signature();

        const mailOptions: Mail.Options = {
            to: options.to.email,
            cc: options.cc,
            bcc: options.bcc,
            replyTo: options.replyTo,
            subject: options.subject,
            html: `
            ${greetings}
            <br /><br />
            ${options.message}\r\n
            <br /><br />
            ${signature.message}
            `,
        };
        
        mailOptions.attachments = mailOptions.attachments ? [...mailOptions.attachments, signature.attachment] : [signature.attachment]
    
        return await this.transporter.sendMail(mailOptions);
      }
      catch (error) {
        throw new MailError(`Erro ao enviar e-mail: ${error.message}`);
      }
      finally {
        if (this.transporter) this.transporter.close();
      }
    }
}

export default Mailer;