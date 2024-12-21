import { useNavigate } from "react-router-dom";
import axios from "axios";

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (_id) => {
    const confirm = window.confirm("Do you want to delete?");
    if (confirm) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/department/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          onDepartmentDelete(_id);
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
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200 w-full sm:w-auto"
        onClick={() =>
          navigate(`/admin-dashboard/departments/viewemployees/${_id}`)
        }
      >
        View
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 w-full sm:w-auto"
        onClick={() => navigate(`/admin-dashboard/departments/${_id}`)}
      >
        Edit
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-200 w-full sm:w-auto"
        onClick={() => handleDelete(_id)}
      >
        Delete
      </button>
    </div>
  );
};
