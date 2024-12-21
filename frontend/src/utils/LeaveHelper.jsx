import axios from "axios";

export const getLeaveHistory = async (userId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/leaves/history/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching leave history:", error);
    throw new Error("Failed to fetch leave history");
  }
};

export const getLeaveById = async (_id) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/leaves/edit/${_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching leave history:", error);
    throw new Error("Failed to fetch leave history");
  }
};

export const updateLeave = async (_id, formData) => {
  try {
    // Fetch the current leave details
    const leaveResponse = await axios.get(
      `http://localhost:5000/api/leaves/edit/${_id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // Update the leave details
    const leaveUpdateResponse = await axios.put(
      `http://localhost:5000/api/leaves/edit/${_id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return leaveUpdateResponse.data;
  } catch (error) {
    console.error("Error updating leave:", error);
    throw new Error("Failed to update leave");
  }
};

export const deleteLeave = async (leaveId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/leaves/${leaveId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting leave:", error);
    throw new Error("Failed to delete leave");
  }
};

export const fetchLeaveBalance = async (userId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/leaves/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response);
    return response.data.leaveBalance;
  } catch (error) {
    console.error("Error fetching leave balance:", error);
    throw error;
  }
};
