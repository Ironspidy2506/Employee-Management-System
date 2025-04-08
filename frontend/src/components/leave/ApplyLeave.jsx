import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../HeaderFooter/Header";
import Footer from "../HeaderFooter/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApplyLeave = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    reason: "",
    leaveType: "el",
    days: 0,
    appliedTo: [],
    attachment: null, // Add this field
  });

  const [employees, setEmployees] = useState([]); // To store the list of employees
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "https://korus-ems-backend.onrender.com/api/employees",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const leadEmployees = response.data.employees.filter(
          (employee) =>
            employee.role === "Lead" && employee.userId?._id !== user._id
        );

        setEmployees(leadEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to load employees.");
      }
    };

    fetchEmployees();
  }, [user._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      appliedTo: selectedOptions.map((option) => option.value),
    }));
  };

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime || "09:30"}`
      );
      const endDateTime = new Date(
        `${formData.endDate}T${formData.endTime || "18:00"}`
      );

      let totalDays =
        Math.floor((endDateTime - startDateTime) / (1000 * 60 * 60 * 24)) + 1;

      const startHour = startDateTime.getHours();
      const startMinutes = startDateTime.getMinutes();
      const endHour = endDateTime.getHours();
      const endMinutes = endDateTime.getMinutes();

      // Office working hours
      const officeStartMinutes = 9 * 60 + 30; // 9:30 AM
      const halfDayMinutes = 13 * 60 + 30; // 1:30 PM
      const officeEndMinutes = 18 * 60; // 6:00 PM

      const startTimeInMinutes = startHour * 60 + startMinutes;
      const endTimeInMinutes = endHour * 60 + endMinutes;

      if (formData.startDate === formData.endDate) {
        // Same-day leave
        if (endTimeInMinutes <= halfDayMinutes) {
          totalDays = 0.5; // Half-day leave
        } else {
          totalDays = 1; // Full-day leave
        }
      } else {
        // Multi-day leave calculation
        if (startTimeInMinutes > halfDayMinutes) {
          totalDays -= 0.5; // First day is half
        }
        if (endTimeInMinutes < halfDayMinutes) {
          totalDays -= 0.5; // Last day is half
        }
      }

      totalDays = Math.max(totalDays, 0);
      setFormData((prev) => ({ ...prev, days: totalDays }));
    }
  }, [
    formData.startDate,
    formData.endDate,
    formData.startTime,
    formData.endTime,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    const userId = user._id;

    const leaveData = new FormData();
    leaveData.append("startDate", formData.startDate);
    leaveData.append("startTime", formData.startTime);
    leaveData.append("endDate", formData.endDate);
    leaveData.append("endTime", formData.endTime);
    leaveData.append("reason", formData.reason);
    leaveData.append("leaveType", formData.leaveType);
    leaveData.append("days", formData.days);
    leaveData.append("appliedTo", JSON.stringify(formData.appliedTo)); // Convert array to string

    // Append file if it exists
    if (formData.attachment) {
      leaveData.append("attachment", formData.attachment);
    }

    try {
      const response = await axios.post(
        `https://korus-ems-backend.onrender.com/api/leaves/apply/${userId}`,
        leaveData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        toast.success("Leave applied successfully");
        setTimeout(() => {
          navigate("/employee-dashboard/leave");
        }, 2000);
      } else {
        toast.error(response.data.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting leave:", error);
      toast.error(error.response.data.message);
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    setFormData((prevData) => ({
      ...prevData,
      attachment: file,
    }));
  };

  return (
    <div className="mt-5 max-w-auto mx-auto p-6 bg-white shadow-md rounded-md">
      <Header />
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">
        Leave Application Form
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Applying To</label>
          <Select
            isMulti
            options={employees
              .sort((a, b) => a.employeeId - b.employeeId) // Simple numeric comparison
              .map((employee) => ({
                value: employee._id,
                label: `${employee.employeeId} - ${employee.name}`,
              }))}
            onChange={handleSelectChange}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select employees..."
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="mb-4 lg:w-1/2">
            <label className="block text-gray-800 mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4 lg:w-1/2">
            <label className="block text-gray-800 mb-2">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="mb-4 lg:w-1/2">
            <label className="block text-gray-800 mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4 lg:w-1/2">
            <label className="block text-gray-800 mb-2">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Leave Type</label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="el">Earned Leave (EL)</option>
            <option value="sl">Sick Leave (SL)</option>
            <option value="cl">Casual Leave (CL)</option>
            <option value="od">On Duty (OD)</option>
            <option value="lwp">Leave without pay (LWP)</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-800 mb-2">Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-800 mb-2">
            Attachments (If any) (Single File to be uploaded)
          </label>
          <input
            type="file"
            name="attachment"
            accept=".pdf,.doc,.docx,.jpg,.png" // Specify allowed file types if needed
            onChange={handleFileChange}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-800 mb-2">Number of Days</label>
          <input
            type="number"
            value={formData.days}
            onChange={(e) => {
              const newDays = parseFloat(e.target.value);
              setFormData((prev) => ({ ...prev, days: newDays }));
            }}
            onWheel={(e) => e.target.blur()}
            className="w-full px-3 py-2 border bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-full md:w-1/5 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              isSubmitting ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Leave"}
          </button>
        </div>
      </form>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default ApplyLeave;
