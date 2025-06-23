import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import Header from "../HeaderFooter/Header";
import Footer from "../HeaderFooter/Footer";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/authContext";

const ratingScale = {
  1: 25,
  2: 50,
  3: 75,
  4: 85,
  5: 100,
};

const ratingFields = [
  {
    key: "Punctuality",
    label: "Punctuality",
    description: "Reports to work on time.",
    descriptions: {
      1: "Frequently late for work or meetings, leaves early or extends breaks without approval, absences regularly disrupt projects or require work redistribution, fails to notify or follow protocol for leave or absences.",
      2: "Communicates inconsistently about attendance or availability; occasionally late; needs reminders.",
      3: "Regularly on time; meets punctuality expectations.",
      4: "Always punctual; shows respect for others' time, takes responsibility to ensure coverage or catch-up after absence.",
      5: "Arrives early or on time consistently; models ideal behavior for others, always ready to compensate for time missed without prompting.",
    },
  },
  {
    key: "JobKnowledge",
    label: "Understanding of Engineering Principles (Job Knowledge)",
    description:
      "Demonstrates knowledge of engineering principles required for the role.",
    descriptions: {
      1: "Lacks required knowledge for the role and level.",
      2: "Basic understanding, but makes frequent errors.",
      3: "Requires regular supervision, but mostly gets it right.",
      4: "Applies concepts with minimal guidance.",
      5: "Applies engineering concepts independently and correctly.",
    },
  },
  {
    key: "DesignAccuracy",
    label: "Design/Drafting Accuracy",
    description:
      "Produces precise and error-free technical work including drawings and calculations.",
    descriptions: {
      1: "Frequent design errors; requires constant corrections.",
      2: "Occasional mistakes; requires rework.",
      3: "Consistently accurate; minor issues only.",
      4: "Double-checks own work; rarely requires changes.",
      5: "Meticulous, spotless technical work; often catches others’ errors.",
    },
  },
  {
    key: "SoftwareProficiency",
    label: "Software Proficiency",
    description:
      "Demonstrates skill and efficiency using required technical software tools.",
    descriptions: {
      1: "Unable to perform without full assistance.",
      2: "Struggles with basic functions, limited software skills.",
      3: "Average, needs occasional help.",
      4: "Proficient and efficient, skilled in multiple functions.",
      5: "Advanced level, capable of training others.",
    },
  },
  {
    key: "DocumentationQuality",
    label: "Detailing & Documentation Quality",
    description:
      "Prepares thorough, well-structured documents with clear detailing.",
    descriptions: {
      1: "Incomplete or poorly formatted documentation.",
      2: "Frequent quality gaps in documents.",
      3: "Acceptable documentation with minor gaps.",
      4: "Good quality, mostly self-checked.",
      5: "Consistently complete, clear, and well-organized documentation.",
    },
  },
  {
    key: "Timeliness",
    label: "Task Completion Timeliness",
    description: "Completes assigned tasks within the expected time frame.",
    descriptions: {
      1: "Consistently behind schedule.",
      2: "Often late, even after reminders.",
      3: "Meets most deadlines with reminders.",
      4: "Usually on time without reminders.",
      5: "Always on or ahead of schedule.",
    },
  },
  {
    key: "TaskVolume",
    label: "Task Volume / Output",
    description: "Maintains expected productivity and output volume.",
    descriptions: {
      1: "Low output; tasks often reassigned.",
      2: "Below expected output.",
      3: "Meets expected workload.",
      4: "Above average; dependable.",
      5: "High output while maintaining quality.",
    },
  },
  {
    key: "TimeUtilization",
    label: "Time Utilization",
    description: "Uses work hours productively and manages time effectively.",
    descriptions: {
      1: "Frequently unproductive.",
      2: "Easily distracted, inefficient.",
      3: "Occasionally needs redirection.",
      4: "Adequately productive.",
      5: "Fully productive; minimal idle time.",
    },
  },
  {
    key: "Initiative",
    label: "Initiative",
    description: "Takes proactive steps and ownership of responsibilities.",
    descriptions: {
      1: "Avoids taking ownership.",
      2: "Passive, waits for instructions.",
      3: "Fulfills own responsibilities adequately.",
      4: "Frequently proactive.",
      5: "Takes full ownership and leads without prompting.",
    },
  },
  {
    key: "Attendance",
    label: "Attendance",
    description:
      "Maintains consistent presence at work with proper leave communication.",
    descriptions: {
      1: "Frequently absent without valid reason; unreliable presence.",
      2: "Inconsistent on-site presence; noticeable availability gaps.",
      3: "Regularly available in office.",
      4: "Very dependable; mostly available and supports team.",
      5: "Highly reliable and sets a positive attendance example.",
    },
  },
];

const EditAppraisalForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [totalRating, setTotalRating] = useState(0);

  const [formData, setFormData] = useState({
    employeeId: "",
    department: "",
    accomplishments: "",
    supervisorComments: "",
    leadIds: [],
  });

  const leads = employees
    .filter((emp) => emp.role === "Lead")
    .sort((a, b) => a.employeeId - b.employeeId);

  const [ratings, setRatings] = useState(
    ratingFields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  );

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
    fetchAppraisal();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://korus-employee-management-system-mern-stack.vercel.app/api/employees", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmployees(response.data.employees);
    } catch (error) {
      toast.error("Failed to load employees.");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("https://korus-employee-management-system-mern-stack.vercel.app/api/department", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDepartments(response.data.departments);
    } catch (error) {
      toast.error("Failed to load departments.");
    }
  };

  const fetchAppraisal = async () => {
    try {
      const response = await axios.get(
        `https://korus-employee-management-system-mern-stack.vercel.app/api/appraisals/get-appraisal-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data.appraisal;

      setFormData({
        employeeId: data.employeeId._id,
        department: data.department._id,
        leadIds: Array.isArray(data.supervisor)
          ? data.supervisor.map((sup) => sup._id)
          : [], // fallback
        accomplishments: data.accomplishments,
        supervisorComments: data.supervisorComments,
      });

      setRatings(data.ratings);
      calculateTotalRating(data.ratings);
    } catch (error) {
      toast.error("Failed to load appraisal data.");
    }
  };

  const handleEmployeeChange = (selectedOption) => {
    const selectedEmployee = employees.find(
      (emp) => emp._id === selectedOption.value
    );
    if (selectedEmployee) {
      setFormData((prev) => ({
        ...prev,
        employeeId: selectedEmployee._id,
        department: selectedEmployee.department?._id || "",
      }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setRatings((prevRatings) => {
      const updated = { ...prevRatings, [name]: value };
      calculateTotalRating(updated);
      return updated;
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

  const getPerformanceMessage = (rating) => {
    if (rating < 65) {
      return { text: "Unsatisfactory", color: "text-red-500" };
    } else if (rating < 70) {
      return { text: "Needs Improvement", color: "text-orange-500" };
    } else if (rating < 85) {
      return { text: "Average", color: "text-yellow-500" };
    } else if (rating < 95) {
      return { text: "Very Good", color: "text-blue-500" };
    } else {
      return { text: "Excellent", color: "text-green-500" };
    }
  };

  const performanceMessage = getPerformanceMessage(totalRating);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      ratings,
      totalRating,
    };

    try {
      const response = await axios.post(
        `https://korus-employee-management-system-mern-stack.vercel.app/api/appraisals/edit-appraisal/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate(`/${user.role === "Lead" ? 'employee' : user.role}-dashboard/appraisal`);
        }, 500);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Edit Annual Appraisal
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee and Department Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-lg font-semibold text-gray-700 mb-1 block">
                Employee
              </label>
              <Select
                options={employees
                  .sort((a, b) => a.employeeId - b.employeeId)
                  .map((employee) => ({
                    value: employee._id,
                    label: `${employee.employeeId} - ${employee.name}`,
                  }))}
                value={
                  employees.find((emp) => emp._id === formData.employeeId)
                    ? {
                      value: formData.employeeId,
                      label: `${employees.find(
                        (emp) => emp._id === formData.employeeId
                      ).employeeId
                        } - ${employees.find(
                          (emp) => emp._id === formData.employeeId
                        ).name
                        }`,
                    }
                    : null
                }
                onChange={handleEmployeeChange}
              />
            </div>

            <div>
              <label className="text-lg font-semibold text-gray-700 mb-1 block">
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
                isDisabled={true}
              />
            </div>
          </div>
          <div>
            <label className="text-lg font-semibold text-gray-700 capitalize mb-1 block">
              Supervisor
            </label>
            <Select
              options={leads.map((lead) => ({
                value: lead._id,
                label: `${lead.employeeId} - ${lead.name}`,
              }))}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Select Lead(s)"
              isMulti
              onChange={(selectedOptions) =>
                setFormData({
                  ...formData,
                  leadIds: selectedOptions.map((opt) => opt.value),
                })
              }
              value={leads
                .filter((lead) => formData.leadIds.includes(lead._id))
                .map((lead) => ({
                  value: lead._id,
                  label: `${lead.employeeId} - ${lead.name}`,
                }))}
            />
          </div>
          <div>
            <label className="text-lg font-semibold text-gray-700 capitalize mb-1 block">
              Supervisor Comments
            </label>
            <textarea
              name="supervisorComments"
              placeholder="Supervisor Comments"
              value={formData.supervisorComments}
              onChange={handleChange}
              className="p-2 border rounded w-full h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Accomplishments */}
          <div>
            <label className="text-lg font-semibold text-gray-700 mb-1 block">
              Accomplishments
            </label>
            <textarea
              name="accomplishments"
              value={formData.accomplishments}
              onChange={handleChange}
              className="p-2 border rounded w-full h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Ratings Section */}
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Performance Ratings
          </h3>
          <div className="space-y-6 bg-white">
            {ratingFields.map((field) => (
              <div
                key={field.key}
                className="p-4 bg-gray-100 rounded-lg shadow mt-4"
              >
                <label className="text-lg font-semibold text-gray-700 capitalize">
                  {field.label}
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  {field.description}
                </p>
                <div className="flex flex-col gap-3 mt-2">
                  {Object.entries(field.descriptions).map(([score, desc]) => (
                    <label
                      key={score}
                      className="flex items-start gap-2 bg-gray-200 px-3 py-2 rounded-lg shadow cursor-pointer hover:bg-gray-300 transition"
                    >
                      <input
                        type="radio"
                        name={field.key}
                        value={score}
                        checked={ratings[field.key] === score}
                        onChange={handleRatingChange}
                        className="w-5 h-5 accent-blue-500 mt-1 cursor-pointer"
                      />
                      <div>
                        <span className="font-semibold text-gray-800">
                          Rating {score}
                        </span>
                        <p className="text-sm text-gray-700">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Total Rating */}
          <div className="text-center text-xl font-extrabold mt-4">
            Total Rating Score:{" "}
            <span className="text-blue-500">{totalRating}/100</span>
            <p
              className={`mt-2 text-lg font-semibold ${performanceMessage.color}`}
            >
              ({performanceMessage.text})
            </p>
          </div>

          {/* Supervisor Comments */}

          {/* Submit */}
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="max-w-sm w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Appraisal
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditAppraisalForm;
