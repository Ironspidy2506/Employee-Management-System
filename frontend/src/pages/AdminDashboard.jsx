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
    <Outlet />
  );
};

export default AdminDashboard;
