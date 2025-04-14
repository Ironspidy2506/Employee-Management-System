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
  },
  {
    key: "Attendance",
    label: "Attendance",
    description:
      "Regularly attends office and gives prior intimation in case of leave.",
  },
  {
    key: "JobKnowledge",
    label: "Job Knowledge",
    description: "Does work without assistance.",
  },
  {
    key: "HumanRelations",
    label: "Human Relations",
    description: "Helps others when their workload increases.",
  },
  {
    key: "QualityOfWork",
    label: "Quality of Work",
    description: "Does work consistently without errors.",
  },
  {
    key: "Performance",
    label: "Performance",
    description: "Consistently meets schedule.",
  },
  {
    key: "ProfessionalDevelopment",
    label: "Professional Development",
    description: "Seeks keen interest to acquire new skills for upgradation.",
  },
  {
    key: "Dedication",
    label: "Dedication",
    description: "Available to work especially during demanding situations.",
  },
  {
    key: "WorkHabits",
    label: "Work Habits",
    description: "Uses work time appropriately.",
  },
  {
    key: "Initiative",
    label: "Initiative",
    description: "Regularly volunteers for additional tasks and projects.",
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
        `https://korus-ems-backend.onrender.com/api/appraisals/get-user-appraisal/${user._id}`,
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
          {appraisal.supervisor?.name || "No supervisor added."}
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
              <div className="inline-block px-3 py-1 text-sm font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                {appraisal.ratings?.[field.key] ?? "N/A"}
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
