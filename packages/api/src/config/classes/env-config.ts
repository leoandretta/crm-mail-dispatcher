import { Dialect } from "sequelize";
import { IAppEnvConfig, IEnv } from "../interfaces";
import path from "path"

export class EnvConfig
{
    private config: IAppEnvConfig;

    constructor(env: IEnv)
    {
        this.config = this.initialize(env);
    }

    private initialize(env: IEnv): IAppEnvConfig {
        return {
            env,
            server: {
                port: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 8000,
                hostname: process.env.HOSTNAME ?? 'localhost'
            },
            database: {
                uri: process.env.DB_URI,
                host: process.env.DB_HOST!,
                port: parseInt(process.env.DB_PORT!),
                user: process.env.DB_USER!,
                password: process.env.DB_PASSWORD!,
                database: process.env.DB_NAME!,
                dialect: process.env.DB_DIALECT! as Dialect,
                logging: false,
                benchmark: false,   
                timezone: process.env.DB_TIMEZONE!,
                pool: {
                    max:  process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX) : 5,
                    min: process.env.DB_POOL_MIN ? parseInt(process.env.DB_POOL_MIN): 0,
                    acquire: process.env.DB_POOL_ACQUIRE ? parseInt(process.env.DB_POOL_ACQUIRE) : 30000,
                    idle: process.env.DB_POOL_IDLE ? parseInt(process.env.DB_POOL_IDLE) : 2000
                },
            },
            mailer: {
                host: process.env.MAILER_HOST,
                port: Number(process.env.MAILER_PORT),
                from: process.env.MAILER_FROM,
                auth: process.env.MAILER_AUTH_TYPE == "SMTP" ? {
                    type: "SMTP",
                    user: process.env.MAILER_USER,
                    password: process.env.MAILER_PASSWORD,
                } : {
                    type: "OAuth2",
                    user: process.env.MAILER_USER,
                    clientId: process.env.MAILER_CLIENT_ID,
                    clientSecret: process.env.MAILER_CLIENT_SECRET,
                    refreshToken: process.env.MAILER_REFRESH_TOKEN
                }
            },
            jwtSecrets: {
                accessToken: process.env.ACCESS_TOKEN_SECRET,
                refreshToken: process.env.REFRESH_TOKEN_SECRET
            },
            paths: {
                signatures: path.resolve(process.cwd(), "../shared/assets/images")
            }
        }
    }
    
    get env(): IAppEnvConfig['env'] {
        return this.config.env;
    }

    get server(): IAppEnvConfig['server'] {
        return this.config.server;
    }

    get database(): IAppEnvConfig['database'] {
        return this.config.database;
    }

    get mailer(): IAppEnvConfig['mailer'] {
        return this.config.mailer;
    }

    get jwt(): IAppEnvConfig["jwtSecrets"] {
        return this.config.jwtSecrets
    }

    get paths(): IAppEnvConfig["paths"] {
        return this.config.paths
    }
}