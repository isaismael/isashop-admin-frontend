import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);

    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }

    return children;
};