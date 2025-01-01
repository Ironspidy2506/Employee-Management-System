import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../HeaderFooter/Footer";
import Header from "../HeaderFooter/Header";

const ApplyAllowances = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: "",
    empName: "",
    designation: "",
    department: "",
    client: "",
    projectNo: "",
    allowanceMonth: "",
    allowanceYear: "",
    allowanceType: "",
    allowanceAmount: "",
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(
          `https://employee-management-system-backend-objq.onrender.com/api/employees/summary/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const employee = response.data.employee;

        setFormData((prev) => ({
          ...prev,
          employeeId: employee.employeeId,
          empName: employee.name,
          designation: employee.designation,
          department: employee.department.departmentName,
        }));
      } catch (err) {
        console.error("Error fetching employee data:", err);
      }
    };

    if (user?._id) {
      fetchEmployeeData();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = user._id;
    try {
      const response = await axios.post(
        `https://employee-management-system-backend-objq.onrender.com/api/allowances/add/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        navigate("/employee-dashboard/allowances");
      }
    } catch (err) {
      if (err.response) {
        console.error("Submission Error:", err.response.data.message);
      } else {
        console.error("Submission Error:", err.message);
      }
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const currentYear = new Date().getFullYear() - 1;
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i); // Generate years from current year to 20 years ahead

  return (
    <>
      <Header />
      <div className="mt-2 max-w-full mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Add Allowance Form
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                readOnly
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Employee Name
              </label>
              <input
                type="text"
                name="empName"
                value={formData.empName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                readOnly
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                readOnly
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                readOnly
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Project No.
              </label>
              <input
                type="text"
                name="projectNo"
                placeholder="(If Any)"
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Client
              </label>
              <input
                type="text"
                name="client"
                placeholder="(If Any)"
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Month
              </label>
              <select
                name="allowanceMonth"
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md select-scrollable"
                required
              >
                <option value="">Select Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Payment Year</label>
              <select
                name="allowanceYear" // Add this attribute
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 select-scrollable"
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

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Allowance Type
              </label>
              <select
                name="allowanceType"
                value={formData.allowanceType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select Allowance Type</option>
                <option value="site">Site Allowance</option>
                <option value="earnedLeave">Earned Leave</option>
                <option value="ltc">LTC</option>
                <option value="loyaltyBonus">Loyalty Bonus</option>
                <option value="petrol">Petrol</option>
                <option value="driver">Driver Allowance</option>
                <option value="carMaint">Car Maintenance</option>
                <option value="localTravel">Local Travel/Metro Fair</option>
                <option value="deferred">Deferred Allowance</option>
                <option value="overTime">Overtime</option>
                <option value="others">Other Allowances</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                name="allowanceAmount"
                value={formData.allowanceAmount}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md mt-6 hover:bg-green-700"
          >
            Submit Allowance
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default ApplyAllowances;
