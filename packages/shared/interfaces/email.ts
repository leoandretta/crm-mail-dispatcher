import { ContactAttributes } from "./contact";
export interface EmailPayloadValues {
    to: string | string[];
    subject: string;
    message: string;
    files: File[]
}