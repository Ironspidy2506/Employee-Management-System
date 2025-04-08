import axios from "axios";

export const getLeaveHistory = async (userId) => {
  try {
    const response = await axios.get(
      `https://korus-ems-backend.onrender.com/api/leaves/history/${userId}`,
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
      `https://korus-ems-backend.onrender.com/api/leaves/edit/${_id}`,
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
    // Update the leave details
    const leaveUpdateResponse = await axios.put(
      `https://korus-ems-backend.onrender.com/api/leaves/edit/${_id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
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
      `https://korus-ems-backend.onrender.com/api/leaves/${leaveId}`,
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
      `https://korus-ems-backend.onrender.com/api/leaves/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data.leaveBalance;
  } catch (error) {
    console.error("Error fetching leave balance:", error);
    throw error;
  }
};
