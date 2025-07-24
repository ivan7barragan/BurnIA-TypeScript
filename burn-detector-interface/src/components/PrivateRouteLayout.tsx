import React from "react";
import { Navigate } from "react-router-dom";
import Layout from "./Layout";

const PrivateRouteLayout = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem("userId");

  return isAuthenticated ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRouteLayout;
