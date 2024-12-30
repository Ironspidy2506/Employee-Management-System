import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useState, useEffect } from "react";
import axios from "axios";

const ApproveAllowances = () => {
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
          `https://employee-management-system-backend-objq.onrender.com/api/allowances/fetchAllHistory`,
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

  // Handle employee ID search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const filtered = allowanceHistory.filter((allowance) =>
        allowance.employeeId.employeeId.toString().includes(value)
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
        `https://employee-management-system-backend-objq.onrender.com/api/allowances/${allowanceId}`,
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
  const formatAllowanceType = (type) => {
    switch (type) {
      case "site":
        return "Site Allowance";
      case "earnedLeave":
        return "Earned Leave";
      case "ltc":
        return "LTC";
      case "loyaltyBonus":
        return "Loyalty Bonus";
      case "petrol":
        return "Petrol Allowances";
      case "driver":
        return "Driver Allowance";
      case "carMaint":
        return "Car Maintenance";
      case "localTravel":
        return "Local Travel/Metro Fair";
      case "deferred":
        return "Deferred Allowance";
      case "overTime":
        return "Overtime";
      case "others":
        return "Other Allowances";
      default:
        return type; // Fallback for unexpected values
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white">
      {/* Table Section */}
      <div className="overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Allowance Approval History</h2>
        {/* Allowance History Section */}
        <div className="mb-4 flex justify-between items-center rounded-sm px-1">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by Employee ID"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

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
                Allowance Type
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Allowance Month
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Allowance Year
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Allowance Amount
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
                  {allowance.employeeId.name}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-800 capitalize">
                  {formatAllowanceType(allowance.allowanceType)}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-800 capitalize">
                  {allowance.allowanceMonth}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-800">
                  {allowance.allowanceYear}
                </td>
                <td className="px-4 py-2 text-center text-sm text-gray-800">
                  {allowance.allowanceAmount}
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
                  ) : allowance.status === "approved" && allowance.voucherNo ? (
                    <span>Voucher No - {allowance.voucherNo || ""}</span>
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

export default ApproveAllowances;
