import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../HeaderFooter/Footer";
import Header from "../HeaderFooter/Header";
import { useNavigate, useParams } from "react-router-dom";

const EditAllowances = () => {
  const { _id } = useParams(); // Get the allowance ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: "",
    empName: "",
    designation: "",
    department: "",
    client: "",
    projectNo: "",
    placeOfVisit: "",
    startDate: "",
    endDate: "",
    allowances: [],
  });

  useEffect(() => {
    // Fetch allowance data from the backend
    const fetchAllowanceData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/allowances/edit/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const allowance = response.data.allowance;
        // Set the formData with the fetched allowance data
        setFormData({
          employeeId: allowance.employeeId.employeeId,
          empName: allowance.empName,
          designation: allowance.designation,
          department: allowance.department,
          client: allowance.client,
          projectNo: allowance.projectNo,
          placeOfVisit: allowance.placeOfVisit,
          startDate: new Date(allowance.startDate).toISOString().split("T")[0],
          endDate: new Date(allowance.endDate).toISOString().split("T")[0],
          allowances: allowance.allowances || [],
        });
      } catch (err) {
        console.error("Error fetching allowance data:", err);
      }
    };

    fetchAllowanceData();
  }, [_id]);

  // Handle changes in general form fields (like empName, department, etc.)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle changes in allowances (each allowance detail and amount)
  const handleAllowanceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAllowances = [...formData.allowances];
    updatedAllowances[index] = { ...updatedAllowances[index], [name]: value };
    setFormData((prev) => ({
      ...prev,
      allowances: updatedAllowances,
    }));
  };

  // Add a new allowance row to the allowances array
  const handleAddAllowance = () => {
    setFormData((prev) => ({
      ...prev,
      allowances: [...prev.allowances, { detail: "", amount: "" }],
    }));
  };

  // Remove an allowance row from the allowances array
  const handleRemoveAllowance = (index) => {
    const updatedAllowances = formData.allowances.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      allowances: updatedAllowances,
    }));
  };

  // Handle form submission (update the data)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing

    try {
      // Send updated data to the backend API
      const response = await axios.put(
        `http://localhost:5000/api/allowances/edit/${_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/employee-dashboard/allowances");
      }
    } catch (err) {
      console.error("Error updating allowance:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("File ready to update");
  };

  return (
    <>
      <Header />
      <div className="mt-2 max-w-full mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Allowance</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Employee Name</label>
              <input
                type="text"
                name="empName"
                value={formData.empName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
                disabled
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
                disabled
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Client</label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Project No.</label>
              <input
                type="text"
                name="projectNo"
                value={formData.projectNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Place of Visit</label>
              <input
                type="text"
                name="placeOfVisit"
                value={formData.placeOfVisit}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>

          {/* Allowances Section */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Allowances</label>
            {formData.allowances.length > 0 && (
              <div>
                {formData.allowances.map((allowance, index) => (
                  <div key={index} className="mb-4 flex items-center space-x-4">
                    <div className="w-1/3">
                      <input
                        type="text"
                        name="detail"
                        value={allowance.detail}
                        onChange={(e) => handleAllowanceChange(index, e)}
                        placeholder="Allowance Detail"
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      />
                    </div>

                    <div className="w-1/3">
                      <input
                        type="number"
                        name="amount"
                        value={allowance.amount}
                        onChange={(e) => handleAllowanceChange(index, e)}
                        placeholder="Amount"
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveAllowance(index)}
                      className="bg-red-600 text-white py-2 px-4 rounded-md border border-red-700 hover:bg-red-700 focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Allowance Button */}
            <button
              type="button"
              onClick={handleAddAllowance}
              className="w-xl bg-blue-600 text-white py-2 px-4 rounded-md mb-4 hover:bg-blue-700"
            >
              Add Allowance
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Edit Proof of Allowance
              </label>
              <input
                type="file"
                name="proofOfAllowance"
                accept=".pdf,.jpg,.jpeg,.png" // Allow specific file types
                onChange={handleFileChange} // Function to handle file selection
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md mt-6 hover:bg-green-700"
          >
            Submit Changes
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default EditAllowances;
