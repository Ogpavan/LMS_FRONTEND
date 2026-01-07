import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (
    isAuthenticated &&
    ["/auth/signin", "/auth/signup"].includes(location.pathname)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AuthLayout;
