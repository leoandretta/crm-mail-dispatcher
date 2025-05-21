import { DatabaseConfig } from "@/database/interfaces";
import { MailerConfig } from "@/services/mail/interfaces";
import { IJWTSecrets } from "./jwt";
import { IPaths } from "./paths";
import { IServerListenOptions } from "./server";

export type IEnv = 'dev' | 'stg' | 'prd';


export interface IAppEnvConfig {
    env: IEnv;
    server: IServerListenOptions
    database: DatabaseConfig;
    mailer: MailerConfig;
    jwtSecrets: IJWTSecrets;
    paths: IPaths;
}