import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Helpdesk = () => {
  const [helpRequests, setHelpRequests] = useState([]);
  const [filteredHelpRequests, setFilteredHelpRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all help requests
  useEffect(() => {
    const fetchHelpRequests = async () => {
      try {
        const response = await axios.get("https://employee-management-system-backend-objq.onrender.com/api/helpdesk", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setHelpRequests(response.data.helpdata);
          setFilteredHelpRequests(response.data.helpdata); // Initialize filtered list
        } else {
          toast.error("Failed to fetch help requests.");
        }
        setLoading(false);
      } catch (err) {
        toast.error("Error fetching help requests.");
        setLoading(false);
      }
    };

    fetchHelpRequests();
  }, []);

  // Handle resolving a query
  const handleResolve = async (helpId) => {
    try {
      const response = await axios.put(
        `https://employee-management-system-backend-objq.onrender.com/api/helpdesk/resolve-help/${helpId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        // Update the status dynamically in the state
        setHelpRequests((prev) =>
          prev.map((helpRequest) =>
            helpRequest._id === helpId
              ? { ...helpRequest, status: true }
              : helpRequest
          )
        );

        // Update the filtered list as well
        setFilteredHelpRequests((prev) =>
          prev.map((helpRequest) =>
            helpRequest._id === helpId
              ? { ...helpRequest, status: true }
              : helpRequest
          )
        );
      } else {
        toast.error("Failed to resolve the help request.");
      }
    } catch (err) {
      toast.error("Error resolving the help request.");
    }
  };

  // Handle search by Employee ID
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearch(searchValue);

    const filtered = helpRequests.filter((helpRequest) =>
      helpRequest.employeeId?.employeeId
        .toString() // Convert the number to a string
        .toLowerCase() // Convert the string to lowercase
        .includes(searchValue)
    );

    setFilteredHelpRequests(filtered);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <ToastContainer />
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Helpdesk</h2>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by Employee ID"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-md shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 border text-center">Employee ID</th>
                <th className="py-3 px-6 border text-left">Employee Name</th>
                <th className="py-3 px-6 border text-left">Help ID</th>
                <th className="py-3 px-6 border text-center">Query</th>
                <th className="py-3 px-6 border text-center">Status</th>
                <th className="py-3 px-6 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHelpRequests.map((helpRequest) => (
                <tr key={helpRequest.helpId} className="border-t">
                  <td className="py-3 px-6 border text-center">
                    {helpRequest.employeeId?.employeeId}
                  </td>
                  <td className="py-3 px-6 border">
                    {helpRequest.employeeId?.name}
                  </td>
                  <td className="py-3 px-6 border">{helpRequest.helpId}</td>
                  <td className="py-3 px-6 border">{helpRequest.query}</td>
                  <td className="py-3 px-6 border text-center">
                    <span
                      className={`py-1 px-3 rounded-full text-sm ${
                        helpRequest.status
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {helpRequest.status ? "Resolved" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-6 border text-center">
                    {!helpRequest.status && (
                      <button
                        onClick={() => handleResolve(helpRequest._id)}
                        className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Helpdesk;
