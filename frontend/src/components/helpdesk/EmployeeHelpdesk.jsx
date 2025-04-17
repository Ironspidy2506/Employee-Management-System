import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeHelpdesk = () => {
  const [queries, setQueries] = useState([]); // Store the list of queries
  const navigate = useNavigate();
  const { user } = useAuth();
  const _id = user._id;

  // Fetch the queries when the component mounts
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const { data } = await axios.get(
          `https://korus-employee-management-system-mern-stack.vercel.app/api/helpdesk/my-queries/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
            },
          }
        );

        if (data.success) {
          setQueries(data.employeehelps);
        }
      } catch (error) {
        console.error("Error fetching queries:", error);
      }
    };

    fetchQueries();
  }, []);

  const handleAskForHelp = () => {
    navigate("/employee-dashboard/helpdesk/apply-help");
  };

  const handleEdit = (helpId) => {
    navigate(`/employee-dashboard/helpdesk/edit-help/${helpId}`);
  };

  const handleDelete = async (helpId) => {
    try {
      const { data } = await axios.delete(
        `https://korus-employee-management-system-mern-stack.vercel.app/api/helpdesk/delete-help/${helpId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);

        // Update the state dynamically
        setQueries(
          (prevQueries) => prevQueries.filter((query) => query._id !== helpId) // Correctly filter out the deleted query
        );
      } else {
        toast.error(data.message || "Failed to delete the query.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the query.");
    }
  };

  const formatDateTime = (dateTime) => {
    const dateObj = new Date(dateTime);

    // Format date
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();

    // Format time
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert to 12-hour format

    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  return (
    <>
      <ToastContainer />
      <div className="max-w-full max-h-screen mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Employee Helpdesk Queries
        </h2>

        <button
          onClick={handleAskForHelp}
          className="mb-6 py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Ask for Help
        </button>

        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700">
                Help ID
              </th>
              <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700">
                Query
              </th>
              <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700">
                Response
              </th>
              <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {queries.length > 0 ? (
              queries.map((query) => (
                <tr key={query.helpId} className="border-b border-gray-200">
                  <td className="py-3 px-6 text-center text-sm text-gray-800">
                    {query.helpId}
                  </td>
                  <td className="py-3 px-6 text-center text-sm text-gray-800">
                    {formatDateTime(query.date) || ""}
                  </td>
                  <td className="py-3 px-6 text-justify text-sm text-gray-800">
                    {query.query}
                  </td>
                  <td className="py-3 px-6 text-justify text-sm text-gray-800">
                    {query.response}
                  </td>
                  <td className="py-3 px-6 flex flex-col md:flex-row justify-center text-center text-sm gap-1">
                    {query.status === false ? (
                      <>
                        <button
                          onClick={() => handleEdit(query._id)}
                          className="text-white bg-blue-500 hover:text-white font-semibold px-4 py-2 border border-blue-500 rounded-md shadow-sm hover:shadow-lg hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(query._id)}
                          className="text-white bg-red-500 hover:text-white font-semibold px-4 py-2 border border-red-500 rounded-md shadow-sm hover:shadow-lg hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <span className="text-green-500 font-semibold">
                        Resolved
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="py-3 px-6 text-sm text-center text-red-600"
                >
                  No queries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EmployeeHelpdesk;
