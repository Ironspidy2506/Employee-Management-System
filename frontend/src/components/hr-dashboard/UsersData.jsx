import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersData = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://employee-management-system-backend-objq.onrender.com/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Handle user deletion
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`https://employee-management-system-backend-objq.onrender.com/api/users/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  function capitalizeFirstLetter(string) {
    if (!string) return ""; // Handle empty or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Users List
      </h1>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-100 border-b border-gray-200"
              >
                <td className="py-3 px-6">{user.name}</td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">{capitalizeFirstLetter(user.role)}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersData;
