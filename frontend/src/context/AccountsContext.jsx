// src/context/AccountsContext.jsx
import { createContext, useState } from "react";

export const AccountsContext = createContext();

export function AccountsProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    console.log(authToken)
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AccountsContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AccountsContext.Provider>
  );
}

/** Helper function to get token outside of React components */
export function getUserToken() {
  return localStorage.getItem("token") || null;
}
