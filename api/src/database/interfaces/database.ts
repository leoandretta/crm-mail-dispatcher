import { Dialect } from "sequelize";

export type DatabaseSyncOptions = {
    force?: boolean;
    alter?: boolean;
    benchmark?: boolean;
}
  
export type DatabaseConfig = {
    uri?: string;
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    dialect: Dialect;
    logging: boolean | false;
    timezone: string;
    pool?: DatabasePoolConfig;
    benchmark?: boolean | false;
}

export type ExtraOptions = {
    schemas?: string[];
    extensions?: string[];
}
  
export type DatabasePoolConfig = {
    max: number;
    min: number;
    acquire: number;
    idle: number;
}

export interface IDatabase 
{
    instantiate(): void;
    synchronize(options: DatabaseSyncOptions): Promise<void>;
}