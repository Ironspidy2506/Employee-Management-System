import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/authContext.jsx";
import EmployeeSidebar from "../components/employee-dashboard/EmployeeSidebar.jsx";
import EmployeeNavbar from "../components/employee-dashboard/EmployeeNavbar.jsx";
import { Outlet } from "react-router-dom";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Ref for sidebar to detect outside clicks
  const sidebarRef = useRef(null);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Function to handle outside clicks
    const handleClickOutside = (event) => {
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
    <Outlet />
  );
};

export default EmployeeDashboard;
