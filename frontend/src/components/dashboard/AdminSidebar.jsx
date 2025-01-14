import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaBuilding,
  FaMoneyBillWave,
  FaUsers,
  FaSignOutAlt,
  FaWallet,
  FaChartLine,
} from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { useAuth } from "../../context/authContext";
import KorusImage from "./../../assets/Korus.png";

const AdminSidebar = ({ isOpen, toggleSidebar, sidebarRef }) => {
  const { logout } = useAuth();

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        ref={sidebarRef} // Attach the ref here
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 z-50 w-64 flex flex-col justify-between`}
        onClick={(e) => e.stopPropagation()} // Prevent click inside the sidebar from closing it
      >
        {/* Sidebar Header */}
        <div className="py-4 px-6 bg-gray-900 shadow-md flex items-center space-x-3">
          <img
            src={KorusImage}
            alt="Company Logo"
            className="w-10 h-10 rounded-full object-cover lg:block hidden"
          />
          <h3 className="text-base font-bold md:mt-0.5">
            Korus Engineering Solutions Pvt. Ltd.
          </h3>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-4">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            end
            onClick={toggleSidebar} // Close the sidebar when this link is clicked
          >
            <FaTachometerAlt className="mr-3 text-xl" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/employees"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar} // Close the sidebar when this link is clicked
          >
            <FaUsers className="mr-3 text-xl" />
            <span>Employees</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/departments"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar} // Close the sidebar when this link is clicked
          >
            <FaBuilding className="mr-3 text-xl" />
            <span>Department</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/leave"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar} // Close the sidebar when this link is clicked
          >
            <FaCalendarAlt className="mr-3 text-xl" />
            <span>Leave</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/salary"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar} // Close the sidebar when this link is clicked
          >
            <FaMoneyBillWave className="mr-3 text-xl" />
            <span>Salary</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/ctc"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar} // Close the sidebar when this link is clicked
          >
            <GiMoneyStack className="mr-3 text-xl" />
            <span>CTC</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/allowances"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar} // Close the sidebar when this link is clicked
          >
            <FaWallet className="mr-3 text-xl" />
            <span>Allowances</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/performance"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar} // Close the sidebar when this link is clicked
          >
            <FaChartLine className="mr-3 text-xl" />
            <span>Performance</span>
          </NavLink>
        </div>

        {/* Logout Button (At the bottom of sidebar) */}
        <div className="px-4 py-6 lg:hidden">
          <NavLink
            to="/logout" // Replace with actual logout route
            className="flex items-center px-4 py-3 rounded-md text-red-500 hover:bg-gray-700 hover:text-white transition-colors"
            onClick={logout}
          >
            <FaSignOutAlt className="mr-3 text-xl" />
            <span>Logout</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
