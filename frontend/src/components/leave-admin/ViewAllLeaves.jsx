import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import {
  getLeaveRecords,
  approveRejectLeave,
} from "../../utils/AdminLeaveHelper.jsx";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const ViewAllLeaves = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [allLeaves, setAllLeaves] = useState([]);
  const [displayedLeaves, setDisplayedLeaves] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const [loadingMore, setLoadingMore] = useState(false);
  const [showTextArea, setShowTextArea] = useState(null);
  const [responseData, setResponseData] = useState({});

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const data = await getLeaveRecords();
      setAllLeaves(data);
      setDisplayedLeaves(data.slice(0, 10));
    } catch (error) {
      console.error("Error fetching leave history:", error);
    }
  };

  const handleShowMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const newCount = visibleCount + 10;
      setVisibleCount(newCount);
      setDisplayedLeaves(allLeaves.slice(0, newCount));
      setLoadingMore(false);
    }, 300); // small delay for better UX
  };

  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query.toLowerCase());
    }, 300),
    []
  );

  const filteredHistory = useMemo(() => {
    let filtered = displayedLeaves;
    if (searchQuery) {
      filtered = displayedLeaves.filter(
        (leave) =>
          leave.employeeId?.employeeId.toString().includes(searchQuery) ||
          leave.employeeId?.name.toLowerCase().includes(searchQuery)
      );
    }
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = new Date(a[sortConfig.key]);
        const bValue = new Date(b[sortConfig.key]);
        return sortConfig.direction === "ascending"
          ? aValue - bValue
          : bValue - aValue;
      });
    }
    return filtered.sort((a, b) =>
      a.status === "pending" ? -1 : b.status === "pending" ? 1 : 0
    );
  }, [displayedLeaves, searchQuery, sortConfig]);

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });
  };

  const handleApproveReject = async (leaveId, action) => {
    try {
      await approveRejectLeave(leaveId, action);
      toast.success(`Leave ${action} successfully`);
      const updatedLeaves = allLeaves.map((leave) =>
        leave._id === leaveId ? { ...leave, status: action } : leave
      );
      setAllLeaves(updatedLeaves);
      setDisplayedLeaves(updatedLeaves.slice(0, visibleCount));
    } catch (error) {
      console.error(`Error ${action} leave:`, error);
      toast.error(`Failed to ${action} leave`);
    }
  };

  const handleSaveResponse = async (leaveId) => {
    try {
      const response = responseData[leaveId];
      if (!response?.trim()) {
        return toast.error("Response cannot be empty.");
      }

      const { data } = await axios.post(
        `https://korus-employee-management-system-mern-stack.vercel.app/api/leaves/update-leave-ror/${leaveId}`,
        response,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      data.success ? toast.success(data.message) : toast.error(data.message);
      setShowTextArea(null);
    } catch (error) {
      console.error("Error saving response:", error);
      toast.error("Error saving response");
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
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
    <div className="p-6 bg-white min-h-screen">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Leave History</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by Employee ID or Name"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() =>
            navigate("/admin-dashboard/leave/employeesLeaveBalances")
          }
          className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          View Remaining Leaves
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              {[
                "S. No.",
                "EmpID",
                "Emp Name",
                "Department",
                "Leave Type",
                "Start Date",
                "Start Time",
                "End Date",
                "End Time",
                "No. of Days",
                "Reason",
                "Attachment",
                "Status",
                "Reason of Rejection",
                "Actions",
              ].map((title, idx) => (
                <th
                  key={idx}
                  onClick={() =>
                    (title === "Start Date" || title === "End Date") &&
                    handleSort(title.toLowerCase().replace(" ", ""))
                  }
                  className={`px-4 py-2 text-sm font-medium text-gray-700 ${
                    title === "Start Date" || title === "End Date"
                      ? "cursor-pointer"
                      : ""
                  }`}
                >
                  {title}
                  {sortConfig.key === title.toLowerCase().replace(" ", "") &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredHistory.map((leave, index) => (
              <tr key={leave._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2 text-center">
                  {leave.employeeId?.employeeId}
                </td>
                <td className="px-4 py-2">{leave.employeeId?.name}</td>
                <td className="px-4 py-2 text-center">
                  {leave.employeeId?.department?.departmentName}
                </td>
                <td className="px-4 py-2 text-center">
                  {leave.type.toLowerCase() === "others"
                    ? "Others/Late Hours Deduction"
                    : leave.type.toUpperCase()}
                </td>
                <td className="px-4 py-2">{formatDate(leave.startDate)}</td>
                <td className="px-4 py-2 text-center">
                  {new Date(`1970-01-01T${leave.startTime}`).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </td>
                <td className="px-4 py-2">{formatDate(leave.endDate)}</td>
                <td className="px-4 py-2 text-center">
                  {new Date(`1970-01-01T${leave.endTime}`).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </td>
                <td className="px-4 py-2 text-center">{leave.days}</td>
                <td className="px-4 py-2">{leave.reason}</td>
                <td className="px-4 py-2 text-center">
                  {leave.attachment ? (
                    <button
                      onClick={() =>
                        window.open(
                          `https://korus-employee-management-system-mern-stack.vercel.app/api/leaves/attachment/${leave._id}`,
                          "_blank"
                        )
                      }
                      className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                  ) : (
                    <span className="text-gray-500">No Attachment</span>
                  )}
                </td>
                <td
                  className={`px-4 py-2 text-center font-semibold ${getStatusColor(
                    leave.status
                  )}`}
                >
                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  {leave.approvedBy &&
                    leave.status === "approved" &&
                    ` by ${leave.approvedBy}`}
                  {leave.rejectedBy &&
                    leave.status === "rejected" &&
                    ` by ${leave.rejectedBy}`}
                </td>
                <td className="px-4 py-2 text-center">
                  {leave.status === "rejected" ? (
                    showTextArea === leave._id ? (
                      <div className="flex flex-col items-center">
                        <textarea
                          rows="3"
                          value={responseData[leave._id] || ""}
                          onChange={(e) =>
                            setResponseData((prev) => ({
                              ...prev,
                              [leave._id]: e.target.value,
                            }))
                          }
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                          placeholder="Write your response here..."
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSaveResponse(leave._id)}
                            className="bg-blue-500 px-3 py-1 text-white rounded-md hover:bg-blue-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setShowTextArea(null)}
                            className="bg-red-500 px-3 py-1 text-white rounded-md hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowTextArea(leave._id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Write Response
                      </button>
                    )
                  ) : (
                    leave.ror || "-"
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {leave.status === "pending" && (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() =>
                          handleApproveReject(leave._id, "approved")
                        }
                        className="bg-green-600 px-3 py-1 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleApproveReject(leave._id, "rejected")
                        }
                        className="bg-red-600 px-3 py-1 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loadingMore && <p className="text-center my-4">Loading more...</p>}

        {!loadingMore && displayedLeaves.length < allLeaves.length && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleShowMore}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Debounce function
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default ViewAllLeaves;
