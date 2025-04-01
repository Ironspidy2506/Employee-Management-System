import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../HeaderFooter/Footer";
import Header from "../HeaderFooter/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditFixedAllowancesAdmin = () => {
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

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/employees/allowances/summary/${formData.employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const employee = response.data.employee;
      setFormData((prev) => ({
        ...prev,
        empName: employee.name,
        designation: employee.designation,
        department: employee.department.departmentName,
      }));
    } catch (err) {
      console.error("Error fetching employee data:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/fixed-allowances/admin/edit-fixed-allowance/${formData.employeeId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Employee allowance updated successfully");
        setTimeout(() => {
          navigate(`/${user.role}-dashboard/fixed-allowances`);
        }, 500);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("There was an error submitting the form. Please try again.");
    }
  };

  const currentYear = new Date().getFullYear() - 1;
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i); // Generate years from current year to 20 years ahead

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="mt-2 max-w-full mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Edit Allowance Form
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={fetchEmployeeData}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Fetch Employee Data
              </button>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Employee Name
              </label>
              <input
                type="text"
                name="empName"
                value={formData.empName}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Project No.
              </label>
              <input
                type="text"
                name="projectNo"
                value={formData.projectNo}
                onChange={handleChange}
                placeholder="(If Any)"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Client
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="(If Any)"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border rounded-md select-scrollable focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 select-scrollable"
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Allowance Type</option>
                <option value="bonus">Bonus</option>
                <option value="resPhone">Loyalty Bonus</option>
                <option value="specialAllowance">Special Allowance</option>
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full md:w-2/5 bg-green-600 text-white py-2 px-4 rounded-md mt-6 hover:bg-green-700"
            >
              Update Allowance
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditFixedAllowancesAdmin;
