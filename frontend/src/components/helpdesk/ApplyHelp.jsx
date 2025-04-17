import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/authContext.jsx";
import Header from "../HeaderFooter/Header.jsx";
import Footer from "../HeaderFooter/Footer.jsx";
import { useNavigate } from "react-router-dom";

const ApplyHelp = () => {
  const [employeeId, setEmployeeId] = useState(null);
  const [query, setQuery] = useState("");
  const { user } = useAuth();
  const _id = user._id;
  const navigate = useNavigate();

  // Fetch employeeId from backend
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const { data } = await axios.get(
          `https://korus-employee-management-system-mern-stack.vercel.app/api/employees/summary/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.success) {
          setEmployeeId(data.employee.employeeId);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    };

    fetchEmployeeId();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(
        `https://korus-employee-management-system-mern-stack.vercel.app/api/helpdesk/apply-help`,
        {
          _id,
          query,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          navigate(`/employee-dashboard/helpdesk`);
        }, 800);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }

    setQuery("");
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl text-center font-bold text-gray-800 mb-4">
          Apply for Help
        </h2>

        {/* Employee ID Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Employee ID
          </label>
          <input
            type="text"
            value={employeeId}
            disabled
            className="w-full px-4 py-2 mt-2 border rounded-md shadow-sm text-gray-700 bg-gray-100"
          />
        </div>

        {/* Textarea for Writing Query */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Write Your Query
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-md shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-500 transition-all"
            rows="4"
            placeholder="Type your query here..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all"
          >
            Submit Query
          </button>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ApplyHelp;
