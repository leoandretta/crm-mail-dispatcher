import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from "react-router-dom"
import { LoginRoute } from "./routes/auth/login"
import { ForgotPasswordRoute } from "./routes/auth/forgot-password";
import { AppRoot } from "./routes/app";
import { Suspense, useMemo } from "react";
import { paths } from "@/config/paths";
import NotFoundRoute from "./routes/not-found";
import useAuth from "@/hooks/useAuth";

export const ProtectedRoute = () => {
  const { token, user, loading } = useAuth();
  const location = useLocation()
  
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const isAuthenticated = !!token && !!user;

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.login.path()} state={{ from: location }} replace />
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { token, user, loading } = useAuth();
  const location = useLocation()

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const isAuthenticated = !!token && !!user;
  if (isAuthenticated) {
    return <Navigate to={paths.app.path()} state={{ from: location }} replace />;
  }

  const publicPaths = ["/login", "/esqueci-minha-senha"];
  if(!publicPaths.includes(location.pathname)) {
    return <Navigate to={paths.auth.login.path()} state={{ from: location }} replace />;
  }

  return <Outlet />;
};


const createAppRouter = () => createBrowserRouter([
    {
        path: "",
        element: <PublicRoute />,
        children: [
            { index: true, element: <Navigate to="/login" replace /> },
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
                index: true,
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

    return (
    <Suspense
      fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}
    >
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </Suspense>
  );
}
export default AppRouter;