import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLeaveById, updateLeave } from "../../utils/LeaveHelper.jsx";
import Footer from "../HeaderFooter/Footer.jsx";
import Header from "../HeaderFooter/Header.jsx";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/authContext.jsx";

const EditLeave = () => {
  const { user } = useAuth();
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
    appliedTo: [],
  };

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
  const [employees, setEmployees] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        const leadEmployees = response.data.employees.filter(
          (employee) =>
            employee.role === "Lead" && employee.userId?._id !== user._id
        );

        const sortedEmployees = leadEmployees.sort(
          (a, b) => a.employeeId - b.employeeId
        );

        const employeeOptions = sortedEmployees.map((employee) => ({
          value: employee._id,
          label: `${employee.employeeId} - ${employee.name}`,
        }));

        setEmployees(employeeOptions);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to load employees.");
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchpayload = async () => {
      try {
        const data = await getLeaveById(_id);
        setFormData({
          startDate: new Date(data.startDate).toISOString().split("T")[0],
          startTime: data.startTime,
          endDate: new Date(data.endDate).toISOString().split("T")[0],
          endTime: data.endTime,
          reason: data.reason,
          leaveType: data.type,
          days: data.days,
          appliedTo: data.appliedTo.map((approver) => ({
            value: approver._id,
            label: `${approver.employeeId} - ${approver.name}`,
          })),
        });
      } catch (err) {
        console.error("Error fetching leave data:", err);
        toast.error("Failed to fetch leave data.");
      }
    };

    fetchpayload();
  }, [_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleApproverChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      appliedTo: selectedOptions || [],
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
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("startDate", formData.startDate);
      payload.append("startTime", formData.startTime);

      payload.append("endDate", formData.endDate);
      payload.append("endTime", formData.endTime);

      payload.append("reason", formData.reason);
      payload.append("leaveType", formData.leaveType);
      payload.append("days", formData.days);

      // Append approvers as array
      payload.append(
        "appliedTo", 
        JSON.stringify(formData.appliedTo.map((approver) => approver.value))
      );

      // Append file if selected
      if (formData.attachment) {
        payload.append("attachment", formData.attachment);
      }

      await updateLeave(_id, payload);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    setFormData((prevData) => ({
      ...prevData,
      attachment: file,
    }));
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
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Approvers</label>
            <Select
              isMulti
              options={employees}
              value={formData.appliedTo}
              onChange={handleApproverChange}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Select approvers..."
            />
          </div>
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
