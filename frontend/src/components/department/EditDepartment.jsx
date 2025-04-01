import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../HeaderFooter/Footer";
import Header from "../HeaderFooter/Header";
import { useAuth } from "../../context/authContext";

const EditDepartment = () => {
  const { _id } = useParams();
  const { user} = useAuth();
  const navigate = useNavigate();

  const [department, setDepartment] = useState([]);
  const [depLoading, setDepLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/department/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          setDepartment(response.data.department);
        }
      } catch (error) {
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        }
      } finally {
        setDepLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/department/${_id}`,
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        navigate(`/${user.role}-dashboard/departments`);
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <>
      {depLoading ? (
        <div>Loading...</div>
      ) : (
        <>
        <Header/>

        <div className="flex items-center justify-center py-4 px-4">
          <div className="p-7 max-w-lg w-full bg-white shadow-lg rounded-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Edit Department
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="departmentId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Department Id
                  </label>
                  <input
                    type="text"
                    value={department.departmentId}
                    name="departmentId"
                    placeholder="Enter department id"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="departmentName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Department Name
                  </label>
                  <input
                    type="text"
                    value={department.departmentName}
                    name="departmentName"
                    placeholder="Enter department name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={department.description}
                  placeholder="Enter description (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 h-28"
                  onChange={handleChange}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-300"
              >
                Update Department
              </button>
            </form>
          </div>
        </div>

        <Footer/>

        </>
      )}
    </>
  );
};

export default EditDepartment;
