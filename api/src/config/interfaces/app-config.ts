// import { DatabaseConfig } from "../../database/interfaces";
import { Options } from "sequelize";
import { IServerListenOptions } from "./server";
import { ENV } from "./env";

export interface IAppConfig {
    get env(): ENV;
    get server(): IServerListenOptions;
    get database(): Options;
    get escopo(): 'Desenvolvimento' | 'Homologação' | 'Produção';
}