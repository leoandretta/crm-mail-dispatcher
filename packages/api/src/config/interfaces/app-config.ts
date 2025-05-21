// import { DatabaseConfig } from "../../database/interfaces";
import { Options } from "sequelize";
import { IEnv } from "./env-config";
import { IServerListenOptions } from "./server";

export interface IAppConfig {
    get env(): IEnv;
    get server(): IServerListenOptions;
    get database(): Options;
    get escopo(): 'Desenvolvimento' | 'Homologação' | 'Produção';
}