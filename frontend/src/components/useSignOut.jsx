import { useContext } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useSignOut = () => {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const signOut = async () => {
        try {
            await axios.post("/api/users/signOut", {}, { withCredentials: true });
            setUser(null);
            toast.success("Signed out successfully");
            navigate("/");
        } catch (e) {
            console.error("Error signing out:", e);
            toast.error("Failed to sign out");
        }
    };

    return signOut;
};