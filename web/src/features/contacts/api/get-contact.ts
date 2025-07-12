import { api, APIResponse } from "@/lib/api-client";


const getContact = async <T extends APIResponse<ContactAttributes>>(id: number): Promise<T> => {
    const { data } = await api.get<T>(`/contacts/${id}`, { withCredentials: true });

    return data;
}

export { getContact }