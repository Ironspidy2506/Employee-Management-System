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
          "http://localhost:5000/api/appraisals/view-all-appraisals",
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

  const handleEdit = (id) => {
    navigate(`/${user.role}-dashboard/appraisal/edit-appraisal/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/appraisals/delete-appraisal/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setAppraisals((prev) =>
          prev.filter((appraisal) => appraisal._id !== id)
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">All Appraisals</h2>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() =>
              navigate(`/${user.role}-dashboard/appraisal/add-appraisal`)
            }
          >
            <FaPlus /> Add Appraisal
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <tr>
                <th className="px-6 py-3 text-center text-sm font-semibold tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold tracking-wider">
                  Banner ID
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold tracking-wider">
                  Total Rating
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appraisals.length > 0 ? (
                appraisals.map((appraisal) => (
                  <tr
                    key={appraisal._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-center text-gray-800 font-medium">
                      {appraisal.employeeId?.employeeId}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-800 font-medium">
                      {appraisal.employeeId?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                      {appraisal.department?.departmentName}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-700">
                      {appraisal.bannerId}
                    </td>
                    <td className="px-6 py-4 font-semibold text-center text-blue-600 text-sm">
                      {appraisal.totalRating}/100
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                          onClick={() =>
                            navigate(
                              `/${user.role}-dashboard/appraisal/view-appraisal/${appraisal._id}`
                            )
                          }
                        >
                          <FaEye />
                        </button>
                        <button
                          className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
                          onClick={() => handleEdit(appraisal._id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                          onClick={() => handleDelete(appraisal._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center px-6 py-4 text-gray-500"
                  >
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
