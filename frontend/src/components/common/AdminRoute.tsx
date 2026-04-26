import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface AdminRouteProps {
  children: JSX.Element;
}

function AdminRoute({ children }: AdminRouteProps) {
  const { isBootstrapping, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="p-6">
        <LoadingSpinner label="Jogosultság ellenőrzése..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;