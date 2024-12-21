import React, { useState, useEffect } from "react";
import {
  fetchDepartments,
  fetchEmployees,
  getRecentSalaryDetails,
  updateSalary,
} from "../../utils/SalaryHelper";
import Footer from "../HeaderFooter/Footer";
import Header from "../HeaderFooter/Header";
import { useNavigate } from "react-router-dom";

const EditSalary = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [basicSalary, setBasicSalary] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [allowances, setAllowances] = useState([]);
  const [deductions, setDeductions] = useState([]);

  // Fetch departments on mount
  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };

    getDepartments();
  }, []);

  // Fetch employees when department is selected
  useEffect(() => {
    if (selectedDepartment) {
      const getEmployees = async () => {
        const employees = await fetchEmployees(selectedDepartment);
        setEmployees(employees);
      };

      getEmployees();
    }
  }, [selectedDepartment]);

  // Fetch salary details when employee is selected
  useEffect(() => {
    const getSalaryDetailsForEdit = async () => {
      if (selectedEmployee) {
        const salaryDetails = await getRecentSalaryDetails(selectedEmployee); // Fetch the latest salary details by employeeId
        setBasicSalary(salaryDetails.basicSalary);
        setWorkingDays(salaryDetails.workingDays);
        setPaymentDate(
          (salaryDetails.paymentDate = new Date(salaryDetails.paymentDate)
            .toISOString()
            .split("T")[0])
        );
        setAllowances(salaryDetails.allowances);
        setDeductions(salaryDetails.deductions);
      }
    };

    // Ensure salary details are always fetched when employee changes
    if (selectedEmployee) {
      getSalaryDetailsForEdit();
    }
  }, [selectedEmployee]);

  const handleAmount = (salary) => {
    if (salary % 1 > 0.5) {
      salary = Math.ceil(salary); // Round up
    } else if (salary % 1 > 0 && salary % 1 <= 0.5) {
      salary = Math.floor(salary); // Round down to .5
    }

    return salary;
  };

  const calculateDeductions = (basicSalary) => {
    let epf = 0;
    let esic = 0;

    if (basicSalary > 25000) {
      epf = (basicSalary * 0.12) / 12; // 12% of basic salary
      esic = 0; // No ESIC if salary is above 25,000
    } else {
      epf = 0; // No EPF if salary is 25,000 or less
      esic = (basicSalary * 0.04) / 12; // 4% of basic salary
    }

    const professionalTax = 200;

    // Annual salary (basicSalary * 12) to check for TDS condition
    let tds = 0;

    if (basicSalary * 12 > 300000) {
      tds = (basicSalary * 0.18) / 12; // 18% of basic salary if annual salary is greater than 3 lakh
    }

    // Round the deductions
    const epfRounded = handleAmount(epf);
    const esicRounded = handleAmount(esic);
    const tdsRounded = handleAmount(tds);
    const professionalTaxRounded = Math.round(professionalTax);

    setDeductions([
      { name: "EPF", amount: epfRounded },
      { name: "ESIC", amount: esicRounded },
      { name: "Professional Tax", amount: professionalTaxRounded },
      { name: "TDS", amount: tdsRounded },
      { name: "Other Deductions", amount: "" },
    ]);
  };

  const handleBasicSalaryChange = (e) => {
    const value = e.target.value;
    setBasicSalary(value);
    if (value) {
      calculateDeductions(parseFloat(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      basicSalary,
      workingDays,
      paymentDate,
      allowances,
      deductions,
    };

    try {
      const result = await updateSalary(selectedEmployee, payload);
      
      navigate('/admin-dashboard/salary');
      // setBasicSalary("");
      // setWorkingDays("");
      // setPaymentDate("");
      // setAllowances([]);
      // setDeductions([]);
    } catch (error) {
      console.error("Error updating salary:", error);
      alert("Error updating salary.");
    }
  };

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    setSelectedEmployee("");
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
  };

  const handleAmountChange = (index, type, value) => {
    const target = type === "allowances" ? [...allowances] : [...deductions];
    target[index].amount = value;
    type === "allowances" ? setAllowances(target) : setDeductions(target);
  };

  return (
    <>
      <Header />

      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl p-6 space-y-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-center text-2xl font-bold">Edit Salary</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Department Selection */}
            <div>
              <label className="block font-medium mb-2">Department</label>
              <select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Selection & Working Days */}
            <div>
              <div className="lg:flex lg:items-center lg:space-x-4">
                <div className="lg:flex-grow">
                  <label className="block font-medium mb-2">Employee</label>
                  <select
                    value={selectedEmployee}
                    onChange={handleEmployeeChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                    disabled={!selectedDepartment}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4 lg:mt-0 lg:flex-none">
                  <label className="block font-medium mb-2">Working Days</label>
                  <input
                    type="number"
                    value={workingDays}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => setWorkingDays(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                    placeholder="Enter working days"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Basic Salary */}
            <div>
              <label className="block font-medium mb-2">Basic Salary</label>
              <input
                type="number"
                value={basicSalary}
                onWheel={(e) => e.target.blur()}
                onChange={handleBasicSalaryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                placeholder="Enter basic salary"
                required
              />
            </div>

            {/* Allowances & Deductions */}
            <div className="flex flex-col gap-2 lg:gap-32 lg:flex-row">
              <div>
                <label className="block font-medium mb-2">Allowances</label>
                {allowances.map((allowance, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-2">
                    <input
                      type="text"
                      value={allowance.name}
                      disabled
                      className="flex-2 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                    />
                    <input
                      type="number"
                      value={allowance.amount}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) =>
                        handleAmountChange(index, "allowances", e.target.value)
                      }
                      className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                      placeholder="Amount"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-medium mb-2">Deductions</label>
                {deductions.map((deduction, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-2">
                    <input
                      type="text"
                      value={deduction.name}
                      disabled
                      className="flex-2 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                    />
                    <input
                      type="number"
                      value={deduction.amount}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) =>
                        handleAmountChange(index, "deductions", e.target.value)
                      }
                      className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                      placeholder="Amount"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Date */}
            <div>
              <label className="block font-medium mb-2">Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EditSalary;
