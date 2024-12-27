import React from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/authContext.jsx";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  console.log(user);
  
  return (
    <div className="flex justify-between items-center bg-gray-900 text-white px-6 py-4 shadow-md">
      {/* Welcome Message */}
      <div className="flex-shrink-0 mb-2 sm:mb-0">
        <p className="text-lg font-semibold">
          Welcome, <span className="text-blue-400">{user.name}</span>
        </p>
      </div>

      {/* Logout Button */}
      <div className="flex items-center space-x-4">
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition hidden lg:block"
          onClick={logout}
        >
          <FaSignOutAlt className="mr-2 inline-block" />
          Logout
        </button>

        {/* Hamburger Menu (visible on small screens) */}
        <div className="lg:hidden">
          <button
            onClick={toggleSidebar}
            className="text-2xl text-white focus:outline-none"
          >
            <FaBars />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
