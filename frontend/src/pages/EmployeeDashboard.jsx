import React, { useState } from "react";
import { useAuth } from "../context/authContext.jsx";
import EmployeeSidebar from "../components/employee-dashboard/EmployeeSidebar.jsx";
import EmployeeNavbar from "../components/employee-dashboard/EmployeeNavbar.jsx";
import { Outlet } from "react-router-dom";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <EmployeeSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-64">
        {/* Navbar */}
        <EmployeeNavbar user={user} toggleSidebar={toggleSidebar} />

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome to the Employee Dashboard, {user?.name || "User"}!
          </h1>

          <Outlet />
          {/* Add any other relevant content or components here */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
