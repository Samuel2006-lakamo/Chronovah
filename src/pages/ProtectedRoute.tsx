
import { useNavigate } from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../ui/Spinner";

function ProtectedRoute({ children }: {children: ReactNode}) {
  const navigate = useNavigate();
  //1. Load Authenticated user
  const { user, loading } = useAuth();

  //3. if there is NO user, redirect to the /login

  useEffect(
    function () {
      if (!user && !loading) navigate("/signin");
    },
    [user, navigate, loading]
  );

  //2. while Loading, show spinner

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Spinner />
      </div>
    );

  //4. if there is a user, render the app
  if (user) return children;
}

export default ProtectedRoute;
