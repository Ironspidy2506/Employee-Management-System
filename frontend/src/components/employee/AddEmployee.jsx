import React, { useEffect, useState } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../HeaderFooter/Footer";
import Header from "../HeaderFooter/Header";

const AddEmployee = () => {
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
        "http://localhost:5000/api/employees/add",
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <>
      <Header />
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
                placeholder="Enter Employee Email"
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                required
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

            {/* New Fields Before Profile Image */}
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
                placeholder="Enter PAN No."
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
                htmlFor="pfNo"
              >
                PF No.
              </label>
              <input
                type="text"
                name="pfNo"
                id="pfNo"
                placeholder="Enter PF No."
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
                placeholder="Enter Bank Name"
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
                placeholder="Enter Account No."
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
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
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

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
          >
            Add New Employee
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default AddEmployee;
