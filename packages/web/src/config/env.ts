type EnvConfig = {
    api: string;
}

const createEnv = (): EnvConfig => {
    return {
        api: import.meta.env.VITE_API_URL!
    }
}


export const env = createEnv();