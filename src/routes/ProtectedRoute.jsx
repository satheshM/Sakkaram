import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role } = useAuth();
  
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default ProtectedRoute;
