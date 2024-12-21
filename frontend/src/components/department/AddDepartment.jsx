import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../HeaderFooter/Footer";
import Header from "../HeaderFooter/Header";

const AddDepartment = () => {
    const [department, setDepartment] = useState({
        departmentId: '',
        departmentName: '',
        description: ''
    });

    const navigate = useNavigate();
    const handleChange = (e) => {
        const {name, value} = e.target;
        setDepartment({...department, [name] : value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/department/add', department, {
                headers : {
                    Authorization : `Bearer ${localStorage.getItem('token')}`
                }
            });

            if(response.data.success) {
                navigate("/admin-dashboard/departments")
            }
        } catch (error) {
            if(error.response && error.response.data.error) {
                alert(error.response.data.error);
            }
        }
    }

  return (
    <>
    <Header/>
    
    <div className="flex items-center justify-center py-4 px-4">
      <div className="p-7 max-w-lg w-full bg-white shadow-md rounded-md">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Add New Department</h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Department Id
              </label>
              <input
                type="text"
                id="departmentId"
                name="departmentId"
                placeholder="Enter department id"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700 mb-1">
                Department Name
              </label>
              <input
                type="text"
                id="departmentName"
                name="departmentName"
                placeholder="Enter department name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter description (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 h-28"
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition duration-300"
          >
            Add Department
          </button>
        </form>
      </div>
    </div>

    <Footer/>

    </>
  );
};

export default AddDepartment;
