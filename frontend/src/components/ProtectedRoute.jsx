// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AccountsContext } from "../context/AccountsContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AccountsContext);

  if (!user) {
    // redirect to login if not logged in
    return <Navigate to="/login" replace />;
  }

  return children;
}
