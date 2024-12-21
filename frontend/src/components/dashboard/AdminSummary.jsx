import React, { useState, useEffect } from "react";
import SummaryCard from "./SummaryCard.jsx";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import axios from "axios"; // Import axios to make API requests

const AdminSummary = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [leaveApplied, setLeaveApplied] = useState(0);
  const [leaveApproved, setLeaveApproved] = useState(0);
  const [leavePending, setLeavePending] = useState(0);
  const [leaveRejected, setLeaveRejected] = useState(0);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        // Create an array of promises for concurrent requests
        const [employeeResponse, departmentResponse, leaveResponse] =
          await Promise.all([
            axios.get("https://employee-management-system-backend-objq.onrender.com/api/employees", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
            axios.get("https://employee-management-system-backend-objq.onrender.com/api/department", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
            axios.get("https://employee-management-system-backend-objq.onrender.com/api/leaves/fetch/summary", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
          ]);

        if (employeeResponse.data.success) {
          setEmployeeCount(employeeResponse.data.employees.length);
        }

        if (departmentResponse.data.success) {
          setDepartmentCount(departmentResponse.data.departments.length);
        }

        if (leaveResponse.data.success) {
          setLeaveApplied(leaveResponse.data.leaveApplied);
          setLeaveApproved(leaveResponse.data.leaveApproved);
          setLeavePending(leaveResponse.data.leavePending);
          setLeaveRejected(leaveResponse.data.leaveRejected);
        }
      } catch (error) {
        console.error("Error fetching summary data:", error);
      }
    };

    fetchSummaryData();
  }, []);

  return (
    <div className="p-6 space-y-12">
      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            icon={<FaUsers />}
            text={"Total Employees"}
            number={employeeCount}
          />
          <SummaryCard
            icon={<FaBuilding />}
            text={"Total Departments"}
            number={departmentCount}
          />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Leave Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            icon={<FaFileAlt />}
            text={"Leave Applied"}
            number={leaveApplied}
          />
          <SummaryCard
            icon={<FaCheckCircle />}
            text={"Leave Approved"}
            number={leaveApproved}
          />
          <SummaryCard
            icon={<FaHourglassHalf />}
            text={"Leave Pending"}
            number={leavePending}
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            text={"Leave Rejected"}
            number={leaveRejected}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
