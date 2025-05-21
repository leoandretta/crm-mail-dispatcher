import { api } from "@/lib/api-client";
import AuthContext from "@/lib/auth";
import { AuthenticationPayloadValues } from "@crm-mail-dispatcher/shared/interfaces/authentication";
import { notifications } from "@mantine/notifications";
import { useContext } from "react";


export const useAuthContext = () => useContext(AuthContext);

const useAuth = () => {
    const { token, setToken, user, setUser } = useAuthContext()

    const fetchUser = async () => {
        try {
            const res = await api.get("/auth/me",{ 
                withCredentials: true 
            });
            setUser(res.data);
        } catch (error){
            notifications.show({
                title: "Erro",
                message: error.message,
                color: "red"
            })
            setUser(null);
        }
    }
    
    const login = async (credentials: AuthenticationPayloadValues) => {
        try {
            const res = await api.post("/auth/login", credentials, { 
                withCredentials: true 
            });
            console.log("🚀 ~ login ~ res:", res)
            const accessToken = res.data.accessToken;

            localStorage.setItem("accessToken", accessToken);
            setToken(accessToken);
            
            await fetchUser();
        } catch (error){
            if(error.response?.data) {
                const { message } = error.response.data
                notifications.show({
                    title: "Erro",
                    message,
                    position: "top-right",
                    color: "red"
                })
            }
            setToken(null);
        }
    };

    const refresh = async () => {
        try {
            const res = await api.get("/auth/refresh", { 
                withCredentials: true 
            });
            const accessToken = res.data.accessToken;

            setToken(accessToken);
            localStorage.setItem("accessToken", accessToken);

            await fetchUser();

            return accessToken;
        } catch (error) {
            notifications.show({
                title: "Erro",
                message: error.message,
                color: "red"
            })
            setToken(null);
            return null;
        }
    };

    const logout = async () => {
        try {
            await api.get("/auth/logout", {
                withCredentials: true
            })
        } catch (error) {
            notifications.show({
                title: "Erro",
                message: error.message,
                color: "red"
            })
        }  finally {
            localStorage.removeItem("accessToken");
            setToken(null);
            setUser(null);
        }
    };

    return { token, user, login, refresh, fetchUser, logout }
}

export default useAuth;