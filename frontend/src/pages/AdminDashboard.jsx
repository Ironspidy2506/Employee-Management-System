import React, { useState } from "react";
import { useAuth } from "../context/authContext.jsx";
import AdminSidebar from "../components/dashboard/AdminSidebar.jsx";
import Navbar from "../components/dashboard/Navbar.jsx";
import AdminSummary from "../components/dashboard/AdminSummary.jsx";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-64">
        {" "}
        {/* Adjust content area margin */}
        {/* Navbar */}
        <Navbar user={user} toggleSidebar={toggleSidebar} />
        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome to the Admin Dashboard, {user?.name || "User"}!
          </h1>

          <Outlet />
          {/* <AdminSummary /> */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
