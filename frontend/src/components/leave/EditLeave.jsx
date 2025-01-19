import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLeaveById, updateLeave } from "../../utils/LeaveHelper.jsx";
import Footer from "../HeaderFooter/Footer.jsx";
import Header from "../HeaderFooter/Header.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditLeave = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const initialFormData = {
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    reason: "",
    leaveType: "el",
    days: 0,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const data = await getLeaveById(_id);
        console.log(data);

        setFormData({
          startDate: new Date(data.startDate).toISOString().split("T")[0],
          startTime: data.startTime,
          endDate: new Date(data.endDate).toISOString().split("T")[0],
          endTime: data.endTime,
          reason: data.reason,
          leaveType: data.type,
          days: data.days,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leave data:", err);
        setError("Failed to fetch leave data.");
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, [_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    setIsSubmitting(true);

    console.log(formData);

    try {
      await updateLeave(_id, formData);
      toast.success("Leave updated successfully!");
      setTimeout(() => {
        navigate("/employee-dashboard/leave");
      }, 800);
    } catch (err) {
      console.error("Error updating leave:", err);
      toast.error("Failed to update leave. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />

      <div className="mt-5 max-w-auto mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl text-gray-700 font-bold text-center mb-6">
          Edit Leave Application
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full md:w-1/5 py-2 px-4 rounded-md text-white ${
                isSubmitting ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Leave"}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default EditLeave;
