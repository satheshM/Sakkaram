import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  console.log("status"+isAuthenticated)

  return isAuthenticated ? element : <Navigate to="/login" />;

  //<Link to="/booking" className="text-green-600 text-sm font-medium hover:underline block mt-2">View all bookings →</Link>
           
};

export default ProtectedRoute;

