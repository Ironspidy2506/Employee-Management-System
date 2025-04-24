import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import Header from "../HeaderFooter/Header";
import Footer from "../HeaderFooter/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/authContext";

const EditMessage = () => {
  const { messageId } = useParams(); // 🔥 Get message ID from URL
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
    fetchMessage(); // 🔥 Fetch message for editing
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://korus-employee-management-system-mern-stack.vercel.app/api/employees", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmployees(response.data.employees);
    } catch (error) {
      toast.error("Failed to load employees.");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("https://korus-employee-management-system-mern-stack.vercel.app/api/department", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDepartments(response.data.departments);
    } catch (error) {
      toast.error("Failed to load departments.");
    }
  };

  const fetchMessage = async () => {
    try {
      const response = await axios.get(
        `https://korus-employee-management-system-mern-stack.vercel.app/api/message/get-message-by-id/${messageId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        const { employeeId, department, message } = response.data.data;
        setFormData({
          employeeId: employeeId?._id || "",
          department: department?._id || "",
          message: message || "",
        });
      } else {
        toast.error("Failed to load message data.");
      }
    } catch (error) {
      toast.error("Error fetching message data.");
    }
  };

  const handleEmployeeChange = (selectedOption) => {
    const selectedEmployee = employees.find(
      (emp) => emp._id === selectedOption.value
    );
    if (selectedEmployee) {
      setFormData({
        ...formData,
        employeeId: selectedEmployee._id,
        department: selectedEmployee.department?._id || "",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://korus-employee-management-system-mern-stack.vercel.app/api/message/edit-message/${messageId}`,
        { message: formData.message }, // ✅ only message sent
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success("Message updated successfully");
        setTimeout(() => {
          navigate(`/${user.role}-dashboard/messages`);
        }, 500);
      } else {
        toast.error(response.data.error || "Failed to update message");
      }
    } catch (error) {
      toast.error("Error updating message");
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Edit Message
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-lg font-semibold text-gray-700 mb-1 block">
                Employee
              </label>
              <Select
                options={employees.map((emp) => ({
                  value: emp._id,
                  label: `${emp.employeeId} - ${emp.name}`,
                }))}
                value={
                  employees.find((emp) => emp._id === formData.employeeId)
                    ? {
                        value: formData.employeeId,
                        label: `${
                          employees.find(
                            (emp) => emp._id === formData.employeeId
                          ).employeeId
                        } - ${
                          employees.find(
                            (emp) => emp._id === formData.employeeId
                          ).name
                        }`,
                      }
                    : null
                }
                isDisabled={true}
                onChange={handleEmployeeChange}
                placeholder="Select Employee"
              />
            </div>

            <div>
              <label className="text-lg font-semibold text-gray-700 mb-1 block">
                Department
              </label>
              <Select
                options={departments.map((dep) => ({
                  value: dep._id,
                  label: `${dep.departmentId} - ${dep.departmentName}`,
                }))}
                value={
                  departments.find((dep) => dep._id === formData.department)
                    ? {
                        value: formData.department,
                        label: `${
                          departments.find(
                            (dep) => dep._id === formData.department
                          ).departmentName
                        }`,
                      }
                    : null
                }
                isDisabled={true}
                placeholder="Select Department"
              />
            </div>
          </div>

          <div>
            <label className="text-lg font-semibold text-gray-700 mb-1 block">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="p-2 border rounded w-full h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your message"
            />
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="max-w-sm w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Update Message
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditMessage;
