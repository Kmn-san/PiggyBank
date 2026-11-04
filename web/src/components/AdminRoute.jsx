import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const AdminRoute = () => {
    const { data: user, isLoading, isError } = useAuth()

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/dashbaord" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;