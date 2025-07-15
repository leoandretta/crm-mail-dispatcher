import { MailerConfig } from "@/services/mail/interfaces";
import { DatabaseConfig } from "../../database/interfaces";
import { IServerListenOptions } from "../interfaces";
import { IAppConfig } from "../interfaces/app-config";
import { EnvConfig } from "./env-config";
import dotenv from "dotenv";
import { IJWTSecrets } from "../interfaces/jwt";
import { IPaths } from "../interfaces/paths";
import { ENV } from "../interfaces/env";

export class _AppConfig implements IAppConfig
{
    private _appEnv: EnvConfig;

    constructor()
    {
        const env = EnvConfig.checkEnv();
        this._appEnv = new EnvConfig(env);
    }

    get env(): ENV {
        return this._appEnv.env;
    }

    get server(): IServerListenOptions {
        return this._appEnv.server
    }

    get serverAddr(): string {
    const url = `${this._appEnv.server.hostname}:${this._appEnv.server.port}`;

    if (this._appEnv.env == 'production') return 'https://' + url + '/api';
    return 'http://' + url + '/api';
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
            case 'production': return 'Produção';
            case 'staging': return 'Homologação';
            default: return 'Desenvolvimento';
        }
    }
}