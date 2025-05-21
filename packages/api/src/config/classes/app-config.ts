import { MailerConfig } from "@/services/mail/interfaces";
import { DatabaseConfig } from "../../database/interfaces";
import { IEnv, IServerListenOptions } from "../interfaces";
import { IAppConfig } from "../interfaces/app-config";
import { EnvConfig } from "./env-config";
import dotenv from "dotenv";
import { IJWTSecrets } from "../interfaces/jwt";
import { IPaths } from "../interfaces/paths";

export class _AppConfig implements IAppConfig
{
    private _appEnv: EnvConfig;

    constructor()
    {
        const env = process.env.NODE_ENV!;
        dotenv.config({ path: `.env.${env.toLowerCase()}`})

        this._appEnv = new EnvConfig(env);
    }

    get env(): IEnv {
        return this._appEnv.env;
    }

    get server(): IServerListenOptions {
        return this._appEnv.server
    }

    get database(): DatabaseConfig {
        return this._appEnv.database
    }

    get mailer(): MailerConfig {
        return this._appEnv.mailer
    }

    get jwt(): IJWTSecrets {
        return this._appEnv.jwt
    }

    get paths(): IPaths {
        return this._appEnv.paths
    }

    get escopo(): "Desenvolvimento" | "Homologação" | "Produção" {
        switch (this.env) {
            case 'prd': return 'Produção';
            case 'stg': return 'Homologação';
            default: return 'Desenvolvimento';
        }
    }
}