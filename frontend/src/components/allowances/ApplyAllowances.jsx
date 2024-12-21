import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext"; // Assuming useAuth provides the logged-in user's data
import axios from "axios";
import Footer from "../HeaderFooter/Footer";
import Header from "../HeaderFooter/Header";
import { useNavigate } from "react-router-dom";

const ApplyAllowance = () => {
  const { user } = useAuth(); // Assuming useAuth provides the logged-in user's data
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    allowanceType: "site",
    employeeId: "",
    empName: "",
    designation: "",
    department: "",
    client: "",
    projectNo: "",
    startDate: "",
    endDate: "",
    placeOfVisit: "",
    allowances: [],
  });

  useEffect(() => {
    // Fetch employee data on mount using userId from useAuth
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(
          `https://employee-management-system-backend-objq.onrender.com/api/employees/summary/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ); // Assuming user._id is the userId
        const employee = response.data.employee;

        setFormData((prev) => ({
          ...prev,
          employeeId: employee.employeeId,
          empName: employee.name,
          designation: employee.designation,
          department: employee.department.departmentName, // Assuming department has a name field
        }));
      } catch (err) {
        console.error("Error fetching employee data:", err);
      }
    };

    if (user?._id) {
      fetchEmployeeData();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAllowanceChange = (index, e) => {
    const { name, value } = e.target;
    const newAllowances = [...formData.allowances];
    newAllowances[index] = { ...newAllowances[index], [name]: value };
    setFormData((prev) => ({
      ...prev,
      allowances: newAllowances,
    }));
  };

  const handleAddAllowance = () => {
    setFormData((prev) => ({
      ...prev,
      allowances: [...prev.allowances, { detail: "", amount: "" }],
    }));
  };

  const handleRemoveAllowance = (index) => {
    const newAllowances = formData.allowances.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      allowances: newAllowances,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    const response = await axios.get(
      `https://employee-management-system-backend-objq.onrender.com/api/employees/summary/${user._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const employee = response.data.employee;

    const data = {
      allowanceType: formData.allowanceType,
      empName: formData.empName,
      designation: formData.designation,
      department: formData.department,
      client: formData.client,
      projectNo: formData.projectNo,
      startDate: formData.startDate,
      endDate: formData.endDate,
      placeOfVisit: formData.placeOfVisit,
      allowances: formData.allowances,
    };

    try {
      const response = await axios.post(
        `https://employee-management-system-backend-objq.onrender.com/api/allowances/add/${employee._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Authorization token
          },
        }
      );

      if (response.status === 200) {
        navigate("/employee-dashboard/allowances");
      }
    } catch (err) {
      console.error("Error submitting allowance application:", err);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("File ready to dispatch");
  };

  return (
    <>
      <Header />
      <div className="mt-2 max-w-full mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6">Allowance Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Allowance Type</label>
              <select
                name="allowanceType"
                value={formData.allowanceType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="site">Site Allowance</option>
                <option value="travel">Travel Allowance</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
                readOnly
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Employee Name</label>
              <input
                type="text"
                name="empName"
                value={formData.empName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
                readOnly
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
                readOnly
              />
            </div>
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
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
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
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
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
                Attach Proof of Allowance
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

          {/* Allowance Details */}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md mt-6 hover:bg-green-700"
          >
            Submit Allowance
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default ApplyAllowance;
