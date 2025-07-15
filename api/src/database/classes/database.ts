import { ConnectionError, ConnectionTimedOutError, Options, Sequelize } from "sequelize";
import { DatabaseConfig, DatabaseSyncOptions, ExtraOptions, IDatabase } from "../interfaces";
import { DatabaseError } from "../../utils/exceptions";
import * as models from "../schemas/models";

export class Database extends Sequelize implements IDatabase
{
    private schemas: string[];
    private extensions: string[];

    constructor(config: DatabaseConfig, options: ExtraOptions = {})
    {
        const dbOptions: Options = {
            logging: config.logging,
            benchmark: config.benchmark,
            timezone: config.timezone ?? "-03:00",
            pool: config.pool,
            define: {
                freezeTableName: true,
                timestamps: true,
                createdAt: 'createdAt',
                updatedAt: 'updatedAt'
            },
            retry: {
                match: [/Deadlock/i, ConnectionError, ConnectionTimedOutError],
                max: 5,
                backoffBase: 1000,
                backoffExponent: 1.5,
            },
            ...config.host && { host: config.host },
            ...config.dialect && { dialect: config.dialect },
        }
        
        if(config.uri) super(config.uri, dbOptions);
        else super(config.database, config.user, config.password, dbOptions);

        this.schemas = options.schemas ?? []
        this.extensions = options.extensions ?? []
    }

    private async createSchemas() {
        for await (const schema of this.schemas) {
          await this.query(`CREATE SCHEMA IF NOT EXISTS ${schema};`);
        }
      }
    
      private async createExtensions() {
        for await (const extension of this.extensions) {
          await this.query(`CREATE EXTENSION IF NOT EXISTS ${extension};`);
        }
      }
    
    instantiate(): void {
        for (const model of Object.values(models))
        {
            model.instantiate(this);
        }

        for (const model of Object.values(models)) 
        {
            model.setAssociations();
            model.setScopes();
            model.setHooks();
        }
    }

    async synchronize(options: DatabaseSyncOptions = {  }): Promise<void> {
        try {
            await this.createSchemas();
            await this.createExtensions();
            
            this.instantiate();

            await this.sync(options);

        } catch (error) {
            throw new DatabaseError(error.message);
        }
    }
    
}