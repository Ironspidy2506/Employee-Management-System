import React, { useState, useEffect } from "react";
import { getLeaveHistory, deleteLeave } from "../../utils/LeaveHelper.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import { fetchLeaveBalance } from "../../utils/LeaveHelper.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewLeaveHistory = () => {
  const { user } = useAuth();

  const [leaveHistory, setLeaveHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [leaveCounts, setLeaveCounts] = useState({
    el: 0,
    cl: 0,
    sl: 0,
    od: 0,
    lwp: 0,
    others: 0,
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const navigate = useNavigate();
  const userId = user._id;

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const data = await getLeaveHistory(userId);
        setLeaveHistory(data);
        setFilteredHistory(data);
      } catch (error) {
        console.error("Error fetching leave history:", error);
      }
    };

    fetchLeaveHistory();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balance = await fetchLeaveBalance(userId);
        setLeaveCounts(balance);
      } catch (error) {
        console.error("Error fetching leave balance:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleDelete = async (leaveId) => {
    try {
      await deleteLeave(leaveId);
      toast.success("Leave deleted successfully");
      const updatedHistory = leaveHistory.filter(
        (leave) => leave._id !== leaveId
      );
      setLeaveHistory(updatedHistory);
      setFilteredHistory(updatedHistory);
    } catch (error) {
      console.error("Error deleting leave:", error);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredHistory].sort((a, b) => {
      const aValue = new Date(a[key]);
      const bValue = new Date(b[key]);

      if (direction === "ascending") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
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

  return (
    <>
      <ToastContainer />
      <div className="p-6 space-y-6 bg-white">
        {/* Leave Counts and Buttons Section */}
        <div className="flex flex-wrap items-center justify-between p-6 rounded-lg shadow-md bg-white gap-4">
          {/* Leave Counts */}
          <div className="flex gap-2 items-center">
            <div className="text-md font-semibold text-gray-700">
              Earned Leave (EL): {leaveCounts.el}
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-md font-semibold text-gray-700">
              Casual Leave (CL): {leaveCounts.cl}
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-md font-semibold text-gray-700">
              Sick Leave (SL): {leaveCounts.sl}
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-md font-semibold text-gray-700">
              On Duty (OD): {leaveCounts.od}
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-md font-semibold text-gray-700">
              Leave without pay (LWP): {leaveCounts.od}
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-md font-semibold text-gray-700">
              Others: {leaveCounts.others}
            </div>
          </div>

          {/* Apply Leave Button */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/employee-dashboard/leave/apply")}
              className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            >
              Apply Leave
            </button>

            {user.role === "Lead" ? (
              <button
                onClick={() =>
                  navigate(
                    `/employee-dashboard/leave/approve-leaves/${user._id}`
                  )
                }
                className="px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              >
                Approve Leave
              </button>
            ) : null}
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <h2 className="text-2xl text-gray-800 font-bold mb-4">
            Leave History
          </h2>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-200 border-b">
              <tr>
                <th className="px-4 py-2 text-center text-base font-medium text-gray-700">
                  S. No.
                </th>
                <th className="px-4 py-2 text-center text-base font-medium text-gray-700">
                  Leave Type
                </th>
                <th
                  className="px-4 py-2 text-center text-base font-medium text-gray-700 cursor-pointer"
                  onClick={() => handleSort("startDate")}
                >
                  Start Date
                  {sortConfig.key === "startDate" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th className="px-4 py-2 text-center text-base font-medium text-gray-700">
                  Start Time
                </th>
                <th
                  className="px-4 py-2 text-center text-base font-medium text-gray-700 cursor-pointer"
                  onClick={() => handleSort("endDate")}
                >
                  End Date
                  {sortConfig.key === "endDate" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th className="px-4 py-2 text-center text-base font-medium text-gray-700">
                  End Time
                </th>
                <th className="px-4 py-2 text-center text-base font-medium text-gray-700">
                  No. of Days
                </th>
                <th className="px-4 py-2 text-center text-base font-medium text-gray-700">
                  Attachment
                </th>
                <th className="px-4 py-2 text-center text-base font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-2 text-center text-base font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((leave, index) => (
                <tr key={leave._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-base text-center text-gray-800">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 text-base text-center text-gray-800">
                    {leave.type.toUpperCase()}
                  </td>
                  <td className="px-4 py-2 text-base text-center text-gray-800">
                    {formatDate(leave.startDate)}
                  </td>
                  <td className="px-4 py-2 text-base text-center text-gray-800">
                    {new Date(
                      `1970-01-01T${leave.startTime}`
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="px-4 py-2 text-base text-center text-gray-800">
                    {formatDate(leave.endDate)}
                  </td>
                  <td className="px-4 py-2 text-base text-center text-gray-800">
                    {new Date(`1970-01-01T${leave.endTime}`).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </td>
                  <td className="px-4 py-2 text-base  text-center text-gray-800">
                    {leave.days}
                  </td>
                  <td className="px-4 py-2 text-sm text-center text-gray-800">
                    {leave.attachment ? (
                      <button
                        onClick={() =>
                          window.open(
                            `https://employee-management-system-backend-objq.onrender.com/api/leaves/attachment/${leave._id}`,
                            "_blank"
                          )
                        }
                        className="text-white bg-blue-600 rounded hover:bg-blue-700 px-3 py-2"
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
                    className={`px-4 py-2 text-base text-center font-semibold ${getStatusColor(
                      leave.status
                    )}`}
                  >
                    {leave.status.charAt(0).toUpperCase() +
                      leave.status.slice(1)}
                  </td>
                  <td className="px-4 py-2 text-base text-gray-800 space-x-2">
                    {leave.status !== "approved" &&
                    leave.status !== "rejected" ? (
                      <div className="flex flex-col justify-center items-center lg:flex-row gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/employee-dashboard/leave/edit/${leave._id}`
                            )
                          }
                          className="px-4 py-2 text-base font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(leave._id)}
                          className="px-4 py-2 text-base font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewLeaveHistory;
