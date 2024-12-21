import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext"; // Assuming you have an authentication context
import axios from "axios"; // Assuming you're using Axios to make API calls
import Header from "../HeaderFooter/Header";
import Footer from "../HeaderFooter/Footer";

const EmployeeSummary = () => {
  const { user } = useAuth(); // Get the logged-in user from context
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    // Fetch employee details from backend
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(
          `https://employee-management-system-backend-objq.onrender.com/api/employees/summary/${user._id}`, // Fetching employee data by logged-in user's ID
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setEmployee(response.data.employee);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [user]);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0"); // Ensure two digits
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!employee) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  return (
    <>
      <Header />
      <div className="w-fulll mx-auto bg-white shadow-lg rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-start gap-10">
          {/* Employee Photo */}
          <div className="flex-shrink-0">
            <img
              src={`https://employee-management-system-backend-objq.onrender.com/${employee.userId.profileImage}`}
              alt={`${employee.name}'s profile`}
              className="w-56 h-56 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />
          </div>

          {/* Employee Information */}
          <div className="flex-grow">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {employee.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="text-xl font-semibold text-gray-700">
                  {employee.employeeId}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-xl font-semibold text-gray-700">
                  {employee.email}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">DOB</p>
                <p className="text-xl font-semibold text-gray-700">
                  {formatDate(employee.dob)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-xl font-semibold text-gray-700">
                  {employee.gender || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Marital Status</p>
                <p className="text-xl font-semibold text-gray-700">
                  {employee.maritalStatus || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Department ID</p>
                <p className="text-xl font-semibold text-gray-700">
                  {employee.department.departmentId || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Department Name</p>
                <p className="text-xl font-semibold text-gray-700">
                  {employee.department.departmentName || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Designation</p>
                <p className="text-xl font-semibold text-gray-700">
                  {employee.designation || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-xl font-semibold text-gray-700">
                  {capitalizeFirstLetter(employee.role) || "N/A"}
                </p>
              </div>

              {/* New Fields */}
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">UAN</p>
                <p className="text-xl font-semibold text-gray-700">
                  {employee.uan || "N/A"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">PF No.</p>
                <p className="text-xl font-semibold text-gray-700">
                  {employee.pfNo || "N/A"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">ESI No.</p>
                <p className="text-xl font-semibold text-gray-700">
                  {employee.esiNo || "N/A"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Bank</p>
                <p className="text-xl font-semibold text-gray-700">
                  {employee.bank || "N/A"}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Account No.</p>
                <p className="text-xl font-semibold text-gray-700">
                  {employee.accountNo || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EmployeeSummary;
