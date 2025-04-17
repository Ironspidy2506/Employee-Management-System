import axios from "axios";

export const getLeaveRecords = async () => {
  try {
    const response = await axios.get(
      `https://korus-employee-management-system-mern-stack.vercel.app/api/leaves/admin/getLeaves`,
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

export const approveRejectLeave = async (leaveId, action) => {
  try {
    const response = await axios.post(`https://korus-employee-management-system-mern-stack.vercel.app/api/leaves/${action}/${leaveId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error(`Failed to ${action} leave with ID ${leaveId}:`, error);
    throw error;
  }
};
