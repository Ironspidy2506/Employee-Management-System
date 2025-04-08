import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../HeaderFooter/Footer";
import Header from "../HeaderFooter/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditAllowances = () => {
  const { user } = useAuth();
  const { _id } = useParams(); // Get the allowance ID from the URL
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
    // Fetch employee data
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employees/summary/${user._id}`,
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

  useEffect(() => {
    // Fetch allowance data
    const fetchAllowanceData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/allowances/edit/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const allowance = response.data.allowance;

        setFormData((prev) => ({
          ...prev,
          projectNo: allowance.projectNo || "",
          client: allowance.client || "",
          allowanceMonth: allowance.allowanceMonth || "",
          allowanceYear: allowance.allowanceYear || "",
          allowanceType: allowance.allowanceType || "",
          allowanceAmount: allowance.allowanceAmount || "",
        }));
      } catch (err) {
        console.error("Error fetching allowance data:", err);
      }
    };

    fetchAllowanceData();
  }, [_id]);

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
        `http://localhost:5000/api/allowances/edit/${_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Allowance updated successfully");
        setTimeout(() => {
          navigate("/employee-dashboard/allowances");
        }, 800);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const currentYear = new Date().getFullYear() - 1;
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="mt-2 max-w-full mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Edit Allowance
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Employee Information */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                readOnly
              />
            </div>
          </div>

          {/* Additional Fields */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                readOnly
              />
            </div>
          </div>

          {/* Allowance Details */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Project No.
              </label>
              <input
                type="text"
                name="projectNo"
                value={formData.projectNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Client
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
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
                value={formData.allowanceMonth}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              >
                <option value="">Select Month</option>
                {[
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
                ].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Year
              </label>
              <select
                name="allowanceYear"
                value={formData.allowanceYear}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              >
                <option value="">Select Allowance Type</option>
                <option value="site">Site Allowance</option>
                <option value="earnedLeave">Earned Leave</option>
                <option value="ltc">LTC</option>
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full md:w-1/5 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-300"
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

export default EditAllowances;
