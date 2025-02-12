import User from "../models/User.js";
import Leave from "../models/Leave.js";
import bcrypt from "bcrypt";
import Employee from "../models/Employee.js";

const getUserData = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.json({
      success: true,
      users,
      message: "User Data fetched Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const deleteUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete({ _id: userId });
    return res.json({
      success: true,
      message: "User Data deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Wrong Old Password!" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(
      userId,
      { password: hashPassword },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const getUserLeaveForApprovals = async (req, res) => {
  try {
    const { userId } = req.params;

    const employee = await Employee.findOne({ userId });
    const empId = employee._id;

    const leaves = await Leave.find({ appliedTo: { $in: [empId] } })
      .populate("employeeId")
      .populate("appliedTo")
      .sort({ lastUpdated: -1 });

    if (leaves.length === 0) {
      return res.status(404).json({ message: "No leaves found for approval." });
    }

    res.status(200).json({ leaves });
  } catch (error) {
    console.error("Error fetching leaves for approval:", error);
    res.status(500).json({ message: "Failed to fetch leaves for approval." });
  }
};

const approveOrRejectLeaveTeamLead = async (req, res) => {
  try {
    const { userId } = req.params;
    const { leaveId, action } = req.body;

    if (!["approve", "reject"].includes(action)) {
      return res.json({
        success: false,
        message: "Invalid action. Must be 'approve' or 'reject'.",
      });
    }

    const teamLead = await Employee.findOne({ userId });
    if (!teamLead) {
      return res.json({
        success: false,
        message: "Team lead not found.",
      });
    }

    const empName = teamLead.name;
    const leave = await Leave.findById(leaveId).populate("employeeId");

    if (!leave) {
      return res.json({
        success: false,
        message: "Leave request not found.",
      });
    }

    const employee = leave.employeeId;
    const leaveType = leave.type.toLowerCase();

    if (action === "approve") {
      // If the leave type is "OD" or others, increase leave balance instead of deducting
      if (["od", "others"].includes(leaveType)) {
        employee.leaveBalance[leaveType] += leave.days;
      } else {
        if (employee.leaveBalance[leaveType] < leave.days) {
          return res.json({
            success: false,
            message: `Insufficient leave balance for ${leaveType}.`,
          });
        }
        employee.leaveBalance[leaveType] -= leave.days;
      }
      leave.approvedBy = empName;
      await employee.save();
    }

    await leave.save();

    res.json({
      success: true,
      message: `Leave ${
        action === "approve" ? "approved" : "rejected"
      } successfully.`,
      leave,
    });
  } catch (error) {
    console.error("Error processing leave approval/rejection:", error);
    res.json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const hrUpdatePassword = async (req, res) => {
  try {
    const { employeeId, newPassword } = req.body;

    const employee = await Employee.findById(employeeId).populate("userId");
    if (!employee) {
      return res.json({ success: false, message: "Employee not found" });
    }

    const userId = employee.userId?._id;
    const hashPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(
      userId,
      { password: hashPassword },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getUserData,
  deleteUserData,
  updatePassword,
  getUserLeaveForApprovals,
  approveOrRejectLeaveTeamLead,
  hrUpdatePassword,
};
