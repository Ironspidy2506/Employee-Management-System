import React, { useEffect, useState } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../HeaderFooter/Footer";
import Header from "../HeaderFooter/Header";
import { useAuth } from "../../context/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddEmployee = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };

    getDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "https://korus-ems-backend.onrender.com/api/employees/add",
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate(`/${user.role}-dashboard/employees`);
        }, 800);
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="max-w-full mx-auto p-6 bg-white shadow-md rounded-md mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add New Employee
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="employeeId"
              >
                Employee ID
              </label>
              <input
                type="text"
                name="employeeId"
                id="employeeId"
                placeholder="Enter Employee ID"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Employee Name"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Personal Email"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="korusEmail"
              >
                Korus Email
              </label>
              <input
                type="email"
                name="korusEmail"
                id="korusEmail"
                placeholder="Enter Korus Email (If Available)"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="dob"
              >
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                id="dob"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="gender"
              >
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
              </select>
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="maritalStatus"
              >
                Marital Status
              </label>
              <select
                name="maritalStatus"
                id="maritalStatus"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
                onChange={handleChange}
              >
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="designation"
              >
                Designation
              </label>
              <input
                type="text"
                name="designation"
                id="designation"
                placeholder="Enter Designation"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="department"
              >
                Department
              </label>
              <select
                name="department"
                id="department"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {departments.map((dep) => (
                  <option key={dep._id} value={dep._id}>
                    {dep.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="hod"
              >
                HOD
              </label>
              <input
                type="text"
                name="hod"
                id="hod"
                placeholder="Enter Head of Department Name (If Available)"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            {/* New Fields Before Profile Image */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="qualification"
              >
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                id="qualification"
                placeholder="Enter Highest Qualification"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="yop"
              >
                Year of Passing
              </label>
              <input
                type="text"
                name="yop"
                id="yop"
                placeholder="Enter Year of Passing of Highest Qualification"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="contactNo"
              >
                Contact No.
              </label>
              <input
                type="number"
                name="contactNo"
                id="contactNo"
                required
                placeholder="Enter Contact No."
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="altContactNo"
              >
                Alternate Contact No.
              </label>
              <input
                type="number"
                name="altContactNo"
                id="altContactNo"
                placeholder="Enter Alternate Contact No. (If Available)"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="permanentAddress"
              >
                Permanent Address
              </label>
              <input
                type="text"
                name="permanentAddress"
                id="permanentAddress"
                placeholder="Enter Permanent Address"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="localAddress"
              >
                Local Address
              </label>
              <input
                type="text"
                name="localAddress"
                id="localAddress"
                placeholder="Enter Local Address"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="aadharNo"
              >
                Aadhar No.
              </label>
              <input
                type="text"
                name="aadharNo"
                id="aadharNo"
                required
                placeholder="Enter Aadhar No."
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="pan"
              >
                PAN No.
              </label>
              <input
                type="text"
                name="pan"
                id="pan"
                required
                placeholder="Enter PAN No."
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="passportNo"
              >
                Passport No.
              </label>
              <input
                type="text"
                name="passportNo"
                id="passportNo"
                placeholder="Enter Passport No. (If Available)"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="role"
              >
                Passport Type
              </label>
              <select
                name="passportType"
                id="passportType"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              >
                <option value="">Select Passport Type</option>
                <option value="P">P (Personal/Private)</option>
                <option value="D">D (Diplomatic)</option>
                <option value="O">O (Official/Service Passport)</option>
                <option value="S">S (Special Passport)</option>
                <option value="X">X (Stateless or Emergency Passport)</option>
              </select>
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="passportpoi"
              >
                Passport Place of Issue
              </label>
              <input
                type="text"
                name="passportpoi"
                id="passportpoi"
                placeholder="Enter Passport Place of Issue (If Available)"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="passportdoi"
              >
                Passport Date of Issue
              </label>
              <input
                type="date"
                name="passportdoi"
                id="passportdoi"
                placeholder="Enter Passport Date of Issue (If Available)"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="passportdoe"
              >
                Passport Date of Expiry
              </label>
              <input
                type="date"
                name="passportdoe"
                id="passportdoe"
                placeholder="Enter Passport Date of Expiry (If Available)"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="nationality"
              >
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                id="nationality"
                placeholder="Enter Nationality"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="uan"
              >
                UAN No.
              </label>
              <input
                type="text"
                name="uan"
                id="uan"
                placeholder="Enter UAN No."
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="epfNo"
              >
                EPF No.
              </label>
              <input
                type="text"
                name="epfNo"
                id="epfNo"
                placeholder="Enter EPF Account No."
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="esiNo"
              >
                ESI No.
              </label>
              <input
                type="text"
                name="esiNo"
                id="esiNo"
                placeholder="Enter ESI No."
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="bank"
              >
                Bank
              </label>
              <input
                type="text"
                name="bank"
                id="bank"
                required
                placeholder="Enter Bank Name"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="bank"
              >
                Branch Name
              </label>
              <input
                type="text"
                name="branch"
                id="branch"
                required
                placeholder="Enter Bank Branch Name"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="bank"
              >
                IFSC Code
              </label>
              <input
                type="text"
                name="ifsc"
                id="ifsc"
                required
                placeholder="Enter Bank IFSC Code"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="accountNo"
              >
                Account No.
              </label>
              <input
                type="text"
                name="accountNo"
                id="accountNo"
                required
                placeholder="Enter Account No."
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="repperson"
              >
                Reporting Person
              </label>
              <input
                type="text"
                name="repperson"
                id="repperson"
                placeholder="Enter Reporting Person (If Available)"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="role"
              >
                Role
              </label>
              <select
                name="role"
                id="role"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                {/* <option value="Admin">Admin</option> */}
                {/* <option value="Accounts">Accounts</option> */}
                {/* <option value="HR">HR</option> */}
                <option value="Employee">Employee</option>
                {/* <option value="Lead">Team Lead</option> */}
              </select>
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter Password"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
                onChange={handleChange}
              />
            </div>

            {/* Profile Image Field */}

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="doj"
              >
                Date of Joining
              </label>
              <input
                type="date"
                name="doj"
                id="doj"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="profileImage"
              >
                Profile Image
              </label>
              <input
                type="file"
                name="profileImage"
                id="profileImage"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-3/5 md:w-2/5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
            >
              Add New Employee
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default AddEmployee;
