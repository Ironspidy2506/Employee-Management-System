import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext"; // Assuming this provides the logged-in user's data
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewEmployeeAllowance = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Assuming this provides the logged-in user's data
  const [allowanceHistory, setAllowanceHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  // Fetch allowance history data
  useEffect(() => {
    const fetchMergedAllowanceData = async () => {
      try {
        // Fetch both allowances and fixed-allowances data in parallel
        const [allowancesResponse, fixedAllowancesResponse] = await Promise.all(
          [
            axios.get(
              `https://employee-management-system-backend-objq.onrender.com/api/allowances/history/${user._id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            ),
            axios.get(
              `https://employee-management-system-backend-objq.onrender.com/api/fixed-allowances/history/${user._id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            ),
          ]
        );

        // Merge the data from both responses
        const mergedData = [
          ...allowancesResponse.data,
          ...fixedAllowancesResponse.data,
        ];

        // Set the merged data into state
        setAllowanceHistory(mergedData);
        setFilteredHistory(mergedData);
      } catch (error) {
        console.error("Error fetching merged allowance data:", error);
      }
    };

    fetchMergedAllowanceData();
  }, [user._id]);

  // Handle project number search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const filtered = allowanceHistory.filter((allowance) =>
        allowance.allowanceType.toLowerCase().includes(value.toLowerCase())
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

  const handleDelete = async (_id) => {
    // Confirm deletion action
    try {
      const response = await axios.delete(
        `https://employee-management-system-backend-objq.onrender.com/api/allowances/delete/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        toast.success("Allowance deleted successfully");
        setFilteredHistory((prevAllowances) =>
          prevAllowances.filter((allowance) => allowance._id !== _id)
        );
      }
    } catch (err) {
      console.error("Error deleting allowance:", err);
      alert("There was an error deleting the allowance.");
    }
  };

  const formatAllowanceType = (type) => {
    switch (type) {
      case "epfByCo":
        return "EPF By Co.";
      case "esiByCo":
        return "ESI By Co.";
      case "medPAIns":
        return "Med. & PA. Ins.";
      case "monthlyInsAcc":
        return "Monthly Ins. & Accidental";
      case "site":
        return "Site Allowance";
      case "earnedLeave":
        return "Earned Leave";
        case "bonus":
          return "Bonus"
      case "ltc":
        return "LTC";
      case "loyaltyBonus":
        return "Loyalty Bonus";
      case "gratuity":
        return "Gratuity";
      case "resPhone":
        return "Res Phone";
      case "mobile":
        return "Mobile";
      case "carEmi":
        return "Car EMI";
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
        return type;
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-6 space-y-6 bg-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-sm shadow-md p-5">
          <input
            type="search"
            placeholder="Search by Allowance Type"
            className="w-full md:w-auto flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleSearch}
          />
          <Link
            to="/employee-dashboard/allowances/add"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Add New Allowance
          </Link>
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
                  Project No.
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                  Client
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                  Allowance Type
                </th>
                <th
                  className="px-4 py-2 text-center text-sm font-medium text-gray-700 cursor-pointer"
                  onClick={() => handleSort("startDate")}
                >
                  Allowance Month
                  {sortConfig.key === "startDate" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
                <th
                  className="px-4 py-2 text-center text-sm font-medium text-gray-700 cursor-pointer"
                  onClick={() => handleSort("endDate")}
                >
                  Allowance Year
                  {sortConfig.key === "endDate" &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
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
                    {allowance.projectNo}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800 capitalize">
                    {allowance.client}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800 capitalize">
                    {formatAllowanceType(allowance.allowanceType)}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowance.allowanceMonth}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowance.allowanceYear}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowance.allowanceAmount} {/* Location column */}
                  </td>
                  <td
                    className={`px-4 py-2 text-center text-sm font-semibold ${getStatusColor(
                      allowance.status
                    )}`}
                  >
                    {allowance.status.charAt(0).toUpperCase() +
                      allowance.status.slice(1)}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800 space-x-2">
                    {allowance.status !== "approved" &&
                    allowance.status !== "rejected" ? (
                      <>
                        <div className="flex flex-wrap justify-center gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                `/employee-dashboard/allowances/edit/${allowance._id}`
                              )
                            }
                            className="px-4 py-2 text-sm font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full sm:w-auto"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(allowance._id)}
                            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 w-full sm:w-auto"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
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

export default ViewEmployeeAllowance;
