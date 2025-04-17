import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewPerformanceAdmin = () => {
  const [viewType, setViewType] = useState("monthly"); // "monthly" or "employee"
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [performances, setPerformances] = useState([]);
  const [search, setSearch] = useState("");

  const handleFetchData = async () => {
    try {
      setLoading(true);
      if (viewType === "monthly") {
        if (!month || !year) {
          toast.warn("Please select both month and year.");
          return;
        }

        const { data } = await axios.get(
          `https://korus-employee-management-system-mern-stack.vercel.app/api/performance/month-year-basis/${month}/${year}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.success) {
          setPerformances(data.performances);
          toast.success(`Data fetched for ${month}-${year}`);
        } else {
          toast.error(data.message);
        }
      } else if (viewType === "employee") {
        if (!employeeId) {
          toast.warn("Please enter an Employee ID.");
          return;
        }

        const empId = Number(employeeId.trim());
        const { data } = await axios.post(
          `https://korus-employee-management-system-mern-stack.vercel.app/api/performance/get-employee-performance`,
          { empId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log(data);

        if (data.success) {
          setPerformances(data.performances);
          toast.success(`Data fetched for Employee ID: ${employeeId}`);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPerformances = performances.filter((p) =>
    p.employeeId?.employeeId.toString().includes(search)
  );

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
          <h1 className="text-2xl font-extrabold text-gray-800 text-center mb-6">
            Performance Tracker
          </h1>

          {/* View Type Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Select View Type
            </label>
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Monthly and Yearly Basis</option>
              <option value="employee">Employee Basis</option>
            </select>
          </div>

          {/* Form for Monthly and Yearly Basis */}
          {viewType === "monthly" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col">
                  <label
                    htmlFor="month"
                    className="text-gray-700 font-medium mb-2"
                  >
                    Select Month
                  </label>
                  <select
                    id="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Month</option>
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="year"
                    className="text-gray-700 font-medium mb-2"
                  >
                    Select Year
                  </label>
                  <select
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Year</option>
                    {Array.from(
                      { length: 10 },
                      (_, i) => new Date().getFullYear() + i - 1
                    ).map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Form for Employee Basis */}
          {viewType === "employee" && (
            <div className="mb-6">
              <label htmlFor="employeeId" className="text-gray-700 font-medium">
                Enter Employee ID
              </label>
              <input
                id="employeeId"
                type="number"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                onWheel={(e) => e.target.blur()}
                className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Employee ID"
              />
            </div>
          )}

          {/* Fetch Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleFetchData}
              disabled={loading}
              className={`w-full md:w-1/3 px-4 py-2 rounded-lg text-white font-semibold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } transition`}
            >
              {loading ? "Fetching..." : "Fetch Data"}
            </button>
          </div>

          {/* Search Bar */}
          {viewType === "monthly" ? (
            <div className="flex justify-center mb-4">
              <input
                type="text"
                placeholder="Search by Employee ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <></>
          )}

          {/* Display Performance Data */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300 shadow-sm">
              <thead className="bg-blue-400 text-white">
                <tr>
                  <th className="border px-4 py-2 text-center">Employee ID</th>
                  <th className="border px-4 py-2 text-center">
                    Employee Name
                  </th>
                  <th className="border px-4 py-2 text-center">Month</th>
                  <th className="border px-4 py-2 text-center">Year</th>
                  <th className="border px-4 py-2 text-center">Project Name</th>
                  <th className="border px-4 py-2 text-center">
                    Project Title
                  </th>
                  <th className="border px-4 py-2 text-center">Drawing Type</th>
                  <th className="border px-4 py-2 text-center">
                    Drawings Released
                  </th>
                  <th className="border px-4 py-2 text-center">Drawings</th>
                </tr>
              </thead>
              <tbody>
                {filteredPerformances.length > 0 ? (
                  filteredPerformances.map((p, index) => (
                    <tr key={index} className={`hover:bg-gray-100 transition`}>
                      <td className="border text-center px-4 py-2">
                        {p.employeeId?.employeeId}
                      </td>
                      <td className="border text-center px-4 py-2">
                        {p.employeeId?.name}
                      </td>
                      <td className="border text-center px-4 py-2">
                        {p.month}
                      </td>
                      <td className="border text-center px-4 py-2">{p.year}</td>
                      <td className="border text-center px-4 py-2">
                        {p.projectName}
                      </td>
                      <td className="border text-center px-4 py-2">
                        {p.projectTitle}
                      </td>
                      <td className="border text-center px-4 py-2">
                        {p.drawingType}
                      </td>
                      <td className="border text-center px-4 py-2">
                        {p.drawingReleased}
                      </td>
                      <td className="border text-center px-4 py-2">
                        {p.drawings}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="border px-4 py-2 text-center text-gray-500"
                    >
                      No performance data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPerformanceAdmin;
