import { createContext, PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { api } from "./api-client";

type AuthContextValues = {
    token: string | null,
    setToken: (token: string | null) => void,
    user: AuthUser | null,
    setUser: (user: AuthUser | null) => void,
}

const AuthContext = createContext<AuthContextValues>({
    token: null,
    setToken: () => {},
    user: null,
    setUser: () => {},
});


export const AuthProvider = ({ children }: PropsWithChildren): ReactNode => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("accessToken"));
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                localStorage.removeItem("accessToken");
                setUser(null);
                return;
            }

            try {
                const res = await api.get("/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                });
                console.log("🚀 ~ fetchUser ~ res:", res)
                localStorage.setItem("accessToken", token);
                
                setUser(res.data);
                setToken(token);
            } catch (err) {
                console.error("Failed to fetch user after token change", err);
                setToken(null);
                setUser(null);
            }
        };

        fetchUser();

    }, [token]);

  
    return (
        <AuthContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}



export default AuthContext;