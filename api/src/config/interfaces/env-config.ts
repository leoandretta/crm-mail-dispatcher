import { DatabaseConfig } from "@/database/interfaces";
import { MailerConfig } from "@/services/mail/interfaces";
import { IJWTSecrets } from "./jwt";
import { IPaths } from "./paths";
import { IServerListenOptions } from "./server";
import { ENV } from "./env";

export interface IAppEnvConfig {
    env: ENV;
    server: IServerListenOptions
    database: DatabaseConfig;
    mailer: MailerConfig;
    jwtSecrets: IJWTSecrets;
    paths: IPaths;
}