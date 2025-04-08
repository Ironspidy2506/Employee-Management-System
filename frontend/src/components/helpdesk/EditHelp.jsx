import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../HeaderFooter/Header";
import Footer from "../HeaderFooter/Footer";

const EditHelp = () => {
  const { _id } = useParams();
  const [query, setQuery] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHelpQuery = async () => {
      try {
        const response = await axios.get(
          `https://korus-ems-backend.onrender.com/api/helpdesk/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setEmployeeId(response.data.employeehelpdata.employeeId.employeeId);
          setQuery(response.data.employeehelpdata.query);
        }
      } catch (err) {
        toast.error("Error fetching the help query.");
      }
    };

    fetchHelpQuery();
  }, [_id]);

  // Handle form submission to update the query
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `https://korus-ems-backend.onrender.com/api/helpdesk/update-help/${_id}`,
        { query },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/employee-dashboard/helpdesk");
        }, 800);
      } else {
        toast.error("Error updating the help query.");
      }
    } catch (err) {
      toast.error("Error updating the help query.");
    }
  };


  return (
    <>
      <Header />
      <ToastContainer />
      <div className="p-6 max-w-5xl mx-auto bg-white rounded-md shadow-md">
        <h2 className="text-xl text-center font-bold text-gray-800 mb-6">
          Edit Help Query
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium my-2">
            Employee Id
          </label>
          <input
            value={employeeId}
            className="w-full px-4 py-2 border rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-500 transition-all"
            readOnly
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium my-2">Query</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows="6"
            className="w-full px-4 py-2 border rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-blue-0 focus:border-blue-500 transition-all"
            placeholder="Edit your help query..."
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Update Query
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditHelp;
