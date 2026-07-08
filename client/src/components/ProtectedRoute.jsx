import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
    children,
    allowedRoles
}) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" />;
    }

    const hasRole = allowedRoles.includes(user.rol);

    return hasRole
        ? children
        : <Navigate to="/" />;
}