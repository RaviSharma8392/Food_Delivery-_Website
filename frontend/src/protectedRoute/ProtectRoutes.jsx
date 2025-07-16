import { Navigate, Outlet } from "react-router-dom";
import useUser from "../context/UserContext";

const ProtectRoute = ({ allowedRole }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>; // Can replace with spinner
  }

  const role = user?.user?.role;
  console.log(role);

  // 🚫 Not logged in
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // 🔄 Handle inverted role logic (e.g., "!User")
  if (allowedRole?.startsWith("!")) {
    const blockedRole = allowedRole.slice(1);
    return role === blockedRole ? <Navigate to="/" replace /> : <Outlet />;
  }

  // ✅ Allow only if role matches
  if (role === allowedRole) {
    return <Outlet />;
  }

  // ❌ Role mismatch — redirect to 404 or home
  return <Navigate to="/" replace />;
};

export default ProtectRoute;
