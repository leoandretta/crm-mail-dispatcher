declare global {
    export interface EmailPayloadValues {
        to: string | string[];
        subject: string;
        message: string;
        files: File[]
    }
}
export {};