import { useNavigate } from "react-router-dom";
import axios from "axios";

export const fetchDepartments = async () => {
  let departments;
  try {
    const response = await axios.get("https://employee-management-system-backend-objq.onrender.com/api/department", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.data.success) {
      departments = response.data.departments;
    }
  } catch (error) {
    if (error.response && error.response.data.error) {
      alert(error.response.data.error);
    }
  }
  return departments;
};

export const EmployeeButtons = ({ _id, onEmployeeDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (_id) => {
    const confirm = window.confirm("Do you want to delete?");
    if (confirm) {
      try {
        const response = await axios.delete(
          `https://employee-management-system-backend-objq.onrender.com/api/employees/delete/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          onEmployeeDelete(_id);
        }
      } catch (error) {
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        }
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2 m-1">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 w-full sm:w-auto"
        onClick={() => navigate(`/admin-dashboard/employees/${_id}`)}
      >
        View
      </button>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 w-full sm:w-auto"
        onClick={() => navigate(`/admin-dashboard/employees/edit/${_id}`)}
      >
        Edit
      </button>

      <button
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-200 w-full sm:w-auto"
        onClick={() => navigate(`/admin-dashboard/employees/salary/${_id}`)}
      >
        Salary
      </button>

      <button
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-200 w-full sm:w-auto"
        onClick={() => navigate(`/admin-dashboard/employees/leave/${_id}`)}
      >
        Leave
      </button>

      <button
        onClick={() => handleDelete(_id)} // Trigger the delete function
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
      >
        Delete
      </button>
    </div>
  );
};