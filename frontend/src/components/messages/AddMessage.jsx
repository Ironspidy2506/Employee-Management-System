import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import Header from "../HeaderFooter/Header";
import Footer from "../HeaderFooter/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const AddMessage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    employeeId: "",
    department: "",
    message: "",
  });

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "https://korus-employee-management-system-mern-stack.vercel.app/api/employees",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEmployees(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees.");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        "https://korus-employee-management-system-mern-stack.vercel.app/api/department",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setDepartments(response.data.departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments.");
    }
  };

  const handleEmployeeChange = (selectedOption) => {
    const selectedEmployee = employees.find(
      (emp) => emp._id === selectedOption.value
    );

    if (selectedEmployee) {
      setFormData({
        ...formData,
        employeeId: selectedEmployee._id, // include _id
        department: selectedEmployee.department?._id || "",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
    };

    try {
      const response = await axios.post(
        "https://korus-employee-management-system-mern-stack.vercel.app/api/message/add-message",
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
          navigate(`/${user.role}-dashboard/messages`);
        }, 500);
        setFormData({
          employeeName: "",
          department: "",
          message: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting appraisal:", error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Send Message
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Info */}
          <div className="grid grid-cols-2 gap-4">
            {/* Employee Selection */}
            <div>
              <label className="text-lg font-semibold text-gray-700 capitalize mb-1 block">
                Employee
              </label>
              <Select
                options={employees
                  .sort((a, b) => a.employeeId - b.employeeId)
                  .map((employee) => ({
                    value: employee._id,
                    label: `${employee.employeeId} - ${employee.name}`,
                  }))}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Employee"
                onChange={handleEmployeeChange}
              />
            </div>

            {/* Department Selection (Auto-updated) */}
            <div>
              <label className="text-lg font-semibold text-gray-700 capitalize mb-1 block">
                Department
              </label>
              <Select
                options={departments.map((dep) => ({
                  value: dep._id,
                  label: `${dep.departmentId} ${dep.departmentName}`,
                }))}
                value={
                  departments.find((dep) => dep._id === formData.department)
                    ? {
                        value: formData.department,
                        label: departments.find(
                          (dep) => dep._id === formData.department
                        )?.departmentName,
                      }
                    : null
                }
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Department"
                isDisabled={true} // Department auto-filled
              />
            </div>
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-700 capitalize mb-1 block">
              Message
            </label>
            <textarea
              name="message"
              placeholder="Write your message here"
              value={formData.message}
              onChange={handleChange}
              className="p-2 border rounded w-full h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="max-w-sm w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddMessage;
