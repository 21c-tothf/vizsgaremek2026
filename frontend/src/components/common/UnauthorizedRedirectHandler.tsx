import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const REDIRECT_KEY = "auth_redirect_from";

function UnauthorizedRedirectHandler() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.removeItem(REDIRECT_KEY);
      return;
    }

    const from = sessionStorage.getItem(REDIRECT_KEY);
    if (!from) {
      return;
    }

    sessionStorage.removeItem(REDIRECT_KEY);

    if (!location.pathname.startsWith("/login")) {
      navigate("/login", { replace: true, state: { from } });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return null;
}

export default UnauthorizedRedirectHandler;