import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/authContext.jsx";
import AdminSidebar from "../components/dashboard/AdminSidebar.jsx";
import Navbar from "../components/dashboard/Navbar.jsx";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Create a ref for the sidebar to detect clicks outside it
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Function to handle outside clicks
    const handleClickOutside = (event) => {
      // Close the sidebar only if clicked outside the sidebar and hamburger icon
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".hamburger-btn")
      ) {
        setIsSidebarOpen(false);
      }
    };

    // Add event listener for outside clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar with ref */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        sidebarRef={sidebarRef}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-64">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          {/* Adjust content area margin to make room for sidebar on large screens */}
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome to the Admin Dashboard, {user?.name || "User"}!
          </h1>

          {/* Render nested route content */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
