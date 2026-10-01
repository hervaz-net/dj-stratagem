import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";

/**
 * Route guard. Renders children only for a signed-in user; otherwise sends
 * them to /login, remembering where they were headed so login can return them.
 *
 * This is a convenience, not the security boundary — the server rejects
 * unauthenticated API requests regardless of what the client renders.
 */
export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6" role="status">
        <div className="flex items-center gap-3 text-sm text-steel">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-steel/30 border-t-amber" />
          Checking your session…
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return children;
}
