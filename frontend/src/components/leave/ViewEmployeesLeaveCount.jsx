import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewEmployeesLeaveCount = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting in ascending order
  const [searchQuery, setSearchQuery] = useState(""); // For search functionality

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "https://employee-management-system-backend-objq.onrender.com/api/employees",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            employeeId: emp.employeeId,
            name: emp.name,
            leaveBalance: emp.leaveBalance,
          }));

          const sortedData = sortEmployees(data, "employeeId");
          const updatedData = updateSerialNumbers(sortedData);

          setEmployees(updatedData);
          setFilteredEmployees(updatedData);
        }
      } catch (error) {
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          console.error("Error fetching employees:", error.message);
        }
      }
    };

    fetchEmployees();
  }, []);

  // Sort employees by a specific field
  const sortEmployees = (data, key) => {
    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return sortOrder === "asc" ? -1 : 1;
      if (a[key] > b[key]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Update serial numbers after sorting
  const updateSerialNumbers = (data) => {
    return data.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
    }));
  };

  // Handle sorting by column
  const handleSort = (key) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sortedData = sortEmployees([...filteredEmployees], key);
    const updatedData = updateSerialNumbers(sortedData);

    setFilteredEmployees(updatedData);
  };

  // Handle search functionality
  const handleSearch = (event) => {
    const query = event.target.value.trim(); // Trim to remove extra spaces
    setSearchQuery(query);

    // If the query is not empty, filter employees by employeeId
    const filteredData = query
      ? employees.filter((employee) =>
          employee.employeeId.toString().includes(query)
        )
      : employees; // Show all employees if query is empty

    const updatedData = updateSerialNumbers(filteredData);
    setFilteredEmployees(updatedData);
  };

  return (
    <div className="p-6 space-y-6 bg-white">
      {/* Table Section */}
      <div className="overflow-y-auto max-h-[525px]">
        {" "}
        {/* Set a max height for scrolling */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Employee Leave Count
        </h2>
        {/* Search Bar */}
        <div className="sticky z-0 mb-2 p-1">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by Employee ID"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b border-gray-300 sticky top-0 z-10">
            <tr>
              <th
                className="px-4 py-2 text-base text-center font-medium text-gray-700 border border-gray-300 cursor-pointer"
                onClick={() => handleSort("serialNumber")}
              >
                S. No.
              </th>
              <th
                className="px-4 py-2 text-base text-center font-medium text-gray-700 border border-gray-300 cursor-pointer"
                onClick={() => handleSort("employeeId")}
              >
                Emp ID
              </th>
              <th className="px-4 py-2 text-base text-center font-medium text-gray-700 border border-gray-300">
                Employee Name
              </th>
              <th className="px-4 py-2 text-base text-center font-medium text-gray-700 border border-gray-300">
                Earned Leave (EL)
              </th>
              <th className="px-4 py-2 text-base text-center font-medium text-gray-700 border border-gray-300">
                Casual Leave (CL)
              </th>
              <th className="px-4 py-2 text-base text-center font-medium text-gray-700 border border-gray-300">
                Sick Leave (SL)
              </th>
              <th className="px-4 py-2 text-base text-center font-medium text-gray-700 border border-gray-300">
                On Duty (OD)
              </th>
              <th className="px-4 py-2 text-base text-center font-medium text-gray-700 border border-gray-300">
                Leave without pay (LWP)
              </th>
              <th className="px-4 py-2 text-base text-center font-medium text-gray-700 border border-gray-300">
                Others
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((employee) => (
              <tr
                key={employee._id}
                className="border-b border-gray-300 hover:bg-gray-50"
              >
                <td className="px-4 py-2 text-base text-center text-gray-800 border border-gray-300">
                  {employee.serialNumber}
                </td>
                <td className="px-4 py-2 text-base text-center text-gray-800 border border-gray-300">
                  {employee.employeeId}
                </td>
                <td className="px-4 py-2 text-base text-left text-gray-800 border border-gray-300">
                  {employee.name}
                </td>
                <td className="px-4 py-2 text-base text-center text-gray-800 border border-gray-300">
                  {employee.leaveBalance?.el || 0}
                </td>
                <td className="px-4 py-2 text-base text-center text-gray-800 border border-gray-300">
                  {employee.leaveBalance?.cl || 0}
                </td>
                <td className="px-4 py-2 text-base text-center text-gray-800 border border-gray-300">
                  {employee.leaveBalance?.sl || 0}
                </td>
                <td className="px-4 py-2 text-base text-center text-gray-800 border border-gray-300">
                  {employee.leaveBalance?.od || 0}
                </td>
                <td className="px-4 py-2 text-base text-center text-gray-800 border border-gray-300">
                  {employee.leaveBalance?.lwp || 0}
                </td>
                <td className="px-4 py-2 text-base text-center text-gray-800 border border-gray-300">
                  {employee.leaveBalance?.others || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewEmployeesLeaveCount;
