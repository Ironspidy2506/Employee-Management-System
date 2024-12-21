import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../HeaderFooter/Header";
import Footer from "../HeaderFooter/Footer";

const ApplyLeave = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startDate: "",
    startTime: "", // Time for start date
    endDate: "",
    endTime: "", // Time for end date
    reason: "",
    leaveType: "el", // Default leave type
    days: 0, // Calculated number of days
  });

  // Update state for form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate the number of days dynamically
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime || "00:00"}`
      );
      const endDateTime = new Date(
        `${formData.endDate}T${formData.endTime || "23:59"}`
      );

      let totalMilliseconds = endDateTime - startDateTime;
      let totalDays = totalMilliseconds / (1000 * 60 * 60 * 24);

      if (totalDays % 1 > 0.5) {
        totalDays = Math.ceil(totalDays); // Round up
      } else if (totalDays % 1 > 0 && totalDays % 1 <= 0.5) {
        totalDays = Math.floor(totalDays) + 0.5; // Round down to .5
      }

      totalDays = Math.max(totalDays, 0); // Ensure no negative values
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
    const userId = user._id; // You can replace this with the actual employee ID from the session or authentication context

    // Prepare the leave request data
    const leaveData = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      leaveType: formData.leaveType,
      days: formData.days,
    };

    try {
      // Send the data to the backend API
      const response = await axios.post(
        `https://employee-management-system-backend-objq.onrender.com/api/leaves/apply/${userId}`,
        leaveData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data) {
        navigate("/employee-dashboard/leave");
      } else {
        // Error: Display the error message from the backend
        console.error("Error applying leave:", data.message);
        alert(data.message || "There was an error applying for leave.");
      }
    } catch (error) {
      console.error("Error submitting leave:", error);
      alert("There was an error submitting your leave request.");
    }
  };

  return (
    <div className="mt-5 max-w-auto mx-auto p-6 bg-white shadow-md rounded-md">
      <Header />

      <h2 className="text-2xl md:text-2xl font-semibold text-gray-700 text-center mb-5">
        Leave Application Form
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="mb-4 lg:w-1/2">
            <label className="block text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 lg:w-1/2">
            <label className="block text-gray-700 mb-2">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="mb-4 lg:w-1/2">
            <label className="block text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4 lg:w-1/2">
            <label className="block text-gray-700 mb-2">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            rows="3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Leave Type</label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="el">Earned Leave (EL)</option>
            <option value="sl">Sick Leave (SL)</option>
            <option value="cl">Casual Leave (CL)</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Number of Days</label>
          <input
            type="number"
            value={formData.days}
            readOnly
            className="w-full px-3 py-2 border bg-gray-100 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Submit Leave
        </button>
      </form>

      <Footer />
    </div>
  );
};

export default ApplyLeave;
