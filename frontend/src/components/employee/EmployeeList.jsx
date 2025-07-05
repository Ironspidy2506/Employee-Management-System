import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { EmployeeButtons } from "../../utils/EmployeeHelper";
import { useAuth } from "../../context/authContext";

const EmployeeList = () => {
  const { user } = useAuth();
  const printRef = useRef();
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting in ascending order

  const handlePrint = () => {
    const originalContents = document.body.innerHTML;
    const printContents = printRef.current.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload to restore interactivity
  };

  const onEmployeeDelete = async (_id) => {
    const data = employees.filter((emp) => emp._id !== _id);
    const updatedData = updateSerialNumbers(data);
    setFilteredEmployees(updatedData);
    setEmployees(updatedData);
  };

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get(
          "https://korus-employee-management-system-mern-stack.vercel.app/api/employees",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          const data = response.data.employees
            .filter((emp) => emp.dol === undefined) // Filter active employees only
            .map((emp) => ({
              _id: emp._id,
              employeeId: emp.employeeId,
              name: emp.name,
              dob: new Date(emp.dob).toLocaleDateString(),
              department: emp.department?.departmentName,
              contactNo: emp.contactNo,
            }));

          const sortedData = sortEmployees(data);
          const updatedData = updateSerialNumbers(sortedData);

          setEmployees(updatedData);
          setFilteredEmployees(updatedData);
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

  // Sort employees by employeeId and toggle between ascending and descending order
  const sortEmployees = (data) => {
    return [...data].sort((a, b) => {
      if (a.employeeId < b.employeeId) return sortOrder === "asc" ? -1 : 1;
      if (a.employeeId > b.employeeId) return sortOrder === "asc" ? 1 : -1;
      return 0; // Keep order unchanged for equal IDs
    });
  };

  // Update serial numbers (sno) based on current order
  const updateSerialNumbers = (data) => {
    return data.map((emp, index) => ({
      ...emp,
      sno: index + 1, // Assign serial number based on the index
    }));
  };

  // Handle search filter by employeeId
  const handleFilter = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const records = employees.filter(
      (emp) =>
        emp.employeeId.toString().toLowerCase().includes(searchValue) ||
        emp.name.toLowerCase().includes(searchValue)
    );
    const updatedData = updateSerialNumbers(records);
    setFilteredEmployees(updatedData);
  };

  // Toggle sort order when Employee ID header is clicked
  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sortedData = sortEmployees(filteredEmployees);
    const updatedData = updateSerialNumbers(sortedData);
    setFilteredEmployees(updatedData);
  };

  // Format date

  return (
    <>
      {empLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="p-4 space-y-6">
          <div className="bg-white shadow-md rounded-md p-4">
            <h3 className="text-xl font-bold text-gray-800">
              Manage Employees
            </h3>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 shadow-md p-5 rounded-md">
            <input
              type="search"
              placeholder="Search Employee By Id or Name"
              onChange={handleFilter}
              className="w-full md:w-auto flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Link
              to={`/${user.role}-dashboard/add-employee`}
              className="px-4 py-2 bg-blue-500 text-lg text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
              Add New Employee
            </Link>
            <Link
              to={`/${user.role}-dashboard/employees/exited-employees`}
              className="px-4 py-2 bg-rose-500 text-lg text-white rounded-md hover:bg-rose-600 transition duration-300"
            >
              Exited Employees
            </Link>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-500 text-lg text-white rounded-md hover:bg-green-600 transition duration-300"
            >
              Print List
            </button>
          </div>

          <div ref={printRef}>
            <table className="w-full mt-6 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-2 py-1 text-base">
                    S.No.
                  </th>
                  <th
                    className="border border-gray-300 px-2 py-1 text-base cursor-pointer"
                    onClick={handleSort}
                  >
                    Employee ID
                  </th>
                  <th className="border border-gray-300 px-2 py-1 text-base">
                    Name
                  </th>
                  <th className="border border-gray-300 px-2 py-1 text-base">
                    Date of Birth
                  </th>
                  <th className="border border-gray-300 px-2 py-1 text-base">
                    Department
                  </th>
                  <th className="border border-gray-300 px-2 py-1 text-base">
                    Contact No.
                  </th>
                  <th className="border border-gray-300 px-2 py-1 text-base print:hidden">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 text-base text-center">
                      {emp.sno}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-base text-center">
                      {emp.employeeId}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-base">
                      {emp.name}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-base text-center">
                      {formatDate(emp.dob)}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-base text-center">
                      {emp.department}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-base text-center">
                      {emp.contactNo}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 text-base text-center flex justify-center print:hidden">
                      <EmployeeButtons
                        _id={emp._id}
                        onEmployeeDelete={onEmployeeDelete}
                        user={user}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeList;
