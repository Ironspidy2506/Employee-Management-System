import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // For getting the employee ID from URL params
import axios from "axios";

const ViewEmployeeSalaryAdmin = () => {
  const { _id } = useParams(); // Get the employee ID from the route params
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [employee, setEmployee] = useState(null);

  // Fetch salary history data based on employee ID
  useEffect(() => {
    const fetchSalaryHistory = async () => {
      try {
        const response = await axios.get(
          `https://employee-management-system-backend-objq.onrender.com/api/salary/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you're using a token for auth
            },
          }
        );
        const data = await response.data;
        setFilteredSalaries(data); // Set the salary history data

        // Assuming the first salary record has the employee details
        if (data.length > 0) {
          setEmployee(data[0].employeeId); // Store employee info for the card display
        }
      } catch (error) {
        console.error("Error fetching salary history:", error);
      }
    };

    if (_id) {
      fetchSalaryHistory();
    }
  }, [_id]);

  // Function to format date
  const formatDate = (date) => {
    const newDate = new Date(date);
    return `${newDate.getDate()}/${
      newDate.getMonth() + 1
    }/${newDate.getFullYear()}`;
  };

  // Function to calculate total salary (Basic + Allowances - Deductions)
  const calculateTotalSalary = (salary) => {
    const totalAllowances = salary.allowances.reduce(
      (acc, allowance) => acc + allowance.amount,
      0
    );
    const totalDeductions = salary.deductions.reduce(
      (acc, deduction) => acc + deduction.amount,
      0
    );
    const totalSalary = salary.basicSalary + totalAllowances - totalDeductions;
    let netSalary = (totalSalary * salary.workingDays) / 26;

    if (netSalary % 1 > 0.5) {
      netSalary = Math.ceil(netSalary); // Round up
    } else if (netSalary % 1 > 0 && netSalary % 1 <= 0.5) {
      netSalary = Math.floor(netSalary); // Round down to .5
    }
    
    return netSalary;
  };

  return (
    <div className="mt-5">


      {/* Salary History Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Emp ID</th>
              <th className="border px-4 py-2">Emp Name</th>
              <th className="border px-4 py-2">Working Days</th>
              <th className="border px-4 py-2">Basic Salary</th>

              <th className="border px-4 py-2">
                Allowances
                <table className="w-full mt-2">
                  <thead>
                    <tr className="flex justify-between bg-gray-200">
                      <th className="border px-2 py-1">HRA</th>
                      <th className="border px-2 py-1">MA</th>
                      <th className="border px-2 py-1">CA</th>
                      <th className="border px-2 py-1">Incent.</th>
                      <th className="border px-2 py-1">Others</th>
                    </tr>
                  </thead>
                </table>
              </th>

              <th className="border px-4 py-2">
                Deductions
                <table className="min-w-full mt-2">
                  <thead>
                    <tr className="flex justify-between bg-gray-200">
                      <th className="border px-2 py-1">EPF</th>
                      <th className="border px-2 py-1">ESIF</th>
                      <th className="border px-2 py-1">Prof.Tax</th>
                      <th className="border px-2 py-1">TDS</th>
                      <th className="border px-2 py-1">Others</th>
                    </tr>
                  </thead>
                </table>
              </th>

              <th className="border px-4 py-2">Payment Date</th>
              <th className="border px-4 py-2">Total Salary</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.map((salary) => (
              <tr key={salary._id} className="border-b">
                {/* Employee ID and Name */}
                <td className="border px-4 py-2 text-center">
                  {salary.employeeId?.employeeId || "NA"}
                </td>
                <td className="border px-4 py-2 text-center" text-center>
                  {salary.employeeId?.name || "NA"}
                </td>

                {/* Basic Salary */}
                <td className="border px-4 py-2 text-center">{salary.workingDays}</td>
                <td className="border px-4 py-2 text-center">{salary.basicSalary}</td>

                {/* Allowances */}
                <td className="border px-4 py-2">
                  <div className="grid grid-cols-5 gap-1">
                    <div className="border px-2 py-1">
                      {salary.allowances[0]?.amount || 0}
                    </div>
                    <div className="border px-2 py-1">
                      {salary.allowances[1]?.amount || 0}
                    </div>
                    <div className="border px-2 py-1">
                      {salary.allowances[2]?.amount || 0}
                    </div>
                    <div className="border px-2 py-1">
                      {salary.allowances[3]?.amount || 0}
                    </div>
                    <div className="border px-2 py-1">
                      {salary.allowances[4]?.amount || 0}
                    </div>
                  </div>
                </td>

                {/* Deductions */}
                <td className="border px-4 py-2">
                  <div className="grid grid-cols-5 gap-2">
                    <div className="border px-2 py-1">
                      {salary.deductions[0]?.amount || 0}
                    </div>
                    <div className="border px-2 py-1">
                      {salary.deductions[1]?.amount || 0}
                    </div>
                    <div className="border px-2 py-1">
                      {salary.deductions[2]?.amount || 0}
                    </div>
                    <div className="border px-2 py-1">
                      {salary.deductions[3]?.amount || 0}
                    </div>
                    <div className="border px-2 py-1">
                      {salary.deductions[4]?.amount || 0}
                    </div>
                  </div>
                </td>

                {/* Payment Date */}
                <td className="border px-4 py-2 text-center">
                  {formatDate(salary.paymentDate)}
                </td>

                {/* Total Salary */}
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
