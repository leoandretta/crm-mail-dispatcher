import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from "react-router-dom"
import { LoginRoute } from "./routes/auth/login"
import { ForgotPasswordRoute } from "./routes/auth/forgot-password";
import { AppRoot } from "./routes/app";
import { useMemo } from "react";
import { paths } from "@/config/paths";
import NotFoundRoute from "./routes/not-found";
import useAuth from "@/hooks/useAuth";

export const ProtectedRoute = () => {
  const { token, user } = useAuth();
  const location = useLocation()

  if (!token && !user) {
    return <Navigate to={paths.auth.login.path()} state={{ from: location }} replace />
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { token, user } = useAuth();
  const location = useLocation()

  if (token && user) {
    return <Navigate to={paths.app.path()} state={{ from: location }} replace />;
  }

  return <Outlet />;
};


const createAppRouter = () => createBrowserRouter([
    {
        path: "",
        element: <PublicRoute />,
        children: [
            { 
                path: "/login", 
                element: <LoginRoute />
            },
            {
                path: "/esqueci-minha-senha",
                element: <ForgotPasswordRoute />
            },
        ]
    },
    {
        path: "/app",
        element: <ProtectedRoute />,
        children: [
            {
                path: "",
                element: <AppRoot />
            }
        ]
    },
    {
        path: "*",
        element: <NotFoundRoute />
    },
], { 
    future: { v7_relativeSplatPath: true } 
})

const AppRouter = () => {
    const router = useMemo(() => createAppRouter(), [])

    return <RouterProvider router={router} future={{ v7_startTransition: true }}/> 
}
export default AppRouter;