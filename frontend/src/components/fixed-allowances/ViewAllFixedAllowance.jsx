import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import * as XLSX from "xlsx";

const ViewAllFixedAllowances = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allowanceHistory, setAllowanceHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);

  const mergeAllowanceRecords = (data) => {
    const merged = {};
    data.forEach((record) => {
      const key = `${record.employeeId.employeeId}-${record.allowanceMonth}-${record.allowanceYear}`;
      if (!merged[key]) {
        merged[key] = { ...record };
        Object.keys(record).forEach((field) => {
          if (["allowanceType", "allowanceAmount", "status"].includes(field)) {
            merged[key][field] = [record[field]];
          }
        });
      } else {
        Object.keys(record).forEach((field) => {
          if (["allowanceType", "allowanceAmount", "status"].includes(field)) {
            merged[key][field].push(record[field]);
          }
        });
      }
    });
    return Object.values(merged);
  };

  useEffect(() => {
    const fetchAllowanceData = async () => {
      try {
        const response = await axios.get(
          `https://korus-ems-backend.onrender.com/api/fixed-allowances/fetchAllHistory`,
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

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value) {
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
    navigate(`/${user.role}-dashboard/fixed-allowances/add-allowances`);
  };

  const handleEditAllowance = () => {
    navigate(`/${user.role}-dashboard/fixed-allowances/edit-allowances`);
  };

  const exportToExcel = () => {
    const worksheetData = [
      [
        "S. No.",
        "Emp ID",
        "Emp Name",
        "Allowance Month",
        "Allowance Year",
        "Bonus",
        "Loyalty Bonus",
        "Special Allowance",
        "Other Allowances",
      ],
      ...filteredHistory.map((allowance, index) => {
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

        return [
          index + 1,
          allowance.employeeId.employeeId,
          allowance.employeeId.name,
          allowance.allowanceMonth,
          allowance.allowanceYear,
          allowanceMap["bonus"] || allowance.bonus || 0,
          allowanceMap["loyaltybonus"] || allowance.loyaltyBonus || 0,
          allowanceMap["specialallowance"] || allowance.specialAllowance || 0,
          allowanceMap["others"] || allowance.others || 0,
        ];
      }),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fixed Allowances");
    XLSX.writeFile(workbook, "Fixed_Allowances.xlsx");
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
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            onClick={exportToExcel}
          >
            Download as Excel
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <h2 className="text-2xl text-gray-800 font-bold mb-4">
          Fixed Allowance History
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
                Bonus
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Loyalty Bonus
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Special Allowance
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                Other Allowances
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((allowance, index) => {
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
                    {allowanceMap["bonus"] || allowance.bonus || 0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["loyaltybonus"] ||
                      allowance.loyaltyBonus ||
                      0}
                  </td>
                  <td className="px-4 py-2 text-center text-sm text-gray-800">
                    {allowanceMap["specialallowance"] ||
                      allowance.specialAllowance ||
                      0}
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

export default ViewAllFixedAllowances;
