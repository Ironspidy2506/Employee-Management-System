import React, { useState, useEffect } from "react";
import Footer from "../HeaderFooter/Footer";
import Header from "../HeaderFooter/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AddSalary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [employeeType, setEmployeeType] = useState("Employee");
  const [grossSalary, setGrossSalary] = useState("");
  const [basicSalary, setBasicSalary] = useState(0);
  const [allowances, setAllowances] = useState([
    { name: "HRA", amount: 0 },
    { name: "Food Allowance", amount: 0 },
    { name: "Medical Allowance", amount: 0 },
    { name: "Transport Allowance", amount: 0 },
  ]);
  const [deductions, setDeductions] = useState([
    { name: "EPF", amount: 0 },
    { name: "ESIC", amount: 0 },
    { name: "Advance Deduction", amount: 0 },
    { name: "Tax Deduction", amount: 0 },
  ]);
  const [paymentMonth, setPaymentMonth] = useState("");
  const [paymentYear, setPaymentYear] = useState("");
  const [payableDays, setPayableDays] = useState("");
  const [sundays, setSundays] = useState(0);
  const [netPayableDays, setNetPayableDays] = useState(0);

  const handleFetchEmployee = async () => {
    try {
      const response = await axios.get(
        `https://employee-management-system-backend-objq.onrender.com/api/employees/allowances/summary/${employeeIdInput}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setEmployeeDetails(response.data.employee);
      } else {
        toast.error("No employee found with this ID.");
        setEmployeeDetails(null);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error("Error fetching employee details.");
    }
  };

  const handleFetchGrossSalary = async () => {
    try {
      const { data } = await axios.get(
        `https://employee-management-system-backend-objq.onrender.com/api/employees/${employeeIdInput}/${paymentMonth}/${paymentYear}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );


      if (data.success) {
        setGrossSalary(data.grossSalary);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching gross salary:", error);
      toast.error("Error fetching gross salary.");
    }
  };

  useEffect(() => {
    if (employeeIdInput && paymentMonth && paymentYear) {
      handleFetchGrossSalary();
    }
  }, [paymentMonth, paymentYear]);

  useEffect(() => {
    if (grossSalary) {
      const basic =
        employeeType === "Employee"
          ? (grossSalary * 0.45).toFixed(2)
          : (grossSalary * 0.6).toFixed(2);
      setBasicSalary(basic);

      // Update allowances
      const updatedAllowances = [
        { name: "HRA", amount: (grossSalary * 0.27).toFixed(2) },
        { name: "Food Allowance", amount: (grossSalary * 0.1).toFixed(2) },
        { name: "Medical Allowance", amount: (grossSalary * 0.08).toFixed(2) },
        { name: "Transport Allowance", amount: (grossSalary * 0.1).toFixed(2) },
      ];
      setAllowances(updatedAllowances);

      // Update deductions
      const updatedDeductions = [
        { name: "EPF", amount: (basic * 0.12).toFixed(2) },
        {
          name: "ESIC",
          amount: basic > 21000 ? 0 : (grossSalary * 0.0075).toFixed(2),
        },
        { name: "Advance Deduction", amount: 0 },
        { name: "Tax Deduction", amount: 0 },
      ];
      setDeductions(updatedDeductions);
    }
  }, [grossSalary, employeeType]);

  useEffect(() => {
    if (paymentMonth && paymentYear) {
      const monthIndex = new Date(
        `${paymentMonth} 1, ${paymentYear}`
      ).getMonth();
      const daysInMonth = new Date(paymentYear, monthIndex + 1, 0).getDate();
      let sundaysCount = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(paymentYear, monthIndex, day);
        if (date.getDay() === 0) {
          sundaysCount++;
        }
      }

      setSundays(sundaysCount);
    }
  }, [paymentMonth, paymentYear]);

  useEffect(() => {
    const totalPayableDays = parseInt(payableDays || 0, 10) + sundays;
    setNetPayableDays(totalPayableDays);
  }, [payableDays, sundays]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeDetails) {
      toast.warn("Please fetch employee details before submitting.");
      return;
    }

    const payload = {
      employeeId: employeeDetails._id,
      employeeType,
      grossSalary,
      basicSalary,
      payableDays,
      sundays,
      netPayableDays,
      paymentMonth,
      paymentYear,
      allowances,
      deductions,
    };

    try {
      const response = await axios.post(
        "https://employee-management-system-backend-objq.onrender.com/api/salary/add",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate(`/${user.role}-dashboard/salary`);
        }, 800);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 1 + i);
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

  const handleFieldChange = (index, fieldType, key, value) => {
    if (fieldType === "allowances") {
      const updatedAllowances = [...allowances];
      updatedAllowances[index][key] = value;
      setAllowances(updatedAllowances);
    } else if (fieldType === "deductions") {
      const updatedDeductions = [...deductions];
      updatedDeductions[index][key] = value;
      setDeductions(updatedDeductions);
    }
  };

  const addField = (fieldType) => {
    if (fieldType === "allowances") {
      setAllowances([...allowances, { name: "", amount: 0 }]);
    } else if (fieldType === "deductions") {
      setDeductions([...deductions, { name: "", amount: 0 }]);
    }
  };

  const removeField = (index, fieldType) => {
    if (fieldType === "allowances") {
      const updatedAllowances = allowances.filter((_, i) => i !== index);
      setAllowances(updatedAllowances);
    } else if (fieldType === "deductions") {
      const updatedDeductions = deductions.filter((_, i) => i !== index);
      setDeductions(updatedDeductions);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl p-6 space-y-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-center text-2xl font-bold text-gray-800">
            Add Employee Salary
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Employee ID Input */}
            <div>
              <label className="block font-medium mb-2">Employee ID</label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={employeeIdInput}
                  onChange={(e) => setEmployeeIdInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                  placeholder="Enter Employee ID"
                  required
                />
                <button
                  type="button"
                  onClick={handleFetchEmployee}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Fetch
                </button>
              </div>
            </div>

            {/* Display Employee Details */}
            {employeeDetails && (
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    value={employeeDetails.name}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Designation</label>
                  <input
                    type="text"
                    value={employeeDetails.designation}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">Department</label>
                  <input
                    type="text"
                    value={employeeDetails.department.departmentName}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-medium mb-2">Employee Type</label>
              <select
                value={employeeType}
                onChange={(e) => setEmployeeType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
              >
                <option value="Employee">Employee</option>
                <option value="Director">Director</option>
              </select>
            </div>

            {/* Payment Month and Year */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block font-medium mb-2">Payment Month</label>
                <select
                  value={paymentMonth}
                  onChange={(e) => setPaymentMonth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                  required
                >
                  <option value="">Select Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
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

            {/* Gross Salary */}
            <div>
              <label className="block font-medium mb-2">Gross Salary</label>
              <input
                type="number"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                onWheel={(e) => e.target.blur()}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter gross salary"
                required
              />
            </div>

            {/* Basic Salary (Readonly) */}
            <div>
              <label className="block font-medium mb-2">Basic Salary</label>
              <input
                type="number"
                value={basicSalary}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Payable Days</label>
              <input
                type="number"
                value={payableDays}
                onWheel={(e) => e.target.blur()}
                onChange={(e) => setPayableDays(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter payable days"
                required
              />
            </div>

            {/* Sundays */}
            <div>
              <label className="block font-medium mb-2">Sundays</label>
              <input
                type="number"
                value={sundays}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>

            {/* Net Payable Days */}
            <div>
              <label className="block font-medium mb-2">Net Payable Days</label>
              <input
                type="number"
                value={netPayableDays}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              />
            </div>

            {/* Allowances */}
            <div>
              <label className="block font-medium mb-2">Allowances</label>
              {allowances.map((allowance, index) => (
                <div key={index} className="flex items-center space-x-4 mb-2">
                  <input
                    type="text"
                    value={allowance.name}
                    onChange={(e) =>
                      handleFieldChange(
                        index,
                        "allowances",
                        "name",
                        e.target.value
                      )
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                    placeholder="Allowance Name"
                  />
                  <input
                    type="number"
                    value={allowance.amount}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      handleFieldChange(
                        index,
                        "allowances",
                        "amount",
                        e.target.value
                      )
                    }
                    className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                    placeholder="Amount"
                  />
                  <button
                    type="button"
                    onClick={() => removeField(index, "allowances")}
                    className="px-2 py-1 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("allowances")}
                className="px-4 py-2 bg-blue-500 text-white rounded-md mt-2 focus:outline-none"
              >
                Add Allowance
              </button>
            </div>

            {/* Deductions */}
            <div>
              <label className="block font-medium mb-2">Deductions</label>
              {deductions.map((deduction, index) => (
                <div key={index} className="flex items-center space-x-4 mb-2">
                  <input
                    type="text"
                    value={deduction.name}
                    onChange={(e) =>
                      handleFieldChange(
                        index,
                        "deductions",
                        "name",
                        e.target.value
                      )
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                    placeholder="Deduction Name"
                  />
                  <input
                    type="number"
                    value={deduction.amount}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) =>
                      handleFieldChange(
                        index,
                        "deductions",
                        "amount",
                        e.target.value
                      )
                    }
                    className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                    placeholder="Amount"
                  />
                  <button
                    type="button"
                    onClick={() => removeField(index, "deductions")}
                    className="px-2 py-1 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("deductions")}
                className="px-4 py-2 bg-blue-500 text-white rounded-md mt-2"
              >
                Add Deduction
              </button>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="w-1/5 px-6 py-2 bg-green-500 text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddSalary;
