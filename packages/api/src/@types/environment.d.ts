
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV?: "dev" | "stg" | "prd";
            SERVER_PORT?: string;
            HOSTNAME?: string;

            // DATABASE
            DB_URI?: string;
            DB_PORT?: string;
            DB_HOST?: string;
            DB_USERNAME?: string;
            DB_PASSWORD?: string;
            DB_NAME?: string;
            DB_DIALECT?: string;
            DB_TIMEZONE?: string;
            DB_POOL_MAX?: string;
            DB_POOL_MIN?: string;
            DB_POOL_ACQUIRE?: string;
            DB_POOL_IDLE?: string;

            // MAILER
            MAILER_HOST: string;
            MAILER_PORT: string;
            MAILER_USER: string;
            MAILER_PASSWORD: string;
            MAILER_FROM: string;
            MAILER_CLIENT_ID: string;
            MAILER_CLIENT_SECRET: string;
            MAILER_REFRESH_TOKEN: string;
            MAILER_AUTH_TYPE: "SMTP" | "OAuth2";

            // JWT
            ACCESS_TOKEN_SECRET: string;
            REFRESH_TOKEN_SECRET: string;
        }
    }
}

export {};
