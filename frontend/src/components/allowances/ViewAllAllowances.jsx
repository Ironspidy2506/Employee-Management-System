import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import * as XLSX from "xlsx";

const ViewAllAllowances = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allowanceHistory, setAllowanceHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);

  // Merge records with the same empId, allowanceMonth, and allowanceYear
  const mergeAllowanceRecords = (data) => {
    const merged = {};

    data.forEach((record) => {
      const key = `${record.employeeId.employeeId}-${record.allowanceMonth}-${record.allowanceYear}`;

      if (!merged[key]) {
        merged[key] = { ...record };
        // Initialize fields that might need to be turned into arrays
        Object.keys(record).forEach((field) => {
          if (["allowanceType", "allowanceAmount", "status"].includes(field)) {
            merged[key][field] = [record[field]];
          }
        });
      } else {
        // Merge fields into arrays for duplicates
        Object.keys(record).forEach((field) => {
          if (["allowanceType", "allowanceAmount", "status"].includes(field)) {
            merged[key][field].push(record[field]);
          }
        });
      }
    });

    return Object.values(merged);
  };

  // Fetch allowance history data
  useEffect(() => {
    const fetchAllowanceData = async () => {
      try {
        const response = await axios.get(
          `https://korus-ems-backend.onrender.com/api/allowances/fetchAllHistory`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const mergedData = mergeAllowanceRecords(response.data);
        setAllowanceHistory(mergedData);
        setFilteredHistory(mergedData);
      } catch (error) {
        console.error("Error fetching allowance data:", error);
      }
    };
    fetchAllowanceData();
  }, [user._id]);

  // Handle search by Employee ID
  const handleSearch = (e) => {
    const value = e.target.value;

    if (value) {
      // Convert value to number if it's not empty
      const numericValue = Number(value);

      const filtered = allowanceHistory.filter(
        (allowance) => allowance?.employeeId?.employeeId === numericValue
      );

      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(allowanceHistory);
    }
  };

  const handleAddAllowance = () => {
    navigate(`/${user.role}-dashboard/allowances/add-allowances`);
  };

  const handleEditAllowance = () => {
    navigate(`/${user.role}-dashboard/allowances/edit-allowances`);
  };

  const handleApproveAllowance = () => {
    navigate(`/${user.role}-dashboard/allowances/approve-allowances`);
  };

  // Function to handle Excel download
  const downloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      filteredHistory.map((allowance, index) => {
        const allowanceMap = {};
        if (
          allowance.allowanceType &&
          allowance.allowanceAmount &&
          allowance.status
        ) {
          allowance.allowanceType.forEach((type, idx) => {
            if (allowance.status[idx] === "approved") {
              const key = type.toLowerCase();
              allowanceMap[key] =
                (allowanceMap[key] || 0) + allowance.allowanceAmount[idx];
            }
          });
        }

        return {
          "S. No.": index + 1,
          "Emp ID": allowance.employeeId.employeeId,
          "Emp Name": allowance.employeeId.name,
          "Allowance Month": allowance.allowanceMonth,
          "Allowance Year": allowance.allowanceYear,
          "EPF By Co.": allowanceMap["epfbyco"] || allowance.epfByCo || 0,
          "ESI by Co.": allowanceMap["esibyco"] || allowance.esiByCo || 0,
          "Med. & P.A. Ins.":
            allowanceMap["medpains"] || allowance.medPAIns || 0,
          "Monthly Ins. & Accidental":
            allowanceMap["monthlyinsacc"] || allowance.monthlyInsAcc || 0,
          "Site Allowance": allowanceMap["site"] || allowance.site || 0,
          "Earned Leave":
            allowanceMap["earnedleave"] || allowance.earnedLeave || 0,
          LTC: allowanceMap["ltc"] || allowance.ltc || 0,
          Gratuity: allowanceMap["gratuity"] || allowance.gratuity || 0,
          "Res. Phone": allowanceMap["resphone"] || allowance.resPhone || 0,
          Mobile: allowanceMap["mobile"] || allowance.mobile || 0,
          "Car EMI": allowanceMap["caremi"] || allowance.carEmi || 0,
          Petrol: allowanceMap["petrol"] || allowance.petrol || 0,
          Driver: allowanceMap["driver"] || allowance.driver || 0,
          "Car Maint.": allowanceMap["carmaint"] || allowance.carMaint || 0,
          "Local Travel/Metro Fair":
            allowanceMap["localtravel"] || allowance.localTravel || 0,
          Deferred: allowanceMap["deferred"] || allowance.deferred || 0,
          "Over Time": allowanceMap["overtime"] || allowance.overTime || 0,
          Others: allowanceMap["others"] || allowance.others || 0,
        };
      })
    );
    XLSX.utils.book_append_sheet(wb, ws, "Allowance History");
    XLSX.writeFile(wb, "Allowance_History.xlsx");
  };

  return (
    <div className="p-6 space-y-6 bg-white">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-col justify-between gap-4 rounded-sm shadow-md p-5">
        <input
          type="search"
          placeholder="Search by Employee ID"
          className="w-full md:w-auto flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleSearch}
        />
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleAddAllowance}
          >
            Add Allowance
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            onClick={handleEditAllowance}
          >
            Edit Allowance
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={handleApproveAllowance}
          >
            Approve Allowance
          </button>
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            onClick={downloadExcel}
          >
            Download as Excel
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <h2 className="text-2xl text-gray-800 font-bold mb-4">
          Variable Allowance History
        </h2>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                S. No.
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Emp ID
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Emp Name
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Allowance Month
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Allowance Year
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                EPF By Co.
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                ESI by Co.
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Med. & P.A. Ins.
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Monthly Ins. & Accidental
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Site Allowance
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Earned Leave
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                LTC
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Gratuity
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Res. Phone
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Mobile
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Car EMI
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Petrol
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Driver
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Car Maint.
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Local Travel/Metro Fair
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Deferred
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Over Time
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Others
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((allowance, index) => {
              // Create a map of allowance types to amounts for easier access
              const allowanceMap = {};
              if (
                allowance.allowanceType &&
                allowance.allowanceAmount &&
                allowance.status
              ) {
                allowance.allowanceType.forEach((type, idx) => {
                  if (allowance.status[idx] === "approved") {
                    const key = type.toLowerCase();
                    allowanceMap[key] =
                      (allowanceMap[key] || 0) + allowance.allowanceAmount[idx];
                  }
                });
              }

              return (
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
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowance.allowanceMonth}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowance.allowanceYear}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["epfbyco"] || allowance.epfByCo || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["esibyco"] || allowance.esiByCo || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["medpains"] || allowance.medPAIns || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["monthlyinsacc"] ||
                      allowance.monthlyInsAcc ||
                      0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["site"] || allowance.site || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["earnedleave"] || allowance.earnedLeave || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["ltc"] || allowance.ltc || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["gratuity"] || allowance.gratuity || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["resphone"] || allowance.resPhone || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["mobile"] || allowance.mobile || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["caremi"] || allowance.carEmi || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["petrol"] || allowance.petrol || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["driver"] || allowance.driver || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["carmaint"] || allowance.carMaint || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["localtravel"] || allowance.localTravel || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["deferred"] || allowance.deferred || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["overtime"] || allowance.overTime || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["others"] || allowance.others || 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllAllowances;
