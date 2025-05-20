import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HrLeaveView = () => {
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

        console.log(response);
        
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

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
  };

  const formatTime = (timeStr) => {
    return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Leave History</h2>

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
                    <td className="px-4 py-2">
                      {leave.attachment ? (
                        <button
                          onClick={() =>
                            window.open(
                              `https://korus-employee-management-system-mern-stack.vercel.app/api/leaves/attachment/${leave._id}`,
                              "_blank"
                            )
                          }
                          className="text-blue-600 underline"
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-gray-500">No Attachment</span>
                      )}
                    </td>
                    <td className="px-4 py-2 capitalize font-semibold text-center">
                      {leave.status}
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
