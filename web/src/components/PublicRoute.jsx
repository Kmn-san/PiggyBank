import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const PublicRoute = () => {
    const { data: user, isLoading, isError } = useAuth()

    if (isLoading) {
        return <div>Loading...</div>;
    }


    if (!isError && user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;