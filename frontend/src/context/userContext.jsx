import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(undefined);
    
    // Get user data if there is a token
    useEffect(() => {
        axios.get("/api/users/profile", { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null)); // not authenticated
    }, []);
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};