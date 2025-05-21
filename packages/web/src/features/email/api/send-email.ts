import { api, APIResponse } from "@/lib/api-client";
import { EmailPayloadValues } from "@crm-mail-dispatcher/shared/interfaces/email";

export const sendEmail = async <T extends APIResponse<boolean>>(values: EmailPayloadValues): Promise<T> => {
    const formData = new FormData()

    const appendArray = (key: string, values: any) => {
        for(let i = 0; i < values.length; i++ ) {
            formData.append(`${key}[]`, values[i]);
        }
    }

    appendArray("to", values.to);
    formData.append("subject", values.subject )
    formData.append("message", values.message )
    appendArray("files", values.files);

    const { data } = await api.post<T>("/emails", formData);

    return data;
}
