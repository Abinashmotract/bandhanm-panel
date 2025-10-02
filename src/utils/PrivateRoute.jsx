import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, token }) => {
  // Wait until auth state is loaded
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
