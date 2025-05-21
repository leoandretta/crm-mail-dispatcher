import { AuthLayout } from "@/components/layouts/AuthLayout"
import { paths } from "@/config/paths"
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"
import {  Button } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const ForgotPasswordRoute = () => {
    const [email_sent, setEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    
    const requestResetCode = () => {
        setEmailSent(true)
        setLoading(true);
        setTimeout(() => {
            notifications.show({
                title: 'Email enviado com sucesso',
                message: '',
                color: 'green',
                position: 'top-right'
            })
            navigate(paths.auth.login.path())
        }, 500)
    }

    return (
        <AuthLayout title="Esqueci minha senha">
            <ForgotPasswordForm email_sent={email_sent} >
                <Button fullWidth onClick={requestResetCode} loading={loading} loaderProps={{ type: 'dots' }}>
                    Enviar link de recuperação
                </Button>
            </ForgotPasswordForm>
        </AuthLayout>
    )
}

export { ForgotPasswordRoute }