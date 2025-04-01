import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/authContext";

const ViewAllAppraisal = () => {
  const { user } = useAuth();
  const [appraisals, setAppraisals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppraisals = async () => {
      try {
        const { data } = await axios.get(
          "https://employee-management-system-backend-objq.onrender.com/api/appraisal/view-all-appraisals",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.success) {
          setAppraisals(data.appraisals);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch appraisals");
      }
    };

    fetchAppraisals();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">All Appraisals</h2>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate(`/${user.role}-dashboard/add-appraisal`)}
          >
            <FaPlus /> Add Appraisal
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">Employee Name</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Banner ID</th>
                <th className="p-3 text-left">Total Rating</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appraisals.length > 0 ? (
                appraisals.map((appraisal) => (
                  <tr
                    key={appraisal._id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-3">{appraisal.employeeName}</td>
                    <td className="p-3">{appraisal.department}</td>
                    <td className="p-3">{appraisal.bannerId}</td>
                    <td className="p-3 font-semibold text-blue-600">
                      {appraisal.totalRating}/100
                    </td>
                    <td className="p-3 flex gap-2">
                      <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                        <FaEye />
                      </button>
                      <button className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                        <FaEdit />
                      </button>
                      <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-600">
                    No appraisals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewAllAppraisal;
