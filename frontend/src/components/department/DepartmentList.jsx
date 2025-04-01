import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DepartmentButtons } from "../../utils/DepartmentHelper";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const DepartmentList = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const onDepartmentDelete = async (_id) => {
    const data = departments.filter((dep) => dep._id !== _id);
    setFilteredDepartments(data);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get(
          "https://employee-management-system-backend-objq.onrender.com/api/department",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          let sno = 1;
          const data = response.data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            departmentId: dep.departmentId,
            departmentName: dep.departmentName,
          }));

          setDepartments(data);
          setFilteredDepartments(data);
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

  const filterDepartments = (e) => {
    const records = departments.filter((dep) =>
      dep.departmentName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredDepartments(records);
  };

  return (
    <>
      {depLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="p-6 space-y-6">
          <div className="bg-white shadow-md rounded-md p-4">
            <h3 className="text-xl font-bold text-gray-800">
              Manage Department
            </h3>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-sm shadow-md p-5">
            <input
              type="search"
              placeholder="Search Department"
              className="w-full md:w-auto flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={filterDepartments}
            />
            <Link
              to={`/${user.role}-dashboard/add-department`}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
              Add New Department
            </Link>
          </div>

          <table className="w-full mt-6 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">S.No.</th>
                <th className="border border-gray-300 px-4 py-2">
                  Department ID
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Department Name
                </th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dep) => (
                <tr key={dep._id} className="odd:bg-white even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {dep.sno}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {dep.departmentId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {dep.departmentName}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center flex justify-center">
                    <DepartmentButtons
                      _id={dep._id}
                      onDepartmentDelete={onDepartmentDelete}
                      user={user}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default DepartmentList;
