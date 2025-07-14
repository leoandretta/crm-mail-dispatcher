type EnvConfig = {
    api: string;
    static: string;
}

const createEnv = (): EnvConfig => {
    return {
        api: import.meta.env.VITE_API_URL!,
        static: import.meta.env.VITE_STATIC_ASSETS_URL!
    }
}


export const env = createEnv();