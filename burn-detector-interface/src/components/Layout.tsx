import React from "react";
import Navbar from "./Navbar";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-colors">
      <Navbar />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default Layout;
