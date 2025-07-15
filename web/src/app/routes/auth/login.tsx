import { AuthLayout } from "@/components/layouts/AuthLayout"
import { paths } from "@/config/paths"
import { LoginForm } from "@/features/auth/components/login-form"
import { useNavigate } from "react-router-dom"

const LoginRoute = () => {
    const navigate = useNavigate()
    
    const onSuccess = () => {
        navigate(paths.app.path())
    }

    return (
        <AuthLayout title="Login">
            <LoginForm onSuccess={onSuccess} />
        </AuthLayout>
    )
}

export { LoginRoute }