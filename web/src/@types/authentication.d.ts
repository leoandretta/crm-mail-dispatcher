declare global {
    export type AuthenticationPayloadValues = {
        email: string;
        password: string;
    }
    export type AuthUser = {
        name: string;
        email: string;
    }

    export type AuthenticatedSession = {
        user: AuthUser;
        accessToken: string;
    }
}

export {};

