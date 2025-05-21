import { api, APIResponse } from "@/lib/api-client"
import { CompanyAttributes } from "@crm-mail-dispatcher/shared/interfaces/company";

const getCompanies = async <T extends APIResponse<CompanyAttributes[]>>(): Promise<T> => {
    const { data } = await api.get("/companies");

    return data;
}

export { getCompanies };