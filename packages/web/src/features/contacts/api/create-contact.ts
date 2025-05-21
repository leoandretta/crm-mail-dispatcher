import { api, APIResponse } from "@/lib/api-client";
import { ContactAttributes, ContactCreationAttributes } from "@crm-mail-dispatcher/shared/interfaces/contact";

export type ContactCreateValues =
{
    name: string;
    company_name: string;
    email: string;
    phone: string;
}


const createContact = async <T extends APIResponse<ContactAttributes>>(values: ContactCreateValues): Promise<T> => {
    const payload: ContactCreationAttributes = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: { name: values.company_name },
    }
    
    const { data } = await api.post<T>("/contacts", payload);

    return data;
}

export { createContact }