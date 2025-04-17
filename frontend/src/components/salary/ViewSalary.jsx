import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

const ViewSalary = () => {
  const { user } = useAuth();
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("monthly");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSalaries([]);
    setFilteredSalaries([]);
    setSearchQuery("");
    setEmployeeId("");
    setMonth("");
    setYear("");
  }, [selectedOption]);

  const fetchSalaries = async () => {
    setIsFetching(true);

    if (selectedOption === "monthly") {
      try {
        const response = await axios.get(
          `https://korus-employee-management-system-mern-stack.vercel.app/api/salary/monthly-wise/${month}/${year}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log(response);

        toast.success(`Fetched salary data for ${month} ${year}`);
        setSalaries(response.data);
        setFilteredSalaries(response.data);
      } catch (error) {
        console.error("Error fetching salaries:", error);
      }
    } else {
      try {
        const response = await axios.get(
          `https://korus-employee-management-system-mern-stack.vercel.app/api/salary/employee-wise/${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast.success(`Fetched salary data for Employee ID: ${employeeId}`);
        setSalaries(response.data);
        setFilteredSalaries(response.data);
      } catch (error) {
        console.error("Error fetching employee salary:", error);
      }
    }

    setIsFetching(false);
  };

  const calculateTotalSalary = (salary) => {
    // The total salary calculation logic remains unchanged
    const hra = salary.allowances[0]?.amount || 0;
    const foodAllowance = salary.allowances[1]?.amount || 0;
    const medicalAllowance = salary.allowances[2]?.amount || 0;
    const transportAllowance = salary.allowances[3]?.amount || 0;

    const otherAllowances = salary.allowances.reduce(
      (total, allowance, index) => {
        if (index !== 0 && index !== 1 && index !== 2 && index !== 3) {
          return total + (allowance?.amount || 0);
        }
        return total;
      },
      0
    );

    const epf = salary.deductions[0]?.amount || 0;
    const ESIC = salary.deductions[1]?.amount || 0;
    const advance = salary.deductions[2]?.amount || 0;
    const tax = salary.deductions[3]?.amount || 0;

    const otherDeductions = salary.deductions.reduce(
      (total, deduction, index) => {
        if (index !== 0 && index !== 1 && index !== 2 && index !== 3) {
          return total + (deduction?.amount || 0);
        }
        return total;
      },
      0
    );

    const totalAllowances =
      hra +
      foodAllowance +
      medicalAllowance +
      transportAllowance +
      otherAllowances;
    const totalDeductions = epf + ESIC + advance + tax + otherDeductions;

    const grossTotalSalary =
      salary.basicSalary + totalAllowances - totalDeductions;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthIndex = monthNames.indexOf(salary.paymentMonth);
    if (monthIndex === -1) {
      console.error("Invalid month name");
      return 0;
    }

    const year = parseInt(salary.paymentYear);
    if (isNaN(year)) {
      console.error("Invalid year");
      return 0;
    }

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const adjustedSalary =
      (grossTotalSalary * salary.netPayableDays) / daysInMonth;

    return Math.ceil(adjustedSalary);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = salaries.filter((salary) =>
      salary.employeeId?.employeeId?.toString().toLowerCase().includes(query)
    );
    setFilteredSalaries(filtered);
  };

  const handleExportToExcel = () => {
    // Calculate totals
    const totals = {
      GrossSalary: filteredSalaries.reduce(
        (sum, salary) => sum + (salary.grossSalary || 0),
        0
      ),
      BasicSalary: filteredSalaries.reduce(
        (sum, salary) => sum + (salary.basicSalary || 0),
        0
      ),
      HRA: filteredSalaries.reduce(
        (sum, salary) =>
          sum + (salary.allowances.find((a) => a.name === "HRA")?.amount || 0),
        0
      ),
      FoodAllowance: filteredSalaries.reduce(
        (sum, salary) =>
          sum +
          (salary.allowances.find((a) => a.name === "Food Allowance")?.amount ||
            0),
        0
      ),
      MedicalAllowance: filteredSalaries.reduce(
        (sum, salary) =>
          sum +
          (salary.allowances.find((a) => a.name === "Medical Allowance")
            ?.amount || 0),
        0
      ),
      TransportAllowance: filteredSalaries.reduce(
        (sum, salary) =>
          sum +
          (salary.allowances.find((a) => a.name === "Transport Allowance")
            ?.amount || 0),
        0
      ),
      OtherAllowances: filteredSalaries.reduce(
        (sum, salary) =>
          sum +
          salary.allowances
            .filter(
              (allowance) =>
                ![
                  "HRA",
                  "Food Allowance",
                  "Medical Allowance",
                  "Transport Allowance",
                ].includes(allowance?.name)
            )
            .reduce((total, allowance) => total + (allowance?.amount || 0), 0),
        0
      ),
      EPF: filteredSalaries.reduce(
        (sum, salary) =>
          sum + (salary.deductions.find((d) => d.name === "EPF")?.amount || 0),
        0
      ),
      ESIC: filteredSalaries.reduce(
        (sum, salary) =>
          sum + (salary.deductions.find((d) => d.name === "ESIC")?.amount || 0),
        0
      ),
      AdvanceDeductions: filteredSalaries.reduce(
        (sum, salary) =>
          sum +
          (salary.deductions.find((d) => d.name === "Advance Deduction")
            ?.amount || 0),
        0
      ),
      TaxDeductions: filteredSalaries.reduce(
        (sum, salary) =>
          sum +
          (salary.deductions.find((d) => d.name === "Tax Deduction")?.amount ||
            0),
        0
      ),
      OtherDeductions: filteredSalaries.reduce(
        (sum, salary) =>
          sum +
          salary.deductions
            .filter(
              (deduction) =>
                !["EPF", "ESIC", "Advance Deduction", "Tax Deduction"].includes(
                  deduction?.name
                )
            )
            .reduce((total, deduction) => total + (deduction?.amount || 0), 0),
        0
      ),
      TotalSalary: filteredSalaries.reduce(
        (sum, salary) => sum + calculateTotalSalary(salary),
        0
      ),
      EmpType: "Total", // This will be a label for the total row
    };

    // Get the table data (filteredSalaries)
    const data = filteredSalaries.map((salary) => ({
      EmpID: salary.employeeId?.employeeId || "0",
      EmpName: salary.employeeId?.name || "NA",
      EmpType: salary.employeeType || "NA",
      GrossSalary: salary.grossSalary,
      BasicSalary: salary.basicSalary,
      HRA: salary.allowances.find((a) => a.name === "HRA")?.amount || 0,
      FoodAllowance:
        salary.allowances.find((a) => a.name === "Food Allowance")?.amount || 0,
      MedicalAllowance:
        salary.allowances.find((a) => a.name === "Medical Allowance")?.amount ||
        0,
      TransportAllowance:
        salary.allowances.find((a) => a.name === "Transport Allowance")
          ?.amount || 0,
      OtherAllowances: salary.allowances
        .filter(
          (allowance) =>
            ![
              "HRA",
              "Food Allowance",
              "Medical Allowance",
              "Transport Allowance",
            ].includes(allowance?.name)
        )
        .reduce((total, allowance) => total + (allowance?.amount || 0), 0),
      EPF: salary.deductions.find((d) => d.name === "EPF")?.amount || 0,
      ESIC: salary.deductions.find((d) => d.name === "ESIC")?.amount || 0,
      AdvanceDeductions:
        salary.deductions.find((d) => d.name === "Advance Deduction")?.amount ||
        0,
      TaxDeductions:
        salary.deductions.find((d) => d.name === "Tax Deduction")?.amount || 0,
      OtherDeductions: salary.deductions
        .filter(
          (deduction) =>
            !["EPF", "ESIC", "Advance Deduction", "Tax Deduction"].includes(
              deduction?.name
            )
        )
        .reduce((total, deduction) => total + (deduction?.amount || 0), 0),
      PayableDays: salary.payableDays || "NA",
      Sundays: salary.sundays || "NA",
      NetPayableDays: salary.netPayableDays || "NA",
      PaymentMonth: salary.paymentMonth,
      PaymentYear: salary.paymentYear,
      TotalSalary: calculateTotalSalary(salary),
    }));

    // Append the totals row
    data.push(totals);

    // Create a new workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Salaries");

    // Export the file
    XLSX.writeFile(wb, "Salary_Report.xlsx");
  };

  return (
    <>
      <ToastContainer />
      <div className="p-4 space-y-6">
        <div className="lg:max-w-6xl items-center p-4">
          <h1 className="text-center text-2xl font-bold text-blue-600">
            Salary Details
          </h1>

          {/* Main Selection */}
          <div className="bg-white shadow-lg rounded-lg p-6 w-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Select Option
            </h2>
            <select
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">Select an Option</option>
              <option value="monthly">Monthly Basis</option>
              <option value="employee">Employee Basis</option>
            </select>

            {/* Monthly Basis */}
            {selectedOption === "monthly" && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Monthly Basis
                </h2>
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-4">
                    <select
                      className="p-3 border rounded-md w-full focus:outline-none focus:ring focus:ring-blue-300"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    >
                      <option value="">Select Month</option>
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>

                    <select
                      name="year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="p-3 border rounded-md w-full focus:outline-none focus:ring focus:ring-blue-300"
                      required
                    >
                      <option value="">Select Year</option>
                      {Array.from(
                        { length: 10 },
                        (_, i) => new Date().getFullYear() + i - 1
                      ).map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className={`bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 mx-auto focus:outline-none focus:ring focus:ring-blue-300 ${
                      isFetching ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isFetching}
                    onClick={fetchSalaries}
                  >
                    {isFetching ? "Fetching..." : "Fetch Data"}
                  </button>
                </div>
              </div>
            )}

            {/* Employee Basis */}
            {selectedOption === "employee" && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Employee Basis
                </h2>
                <div className="flex flex-col space-y-4">
                  <input
                    type="text"
                    className="p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter Employee ID"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                  />
                  <button
                    className={`bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 mx-auto focus:outline-none focus:ring focus:ring-blue-300 ${
                      isFetching ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isFetching}
                    onClick={fetchSalaries}
                  >
                    {isFetching ? "Fetching..." : "Fetch Data"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={() => navigate(`/${user.role}-dashboard/salary/add`)}
              className="px-6 py-3 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 min-w-[200px]"
            >
              Add Salary
            </button>
            <button
              onClick={() => navigate(`/${user.role}-dashboard/salary/edit`)}
              className="px-6 py-3 text-sm font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 min-w-[200px]"
            >
              Edit Salary
            </button>
            <button
              onClick={handleExportToExcel}
              className="px-6 py-3 text-sm font-semibold text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 min-w-[200px]"
            >
              Download as Excel
            </button>
          </div>
        </div>

        {/* Search and Buttons Section */}
        {selectedOption === "monthly" && (
          <div className="flex flex-col flex-wrap justify-start bg-gray-50 p-4 rounded-lg shadow-md gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by Employee Id"
              className="w-full flex-grow px-3 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        {/* Salary Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border text-center text-gray-800 px-4 py-2">
                  Emp ID
                </th>
                <th className="border text-center text-gray-800 px-4 py-2">
                  Emp Name
                </th>
                <th className="border text-center text-gray-800 px-4 py-2">
                  Emp Type
                </th>

                <th className="border text-center text-gray-800 px-4 py-2">
                  Gross Salary
                </th>
                <th className="border text-center text-gray-800 px-4 py-2">
                  Basic Salary
                </th>

                <th className="border text-center text-gray-800 bg-blue-100 px-4 py-2">
                  HRA
                </th>
                <th className="border text-center text-gray-800 bg-blue-100 px-4 py-2">
                  Food Allowance
                </th>
                <th className="border text-center text-gray-800 bg-blue-100 px-4 py-2">
                  Medical Allowance
                </th>
                <th className="border text-center text-gray-800 bg-blue-100 px-4 py-2">
                  Transport Allowance
                </th>
                <th className="border text-center text-gray-800 bg-blue-100 px-2 py-2">
                  Other Allowances
                </th>
                <th className="border text-center text-gray-800 bg-red-100 px-2 py-1">
                  EPF
                </th>
                <th className="border text-center text-gray-800 bg-red-100 px-2 py-1">
                  ESIC
                </th>
                <th className="border text-center text-gray-800 bg-red-100 px-2 py-1">
                  Adv. Deductions
                </th>
                <th className="border text-center text-gray-800 bg-red-100 px-2 py-1">
                  Tax Deductions
                </th>
                <th className="border text-center text-gray-800 bg-red-100 px-2 py-1">
                  Other Deductions
                </th>
                <th className="border text-center text-gray-800 px-4 py-2">
                  Payable Days
                </th>
                <th className="border text-center text-gray-800 px-4 py-2">
                  Sundays
                </th>
                <th className="border text-center text-gray-800 px-4 py-2">
                  Net Payable Days
                </th>
                <th className="border text-center text-gray-800 px-4 py-2">
                  Payment Month
                </th>
                <th className="border text-center text-gray-800 px-4 py-2">
                  Payment Year
                </th>
                <th className="border text-center text-gray-800 bg-green-100 px-4 py-2">
                  Total Salary
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.map((salary) => (
                <tr key={salary._id} className="border-b">
                  <td className="border px-4 py-2 text-center">
                    {salary.employeeId?.employeeId || "0"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.employeeId?.name || "NA"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.employeeType || "NA"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.grossSalary}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.basicSalary}
                  </td>

                  <td className="border px-4 py-2 text-center">
                    {salary.allowances.find((a) => a.name === "HRA")?.amount ||
                      0}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.allowances.find((a) => a.name === "Food Allowance")
                      ?.amount || 0}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.allowances.find(
                      (a) => a.name === "Medical Allowance"
                    )?.amount || 0}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.allowances.find(
                      (a) => a.name === "Transport Allowance"
                    )?.amount || 0}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.allowances
                      .filter(
                        (allowance) =>
                          ![
                            "HRA",
                            "Food Allowance",
                            "Medical Allowance",
                            "Transport Allowance",
                          ].includes(allowance?.name)
                      )
                      .reduce(
                        (total, allowance) => total + (allowance?.amount || 0),
                        0
                      )}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.deductions.find((d) => d.name === "EPF")?.amount ||
                      0}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.deductions.find((d) => d.name === "ESIC")?.amount ||
                      0}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.deductions.find(
                      (d) => d.name === "Advance Deduction"
                    )?.amount || 0}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.deductions.find((d) => d.name === "Tax Deduction")
                      ?.amount || 0}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.deductions
                      .filter(
                        (deduction) =>
                          ![
                            "EPF",
                            "ESIC",
                            "Advance Deduction",
                            "Tax Deduction",
                          ].includes(deduction?.name)
                      )
                      .reduce(
                        (total, deduction) => total + (deduction?.amount || 0),
                        0
                      )}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.payableDays || "NA"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.sundays || "NA"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.netPayableDays || "NA"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.paymentMonth}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {salary.paymentYear}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {calculateTotalSalary(salary)}
                  </td>
                </tr>
              ))}
            </tbody>
            {filteredSalaries.length > 0 && (
              <tfoot className="text-gray-700">
                <tr className="">
                  <td className="border px-4 py-2 text-center"></td>
                  <td className="border px-4 py-2 text-center"></td>
                  <td className="border px-4 py-2 text-center font-bold">
                    Total
                  </td>

                  <td className="border px-4 py-2 text-center font-bold">
                    {filteredSalaries.reduce(
                      (sum, salary) => sum + (salary.grossSalary || 0),
                      0
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center font-bold">
                    {filteredSalaries.reduce(
                      (sum, salary) => sum + (salary.basicSalary || 0),
                      0
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center bg-blue-200 font-bold">
                    {filteredSalaries.reduce(
                      (sum, salary) =>
                        sum +
                        (salary.allowances.find((a) => a.name === "HRA")
                          ?.amount || 0),
                      0
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center bg-blue-200 font-bold">
                    {filteredSalaries.reduce(
                      (sum, salary) =>
                        sum +
                        (salary.allowances.find(
                          (a) => a.name === "Food Allowance"
                        )?.amount || 0),
                      0
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center bg-blue-200 font-bold">
                    {filteredSalaries.reduce(
                      (sum, salary) =>
                        sum +
                        (salary.allowances.find(
                          (a) => a.name === "Medical Allowance"
                        )?.amount || 0),
                      0
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center bg-blue-200 font-bold">
                    {filteredSalaries.reduce(
                      (sum, salary) =>
                        sum +
                        (salary.allowances.find(
                          (a) => a.name === "Transport Allowance"
                        )?.amount || 0),
                      0
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center bg-blue-200 font-bold">
                    {filteredSalaries.reduce(
                      (sum, salary) =>
                        sum +
                        salary.allowances
                          .filter(
                            (allowance) =>
                              ![
                                "HRA",
                                "Food Allowance",
                                "Medical Allowance",
                                "Transport Allowance",
                              ].includes(allowance.name)
                          )
                          .reduce(
                            (total, allowance) =>
                              total + (allowance?.amount || 0),
                            0
                          ),
                      0
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center bg-red-200 font-bold">
                    {filteredSalaries.reduce(
                      (sum, salary) =>
                        sum +
                        (salary.deductions.find((d) => d.name === "EPF")
                          ?.amount || 0),
                      0
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center bg-red-200 font-bold">
                    {filteredSalaries.reduce(
                      (sum, salary) =>
                        sum +
                        (salary.deductions.find((d) => d.name === "ESIC")
                          ?.amount || 0),
                      0
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center bg-red-200 font-bold">
                    {filteredSalaries.reduce(
                      (sum, salary) =>
                        sum +
                        (salary.deductions.find(
                          (d) => d.name === "Advance Deduction"
                        )?.amount || 0),
                      0
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center bg-red-200 font-bold">
                    {filteredSalaries.reduce(
                      (sum, salary) =>
                        sum +
                        (salary.deductions.find(
                          (d) => d.name === "Tax Deduction"
                        )?.amount || 0),
                      0
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center bg-red-200 font-bold">
                    {filteredSalaries.reduce(
                      (sum, salary) =>
                        sum +
                        salary.deductions
                          .filter(
                            (deduction) =>
                              ![
                                "EPF",
                                "ESIC",
                                "Advance Deduction",
                                "Tax Deduction",
                              ].includes(deduction.name)
                          )
                          .reduce(
                            (total, deduction) =>
                              total + (deduction?.amount || 0),
                            0
                          ),
                      0
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center font-bold"></td>
                  <td className="border px-4 py-2 text-center font-bold"></td>
                  <td className="border px-4 py-2 text-center font-bold"></td>
                  <td className="border px-4 py-2 text-center"></td>
                  <td className="border px-4 py-2 text-center"></td>
                  <td className="border px-4 py-2 text-center bg-green-200 font-bold">
                    {filteredSalaries.reduce(
                      (sum, salary) => sum + calculateTotalSalary(salary),
                      0
                    )}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewSalary;
