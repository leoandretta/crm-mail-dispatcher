import { api } from "@/lib/api-client";
import { LoadResult } from "devextreme/common/data/custom-store";
import { LoadOptions } from "devextreme/data";


const getContacts = async <T extends LoadResult<ContactAttributes>>(options: LoadOptions): Promise<T> => {
    const { data } = await api.get<T>(`/contacts/dx`, { withCredentials: true, params: options });

    return data;
}

export { getContacts }