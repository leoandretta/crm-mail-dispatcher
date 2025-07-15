import { api, APIResponse } from "@/lib/api-client"

const getCompanies = async <T extends APIResponse<CompanyAttributes[]>>(): Promise<T> => {
    const { data } = await api.get("/companies");

    return data;
}

export { getCompanies };