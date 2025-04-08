import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ViewDepartment = () => {
  const { _id } = useParams(); // Assuming departmentId is passed in the URL
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate();

  // Fetch employees by department
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `https://korus-ems-backend.onrender.com/api/employees/department/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Sort employees by employeeId (ascending order)
        const sortedEmployees = response.data.employees.sort(
          (a, b) => a.employeeId - b.employeeId
        );

        setEmployees(sortedEmployees);
        setFilteredEmployees(sortedEmployees); // Initialize with sorted employees
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [_id]);

  // Function to handle search and filter employees
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = employees.filter((employee) => {
      return employee.employeeId.toString().includes(query);
    });

    setFilteredEmployees(filtered);
  };

  // Function to format date
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0"); // Ensure two digits
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="p-6 space-y-6 bg-white">
      {/* Table Section */}
      <div className="overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">Employee List</h2>
        <div className="mb-4 flex justify-between items-center rounded-sm p-1">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search by Employee ID"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th className="px-5 py-3 text-center text-base font-medium text-gray-700">
                Employee ID
              </th>
              <th className="px-5 py-3 text-left text-base font-medium text-gray-700">
                Name
              </th>
              <th className="px-5 py-3 text-center text-base font-medium text-gray-700">
                Designation
              </th>
              <th className="px-5 py-3 text-center text-base font-medium text-gray-700">
                Email
              </th>
              <th className="px-5 py-3 text-center text-base font-medium text-gray-700">
                Date of Birth
              </th>
              <th className="px-5 py-3 text-center text-base font-medium text-gray-700">
                Gender
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee._id} className="border-b hover:bg-gray-50">
                <td className="px-5 py-2 lg:py-4 text-center text-base text-gray-800">
                  {employee.employeeId}
                </td>
                <td className="px-5 py-2 lg:py-4 text-base text-gray-800">
                  {employee.name}
                </td>
                <td className="px-5 py-2 lg:py-4 text-center text-base text-gray-800">
                  {employee.designation}
                </td>
                <td className="px-5 py-2 lg:py-4 text-center text-base text-gray-800">
                  {employee.email}
                </td>
                <td className="px-5 py-2 lg:py-4 text-center text-base text-gray-800">
                  {formatDate(employee.dob)}
                </td>
                <td className="px-5 py-2 lg:py-4 text-center text-base text-gray-800">
                  {employee.gender}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewDepartment;
