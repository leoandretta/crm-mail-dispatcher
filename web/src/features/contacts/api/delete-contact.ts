import { api, APIResponse } from "@/lib/api-client";


const deleteContact = async <T extends APIResponse<ContactAttributes>>(id: number): Promise<T> => {
    const { data } = await api.delete<T>(`/contacts/${id}`, { withCredentials: true });

    return data;
}

export { deleteContact }