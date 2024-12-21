import axios from "axios";

export const fetchDepartments = async () => {
  let departments;
  try {
    const response = await axios.get("http://localhost:5000/api/department", {
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

export const fetchEmployees = async (_id) => {
  let employees;
  try {
    const response = await axios.get(
      `http://localhost:5000/api/employees/department/${_id}`,
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
      alert(error.response.data.error);
    }
  }
  return employees;
};

export const addSalaries = async (payload) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/salary/add",
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error in addSalaries helper:", error);
  }
};

export const getSalaryDetails = async (_id) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/salary/${_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error fetching salary details:", error);
    throw error;
  }
};

export const updateSalary = async (employeeId, payload) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/salary/${employeeId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you're using a token for auth
        },
      }
    );
    return response.data; // Return the updated salary details or success response
  } catch (error) {
    console.error("Error updating salary:", error);
    throw error;
  }
};

export const getAllSalaries = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/salary", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data; // Assuming the backend sends an array of salaries
  } catch (error) {
    console.error("Error fetching salaries:", error);
    throw error;
  }
};

export const getRecentSalaryDetails = async (employeeId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/salary/edit/${employeeId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error fetching salary details:", error);
    throw error;
  }
};
