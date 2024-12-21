import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import axios from "axios";

const ViewAllAllowances = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allowanceHistory, setAllowanceHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [voucherNos, setVoucherNos] = useState({}); // State to track voucher numbers

  // Fetch allowance history data
  useEffect(() => {
    const fetchAllowanceData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/allowances/fetchAllHistory`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setAllowanceHistory(response.data);
        setFilteredHistory(response.data);
      } catch (error) {
        console.error("Error fetching allowance data:", error);
      }
    };
    fetchAllowanceData();
  }, [user._id]);

  // Handle project number search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const filtered = allowanceHistory.filter((allowance) =>
        allowance.projectNo.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(allowanceHistory);
    }
  };

  // Sorting function
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredHistory].sort((a, b) => {
      if (key === "startDate" || key === "endDate") {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === "ascending" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    setFilteredHistory(sortedData);
  };

  // Approve allowance with voucher number
  const handleApprove = async (allowanceId) => {
    const voucherNo = voucherNos[allowanceId];
    if (!voucherNo) {
      alert("Please enter a voucher number.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/allowances/${allowanceId}`,
        { status: "approved", voucherNo },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAllowanceHistory((prevHistory) =>
        prevHistory.map((allowance) =>
          allowance._id === allowanceId
            ? { ...allowance, status: "approved", voucherNo }
            : allowance
        )
      );
      setFilteredHistory((prevHistory) =>
        prevHistory.map((allowance) =>
          allowance._id === allowanceId
            ? { ...allowance, status: "approved", voucherNo }
            : allowance
        )
      );

    } catch (error) {
      console.error("Error approving allowance:", error);
    }
  };

  // Update voucher number state for specific allowance
  const handleInputChange = (allowanceId, value) => {
    setVoucherNos((prev) => ({ ...prev, [allowanceId]: value }));
  };

  // Get status color helper
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Format date
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="p-6 space-y-6 bg-white">
      {/* Allowance History Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-sm shadow-md p-5">
        <input
          type="search"
          placeholder="Search Project Number"
          className="w-full md:w-auto flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleSearch}
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Allowance History</h2>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                S. No.
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Employee ID
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Employee Name
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Department
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Project No.
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Allowance Type
              </th>
              <th
                className="px-4 py-2 text-center text-sm font-medium text-gray-700 cursor-pointer"
                onClick={() => handleSort("startDate")}
              >
                Start Date
                {sortConfig.key === "startDate" &&
                  (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
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
                Location
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Allowances
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((allowance, index) => (
              <tr key={allowance._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center text-sm text-gray-800">
                  {index + 1}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-800">
                  {allowance.employeeId.employeeId}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-800">
                  {allowance.empName}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-800">
                  {allowance.department}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-800">
                  {allowance.projectNo}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-800 capitalize">
                  {allowance.allowanceType}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-800">
                  {formatDate(allowance.startDate)}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-800">
                  {formatDate(allowance.endDate)}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-800">
                  {allowance.placeOfVisit}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-800">
                  {allowance.allowances.reduce(
                    (sum, item) => sum + item.amount,
                    0
                  )}
                </td>
                <td
                  className={`px-4 py-2 text-center text-sm font-semibold ${getStatusColor(
                    allowance.status
                  )}`}
                >
                  {allowance.status === "approved"
                    ? allowance.status.charAt(0).toUpperCase() +
                      allowance.status.slice(1)
                    : allowance.status.charAt(0).toUpperCase() +
                      allowance.status.slice(1)}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-800">
                  {allowance.status === "pending" ? (
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <input
                        type="text"
                        placeholder="Voucher No."
                        value={voucherNos[allowance._id] || ""}
                        onChange={(e) =>
                          handleInputChange(allowance._id, e.target.value)
                        }
                        className="px-2 py-1 border border-gray-300 rounded-md"
                      />
                      <button
                        onClick={() => handleApprove(allowance._id)}
                        className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 sm:text-base"
                      >
                        Approve
                      </button>
                    </div>
                  ) : allowance.status === "approved" ? (
                    <span>Voucher No - {allowance.voucherNo}</span>
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

export default ViewAllAllowances;
