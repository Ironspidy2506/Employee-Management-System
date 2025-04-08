import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewAppliedLeavesTeamLead = () => {
  const { user } = useAuth();
  const userId = user._id;
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getAppliedLeaves = async () => {
    try {
      const { data } = await axios.get(
        `https://korus-ems-backend.onrender.com/api/users/get-leave-for-approvals/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLeaves(data.leaves || []);
      setFilteredLeaves(data.leaves || []);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      toast.error("Failed to fetch leaves.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = leaves.filter(
      (leave) =>
        leave.employeeId.employeeId.toString().includes(query) ||
        leave.employeeId.name.toLowerCase().includes(query)
    );
    setFilteredLeaves(filtered);
  };

  const handleAction = async (leaveId, action) => {
    try {
      const { data } = await axios.post(
        `https://korus-ems-backend.onrender.com/api/users/leave-action/${userId}`,
        { leaveId, action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

      getAppliedLeaves();
    } catch (error) {
      console.error(`Error ${action}ing leave:`, error);
      toast.error(`Failed to ${action} the leave.`);
    }
  };

  useEffect(() => {
    getAppliedLeaves();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="max-w-full mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Leaves for Your Approval
      </h2>

      <ToastContainer />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Employee ID or Name"
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <p className="text-center text-gray-600">Loading leaves...</p>
      ) : filteredLeaves.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-gray-700">Emp ID</th>
                <th className="border px-4 py-2 text-gray-700">Emp Name</th>
                <th className="border px-4 py-2 text-gray-700">Leave Type</th>
                <th className="border px-4 py-2 text-gray-700">Start Date</th>
                <th className="border px-4 py-2 text-gray-700">Start Time</th>
                <th className="border px-4 py-2 text-gray-700">End Date</th>
                <th className="border px-4 py-2 text-gray-700">End Time</th>
                <th className="border px-4 py-2 text-gray-700">Days</th>
                <th className="border px-4 py-2 text-gray-700">Reason</th>
                <th className="border px-4 py-2 text-gray-700">Status</th>
                <th className="border px-4 py-2 text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr
                  key={leave._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="border px-4 py-2 text-center">
                    {leave.employeeId.employeeId}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {leave.employeeId.name}
                  </td>
                  <td className="border px-4 py-2 text-center">{leave.type.toUpperCase()}</td>
                  <td className="border px-4 py-2 text-center">
                    {formatDate(leave.startDate)}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {new Date(
                      `1970-01-01T${leave.startTime}`
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {formatDate(leave.endDate)}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {new Date(`1970-01-01T${leave.endTime}`).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center">{leave.days}</td>
                  <td className="border px-4 py-2 text-center">
                    {leave.reason}
                  </td>
                  <td
                    className={`border px-4 py-2 text-center text-sm font-semibold ${getStatusColor(
                      leave.status
                    )}`}
                  >
                    {leave.status.charAt(0).toUpperCase() +
                      leave.status.slice(1)}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {leave.status === "pending" && (
                      <>
                        <div className="flex flex-col lg:flex-row gap-1">
                          <button
                            onClick={() => handleAction(leave._id, "approve")}
                            className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition duration-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(leave._id, "reject")}
                            className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition duration-200"
                          >
                            Reject
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No leaves available for your approval.
        </p>
      )}
    </div>
  );
};

export default ViewAppliedLeavesTeamLead;
