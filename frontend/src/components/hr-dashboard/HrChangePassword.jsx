import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Header from "../HeaderFooter/Header";
import Footer from "../HeaderFooter/Footer";

const HrChangePassword = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [passwordDetails, setPasswordDetails] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [employees, setEmployees] = useState([]);

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/employees",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setEmployees(response.data.employees);
      } catch (error) {
        if (error.response && error.response.data.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Failed to fetch employees!");
        }
      }
    };

    fetchEmployees(); // Correctly calling fetchEmployees
  }, []);

  const handleSelectChange = (selectedOption) => {
    setSelectedEmployee(selectedOption);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (passwordDetails.newPassword !== passwordDetails.confirmNewPassword) {
      toast.error("New password and confirm password do not match!");
      return;
    }

    if (!selectedEmployee) {
      toast.error("Please select an employee!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/hr-update-password",
        {
          employeeId: selectedEmployee.value,
          newPassword: passwordDetails.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Password updated successfully!");
        setPasswordDetails({ newPassword: "", confirmNewPassword: "" });
        setSelectedEmployee(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update password!"
      );
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="flex items-center justify-center">
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl">
          <h2 className="text-center text-xl font-bold text-gray-700 mb-6">
            Change Employee Password
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Employee Select */}
            <div className="mb-4">
              <label className="block text-gray-800 mb-2">
                Select Employee
              </label>
              <Select
                options={employees
                  .sort((a, b) => a.employeeId - b.employeeId) // Sort by employeeId
                  .map((employee) => ({
                    value: employee._id,
                    label: `${employee.employeeId} - ${employee.name}`, // Display employeeId and name
                  }))}
                onChange={handleSelectChange}
                value={selectedEmployee}
                placeholder="Select employee..."
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="block text-md font-medium text-gray-600 mb-2">
                New Password
              </label>
              <div className="flex items-center">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordDetails.newPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="ml-2 text-xl text-gray-600"
                >
                  {showNewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="relative">
              <label className="block text-md font-medium text-gray-600 mb-2">
                Confirm New Password
              </label>
              <div className="flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  value={passwordDetails.confirmNewPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2 text-xl text-gray-600"
                >
                  {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full md:w-2/5 py-3 bg-green-600 text-white rounded-lg text-base hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HrChangePassword;
