import React, { useState, useEffect } from "react";
import { getAllSalaries } from "../../utils/SalaryHelper";
import { useNavigate } from "react-router-dom";

const ViewSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const data = await getAllSalaries();

        setSalaries(data);
        setFilteredSalaries(data);
      } catch (error) {
        console.error("Error fetching salaries:", error);
      }
    };

    fetchSalaries();
  }, []);

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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = salaries.filter(
      (salary) => salary.employeeName.toLowerCase().includes(query) // Assuming employeeName is the correct property
    );
    setFilteredSalaries(filtered);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0"); // Ensure two digits
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="p-4 space-y-6">
      {/* Search and Buttons Section */}
      <div className="flex flex-wrap items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md gap-4">
        {/* Search Bar */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by Employee Id"
          className="flex-grow px-3 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/admin-dashboard/salary/add")}
            className="px-6 py-3 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 min-w-[200px]"
          >
            Add Salary
          </button>
          <button
            onClick={() => navigate("/admin-dashboard/salary/edit")}
            className="px-6 py-3 text-sm font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 min-w-[200px]"
          >
            Edit Salary
          </button>
        </div>
      </div>

      {/* Salary Table */}
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
                <td className="border px-4 py-2 text-center">
                  {salary.workingDays}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.basicSalary}
                </td>

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

export default ViewSalary;
