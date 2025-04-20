import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../HeaderFooter/Header";
import Footer from "../HeaderFooter/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/authContext";

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
      3: "Adequately productive.",
      4: "Occasionally needs redirection.",
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

const ViewMyAppraisal = () => {
  const { user } = useAuth();
  const [appraisal, setAppraisal] = useState(null);

  useEffect(() => {
    fetchAppraisal();
  }, []);

  const fetchAppraisal = async () => {
    try {
      const response = await axios.get(
        `https://korus-employee-management-system-mern-stack.vercel.app/api/appraisals/get-user-appraisal/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setAppraisal(response.data.appraisal);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!appraisal) {
    return (
      <>
        <Header />
        <ToastContainer />
        <div className="text-center py-10 text-gray-900 text-lg">
          No Appraisal Data Found!
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="mx-auto p-6 bg-white shadow-lg rounded-xl my-8 border">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 border-b pb-3">
          Appraisal Summary
        </h1>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-base mb-8">
          <Info
            label="Employee Name"
            value={appraisal?.employeeId?.name || "N/A"}
          />
          <Info
            label="Department"
            value={appraisal?.department?.departmentName || "N/A"}
          />
        </div>

        <SectionTitle title="Supervisor" />
        <div className="bg-gray-100 p-4 rounded-lg mb-8 text-gray-700 whitespace-pre-line">
          {Array.isArray(appraisal.supervisor) &&
          appraisal.supervisor.length > 0
            ? appraisal.supervisor.map((sup, index) => (
                <div key={sup._id || index}>{sup.name}</div>
              ))
            : "No Supervisor Added."}
        </div>

        <SectionTitle title="Supervisor Comments" />
        <div className="bg-gray-100 p-4 rounded-lg text-gray-700 whitespace-pre-line">
          {appraisal.supervisorComments || "No comments provided."}
        </div>

        <SectionTitle title="Accomplishments" />
        <div className="bg-gray-100 p-4 rounded-lg mb-8 text-gray-700 whitespace-pre-line">
          {appraisal.accomplishments || "No accomplishments provided."}
        </div>

        {/* Ratings Section */}
        <SectionTitle title="Ratings" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {ratingFields.map((field) => (
            <div
              key={field.key}
              className="border rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="font-medium text-gray-800">{field.label}</div>
              <div className="text-sm text-gray-500 mb-2">
                {field.description}
              </div>
              <div className="inline-block px-3 py-1 text-md font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                {appraisal.ratings?.[field.key] ?? "N/A"}
              </div>
              <div className="mt-2 text-gray-600">
                {/* Display the description for the rating */}
                {field.descriptions[appraisal.ratings?.[field.key]] ?? "N/A"}
              </div>
            </div>
          ))}
        </div>

        {/* Total Rating */}
        <SectionTitle title="Total Rating" />
        <div className="bg-indigo-100 text-indigo-800 font-bold px-5 py-2 inline-block rounded-lg text-lg mb-8">
          {appraisal.totalRating}
        </div>
      </div>
      <Footer />
    </>
  );
};

const Info = ({ label, value }) => (
  <div>
    <span className="block text-gray-600 font-medium">{label}</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

const SectionTitle = ({ title }) => (
  <h2 className="text-xl font-semibold text-gray-700 mb-3 mt-8">{title}</h2>
);

export default ViewMyAppraisal;
