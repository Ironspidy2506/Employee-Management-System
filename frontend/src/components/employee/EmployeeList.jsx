import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { EmployeeButtons } from "../../utils/EmployeeHelper";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const onEmployeeDelete = async (_id) => {
    const data = employees.filter((emp) => emp._id !== _id);
    setFilteredEmployees(data);
  };

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
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
          let sno = 1;
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            employeeId: emp.employeeId,
            name: emp.name,
            dob: new Date(emp.dob).toLocaleDateString(),
            department: emp.department.departmentName,
            profileImage: emp.userId?.profileImage || "N/A",
          }));

          setEmployees(data);
          setFilteredEmployees(data);
        }
      } catch (error) {
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        }
      } finally {
        setEmpLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees by employeeId
  const handleFilter = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const records = employees.filter((emp) =>
      emp.employeeId.toString().toLowerCase().includes(searchValue)
    );
    setFilteredEmployees(records);
  };

  // Format date
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <>
      {empLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="p-6 space-y-6">
          <div className="bg-white shadow-md rounded-md p-4">
            <h3 className="text-xl font-bold text-gray-800">
              Manage Employees
            </h3>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 shadow-md p-5 rounded-md">
            <input
              type="search"
              placeholder="Search Employee By Id"
              onChange={handleFilter}
              className="w-full md:w-auto flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Link
              to="/admin-dashboard/add-employee"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
              Add New Employee
            </Link>
          </div>

          <table className="w-full mt-6 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">S.No.</th>
                <th className="border border-gray-300 px-4 py-2">
                  Profile Image
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Employee ID
                </th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">
                  Date of Birth
                </th>
                <th className="border border-gray-300 px-4 py-2">Department</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp._id} className="odd:bg-white even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {emp.sno}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <img
                      src={`https://employee-management-system-backend-objq.onrender.com/${emp.profileImage}`}
                      alt="Employee"
                      className="w-10 h-10 rounded-full object-cover mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {emp.employeeId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {emp.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {formatDate(emp.dob)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {emp.department}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center flex justify-center">
                    <EmployeeButtons
                      _id={emp._id}
                      onEmployeeDelete={onEmployeeDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default EmployeeList;
