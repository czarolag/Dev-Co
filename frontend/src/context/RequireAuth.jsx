import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { toast } from "react-hot-toast";

const RequireAuth = ({ children }) => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Must be signed in to use this feature.");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  return user ? children : null;
};

export default RequireAuth;