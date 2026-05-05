// pages/OAuthCallback.tsx
// Handles the redirect from the backend after Google OAuth.
// The backend passes the JWT as a URL param so it works even when
// cross-origin cookies are blocked.
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../ui/Spinner";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error || !token) {
      navigate("/signin?error=oauth_failed", { replace: true });
      return;
    }

    // Store token so protectedAxios can use it
    localStorage.setItem("accessToken", token);

    // Refresh auth context then go to dashboard
    refresh().then(() => {
      navigate("/dashboard", { replace: true });
    }).catch(() => {
      navigate("/signin?error=oauth_failed", { replace: true });
    });
  }, [searchParams, navigate, refresh]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-default">
      <div className="text-center">
        <Spinner size="lg" overlay={false} />
        <p className="mt-4 text-sm text-muted">Completing sign in…</p>
      </div>
    </div>
  );
}
