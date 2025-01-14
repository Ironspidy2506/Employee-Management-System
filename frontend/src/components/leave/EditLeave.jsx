import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLeaveById, updateLeave } from "../../utils/LeaveHelper.jsx"; // Adjust import according to your actual API helpers
import Footer from "../HeaderFooter/Footer.jsx";
import Header from "../HeaderFooter/Header.jsx";

const EditLeave = () => {
  const { _id } = useParams(); // Get the leave ID from the route parameters
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const data = await getLeaveById(_id);
        setFormData({
          startDate: new Date(data.startDate).toISOString().split("T")[0],
          startTime: data.startTime,
          endDate: new Date(data.endDate).toISOString().split("T")[0],
          endTime: data.endTime,
          reason: data.reason,
          leaveType: data.leaveType,
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
  }, []);

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
    try {
      await updateLeave(_id, formData);
      navigate("/employee-dashboard/leave");
    } catch (err) {
      console.error("Error updating leave:", err);
      setError("Failed to update leave. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state while data is being fetched
  }

  if (error) {
    return <div className="text-red-600">{error}</div>; // Display error message if any
  }

  return (
    <>
    <Header/>
    
      <div className="mt-5 max-w-auto mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Leave</h2>
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
            Update Leave
          </button>
        </form>
      </div>

      <Footer/>
    </>
  );
};

export default EditLeave;
