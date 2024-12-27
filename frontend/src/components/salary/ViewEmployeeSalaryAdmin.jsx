import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewEmployeeSalaryAdmin = () => {
  const { _id } = useParams();
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);

  // Fetch salary history for the employee
  useEffect(() => {
    const fetchSalaryHistory = async () => {
      try {
        const response = await axios.get(
          `https://employee-management-system-backend-objq.onrender.com/api/salary/employee/${_id}`,
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

  // Function to calculate total salary
  const calculateTotalSalary = (salary) => {
    const hra = salary.allowances[0]?.amount || 0;
    const foodAllowance = salary.allowances[1]?.amount || 0;
    const medicalAllowance = salary.allowances[2]?.amount || 0;
    const transportAllowance = salary.allowances[3]?.amount || 0;
    const otherAllowances = salary.allowances.reduce(
      (total, allowance, index) =>
        index > 3 ? total + (allowance?.amount || 0) : total,
      0
    );

    const epf = salary.deductions[0]?.amount || 0;
    const esi = salary.deductions[1]?.amount || 0;
    const advance = salary.deductions[2]?.amount || 0;
    const tax = salary.deductions[3]?.amount || 0;
    const otherDeductions = salary.deductions.reduce(
      (total, deduction, index) =>
        index > 3 ? total + (deduction?.amount || 0) : total,
      0
    );

    const totalAllowances =
      hra +
      foodAllowance +
      medicalAllowance +
      transportAllowance +
      otherAllowances;
    const totalDeductions = epf + esi + advance + tax + otherDeductions;

    return salary.basicSalary + totalAllowances - totalDeductions;
  };

  const employee = salaries.length > 0 ? salaries[0].employeeId : {};

  return (
    <div className="mt-5">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Employee Salary History
      </h1>

      <div className="bg-gray-100 p-4 rounded-lg shadow-lg mb-6">
        <div className="mt-2">
          <p className="text-lg font-medium text-gray-600">
            <span className="font-bold text-gray-800">Emp Id:</span>{" "}
            {employee.employeeId}
          </p>
          <p className="text-lg font-medium text-gray-600">
            <span className="font-bold text-gray-800">Emp Name:</span>{" "}
            {employee.name}
          </p>
        </div>
      </div>
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
                  {salary.allowances[0]?.amount || 0}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.allowances[1]?.amount || 0}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.allowances[2]?.amount || 0}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.allowances[3]?.amount || 0}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.allowances.reduce(
                    (total, allowance, index) =>
                      index > 3 ? total + (allowance?.amount || 0) : total,
                    0
                  )}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.deductions[0]?.amount || 0}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.deductions[1]?.amount || 0}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.deductions[2]?.amount || 0}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.deductions[3]?.amount || 0}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.deductions.reduce(
                    (total, deduction, index) =>
                      index > 3 ? total + (deduction?.amount || 0) : total,
                    0
                  )}
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
