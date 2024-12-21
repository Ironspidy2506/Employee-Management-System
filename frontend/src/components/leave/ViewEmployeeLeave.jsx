import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewEmployeeLeave = () => {
  const { _id } = useParams(); // Extract employee ID from the URL
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  // Fetch leave data when component mounts
  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employees/leaves/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.data;
        setLeaveHistory(data);
        setFilteredHistory(data); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching leave history:", error);
      }
    };

    fetchLeaveHistory();
  }, [_id]);

  // Function to format dates
  const formatDate = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Function to determine the status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Sorting function
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedData = [...filteredHistory].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setFilteredHistory(sortedData);
  };

  return (
    <div className="overflow-x-auto p-4 mt-2">
      <h2 className="text-2xl font-bold mb-4">Leave History</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-200 border-b">
          <tr>
            {[
              { label: "S. No.", key: null },
              { label: "Leave Type", key: "type" },
              { label: "Start Date", key: "startDate" },
              { label: "End Date", key: "endDate" },
              { label: "No. of Days", key: "days" },
              { label: "Status", key: "status" },
            ].map((column, index) => (
              <th
                key={index}
                className={`px-4 py-3 text-left text-base font-medium text-gray-700 ${
                  column.key ? "cursor-pointer" : ""
                }`}
                onClick={column.key ? () => handleSort(column.key) : null}
              >
                {column.label}
                {sortConfig.key === column.key &&
                  (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredHistory.map((leave, index) => (
            <tr
              key={leave._id}
              className="border-b hover:bg-gray-50 text-base text-gray-800"
            >
              <td className="px-4 py-3">{index + 1}</td>
              <td className="px-4 py-3">{leave.type.toUpperCase()}</td>
              <td className="px-4 py-3">{formatDate(leave.startDate)}</td>
              <td className="px-4 py-3">{formatDate(leave.endDate)}</td>
              <td className="px-4 py-3">{leave.days}</td>
              <td
                className={`px-4 py-3 font-semibold ${getStatusColor(
                  leave.status
                )}`}
              >
                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewEmployeeLeave;
