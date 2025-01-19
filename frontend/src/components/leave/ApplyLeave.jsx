import React, { useState, useEffect } from "react";
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Button state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
        totalDays = Math.ceil(totalDays);
      } else if (totalDays % 1 > 0 && totalDays % 1 <= 0.5) {
        totalDays = Math.floor(totalDays) + 0.5;
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

    if (isSubmitting) return; // Prevent duplicate submissions

    setIsSubmitting(true); // Disable the button
    const userId = user._id;

    const leaveData = {
      startDate: formData.startDate,
      startTime: formData.startTime,
      endDate: formData.endDate,
      endTime: formData.endTime,
      reason: formData.reason,
      leaveType: formData.leaveType,
      days: formData.days,
    };

    try {
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
        toast.success("Leave applied successfully");
        setTimeout(() => {
          navigate("/employee-dashboard/leave");
        }, 2000);
      } else {
        toast.error("There was an error applying for leave.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting leave:", error);
      toast.error("There was an error submitting your leave request.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-5 max-w-auto mx-auto p-6 bg-white shadow-md rounded-md">
      <Header />
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-5">
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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Reason</label>
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
          <label className="block text-gray-700 mb-2">Leave Type</label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            onChange={handleChange}
            className="w-full px-3 py-2 border bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            readOnly
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
