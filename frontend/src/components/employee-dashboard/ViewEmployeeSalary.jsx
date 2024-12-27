import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import axios from "axios";

const ViewEmployeeSalary = () => {
  const { user } = useAuth();
  const [salary, setSalary] = useState({
    basicSalary: 0,
    allowances: [],
    deductions: [],
    totalSalary: 0,
    paymentDate: "",
    employeeId: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMonth, setPaymentMonth] = useState("");
  const [paymentYear, setPaymentYear] = useState("");
  const [showSalaryDetails, setShowSalaryDetails] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear + i);

  const months = [
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

  const fetchSalary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://employee-management-system-backend-objq.onrender.com/api/employees/salary/${user._id}?paymentMonth=${paymentMonth}&paymentYear=${paymentYear}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSalary(response.data);
      setShowSalaryDetails(true);
    } catch (err) {
      setError("No salary details found!");
      setShowSalaryDetails(false);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalSalary = () => {
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

  return (
    <div className="max-w-full mx-auto mt-10 p-8 bg-white shadow-xl rounded-lg">
      {/* Month and Year Selector */}
      <div className="flex space-x-4 mb-6">
        <div className="w-1/2">
          <label className="block font-medium mb-2">Payment Month</label>
          <select
            value={paymentMonth}
            onChange={(e) => setPaymentMonth(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Select Month</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="w-1/2">
          <label className="block font-medium mb-2">Payment Year</label>
          <select
            value={paymentYear}
            onChange={(e) => setPaymentYear(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
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
      </div>

      <button
        onClick={fetchSalary}
        className="w-full mt-3 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
      >
        Fetch Salary
      </button>

      {loading && <div className="text-center text-xl mt-5">Loading...</div>}
      {error && (
        <div className="text-center mt-5">
          <h2 className="text-2xl font-semibold mb-6 text-red-600">{error}</h2>
        </div>
      )}

      {showSalaryDetails && (
        <div>
          {/* Header */}
          <div className="mt-8 text-center space-y-4">
            <img
              src="http://korus.co.in/Kimg/Korus.png"
              alt="Company Logo"
              className="w-28 h-28 mx-auto"
            />
            <h1 className="text-3xl font-bold">
              Korus Engineering Solutions Pvt. Ltd.
            </h1>
            <p className="text-sm text-gray-700">
              912, Pearls Best Heights-II, 9th Floor, Plot No. C-9, Netaji
              Subhash Place, Pitampura, Delhi - 110034
              <br />
              Web: www.korus.co.in | MSME Registration No.: DL06E0006843 | CIN:
              U74210DL2005PTC134637
            </p>
            <p className="text-lg text-gray-600 mt-2">
              Pay Slip for {`${salary.paymentMonth} ${salary.paymentYear}`}
            </p>
          </div>

          {/* Employee Details */}
          <div className="mt-8 border-b pb-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
            {[
              { label: "Employee ID", value: salary.employeeId?.employeeId },
              { label: "UAN", value: salary.employeeId?.uan },
              { label: "Employee Name", value: salary.employeeId?.name },
              { label: "PF No.", value: salary.employeeId?.pfNo },
              { label: "Designation", value: salary.employeeId?.designation },
              { label: "ESI No.", value: salary.employeeId?.esiNo },
              { label: "Bank", value: salary.employeeId?.bank },
              { label: "Account No.", value: salary.employeeId?.accountNo },
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg shadow-md border"
              >
                <span className="font-semibold">{item.label}:</span>{" "}
                <span className="font-medium">
                  {item.value || "Not Available"}
                </span>
              </div>
            ))}
          </div>

          {/* Salary Summary */}
          <div className="mt-8 text-gray-700">
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <p className="mb-4 text-lg">
                <span className="font-bold">Gross Salary:</span>{" "}
                <span className="font-medium">₹{salary.grossSalary}</span>
              </p>
              <p className="mb-4 text-lg">
                <span className="font-bold">Basic Salary:</span>{" "}
                <span className="font-medium">₹{salary.basicSalary}</span>
              </p>
            </div>
          </div>

          {/* Allowances */}
          <div className="mt-8 text-gray-700">
            <h3 className="text-xl font-semibold mb-4">Allowances</h3>
            {salary.allowances.length === 0 ? (
              <p>No allowances available</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {salary.allowances.map((allowance, index) => (
                  <React.Fragment key={index}>
                    <div className="text-center font-semibold bg-blue-200 p-2 rounded-lg shadow-sm">
                      {allowance.name}
                    </div>
                    <div className="text-center font-bold text-blue-700 bg-blue-100 p-2 rounded-lg shadow-sm">
                      ₹{allowance.amount}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Deductions */}
          <div className="mt-8 text-gray-700">
            <h3 className="text-xl font-semibold mb-4">Deductions</h3>
            {salary.deductions.length === 0 ? (
              <p>No deductions available</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {salary.deductions.map((deduction, index) => (
                  <React.Fragment key={index}>
                    <div className="text-center font-semibold bg-red-200 p-2 rounded-lg shadow-sm">
                      {deduction.name}
                    </div>
                    <div className="text-center font-bold text-red-700 bg-red-100 p-2 rounded-lg shadow-sm">
                      ₹{deduction.amount}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Net Salary */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-gray-800 text-lg">
            <div className="text-center font-semibold bg-gray-200 p-2 rounded-lg shadow-sm">
              Total Salary
            </div>
            <div className="text-center font-bold text-green-700 bg-green-100 p-2 rounded-lg shadow-sm">
              ₹{calculateTotalSalary(salary)}
            </div>
          </div>

          <div className="text-center mt-8 pt-4 border-t border-gray-300 text-gray-700 text-sm md:text-base">
            Korus Design & Skill Forum: Plot No. 32, Sector-4B, HSIIDC,
            Bahadurgarh, Haryana - 124507
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEmployeeSalary;
