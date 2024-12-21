import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import axios from "axios";

const ViewEmployeeSalary = () => {
  const { user } = useAuth();
  const [salary, setSalary] = useState({
    basicSalary: 0,
    allowances: [],
    deductions: [],
    totalSalary: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const response = await axios.get(
          `https://employee-management-system-backend-objq.onrender.com/api/employees/salary/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setSalary(response.data.salary);
      } catch (err) {
        setError("No salary details found!");
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, [user._id]);

  const calculateTotalSalary = () => {
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

  if (loading)
    return <div className="text-center text-xl mt-5">Loading...</div>;
  if (error)
    return (
      <div className="text-center mt-5">
        <h2 className="text-2xl font-semibold mb-6 text-red-600">{error}</h2>
      </div>
    );

  return (
    <div className="max-w-full mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex flex-col items-center space-y-4">
        <img
          src="http://korus.co.in/Kimg/Korus.png"
          alt="Company Logo"
          className="w-28 h-28"
        />
        <h1 className="text-2xl md:text-4xl font-bold text-center">
          Korus Engineering Solutions Pvt. Ltd.
        </h1>
        <h4 className="text-center text-gray-700 text-sm md:text-base leading-relaxed">
          <span className="block">
            912, Pearls Best Heights-II, 9th Floor, Plot No. C-9, Netaji Subhash
            Place, Pitampura, Delhi - 110034
          </span>
          <span className="block">
            Web: www.korus.co.in | MSME Registration No.: DL06E0006843 | CIN:
            U74210DL2005PTC134637
          </span>
        </h4>

        <p className="text-lg text-gray-600">
          Pay Slip for{" "}
          {new Date(salary.paymentDate).toLocaleDateString("default", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Employee Details */}
      <div className="mt-8 border-b pb-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
          <span className="text-lg font-bold">Employee ID:</span>{" "}
          <span className="text-lg font-medium">
            {salary.employeeId.employeeId}
          </span>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
          <span className="text-lg font-bold">UAN:</span>{" "}
          <span className="text-lg font-medium">
            {salary.employeeId.uan || "Not Available"}
          </span>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
          <span className="text-lg font-bold">Employee Name:</span>{" "}
          <span className="text-lg font-medium">{salary.employeeId.name}</span>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
          <span className="text-lg font-bold">PF No.:</span>{" "}
          <span className="text-lg font-medium">
            {salary.employeeId.pfNo || "Not Available"}
          </span>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
          <span className="text-lg font-bold">Designation:</span>{" "}
          <span className="text-lg font-medium">
            {salary.employeeId.designation || "Not Available"}
          </span>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
          <span className="text-lg font-bold">ESI No.:</span>{" "}
          <span className="text-lg font-medium">
            {salary.employeeId.esiNo || "Not Available"}
          </span>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
          <span className="text-lg font-bold">Bank:</span>{" "}
          <span className="text-lg font-medium">
            {salary.employeeId.bank || "Not Available"}
          </span>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
          <span className="text-lg font-bold">Account No.:</span>{" "}
          <span className="text-lg font-medium">
            {salary.employeeId.accountNo || "Not Available"}
          </span>
        </div>
      </div>

      {/* Salary Summary */}
      <div className="mt-8 text-gray-700">
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
          <p className="mb-4 text-lg">
            <span className="font-bold">Gross Salary:</span>{" "}
            <span className="font-medium">
              ₹
              {salary.basicSalary +
                salary.allowances.reduce(
                  (acc, allowance) => acc + allowance.amount,
                  0
                )}
            </span>
          </p>
          <p className="mb-4 text-lg">
            <span className="font-bold">Basic Salary:</span>{" "}
            <span className="font-medium">₹{salary.basicSalary}</span>
          </p>
          <p className="text-lg">
            <span className="font-bold">Total Working Days:</span>{" "}
            <span className="font-medium">{salary.workingDays || 30}</span>
          </p>
        </div>
      </div>

      {/* Earnings and Deductions */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
        <div className="grid grid-cols-2 gap-6 text-white">
          <div className="bg-blue-600 text-center py-2 rounded-lg font-semibold">
            Earnings
          </div>
          <div className="bg-red-600 text-center py-2 rounded-lg font-semibold">
            Deductions
          </div>
        </div>

        <div className="grid grid-cols-4 mt-6 gap-4 text-gray-800">
          {/* Column Headers */}
          <div className="text-center font-semibold bg-gray-200 p-2">
            Details
          </div>
          <div className="text-center font-semibold bg-gray-200 p-2">
            Amount
          </div>
          <div className="text-center font-semibold bg-gray-200 p-2">
            Details
          </div>
          <div className="text-center font-semibold bg-gray-200 p-2">
            Amount
          </div>
        </div>

        {/* Earnings */}
        <div className="grid grid-cols-4 max-w-full gap-3 mt-2">
          {salary.allowances.map((allowance, index) => (
            <React.Fragment key={index}>
              <div className="text-center border p-2">{allowance.name}</div>
              <div className="text-center border p-2">₹{allowance.amount}</div>
            </React.Fragment>
          ))}

          {/* Deductions */}
          {salary.deductions.map((deduction, index) => (
            <React.Fragment key={index}>
              <div className="text-center border p-2">{deduction.name}</div>
              <div className="text-center border p-2">₹{deduction.amount}</div>
            </React.Fragment>
          ))}
        </div>

        <div className="col-span-2 grid grid-cols-2 mt-6 gap-4">
          <div className="grid grid-cols-2">
            <div className="text-center font-semibold bg-blue-100 p-2">
              Total Allowances
            </div>
            <div className="text-center font-semibold bg-blue-100 p-2">
              ₹
              {salary.allowances.reduce(
                (acc, allowance) => acc + allowance.amount,
                0
              )}
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="text-center font-semibold bg-red-100 p-2">
              Total Deductions
            </div>
            <div className="text-center font-semibold bg-red-100 p-2">
              ₹
              {salary.deductions.reduce(
                (acc, deduction) => acc + deduction.amount,
                0
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Net Salary */}
      <div className="mt-8 grid grid-cols-2 gap-4 text-gray-800 text-lg">
        <div className="text-center font-semibold bg-gray-200 p-2">
          Net Salary
        </div>
        <div className="text-center font-bold text-green-700 bg-green-100 p-2">
          ₹{calculateTotalSalary()}
        </div>
      </div>

      <div className="text-center mt-8 pt-4 border-t border-gray-300 text-gray-700 text-sm md:text-base leading-relaxed">
        Korus Design & Skill Forum: Plot No. 32, Sector-4B, HSIIDC, Bahadurgarh,
        Haryana - 124507
      </div>
    </div>
  );
};

export default ViewEmployeeSalary;
