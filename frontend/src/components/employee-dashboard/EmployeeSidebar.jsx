import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaWallet,
  FaSignOutAlt,
  FaHandsHelping,
  FaChartLine,
  FaRoute,
} from "react-icons/fa";
import { FaKey } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { useAuth } from "../../context/authContext";
import KorusImage from "./../../assets/Korus.png";
import { MdOutlineMessage } from "react-icons/md";

const EmployeeSidebar = ({ isOpen, toggleSidebar, sidebarRef }) => {
  const { user, logout } = useAuth();

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        ref={sidebarRef} // Attach the ref here
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"
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
            to="/employee-dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${isActive
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            end
            onClick={toggleSidebar} // Close sidebar when link is clicked
          >
            <FaTachometerAlt className="mr-3 text-xl" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/employee-dashboard/holiday"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${isActive
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar} // Close the sidebar when this link is clicked
          >
            <FaRoute className="mr-3 text-xl" />
            <span>Holidays</span>
          </NavLink>

          <NavLink
            to="/employee-dashboard/leave"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${isActive
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar}
          >
            <FaCalendarAlt className="mr-3 text-xl" />
            <span>Leave</span>
          </NavLink>

          <NavLink
            to="/employee-dashboard/salary"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${isActive
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar}
          >
            <FaMoneyBillWave className="mr-3 text-xl" />
            <span>Salary</span>
          </NavLink>

          <NavLink
            to="/employee-dashboard/allowances"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${isActive
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar}
          >
            <FaWallet className="mr-3 text-xl" />
            <span>Allowances</span>
          </NavLink>

          {user.role === "Lead" ? <NavLink
            to="/employee-dashboard/appraisal"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${isActive
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar} // Close the sidebar when this link is clicked
          >
            <FaChartLine className="mr-3 text-xl" />
            <span>Appraisal</span>
          </NavLink> : <></>}

          <NavLink
            to="http://korus.icewarpcloud.in/webmail/"
            target="_blank"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${isActive
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar} // Close the sidebar when this link is clicked
          >
            <IoIosMail className="mr-3 text-xl" />
            <span>Webmail</span>
          </NavLink>

          {/* <NavLink
            to="/employee-dashboard/change-password"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${isActive
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar}
          >
            <FaKey className="mr-3 text-lg" />
            <span>Change Password</span>
          </NavLink> */}

          <NavLink
            to="/employee-dashboard/messages"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${isActive
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar}
          >
            <MdOutlineMessage className="mr-3 text-xl" />
            <span>Messages</span>
          </NavLink>
          <NavLink
            to="/employee-dashboard/helpdesk"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md transition-colors ${isActive
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`
            }
            onClick={toggleSidebar}
          >
            <FaHandsHelping className="mr-3 text-xl" />
            <span>Helpdesk</span>
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

export default EmployeeSidebar;
