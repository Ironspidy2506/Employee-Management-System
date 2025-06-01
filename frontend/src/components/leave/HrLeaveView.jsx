import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/authContext";

const HrLeaveView = () => {
  const navigate = useNavigate();
  const user = useAuth();
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://korus-employee-management-system-mern-stack.vercel.app/api/leaves/admin-hr/get-all-leaves", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLeaveHistory(response.data);
      } catch (error) {
        toast.error("Failed to fetch leave history.");
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveHistory();
  }, []);

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  const formatTime = (timeStr) =>
    new Date(`1970-01-01T${timeStr}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const downloadExcel = () => {
    const formattedData = leaveHistory.map((leave, index) => ({
      "S. No.": index + 1,
      "Emp ID": leave.employeeId?.employeeId || "",
      "Emp Name": leave.employeeId?.name || "",
      "Department": leave.employeeId?.department?.departmentName || "",
      "Leave Type": leave.type?.toUpperCase() || "",
      "Start Date": formatDate(leave.startDate),
      "Start Time": formatTime(leave.startTime),
      "End Date": formatDate(leave.endDate),
      "End Time": formatTime(leave.endTime),
      "Days": leave.days,
      "Reason": leave.reason,
      "Status": leave.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leave History");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "leave-history.xlsx");
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

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="flex space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Leave History</h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/${user.user.role}-dashboard/leave/view-employeesLeaveBalances`)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Remaining Leaves
              </button>
              <button
                onClick={() => navigate(`/${user.user.role}-dashboard/leave/employeesLeaveBalances`)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit Leave Balance
              </button>
              <button
                onClick={downloadExcel}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Download Excel
              </button>
            </div>
          </div>

          {leaveHistory.length === 0 ? (
            <p className="text-gray-500">No leave records found.</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">S. No.</th>
                  <th className="px-4 py-2 text-left">Emp ID</th>
                  <th className="px-4 py-2 text-left">Emp Name</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Leave Type</th>
                  <th className="px-4 py-2 text-left">Start Date</th>
                  <th className="px-4 py-2 text-left">Start Time</th>
                  <th className="px-4 py-2 text-left">End Date</th>
                  <th className="px-4 py-2 text-left">End Time</th>
                  <th className="px-4 py-2 text-left">Days</th>
                  <th className="px-4 py-2 text-left">Reason</th>
                  <th className="px-4 py-2 text-left">Attachment</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map((leave, index) => (
                  <tr key={leave._id} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{leave.employeeId?.employeeId}</td>
                    <td className="px-4 py-2">{leave.employeeId?.name}</td>
                    <td className="px-4 py-2">
                      {leave.employeeId?.department?.departmentName}
                    </td>
                    <td className="px-4 py-2">
                      {leave.type.toUpperCase()}
                    </td>
                    <td className="px-4 py-2">{formatDate(leave.startDate)}</td>
                    <td className="px-4 py-2">{formatTime(leave.startTime)}</td>
                    <td className="px-4 py-2">{formatDate(leave.endDate)}</td>
                    <td className="px-4 py-2">{formatTime(leave.endTime)}</td>
                    <td className="px-4 py-2">{leave.days}</td>
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
                          className="bg-blue-600 text-white px-4 py-2 rounded-md"
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
                      {leave.approvedBy && leave.status === "approved" && ` by ${leave.approvedBy}`}
                      {leave.rejectedBy && leave.status === "rejected" && ` by ${leave.rejectedBy}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default HrLeaveView;
