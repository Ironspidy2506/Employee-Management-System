import React, { useState, useEffect } from "react";
import { getSalaryDetails, updateSalary } from "../../utils/SalaryHelper";
import Footer from "../HeaderFooter/Footer";
import Header from "../HeaderFooter/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const EditSalary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [employeeIdInput, setEmployeeIdInput] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [grossSalary, setGrossSalary] = useState("");
  const [paymentMonth, setPaymentMonth] = useState("");
  const [paymentYear, setPaymentYear] = useState("");
  const [allowances, setAllowances] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [basicSalary, setBasicSalary] = useState(0);
  const [payableDays, setPayableDays] = useState("");
  const [sundays, setSundays] = useState(0);
  const [netPayableDays, setNetPayableDays] = useState(0);

  const handleFetchEmployee = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/employees/allowances/summary/${employeeIdInput}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  useEffect(() => {
    if (grossSalary) {
      // Calculate basic salary
      const basic =
        employeeType === "Employee"
          ? (grossSalary * 0.45).toFixed(2)
          : (grossSalary * 0.6).toFixed(2);
      setBasicSalary(basic);

      // Reusable function to update or add entries in an array
      const updateOrAddEntries = (prevItems, newItems) => {
        const updatedItems = [...prevItems];
        newItems.forEach(({ name, amount }) => {
          const index = updatedItems.findIndex((item) => item.name === name);
          if (index >= 0) {
            updatedItems[index].amount = amount; // Update existing item
          } else {
            updatedItems.push({ name, amount }); // Add new item
          }
        });
        return updatedItems;
      };

      // Update allowances
      setAllowances((prevAllowances) =>
        updateOrAddEntries(prevAllowances, [
          { name: "HRA", amount: (grossSalary * 0.27).toFixed(2) },
          { name: "Food Allowance", amount: (grossSalary * 0.1).toFixed(2) },
          {
            name: "Medical Allowance",
            amount: (grossSalary * 0.08).toFixed(2),
          },
          {
            name: "Transport Allowance",
            amount: (grossSalary * 0.1).toFixed(2),
          },
        ])
      );

      // Update deductions
      setDeductions((prevDeductions) =>
        updateOrAddEntries(prevDeductions, [
          { name: "EPF", amount: (basic * 0.12).toFixed(2) },
          {
            name: "ESIC",
            amount: basic > 21000 ? 0 : (grossSalary * 0.0075).toFixed(2),
          },
          { name: "Advance Deduction", amount: 0 },
          { name: "Tax Deduction", amount: 0 },
        ])
      );
    }
  }, [grossSalary, employeeType]);

  useEffect(() => {
    const fetchSalaryData = async () => {
      if (employeeDetails && paymentMonth && paymentYear) {
        try {
          const salaryDetails = await getSalaryDetails({
            employeeId: employeeDetails._id,
            paymentMonth,
            paymentYear,
          });

          if (salaryDetails) {
            setEmployeeType(salaryDetails.employeeType || "");
            setGrossSalary(salaryDetails.grossSalary || "");
            setBasicSalary(salaryDetails.basicSalary || 0);
            setPayableDays(salaryDetails.payableDays || "");
            setSundays(salaryDetails.sundays || 0);
            setNetPayableDays(salaryDetails.netPayableDays || 0);
            setAllowances(salaryDetails.allowances);
            setDeductions(salaryDetails.deductions);

            if (
              salaryDetails.sundays === undefined ||
              salaryDetails.sundays === null
            ) {
              const daysInMonth = new Date(
                paymentYear,
                new Date(paymentMonth + " 1").getMonth() + 1,
                0
              ).getDate();
              let sundaysCount = 0;

              for (let day = 1; day <= daysInMonth; day++) {
                if (
                  new Date(
                    paymentYear,
                    new Date(paymentMonth + " 1").getMonth(),
                    day
                  ).getDay() === 0
                ) {
                  sundaysCount++;
                }
              }

              setSundays(sundaysCount);
            } else {
              setSundays(salaryDetails.sundays);
            }
          } else {
            setGrossSalary("");
            setAllowances([]);
            setDeductions([]);
          }
        } catch (error) {
          console.error("Error fetching salary data:", error);
          toast.error("Error fetching salary details.");
        }
      }
    };

    fetchSalaryData();
  }, [employeeDetails, paymentMonth, paymentYear]);

  useEffect(() => {
    if (paymentMonth && paymentYear) {
      const daysInMonth = new Date(
        paymentYear,
        new Date(paymentMonth + " 1").getMonth() + 1,
        0
      ).getDate();
      let sundaysCount = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        if (
          new Date(
            paymentYear,
            new Date(paymentMonth + " 1").getMonth(),
            day
          ).getDay() === 0
        ) {
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

  const addField = (type) => {
    if (type === "allowances") {
      setAllowances([...allowances, { name: "", amount: 0 }]);
    } else if (type === "deductions") {
      setDeductions([...deductions, { name: "", amount: 0 }]);
    }
  };

  const removeField = (index, type) => {
    if (type === "allowances") {
      const updatedAllowances = allowances.filter((_, i) => i !== index);
      setAllowances(updatedAllowances);
    } else if (type === "deductions") {
      const updatedDeductions = deductions.filter((_, i) => i !== index);
      setDeductions(updatedDeductions);
    }
  };

  const handleFieldChange = (index, type, field, value) => {
    if (type === "allowances") {
      const updatedAllowances = allowances.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setAllowances(updatedAllowances);
    } else if (type === "deductions") {
      const updatedDeductions = deductions.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      setDeductions(updatedDeductions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      employeeId: employeeDetails._id,
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
      await updateSalary(employeeDetails._id, payload);
      toast.success("Salary updated successfully!");
      setTimeout(() => {
        navigate(`/${user.role}-dashboard/salary`);
      }, 800);
    } catch (error) {
      console.error("Error updating salary:", error);
      toast.error("Error updating salary.");
    }
  };

  const currentYear = new Date().getFullYear() - 1;
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i); // Generate years from current year to 20 years ahead

  // List of month names
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

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl p-6 space-y-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-center text-2xl font-bold">
            Edit Salary Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Employee ID</label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={employeeIdInput}
                  onWheel={(e) => e.target.blur()}
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

            {/* Payment Month and Year */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block font-medium mb-2">Payment Month</label>
                <select
                  value={paymentMonth}
                  onChange={(e) => setPaymentMonth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
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
                onWheel={(e) => e.target.blur()}
                onChange={(e) => setGrossSalary(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
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
                onWheel={(e) => e.target.blur()}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Employee Type</label>
              <select
                value={employeeType}
                onChange={(e) => setEmployeeType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
              >
                <option value="">Select Employee Type</option>
                <option value="Employee">Employee</option>
                <option value="Director">Director</option>
              </select>
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
              {allowances && allowances.length > 0 ? (
                allowances.map((allowance, index) => (
                  <div key={index} className="flex space-x-4 mb-2">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                      placeholder="Allowance Amount"
                    />
                    <button
                      type="button"
                      onClick={() => removeField(index, "allowances")}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p></p>
              )}
              <button
                type="button"
                onClick={() => addField("allowances")}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Add Allowance
              </button>
            </div>

            {/* Deductions */}
            <div>
              <label className="block font-medium mb-2">Deductions</label>
              {deductions && deductions.length > 0 ? (
                deductions.map((deduction, index) => (
                  <div key={index} className="flex space-x-4 mb-2">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                      placeholder="Deduction Amount"
                    />
                    <button
                      type="button"
                      onClick={() => removeField(index, "deductions")}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <p></p>
              )}
              <button
                type="button"
                onClick={() => addField("deductions")}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Add Deduction
              </button>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-1/5 px-6 py-2 bg-green-500 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditSalary;
