import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import {
  getLeaveRecords,
  approveRejectLeave,
} from "../../utils/AdminLeaveHelper.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HrLeaveView = () => {
  const { user } = useAuth();
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleRecords, setVisibleRecords] = useState(10);
  const [loading, setLoading] = useState(true); // Loading state

  const navigate = useNavigate();
  const userId = user._id;

  const handleShowMore = () => {
    setVisibleRecords((prev) => prev + 10);
  };

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        setLoading(true); // Start loading
        const data = await getLeaveRecords();
        setLeaveHistory(data);
        setFilteredHistory(data);
      } catch (error) {
        console.error("Error fetching leave history:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchLeaveHistory();
  }, [userId]);

  const handleApproveReject = async (leaveId, action) => {
    try {
      await approveRejectLeave(leaveId, action);
      toast.success("Leave status updated successfully");
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
        return direction === "ascending" ? aValue - bValue : bValue - aValue;
      })
      .sort((a, b) => {
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
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = leaveHistory.filter((leave) => {
      return (
        leave.employeeId.employeeId.toString().includes(query) ||
        leave.employeeId.name.toLowerCase().includes(query)
      );
    });

    setFilteredHistory(filtered);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <ToastContainer />
      {loading ? (
        // Loading spinner
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        // Main Content
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Leave History
          </h2>

          {/* Search and Buttons */}
          <div className="mb-4 flex justify-between items-center rounded-sm p-1">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by Employee ID or Name"
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex justify-start gap-2 mb-4">
            <button
              onClick={() =>
                navigate("/hr-dashboard/leave/employeesLeaveBalances")
              }
              className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Edit Leave Balances
            </button>
            <button
              onClick={() =>
                navigate("/hr-dashboard/leave/view-employeesLeaveBalances")
              }
              className="px-5 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              View Remaining Leaves
            </button>
          </div>

          {/* Table */}
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-200 border">
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
                  Department
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Leave Type
                </th>
                <th
                  className="px-4 py-2 text-center text-sm font-medium text-gray-700 cursor-pointer"
                  onClick={() => handleSort("startDate")}
                >
                  Start Date
                  {sortConfig.key === "startDate" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                  Start Time
                </th>
                <th
                  className="px-4 py-2 text-center text-sm font-medium text-gray-700 cursor-pointer"
                  onClick={() => handleSort("endDate")}
                >
                  End Date
                  {sortConfig.key === "endDate" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                  End Time
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  No. of Days
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Reason
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Attachment
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.slice(0, visibleRecords).map((leave, index) => (
                <tr key={leave._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-center text-sm">{index + 1}</td>
                  <td className="px-4 py-2 text-center text-sm">
                    {leave.employeeId?.employeeId}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {leave.employeeId?.name}
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    {leave.employeeId?.department?.departmentName}
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    {leave.type.toLowerCase() === "others"
                      ? "Others/Late Hours Deduction"
                      : leave.type.toUpperCase()}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {formatDate(leave.startDate)}
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    {new Date(
                      `1970-01-01T${leave.startTime}`
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {formatDate(leave.endDate)}
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    {new Date(`1970-01-01T${leave.endTime}`).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </td>
                  <td className="px-4 py-2 text-center text-sm">
                    {leave.days}
                  </td>
                  <td className="px-4 py-2 text-sm">{leave.reason}</td>
                  <td className="px-4 py-2 text-center text-sm">
                    {leave.attachment ? (
                      <button
                        onClick={() =>
                          window.open(
                            `https://korus-employee-management-system-mern-stack.vercel.app/api/leaves/attachment/${leave._id}`,
                            "_blank"
                          )
                        }
                        className="px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        View
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        No Attachment
                      </span>
                    )}
                  </td>
                  <td
                    className={`px-4 py-2 text-center text-sm font-semibold ${getStatusColor(
                      leave.status
                    )}`}
                  >
                    {leave.status.charAt(0).toUpperCase() +
                      leave.status.slice(1)}
                    {leave?.approvedBy || leave?.rejectedBy
                      ? leave.status === "approved"
                        ? ` by ${leave.approvedBy}`
                        : leave.status === "rejected"
                        ? ` by ${leave.rejectedBy}`
                        : ""
                      : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visibleRecords < filteredHistory.length && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleShowMore}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HrLeaveView;
