import React, { useState } from "react";
import axios from "axios";
import Header from "../HeaderFooter/Header.jsx";
import Footer from "../HeaderFooter/Footer.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OnboardingOffboarding = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState(null);

  const handleFetchEmployee = async () => {
    if (!localStorage.getItem("token")) {
      toast.error("Authentication token is missing.");
      return;
    }

    try {
      const response = await axios.get(
        `https://korus-ems-backend.onrender.com/api/employees/allowances/summary/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setEmployeeData(response.data.employee);
        toast.success("Employee data fetched successfully!");
      }
    } catch (err) {
      setEmployeeData(null);
      toast.error(err.response?.data?.error || "Error fetching employee data.");
    }
  };

  const handleUpdateJourney = async () => {
    if (!localStorage.getItem("token")) {
      toast.error("Authentication token is missing.");
      return;
    }

    try {
      const response = await axios.put(
        `https://korus-ems-backend.onrender.com/api/employees/update-journey/${employeeId}`,
        {
          doj: employeeData.doj,
          dol: employeeData.dol,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Details updated successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Error updating details.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl text-center font-bold text-gray-700 mb-6">
            Onboarding & Offboarding Status
          </h2>

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
                className="flex-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                placeholder="Enter Employee ID"
              />
              <button
                onClick={handleFetchEmployee}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 shadow-md transition-all"
              >
                Fetch
              </button>
            </div>
          </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Date of Joining
                </label>
                <input
                  type="date"
                  name="doj"
                  value={employeeData?.doj?.split("T")[0] || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Date of Leaving
                </label>
                <input
                  type="date"
                  name="dol"
                  value={employeeData?.dol?.split("T")[0] || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                />
              </div>

              <button
                onClick={handleUpdateJourney}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 shadow-md transition-all"
              >
                Update Details
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OnboardingOffboarding;
