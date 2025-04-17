import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";

const ViewEmployeeSalaryAdmin = () => {
  const { _id } = useParams();
  const [employee, setEmployee] = useState({});
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);

  // Fetch employee details
  useEffect(() => {
    const getEmployeeSummary = async () => {
      try {
        const response = await axios.get(
          `https://korus-employee-management-system-mern-stack.vercel.app/api/employees/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.data.employee;
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    getEmployeeSummary();
  }, [_id]);

  // Fetch salary history
  useEffect(() => {
    const fetchSalaryHistory = async () => {
      try {
        const response = await axios.get(
          `https://korus-employee-management-system-mern-stack.vercel.app/api/salary/employee/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data;
        setSalaries(data);
        setFilteredSalaries(data);
      } catch (error) {
        console.error("Error fetching salary history:", error);
        setSalaries([]);
        setFilteredSalaries([]);
      }
    };

    fetchSalaryHistory();
  }, [_id]);

  // Calculate total salary
  const calculateTotalSalary = (salary) => {
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

  // Download salary history as Excel file
  const downloadExcel = () => {
    const excelData = filteredSalaries.map((salary) => ({
      "Gross Salary": salary.grossSalary,
      "Basic Salary": salary.basicSalary,
      HRA: salary.allowances.find((a) => a.name === "HRA")?.amount || 0,
      "Food Allowance":
        salary.allowances.find((a) => a.name === "Food Allowance")?.amount || 0,
      "Medical Allowance":
        salary.allowances.find((a) => a.name === "Medical Allowance")?.amount ||
        0,
      "Transport Allowance":
        salary.allowances.find((a) => a.name === "Transport Allowance")
          ?.amount || 0,
      "Other Allowances": salary.allowances
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
      ESI: salary.deductions.find((d) => d.name === "ESIC")?.amount || 0,
      "Advance Deduction":
        salary.deductions.find((d) => d.name === "Advance Deduction")?.amount ||
        0,
      "Tax Deduction":
        salary.deductions.find((d) => d.name === "Tax Deduction")?.amount || 0,
      "Other Deductions": salary.deductions
        .filter(
          (deduction) =>
            !["EPF", "ESIC", "Advance Deduction", "Tax Deduction"].includes(
              deduction?.name
            )
        )
        .reduce((total, deduction) => total + (deduction?.amount || 0), 0),
      "Payable Days": salary.payableDays,
      Sundays: salary.sundays,
      "Net Payable Days": salary.netPayableDays,
      "Payment Month": salary.paymentMonth,
      "Payment Year": salary.paymentYear,
      "Total Salary": calculateTotalSalary(salary),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salary History");

    XLSX.writeFile(
      workbook,
      `Salary_History_EmpId:${employee.employeeId}_${employee.name}.xlsx`
    );
  };

  return (
    <div className="mt-5">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Employee Salary History
      </h1>

      <div className="bg-gray-100 p-4 rounded-lg shadow-lg mb-6">
        <div>
          <p className="text-lg font-medium text-gray-600">
            <span className="font-semibold text-gray-800">Emp Id:</span>{" "}
            {employee.employeeId}
          </p>
          <p className="text-lg font-medium text-gray-600">
            <span className="font-semibold text-gray-800">Emp Name:</span>{" "}
            {employee.name}
          </p>
        </div>
      </div>

      <button
        onClick={downloadExcel}
        className="mb-4 px-4 py-2 bg-orange-500 text-white rounded-md shadow hover:bg-orange-600"
      >
        Download as Excel
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Gross Salary</th>
              <th className="border px-4 py-2">Basic Salary</th>
              <th className="border bg-blue-100 px-4 py-2">HRA</th>
              <th className="border bg-blue-100 px-4 py-2">Food Allowance</th>
              <th className="border bg-blue-100 px-4 py-2">
                Medical Allowance
              </th>
              <th className="border bg-blue-100 px-4 py-2">
                Transport Allowance
              </th>
              <th className="border bg-blue-100 px-4 py-2">Other Allowances</th>
              <th className="border bg-red-100 px-4 py-2">EPF</th>
              <th className="border bg-red-100 px-4 py-2">ESI</th>
              <th className="border bg-red-100 px-4 py-2">Adv. Deductions</th>
              <th className="border bg-red-100 px-4 py-2">Tax Deductions</th>
              <th className="border bg-red-100 px-4 py-2">Other Deductions</th>
              <th className="border px-4 py-2">Payable Days</th>
              <th className="border px-4 py-2">Sundays</th>
              <th className="border px-4 py-2">Net Payable Days</th>
              <th className="border px-4 py-2">Payment Month</th>
              <th className="border px-4 py-2">Payment Year</th>
              <th className="border bg-green-100 px-4 py-2">Total Salary</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.map((salary) => (
              <tr key={salary._id} className="border-b">
                <td className="border px-4 py-2 text-center">
                  {salary.grossSalary}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.basicSalary}
                </td>

                <td className="border px-4 py-2 text-center">
                  {salary.allowances.find((a) => a.name === "HRA")?.amount || 0}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.allowances.find((a) => a.name === "Food Allowance")
                    ?.amount || 0}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.allowances.find((a) => a.name === "Medical Allowance")
                    ?.amount || 0}
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
                  {salary.deductions.find((d) => d.name === "EPF")?.amount || 0}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.deductions.find((d) => d.name === "ESIC")?.amount ||
                    0}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.deductions.find((d) => d.name === "Advance Deduction")
                    ?.amount || 0}
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
                  {salary.payableDays}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.sundays}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.netPayableDays}
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
        </table>
      </div>
    </div>
  );
};

export default ViewEmployeeSalaryAdmin;
