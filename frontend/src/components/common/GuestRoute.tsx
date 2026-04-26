import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface GuestRouteProps {
  children: JSX.Element;
}

function GuestRoute({ children }: GuestRouteProps) {
  const { isBootstrapping, isAuthenticated } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="p-6">
        <LoadingSpinner label="Munkamenet betöltése..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default GuestRoute;
