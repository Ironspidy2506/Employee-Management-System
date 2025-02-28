import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import Header from "../HeaderFooter/Header";
import Footer from "../HeaderFooter/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ratingScale = {
  Poor: 1,
  Fair: 2,
  Satisfactory: 3,
  Excellent: 4,
  Outstanding: 5,
};

const AnnualAppraisalForm = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [totalRating, setTotalRating] = useState(0);

  const [formData, setFormData] = useState({
    employeeName: "",
    bannerId: "",
    classification: "",
    department: "",
    accomplishments: "",
    jobKnowledge: "",
    planningOrganizing: "",
    problemSolving: "",
    humanRelations: "",
    communicationSkills: "",
    qualityOfWork: "",
    productivity: "",
    dependability: "",
    professionalDevelopment: "",
    overallPerformance: "",
    supervisorComments: "",
  });

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://employee-management-system-backend-objq.onrender.com/api/employees", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEmployees(response.data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees.");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("https://employee-management-system-backend-objq.onrender.com/api/department", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDepartments(response.data.departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments.");
    }
  };

  const handleEmployeeChange = (selectedOption) => {
    const selectedEmployee = employees.find(
      (emp) => emp._id === selectedOption.value
    );

    if (selectedEmployee) {
      setFormData({
        ...formData,
        employeeName: selectedEmployee.name,
        department: selectedEmployee.department
          ? selectedEmployee.department._id
          : "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      calculateTotalRating(newData); // Update total rating dynamically
      return newData;
    });
  };

  const calculateTotalRating = (data) => {
    let total = 0;
    let count = 0;

    Object.keys(data).forEach((key) => {
      if (ratingScale[data[key]]) {
        total += ratingScale[data[key]];
        count++;
      }
    });

    setTotalRating(count > 0 ? (total / count).toFixed(2) : 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Appraisal Submitted Successfully!");
  };

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
        <h2 className="text-2xl font-bold text-center mb-4">
          Annual Appraisal Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Info */}
          <div className="grid grid-cols-2 gap-4">
            {/* Employee Selection */}
            <Select
              options={employees
                .sort((a, b) => a.employeeId - b.employeeId)
                .map((employee) => ({
                  value: employee._id,
                  label: `${employee.employeeId} - ${employee.name}`,
                }))}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Select Employee"
              onChange={handleEmployeeChange}
            />

            {/* Department Selection (Auto-updated) */}
            <Select
              options={departments.map((dep) => ({
                value: dep._id,
                label: `${dep.departmentId} ${dep.departmentName}`,
              }))}
              value={
                departments.find((dep) => dep._id === formData.department)
                  ? {
                      value: formData.department,
                      label: departments.find(
                        (dep) => dep._id === formData.department
                      )?.departmentName,
                    }
                  : null
              }
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Select Department"
              isDisabled={true} // Department auto-filled
            />
            <input
              type="text"
              name="bannerId"
              placeholder="Banner ID #"
              value={formData.bannerId}
              onChange={handleChange}
              className="p-2 border rounded w-full dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="classification"
              placeholder="Classification"
              value={formData.classification}
              onChange={handleChange}
              className="p-2 border rounded w-full dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Accomplishments */}
          <textarea
            name="accomplishments"
            placeholder="Accomplishments of Position Duties"
            value={formData.accomplishments}
            onChange={handleChange}
            className="p-2 border rounded w-full h-20 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Ratings Section */}
          <h3 className="font-semibold">Performance Ratings</h3>
          {[
            "jobKnowledge",
            "planningOrganizing",
            "problemSolving",
            "humanRelations",
            "communicationSkills",
            "qualityOfWork",
            "productivity",
            "dependability",
            "professionalDevelopment",
            "overallPerformance",
          ].map((field) => (
            <div key={field} className="flex items-center gap-3">
              <label className="w-1/2 capitalize">
                {field.replace(/([A-Z])/g, " $1")}:
              </label>
              {["Poor", "Fair", "Satisfactory", "Excellent", "Outstanding"].map(
                (rating) => (
                  <label key={rating} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={field}
                      value={rating}
                      checked={formData[field] === rating}
                      onChange={handleChange}
                      className="dark:bg-gray-700"
                    />
                    {rating}
                  </label>
                )
              )}
            </div>
          ))}

          {/* Display Total Rating */}
          <div className="text-center text-lg font-bold mt-4">
            Total Rating Score:{" "}
            <span className="text-blue-500">{totalRating}/5</span>
          </div>

          {/* Supervisor Comments */}
          <textarea
            name="supervisorComments"
            placeholder="Supervisor Comments"
            value={formData.supervisorComments}
            onChange={handleChange}
            className="p-2 border rounded w-full h-20 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Submit Button */}
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="max-w-sm w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Appraisal
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AnnualAppraisalForm;
