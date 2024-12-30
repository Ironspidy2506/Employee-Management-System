import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import {
  getLeaveRecords,
  approveRejectLeave,
} from "../../utils/AdminLeaveHelper.jsx";

const ViewAllLeaves = () => {
  const { user } = useAuth();
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const navigate = useNavigate();
  const userId = user._id;

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const data = await getLeaveRecords();
        setLeaveHistory(data);
        setFilteredHistory(data);
      } catch (error) {
        console.error("Error fetching leave history:", error);
      }
    };

    fetchLeaveHistory();
  }, [userId]);

  const handleApproveReject = async (leaveId, action) => {
    try {
      await approveRejectLeave(leaveId, action);
      const updatedHistory = leaveHistory.map((leave) =>
        leave._id === leaveId ? { ...leave, status: action } : leave
      );

      setLeaveHistory(updatedHistory);
      setFilteredHistory(updatedHistory);
    } catch (error) {
      console.error(`Error ${action} leave:`, error);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredHistory]
      .sort((a, b) => {
        const aValue = new Date(a[key]);
        const bValue = new Date(b[key]);

        if (direction === "ascending") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      })
      .sort((a, b) => {
        // Prioritize pending status by sorting them at the top
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;
        return 0;
      });

    setFilteredHistory(sortedData);
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

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0"); // Ensure two digits
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter by employeeId (handling it as a number)
    const filtered = leaveHistory.filter((leave) => {
      return leave.employeeId.employeeId.toString().includes(query); // Ensure employeeId is treated as a string
    });

    setFilteredHistory(filtered);
  };

  return (
    <div className="p-6 space-y-6 bg-white">
      {/* Search Bar */}

      {/* Table Section */}
      <div className="overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Leave History</h2>
        <div className="mb-4 flex justify-between items-center rounded-sm p-1">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by Employee ID"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex justify-start mb-4">
          <button
            onClick={() =>
              navigate("/admin-dashboard/leave/employeesLeaveBalances")
            }
            className="w-full sm:w-auto px-5 py-2 text-center text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            View Remaining Leaves
          </button>
        </div>

        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                S. No.
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                EmpID
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Emp Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Leave Type
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer"
                onClick={() => handleSort("startDate")}
              >
                Start Date
                {sortConfig.key === "startDate" &&
                  (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
              </th>
              <th
                className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer"
                onClick={() => handleSort("endDate")}
              >
                End Date
                {sortConfig.key === "endDate" &&
                  (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                No. of Days
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Reason
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((leave, index) => (
              <tr key={leave._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-800">{index + 1}</td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {leave.employeeId.employeeId}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {leave.employeeId.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {leave.type.toUpperCase()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {formatDate(leave.startDate)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {formatDate(leave.endDate)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {leave.days}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {leave.reason}
                </td>
                <td
                  className={`px-4 py-2 text-sm font-semibold ${getStatusColor(
                    leave.status
                  )}`}
                >
                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                </td>
                <td className="flex px-4 py-2 text-sm text-gray-800 space-x-2">
                  {leave.status === "pending" ? (
                    <>
                      <button
                        onClick={() =>
                          handleApproveReject(leave._id, "approved")
                        }
                        className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleApproveReject(leave._id, "rejected")
                        }
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllLeaves;
