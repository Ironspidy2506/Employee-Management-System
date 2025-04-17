import React, { useState, useEffect } from "react";
import SummaryCard from "./SummaryCard.jsx";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaTimesCircle,
  FaUsers,
  FaUsersSlash,
} from "react-icons/fa";
import axios from "axios"; // Import axios to make API requests

const AdminSummary = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [employeeExitCount, setEmployeeExitCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [leaveApplied, setLeaveApplied] = useState(0);
  const [leaveApproved, setLeaveApproved] = useState(0);
  const [leavePending, setLeavePending] = useState(0);
  const [leaveRejected, setLeaveRejected] = useState(0);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        // Create an array of promises for concurrent requests
        const [employeeResponse, departmentResponse, leaveResponse] =
          await Promise.all([
            axios.get("https://korus-employee-management-system-mern-stack.vercel.app/api/employees", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
            axios.get("https://korus-employee-management-system-mern-stack.vercel.app/api/department", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
            axios.get("https://korus-employee-management-system-mern-stack.vercel.app/api/leaves/fetch/summary", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }),
          ]);

        if (employeeResponse.data.success) {
          // Process upcoming birthdays
          const employees = employeeResponse.data.employees;

          const activeEmployees = employees.filter(
            (emp) => emp.dol === undefined
          );

          // Set the count
          setEmployeeCount(activeEmployees.length);

          // Filter exited employees (those with a valid dol)
          const exitedEmployees = employees.filter((emp) => {
            if (!emp.dol) return false;
            const dol = new Date(emp.dol);
            return !isNaN(dol.getTime());
          });
          setEmployeeExitCount(exitedEmployees.length);

          const today = new Date();
          const upcoming = employees
            .map((employee) => {
              const dob = new Date(employee.dob);
              const birthdayThisYear = new Date(
                today.getFullYear(),
                dob.getMonth(),
                dob.getDate()
              );

              // Handle cases where the birthday is today or upcoming
              const isToday =
                birthdayThisYear.getDate() === today.getDate() &&
                birthdayThisYear.getMonth() === today.getMonth();

              const isUpcoming = birthdayThisYear >= today;

              if (isToday || isUpcoming) {
                return {
                  name: employee.name,
                  employeeId: employee.employeeId,
                  dob: birthdayThisYear,
                  isToday,
                };
              }

              return null; // Exclude past birthdays
            })
            .filter((entry) => entry !== null)
            .sort((a, b) => a.dob - b.dob) // Sort by date
            .slice(0, 5); // Limit to top 5 results

          setUpcomingBirthdays(upcoming);
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
            icon={<FaUsersSlash />}
            text={"Employees Exited"}
            number={employeeExitCount}
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

      {/* Alerts Section */}
      <div>
        <h3 className="text-2xl font-bold mb-8 text-gray-800">Alerts</h3>

        <div className="space-y-8">
          <h4 className="text-xl font-bold text-indigo-600">
            🎉 Upcoming Birthdays
          </h4>

          {upcomingBirthdays.length > 0 ? (
            <div className="flex flex-col gap-6">
              {upcomingBirthdays.map((employee, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
                    employee.isToday
                      ? "bg-gradient-to-r from-green-300 via-green-300 to-green-200 text-green-900"
                      : "bg-gradient-to-r from-gray-200 via-gray-100 to-white text-gray-800"
                  }`}
                >
                  {/* Left Section: Cake Icon or Circle */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full shadow-md">
                      {employee.isToday ? (
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 shadow-md text-2xl">
                          🎂
                        </div>
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 shadow-md text-2xl">
                          🎂
                        </div>
                      )}
                    </div>

                    {/* Employee Name */}
                    <div className="flex items-center gap-4">
                      {/* Employee ID */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white shadow-md">
                        <p className="text-lg font-bold">
                          {employee.employeeId}
                        </p>
                      </div>

                      {/* Employee Name */}
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-800">
                          {employee.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Date of Birth */}
                  <div className="flex flex-col items-end text-right">
                    <p className="text-base font-medium">
                      {new Date(employee.dob).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    {employee.isToday && (
                      <p className="mt-1 text-green-800 font-semibold text-sm">
                        🎉 (Today!)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">No upcoming birthdays.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
