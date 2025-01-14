import React, { useState, useEffect } from "react";
import { getAllSalaries } from "../../utils/SalaryHelper";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const ViewSalary = () => {
  const { user } = useAuth();
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
    // Get standard allowances
    const hra = salary.allowances[0]?.amount || 0;
    const foodAllowance = salary.allowances[1]?.amount || 0;
    const medicalAllowance = salary.allowances[2]?.amount || 0;
    const transportAllowance = salary.allowances[3]?.amount || 0;

    // Calculate other allowances (sum of all allowances except the standard ones)
    const otherAllowances = salary.allowances.reduce(
      (total, allowance, index) => {
        if (index !== 0 && index !== 1 && index !== 2 && index !== 3) {
          return total + (allowance?.amount || 0);
        }
        return total;
      },
      0
    );

    // Get standard deductions
    const epf = salary.deductions[0]?.amount || 0;
    const esi = salary.deductions[1]?.amount || 0;
    const advance = salary.deductions[2]?.amount || 0;
    const tax = salary.deductions[3]?.amount || 0;

    // Calculate other deductions (sum of all deductions except the standard ones)
    const otherDeductions = salary.deductions.reduce(
      (total, deduction, index) => {
        if (index !== 0 && index !== 1 && index !== 2 && index !== 3) {
          return total + (deduction?.amount || 0);
        }
        return total;
      },
      0
    );

    // Calculate total allowances and deductions
    const totalAllowances =
      hra +
      foodAllowance +
      medicalAllowance +
      transportAllowance +
      otherAllowances;
    const totalDeductions = epf + esi + advance + tax + otherDeductions;

    // Calculate gross total salary
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

    // Get the numeric index of the month (0-based index)
    const monthIndex = monthNames.indexOf(salary.paymentMonth);

    if (monthIndex === -1) {
      console.error("Invalid month name");
      return 0; // Return 0 if the month is invalid
    }

    // Ensure the year is parsed as an integer
    const year = parseInt(salary.paymentYear);

    if (isNaN(year)) {
      console.error("Invalid year");
      return 0; // Return 0 if the year is invalid
    }

    // Get the number of days in the month
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // Adjust salary based on net payable days
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

  return (
    <div className="p-4 space-y-6">
      {/* Search and Buttons Section */}
      <div className="flex flex-wrap items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by Employee Id"
          className="flex-grow px-3 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex space-x-4">
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
        </div>
      </div>

      {/* Salary Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border text-center px-4 py-2">Emp ID</th>
              <th className="border text-center px-4 py-2">Emp Name</th>
              <th className="border text-center px-4 py-2">Gross Salary</th>
              <th className="border text-center px-4 py-2">Basic Salary</th>

              <th className="border text-center bg-blue-100 px-4 py-2">HRA</th>
              <th className="border text-center bg-blue-100 px-4 py-2">
                Food Allowance
              </th>
              <th className="border text-center bg-blue-100 px-4 py-2">
                Medical Allowance
              </th>
              <th className="border text-center bg-blue-100 px-4 py-2">
                Transport Allowance
              </th>
              <th className="border text-center bg-blue-100 px-2 py-2">
                Other Allowances
              </th>
              <th className="border text-center bg-red-100 px-2 py-1">EPF</th>
              <th className="border text-center bg-red-100 px-2 py-1">ESI</th>
              <th className="border text-center bg-red-100 px-2 py-1">
                Adv. Deductions
              </th>
              <th className="border text-center bg-red-100 px-2 py-1">
                Tax Deductions
              </th>
              <th className="border text-center bg-red-100 px-2 py-1">
                Other Deductions
              </th>
              <th className="border text-center px-4 py-2">Payable Days</th>
              <th className="border text-center px-4 py-2">Sundays</th>
              <th className="border text-center px-4 py-2">Net Payable Days</th>
              <th className="border text-center px-4 py-2">Payment Month</th>
              <th className="border text-center px-4 py-2">Payment Year</th>
              <th className="border text-center bg-green-100 px-4 py-2">
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
                  {salary.allowances.reduce((total, allowance, index) => {
                    if (
                      index !== 0 &&
                      index !== 1 &&
                      index !== 2 &&
                      index !== 3
                    ) {
                      return total + (allowance?.amount || 0);
                    }
                    return total;
                  }, 0)}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.deductions.find((d) => d.name === "EPF")?.amount || 0}
                </td>
                <td className="border px-4 py-2 text-center">
                  {salary.deductions.find((d) => d.name === "ESI")?.amount || 0}
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
                          "ESI",
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
          <tfoot className="text-gray-700">
            <tr className="">
              <td className="border px-4 py-2 text-center"></td>
              <td className="border px-4 py-2 text-center font-bold">Total</td>
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
              <td className="border px-4 py-2 text-center bg-blue-200  font-bold">
                {filteredSalaries.reduce(
                  (sum, salary) => sum + (salary.allowances[0]?.amount || 0),
                  0
                )}
              </td>
              <td className="border px-4 py-2 text-center bg-blue-200  font-bold">
                {filteredSalaries.reduce(
                  (sum, salary) => sum + (salary.allowances[1]?.amount || 0),
                  0
                )}
              </td>
              <td className="border px-4 py-2 text-center bg-blue-200  font-bold">
                {filteredSalaries.reduce(
                  (sum, salary) => sum + (salary.allowances[2]?.amount || 0),
                  0
                )}
              </td>
              <td className="border px-4 py-2 text-center bg-blue-200  font-bold">
                {filteredSalaries.reduce(
                  (sum, salary) => sum + (salary.allowances[3]?.amount || 0),
                  0
                )}
              </td>
              <td className="border px-4 py-2 text-center bg-blue-200 font-bold">
                {filteredSalaries.reduce(
                  (sum, salary) =>
                    sum +
                    salary.allowances.reduce(
                      (total, allowance, index) =>
                        index >= 4 ? total + (allowance?.amount || 0) : total,
                      0
                    ),
                  0
                )}
              </td>
              <td className="border px-4 py-2 text-center bg-red-200 font-bold">
                {filteredSalaries.reduce(
                  (sum, salary) =>
                    sum +
                    (salary.deductions.find((d) => d.name === "EPF")?.amount ||
                      0),
                  0
                )}
              </td>
              <td className="border px-4 py-2 text-center bg-red-200 font-bold">
                {filteredSalaries.reduce(
                  (sum, salary) =>
                    sum +
                    (salary.deductions.find((d) => d.name === "ESI")?.amount ||
                      0),
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
                    (salary.deductions.find((d) => d.name === "Tax Deduction")
                      ?.amount || 0),
                  0
                )}
              </td>
              <td className="border px-4 py-2 text-center bg-red-200 font-bold">
                {filteredSalaries.reduce(
                  (sum, salary) =>
                    sum +
                    salary.deductions
                      .filter(
                        (d) =>
                          ![
                            "EPF",
                            "ESI",
                            "Advance Deduction",
                            "Tax Deduction",
                          ].includes(d.name)
                      )
                      .reduce((total, d) => total + (d?.amount || 0), 0),
                  0
                )}
              </td>
              <td className="border px-4 py-2 text-center font-bold">
                
              </td>
              <td className="border px-4 py-2 text-center font-bold">
                
              </td>
              <td className="border px-4 py-2 text-center font-bold">
                
              </td>
              <td className="border px-4 py-2 text-center"></td>
              <td className="border px-4 py-2 text-center"></td>
              <td className="border px-4 py-2 text-center bg-green-200  font-bold">
                {filteredSalaries.reduce(
                  (sum, salary) => sum + calculateTotalSalary(salary),
                  0
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ViewSalary;
