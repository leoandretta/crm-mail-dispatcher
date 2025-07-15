
import { MantineProvider, Loader } from "@mantine/core";
import { theme } from "../theme";
import { Notifications } from '@mantine/notifications';
import { ReactNode, Suspense } from "react"
import '@mantine/notifications/styles.css';
import "@mantine/core/styles.css";
import { AuthProvider } from "@/lib/auth";

type AppProviderProps = {
    children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const Fallback = () => {
        return (
            <div style={{width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Loader size="xl"  color="indigo" />
            </div>
        )
    }
    
    
    return (
        <Suspense fallback={<Fallback />}>
            <MantineProvider theme={theme} >
                <Notifications position="top-right" />
                <AuthProvider >
                    { children }
                </AuthProvider>
            </MantineProvider>
        </Suspense>
    )
    
}