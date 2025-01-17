import { createContext, useContext, useState } from "react";
import GigMatchApi from "../../utils/api"; 

// Creates context for current user
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser && storedUser !== "undefined") {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken && storedToken !== "undefined" ? storedToken : null;
  });

  const setAndStoreToken = (newToken) => {
    setToken(newToken);
    GigMatchApi.storeToken(newToken);
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    GigMatchApi.storeToken(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, token, setToken: setAndStoreToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export { UserContext };
