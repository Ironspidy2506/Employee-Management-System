import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../HeaderFooter/Footer";
import Header from "../HeaderFooter/Header";

const ViewEmployee = () => {
  const { _id } = useParams();
  const [employee, setEmployee] = useState(null); // Single employee object
  const [empLoading, setEmpLoading] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get(
          `https://employee-management-system-backend-objq.onrender.com/api/employees/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setEmployee(response.data.employee); // Assuming API returns a single employee object
        }
      } catch (error) {
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        }
      } finally {
        setEmpLoading(false);
      }
    };

    fetchEmployee();
  }, [_id]);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  if (empLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!employee) {
    return <div className="text-center mt-10">No Employee Found</div>;
  }

  return (
    <>
    <Header/>
    <div className="max-w-full mx-auto mt-16 bg-white shadow-lg rounded-2xl p-8">
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
                {new Date(employee.dob).toDateString()}
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
              <p className="text-sm text-gray-500">Designation</p>
              <p className="text-xl font-semibold text-gray-700">
                {employee.designation || "N/A"}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Department</p>
              <p className="text-xl font-semibold text-gray-700">
                {employee.department.departmentName || "N/A"}
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
                {employee.aadharNo || "N/A"}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">UAN</p>
              <p className="text-xl font-semibold text-gray-700">
                {employee.pan || "N/A"}
              </p>
            </div>

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

            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Date of Joining</p>
              <p className="text-xl font-semibold text-gray-700">
                {new Date(employee.doj).toDateString() || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer/>
    </>
  );
};

export default ViewEmployee;
