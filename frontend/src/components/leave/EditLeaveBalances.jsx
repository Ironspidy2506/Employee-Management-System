import React, { useState } from "react";
import axios from "axios";
import Header from "../HeaderFooter/Header.jsx";
import Footer from "../HeaderFooter/Footer.jsx";

const EditLeaveBalances = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFetchEmployee = async () => {
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.get(
        `https://employee-management-system-backend-objq.onrender.com/api/employees/allowances/summary/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setEmployeeData(response.data.employee);
      }
    } catch (err) {
      setEmployeeData(null);
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Error fetching employee data.");
      }
    }
  };

  const handleUpdateLeaveBalance = async () => {
    setError(null);
    setSuccess(null);
    try {
      // Send the leave balance data (el, cl, sl) in the request body
      const response = await axios.put(
        `https://employee-management-system-backend-objq.onrender.com/api/employees/edit-leave-balance/${employeeId}`,
        {
          el: employeeData.leaveBalance.el, // Send the leave balance values individually
          cl: employeeData.leaveBalance.cl,
          sl: employeeData.leaveBalance.sl,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess("Leave balance updated successfully!");
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Error updating leave balance.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      leaveBalance: {
        ...prevData.leaveBalance,
        [name]: value,
      },
    }));
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl text-center font-bold text-gray-700 mb-6">
            Edit Employee Leave Balances
          </h2>

          {/* Employee ID Input */}
          <div className="mb-6">
            <label
              htmlFor="employeeId"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Employee ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                placeholder="Enter Employee ID"
              />
              <button
                onClick={handleFetchEmployee}
                className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 shadow-md transition-all"
              >
                Fetch
              </button>
            </div>
          </div>

          {/* Leave Balance Form */}
          {employeeData && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Employee Name
                </label>
                <p className="mt-1 text-gray-900 bg-gray-100 px-4 py-2 rounded-md">
                  {employeeData.name}
                </p>
              </div>

              {/* Earned Leave (EL) Input */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Earned Leave (EL)
                </label>
                <input
                  type="number"
                  name="el"
                  value={employeeData.leaveBalance.el}
                  onWheel={(e) => e.target.blur()}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                />
              </div>

              {/* Casual Leave (CL) Input */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Casual Leave (CL)
                </label>
                <input
                  type="number"
                  name="cl"
                  value={employeeData.leaveBalance.cl}
                  onWheel={(e) => e.target.blur()}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                />
              </div>

              {/* Sick Leave (SL) Input */}
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Sick Leave (SL)
                </label>
                <input
                  type="number"
                  name="sl"
                  value={employeeData.leaveBalance.sl}
                  onWheel={(e) => e.target.blur()}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                />
              </div>

              {/* Error/Success Messages */}
              {error && (
                <p className="text-red-600 text-center mb-4">{error}</p>
              )}
              {success && (
                <p className="text-green-600 text-center mb-4">{success}</p>
              )}

              {/* Update Button */}
              <button
                onClick={handleUpdateLeaveBalance}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 shadow-md transition-all"
              >
                Update Leave Balance
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditLeaveBalances;
