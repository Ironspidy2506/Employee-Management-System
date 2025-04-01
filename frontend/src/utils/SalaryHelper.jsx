import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.error(error.response.data.error);
    }
  }
  return departments;
};

export const fetchEmployeeById = async (_id) => {
  let employees;
  try {
    const response = await axios.get(
      `https://employee-management-system-backend-objq.onrender.com/api/employees/allowances/summary/${_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.success) {
      employees = response.data.employees;
    }
  } catch (error) {
    if (error.response && error.response.data.error) {
      toast.error(error.response.data.error);
    }
  }
  return employees;
};

export const getSalaryDetails = async ({
  employeeId,
  paymentMonth,
  paymentYear,
}) => {
  try {
    const response = await axios.get(
      `https://employee-management-system-backend-objq.onrender.com/api/salary/${employeeId}?paymentMonth=${paymentMonth}&paymentYear=${paymentYear}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    return response.data.salary || null;
  } catch (error) {
    console.error("Error fetching salary details:", error);
    throw error;
  }
};

export const updateSalary = async (employeeId, payload) => {
  try {
    await axios.put(`https://employee-management-system-backend-objq.onrender.com/api/salary/${employeeId}`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  } catch (error) {
    console.error("Error updating salary:", error);
    throw error;
  }
};

