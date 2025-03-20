import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import Header from "../HeaderFooter/Header";
import Footer from "../HeaderFooter/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ratingScale = {
  Failed: 1,
  "Needs Improvement": 2,
  "Adequate/Fair": 3,
  Excellent: 4,
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
      calculateTotalRating(newData); // Ensure rating updates when inputs change
      return newData;
    });
  };

  const calculateTotalRating = (data) => {
    let total = 0;
    let count = 0;

    Object.keys(data).forEach((key) => {
      if (ratingScale[data[key]]) {
        // Only sum up valid ratings
        total += ratingScale[data[key]];
        count++;
      }
    });

    setTotalRating(count > 0 ? (total / count).toFixed(2) : 0);
  };

  const getPerformanceMessage = (rating) => {
    if (rating < 1.5) {
      return { text: "Needs Significant Improvement", color: "text-red-500" };
    } else if (rating < 2.5) {
      return { text: "Needs Improvement", color: "text-orange-500" };
    } else if (rating < 3.5) {
      return { text: "Satisfactory Performance", color: "text-blue-500" };
    } else {
      return { text: "Excellent Performance", color: "text-green-500" };
    }
  };

  // Inside your return statement where total rating is displayed
  const performanceMessage = getPerformanceMessage(totalRating);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Appraisal Submitted Successfully!");
  };

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Annual Appraisal Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Info */}
          <div className="grid grid-cols-2 gap-4">
            {/* Employee Selection */}
            <div>
              <label className="text-lg font-semibold text-gray-700 dark:text-gray-200 capitalize mb-1 block">
                Employee
              </label>
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
            </div>

            {/* Department Selection (Auto-updated) */}
            <div>
              <label className="text-lg font-semibold text-gray-700 dark:text-gray-200 capitalize mb-1 block">
                Department
              </label>
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
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-700 dark:text-gray-200 capitalize mb-1 block">
                Banner ID
              </label>
              <input
                type="text"
                name="bannerId"
                placeholder="Banner ID #"
                value={formData.bannerId}
                onChange={handleChange}
                className="p-2 border rounded w-full dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-lg font-semibold text-gray-700 dark:text-gray-200 capitalize mb-1 block">
                Classification
              </label>
              <input
                type="text"
                name="classification"
                placeholder="Classification"
                value={formData.classification}
                onChange={handleChange}
                className="p-2 border rounded w-full dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Accomplishments */}
          <div>
            <label className="text-lg font-semibold text-gray-700 dark:text-gray-200 capitalize mb-1 block">
              Accomplishments
            </label>
            <textarea
              name="accomplishments"
              placeholder="Accomplishments of Position Duties"
              value={formData.accomplishments}
              onChange={handleChange}
              className="p-2 border rounded w-full h-20 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Ratings Section */}
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Performance Ratings
          </h3>
          <div className="space-y-6 bg-white dark:bg-gray-900">
            {[
              "Punctuality",
              "Attendance",
              "Job Knowledge",
              "Human Relations",
              "Quality of Work",
              "Performance",
              "Professional Development",
              "Dedication",
              "Work Habits",
              "Initiative",
            ].map((field) => (
              <div
                key={field}
                className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow"
              >
                <label className="text-lg font-semibold text-gray-700 dark:text-gray-200 capitalize">
                  {field}:
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {
                    {
                      Punctuality: "Reports to work on time.",
                      Attendance:
                        "Regularly attends office and gives prior intimation in case of leave.",
                      "Job Knowledge": "Does work without assistance.",
                      "Human Relations":
                        "Helps others when their workload increases.",
                      "Quality of Work":
                        "Does work consistently without errors.",
                      Performance: "Consistently meets schedule.",
                      "Professional Development":
                        "Seeks keen interest to acquire new skills for upgradation.",
                      Dedication:
                        "Available to work especially during demanding situations.",
                      "Work Habits": "Uses work time appropriately.",
                      Initiative:
                        "Regularly volunteers for additional tasks and projects.",
                    }[field]
                  }
                </p>
                <div className="flex gap-4 mt-2">
                  {[
                    "Failed",
                    "Needs Improvement",
                    "Adequate/Fair",
                    "Excellent",
                  ].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-lg shadow cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      <input
                        type="radio"
                        name={field}
                        value={rating}
                        checked={formData[field] === rating}
                        onChange={handleChange}
                        className="w-5 h-5 accent-blue-500 cursor-pointer"
                      />
                      <span className="text-gray-800 dark:text-white">
                        {rating}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Display Total Rating */}
          <div className="text-center text-xl font-extrabold mt-4">
            Total Rating Score:{" "}
            <span className="text-blue-500">{totalRating}/4</span>
            <p
              className={`mt-2 text-lg font-semibold ${performanceMessage.color}`}
            >
              ({performanceMessage.text})
            </p>
          </div>

          {/* Supervisor Comments */}
          <div>
            <label className="text-lg font-semibold text-gray-700 dark:text-gray-200 capitalize mb-1 block">
              Supervisor Comments
            </label>
            <textarea
              name="supervisorComments"
              placeholder="Supervisor Comments"
              value={formData.supervisorComments}
              onChange={handleChange}
              className="p-2 border rounded w-full h-20 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
