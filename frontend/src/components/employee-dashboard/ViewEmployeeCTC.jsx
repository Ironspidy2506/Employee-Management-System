import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

const ViewEmployeeCTC = () => {
  const [selectedOption, setSelectedOption] = useState("monthly");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchId, setSearchId] = useState(""); // State for search input
  const [isFetching, setIsFetching] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    // Clear data when switching between views
    setEmployeeData([]);
    setFilteredData([]);
    setSearchId("");
    setEmployeeId("");
    setMonth("");
    setYear("");
  }, [selectedOption]);

  const exportToExcel = () => {
    let worksheetData = [];
    let sheetName = "";

    if (selectedOption === "monthly") {
      // Prepare data for the "monthly" table
      worksheetData = [
        ["Employee ID", "Employee Name", "Department", "CTC"],
        ...filteredData.map((item) => [
          item.employee?.id,
          item.employee?.name,
          item.employee?.department,
          item.grossSalary +
            item.totalDynamicAllowance +
            item.totalFixedAllowance,
        ]),
      ];

      // Add footer row for totals (if needed)
      if (filteredData.length > 0) {
        worksheetData.push([
          "",
          "",
          "Total",
          filteredData.reduce(
            (total, item) =>
              total +
              item.grossSalary +
              item.totalDynamicAllowance +
              item.totalFixedAllowance,
            0
          ),
        ]);
      }

      sheetName = "Monthly Data";
    } else if (selectedOption === "employee") {
      // Prepare data for the "employee" table
      worksheetData = [
        [
          "Employee ID",
          "Employee Name",
          "Department",
          "Month",
          "Year",
          "Gross Salary",
          "Variable Allowance",
          "Fixed Allowance",
          "CTC",
        ],
        ...employeeData.map((item) => [
          item.id,
          item.name,
          item.department,
          item.paymentMonth,
          item.paymentYear,
          item.grossSalary,
          item.totalVariableAllowances,
          item.totalFixedAllowances,
          item.netCTC,
        ]),
      ];

      // Add footer row for totals (if needed)
      if (employeeData.length > 0) {
        worksheetData.push([
          "",
          "",
          "",
          "",
          "Total",
          employeeData.reduce((total, item) => total + item.grossSalary, 0),
          employeeData.reduce(
            (total, item) => total + item.totalVariableAllowances,
            0
          ),
          employeeData.reduce(
            (total, item) => total + item.totalFixedAllowances,
            0
          ),
          employeeData.reduce((total, item) => total + item.netCTC, 0),
        ]);
      }

      sheetName = "Employee Data";
    }

    // Create worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, `${sheetName}.xlsx`);
  };

  const handleFetchData = async (fetchType) => {
    setIsFetching(true);
    if (fetchType === "Monthly CTC") {
      try {
        const response = await axios.get(
          `https://korus-employee-management-system-mern-stack.vercel.app/api/ctc/monthly/${month}/${year}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          toast.success(`CTC fetched for ${month} ${year}`);
          setEmployeeData(response.data.data);
          setFilteredData(response.data.data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    // else if (fetchType === "Yearly CTC") {
    //   try {
    //     const { data } = await axios.get(
    //       `https://korus-employee-management-system-mern-stack.vercel.app/api/ctc/yearly/${year}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${localStorage.getItem("token")}`,
    //         },
    //       }
    //     );

    //     if (data.success) {
    //       toast.success(data.message);
    //       setEmployeeData(data.employeeData); // Assuming the response has employee data
    //     } else {
    //       toast.error(data.message);
    //     }
    //   } catch (error) {
    //     toast.error(error.message);
    //   }
    // }
    else {
      try {
        const { data } = await axios.get(
          `https://korus-employee-management-system-mern-stack.vercel.app/api/ctc/employee/${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log(data);

        if (data.success) {
          toast.success(`CTC fetched for Employee ID: ${employeeId}`);
          setEmployeeData(data.data); // Assuming the response has employee data
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    setIsFetching(false);
  };

  // Handle employee detail view
  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchId(query);

    if (query.trim()) {
      const filtered = employeeData.filter((emp) =>
        emp.employee.id.toString().includes(query.trim())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(employeeData);
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
        return "Bonus";
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
  const currentYear = new Date().getFullYear() - 1;
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold text-blue-600">CTC Details</h1>

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
            {/* <option value="yearly">Yearly Basis</option> */}
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
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className={`bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 mx-auto focus:outline-none focus:ring focus:ring-blue-300 ${
                    isFetching ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleFetchData("Monthly CTC")}
                  disabled={isFetching}
                >
                  {isFetching ? "Fetching..." : "Fetch Data"}
                </button>
              </div>
            </div>
          )}

          {/* Yearly Basis */}
          {selectedOption === "yearly" && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Yearly Basis
              </h2>
              <div className="flex flex-col space-y-4">
                <select
                  className="p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
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
                <button
                  className={`bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 mx-auto focus:outline-none focus:ring focus:ring-blue-300 ${
                    isFetching ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleFetchData("Yearly CTC")}
                  disabled={isFetching}
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
                  onClick={() => handleFetchData("Employee CTC")}
                  disabled={isFetching}
                >
                  {isFetching ? "Fetching..." : "Fetch Data"}
                </button>
              </div>
            </div>
          )}

          {/* Employee Table */}
          <div className="overflow-x-auto mt-6">
            {selectedOption === "monthly" && (
              <div className="text-gray-800 p-2 mb-2">
                <input
                  type="text"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Search by Employee ID"
                  value={searchId}
                  onChange={handleSearch}
                />
              </div>
            )}
            {selectedOption === "monthly" && (
              <table className="min-w-full table-auto border border-collapse bg-white rounded-lg shadow-lg">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-center border text-gray-600">
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-center border text-gray-600">
                      Employee Name
                    </th>
                    <th className="px-6 py-3 text-center border text-gray-600">
                      Department
                    </th>
                    <th className="px-6 py-3 text-center border text-gray-600">
                      CTC
                    </th>
                    <th className="px-6 py-3 text-center border text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr
                      key={item.employee.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-3 text-center border">
                        {item.employee?.id}
                      </td>
                      <td className="px-6 py-3 text-center border">
                        {item.employee.name}
                      </td>
                      <td className="px-6 py-3 text-center border">
                        {item.employee.department}
                      </td>
                      <td className="px-6 py-3 text-center border">
                        {item.grossSalary +
                          item.totalDynamicAllowance +
                          item.totalFixedAllowance}
                      </td>
                      <td className="px-6 py-3 text-center border">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleViewDetails(item)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {filteredData.length > 0 && (
                  <tfoot>
                    <tr className="border-t font-bold">
                      <td className="px-6 py-3 text-center border"></td>
                      <td className="px-6 py-3 text-center border"></td>
                      <td className="px-6 py-3 text-center border text-blue-600">
                        Total
                      </td>
                      <td className="px-6 py-3 text-center border text-blue-600">
                        {/* Calculate Total CTC */}
                        {filteredData.reduce(
                          (total, item) =>
                            total +
                            item.grossSalary +
                            item.totalDynamicAllowance +
                            item.totalFixedAllowance,
                          0
                        )}
                      </td>
                      <td className="px-6 py-3 text-center border"></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            )}

            {selectedOption === "employee" && (
              <table className="min-w-full table-auto border border-collapse bg-white rounded-lg shadow-lg">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-center border text-gray-600">
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-center border text-gray-600">
                      Employee Name
                    </th>
                    <th className="px-6 py-3 text-center border text-gray-600">
                      Department
                    </th>
                    <th className="px-6 py-3 text-center border text-gray-600">
                      Month
                    </th>
                    <th className="px-6 py-3 text-center border text-gray-600">
                      Year
                    </th>
                    <th className="px-6 py-3 text-center border text-gray-600">
                      Gross Salary
                    </th>
                    <th className="px-6 py-3 text-center border text-gray-600">
                      Variable Allowance
                    </th>
                    <th className="px-6 py-3 text-center border text-gray-600">
                      Fixed Allowance
                    </th>
                    <th className="px-6 py-3 text-center border text-gray-600">
                      CTC
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employeeData.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-center border">
                        {item.id}
                      </td>
                      <td className="px-6 py-3 text-center border">
                        {item.name}
                      </td>
                      <td className="px-6 py-3 text-center border">
                        {item.department}
                      </td>
                      <td className="px-6 py-3 text-center border">
                        {item.paymentMonth}
                      </td>
                      <td className="px-6 py-3 text-center border">
                        {item.paymentYear}
                      </td>
                      <td className="px-6 py-3 text-center border">
                        {item.grossSalary}
                      </td>
                      <td className="px-6 py-3 text-center border">
                        {item.totalVariableAllowances}
                      </td>
                      <td className="px-6 py-3 text-center border">
                        {item.totalFixedAllowances}
                      </td>
                      <td className="px-6 py-3 text-center border">
                        {item.netCTC}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {employeeData.length > 0 && (
                  <tfoot>
                    <tr className="border-t font-bold">
                      <td className="px-6 py-3 text-center border"></td>
                      <td className="px-6 py-3 text-center border"></td>
                      <td className="px-6 py-3 text-center border"></td>
                      <td className="px-6 py-3 text-center border"></td>
                      <td className="px-6 py-3 text-center border text-blue-600">
                        Total
                      </td>
                      <td className="px-6 py-3 text-center border text-blue-600">
                        {/* Calculate Total Gross Salary */}
                        {employeeData.reduce(
                          (total, item) => total + item.grossSalary,
                          0
                        )}
                      </td>
                      <td className="px-6 py-3 text-center border text-blue-600">
                        {/* Calculate Total Variable Allowance */}
                        {employeeData.reduce(
                          (total, item) => total + item.totalVariableAllowances,
                          0
                        )}
                      </td>
                      <td className="px-6 py-3 text-center border text-blue-600">
                        {/* Calculate Total Fixed Allowance */}
                        {employeeData.reduce(
                          (total, item) => total + item.totalFixedAllowances,
                          0
                        )}
                      </td>
                      <td className="px-6 py-3 text-center border text-blue-600">
                        {/* Calculate Total CTC */}
                        {employeeData.reduce(
                          (total, item) => total + item.netCTC,
                          0
                        )}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            )}

            <div className="flex justify-end">
            <button
              onClick={exportToExcel}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Download as Excel
            </button>
            </div>

            {selectedEmployee && (
              <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
                  <button
                    className="absolute top-2 right-6 text-2xl text-gray-500 hover:text-gray-800"
                    onClick={handleCloseModal}
                  >
                    ×
                  </button>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Salary Details for {selectedEmployee.employee.name}
                  </h2>

                  {/* Salary Model Allowances */}
                  <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
                    <div className=" flex justify-between mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Gross Salary
                      </h3>
                      <h3 className="text-lg font-semibold text-gray-600 mb-4">
                        {selectedEmployee.grossSalary}
                      </h3>
                    </div>

                    {/* Dynamic Allowances */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Variable Allowances
                      </h3>
                      <ul className="space-y-2">
                        {selectedEmployee.dynamicAllowances.map(
                          (allowance, index) => (
                            <li
                              key={index}
                              className="flex justify-between text-gray-600"
                            >
                              <span>{formatAllowanceType(allowance.type)}</span>
                              <span className="font-medium text-gray-800">
                                {allowance.amount}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Fixed Allowances */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Fixed Allowances
                      </h3>
                      <ul className="space-y-2">
                        {selectedEmployee.fixedAllowances.map(
                          (allowance, index) => (
                            <li
                              key={index}
                              className="flex justify-between text-gray-600"
                            >
                              <span>{formatAllowanceType(allowance.type)}</span>
                              <span className="font-medium text-gray-800">
                                {allowance.amount}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Summary */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold text-blue-700 mb-4 text-center">
                        Summary
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Gross Salary:</span>
                          <span className="font-medium text-gray-800">
                            {selectedEmployee.grossSalary}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            Total Variable Allowance:
                          </span>
                          <span className="font-medium text-gray-800">
                            {selectedEmployee.totalDynamicAllowance}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            Total Fixed Allowance:
                          </span>
                          <span className="font-medium text-gray-800">
                            {selectedEmployee.totalFixedAllowance}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-3 mt-3">
                          <span className="text-lg font-semibold text-gray-900">
                            Overall CTC:
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            {selectedEmployee.grossSalary +
                              selectedEmployee.totalDynamicAllowance +
                              selectedEmployee.totalFixedAllowance}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewEmployeeCTC;
