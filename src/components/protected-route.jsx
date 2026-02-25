import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to so we can redirect them back after logging in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
