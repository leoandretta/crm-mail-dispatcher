import { api, APIResponse } from "@/lib/api-client";
import { ContactAttributes, ContactUpdateAttributes } from "@crm-mail-dispatcher/shared/interfaces/contact";

export type ContactUpdateValues =
{
    name: string;
    company_name: string;
    email: string;
    phone: string;
}


const updateContact = async <T extends APIResponse<ContactAttributes>>(id: number, values: ContactUpdateValues): Promise<T> => {
    const payload: ContactUpdateAttributes = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: { name: values.company_name }
    }
    
    const { data } = await api.put<T>(`/contacts/${id}`, payload);

    return data;
}

export { updateContact }