import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import transporter from "../config/nodemailer.js";

const getLeaveHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const leaveHistory = await Leave.find({ employeeId: employee._id })
      .populate({
        path: "employeeId",
      })
      .sort({ lastUpdated: -1 });

    res.status(200).json(leaveHistory);
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).json({ error: "Failed to fetch leave history" });
  }
};

const applyForLeave = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, startTime, endDate, endTime, reason, leaveType, days } =
      req.body;

    // Parse appliedTo field
    let appliedTo = [];
    try {
      appliedTo = JSON.parse(req.body.appliedTo || "[]"); // Convert back to array
      if (!Array.isArray(appliedTo) || appliedTo.length === 0) {
        return res.status(400).json({ message: "Invalid 'appliedTo' data" });
      }
    } catch (error) {
      return res.status(400).json({ message: "Invalid 'appliedTo' format" });
    }

    // Find the employee making the request
    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Convert leaveType to lowercase for consistency
    const leaveTypeLower = leaveType.toLowerCase();

    // Skip leave balance check for "od", "others", and "lwp"
    if (!["od", "others", "lwp"].includes(leaveTypeLower)) {
      const leaveBalance = employee.leaveBalance[leaveTypeLower];
      if (leaveBalance < days) {
        return res.status(400).json({ message: "Not enough leave balance" });
      }
    }

    // Validate if approvers exist
    const approvers = await Employee.find({ _id: { $in: appliedTo } });
    if (approvers.length !== appliedTo.length) {
      return res
        .status(404)
        .json({ message: "One or more approvers not found" });
    }

    // Handle file attachments
    let attachment = null;
    if (req.file) {
      attachment = {
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileData: req.file.buffer, // Store file as Buffer
      };
    }

    // Create the leave entry
    const newLeave = new Leave({
      employeeId: employee._id,
      startDate,
      startTime,
      endDate,
      endTime,
      reason,
      type: leaveTypeLower,
      days,
      appliedTo,
      attachment, // Single attachment (matching updateLeaveById)
    });

    await newLeave.save();

    // Extract approvers' emails
    const approverEmails = approvers
      .map((approver) => approver.email)
      .join(",");

    // Send email notification
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: approverEmails,
      subject: "New Leave Application",
      html: `
        <p>Dear Approver,</p>
        <p><strong>${employee.name}</strong> has applied for leave from <strong>${startDate}</strong> to <strong>${endDate}</strong>.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please review the request.</p>
        <br>
        <p>Best Regards,<br><strong>Korus Engineering Solutions Pvt. Ltd.</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Leave applied successfully", leave: newLeave });
  } catch (error) {
    console.error("Error applying for leave:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getLeaveById = async (req, res) => {
  try {
    const { _id } = req.params;
    const leaveHistory = await Leave.findById({ _id }).populate("appliedTo");
    res.status(200).json(leaveHistory);
  } catch (error) {
    console.error("Error fetching leave history:", error);
    res.status(500).json({ error: "Failed to fetch leave history" });
  }
};

const updateLeaveById = async (req, res) => {
  try {
    const { _id } = req.params;

    // Parse JSON fields
    const appliedTo = JSON.parse(req.body.appliedTo || "[]"); // Convert back to array

    const { startDate, startTime, endDate, endTime, reason, leaveType, days } =
      req.body;

    // Find the leave record
    const leaveHistory = await Leave.findById(_id);
    if (!leaveHistory) {
      return res.status(404).json({ error: "Leave record not found" });
    }

    // Find the employee who applied for leave
    const employee = await Employee.findById(leaveHistory.employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Convert leaveType to lowercase for consistency
    const leaveTypeLower = leaveType.toLowerCase();

    // Check leave balance if leaveType is NOT "od", "others", or "lwp"
    if (!["od", "others", "lwp"].includes(leaveTypeLower)) {
      const leaveBalance = employee.leaveBalance[leaveTypeLower];
      if (leaveBalance < days) {
        return res.status(400).json({ message: "Not enough leave balance" });
      }
    }

    // Validate and update appliedTo field
    const approvers = await Employee.find({ _id: { $in: appliedTo } });
    if (approvers.length !== appliedTo.length) {
      return res
        .status(404)
        .json({ message: "One or more approvers not found" });
    }
    leaveHistory.appliedTo = appliedTo;

    // Handle file attachment if present
    if (req.file) {
      console.log("File uploaded:", req.file);
      leaveHistory.attachment = {
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileData: req.file.buffer, // Store file as Buffer
      };
    }

    // Update leave record fields
    leaveHistory.type = leaveTypeLower;
    leaveHistory.startDate = startDate;
    leaveHistory.startTime = startTime;
    leaveHistory.endDate = endDate;
    leaveHistory.endTime = endTime;
    leaveHistory.days = days;
    leaveHistory.reason = reason;

    // Save the updated leave record
    const updatedLeave = await leaveHistory.save();
    res.json({ message: "Leave updated successfully", leave: updatedLeave });
  } catch (error) {
    console.error("Error updating leave record:", error);
    res.status(500).json({ error: "Failed to update leave record" });
  }
};

const deleteLeaveById = async (req, res) => {
  try {
    const { _id } = req.params;
    const leave = await Leave.findById(_id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave record not found",
      });
    }

    await Leave.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      message: "Leave record deleted successfully and leave balance updated",
    });
  } catch (error) {
    console.error("Error deleting leave:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting leave record",
    });
  }
};

const getLeaveBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      leaveBalance: employee.leaveBalance,
    });
  } catch (error) {
    console.error("Error fetching leave balance:", error);
    res.json({
      success: false,
      message: "Error fetching leave balance",
    });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({
        path: "employeeId",
        populate: {
          path: "department", // 🔁 the correct field name in Employee schema
          model: "department", // ✅ should match your Department model name
        },
      })
      .sort({ lastUpdated: -1 });

    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching all leaves:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching leaves" });
  }
};

const approveOrReject = async (req, res) => {
  try {
    const { leaveId, action } = req.params;

    if (!["approved", "rejected"].includes(action)) {
      return res.json({
        error: "Invalid action. Must be 'approved' or 'rejected'.",
      });
    }

    const leave = await Leave.findById(leaveId).populate("employeeId");
    if (!leave) {
      return res.status(404).json({ error: "Leave request not found." });
    }

    if (leave.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Only pending leave requests can be updated." });
    }

    const employee = leave.employeeId;
    const leaveType = leave.type.toLowerCase();

    if (action === "approved") {
      if (["od", "lwp", "others"].includes(leaveType)) {
        // Add leave days for OD or Other leave types
        employee.leaveBalance[leaveType] += leave.days;
      } else {
        // Deduct leave balance for normal leave types
        if (employee.leaveBalance[leaveType] < leave.days) {
          return res.status(400).json({ error: "Insufficient leave balance." });
        }
        employee.leaveBalance[leaveType] -= leave.days;
      }

      leave.status = "approved";
      leave.approvedBy = "Admin";

      await employee.save();
    } else if (action === "rejected") {
      leave.status = "rejected";
      leave.rejectedBy = "Admin";
    }

    await leave.save();

    res.status(200).json({ message: `Leave successfully ${action}d.`, leave });
  } catch (error) {
    console.error(`Error while ${action}ing leave:`, error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getSummary = async (req, res) => {
  try {
    const leaveApplied = await Leave.countDocuments();
    const leaveApproved = await Leave.countDocuments({ status: "approved" });
    const leavePending = await Leave.countDocuments({ status: "pending" });
    const leaveRejected = await Leave.countDocuments({ status: "rejected" });

    return res.json({
      success: true,
      leaveApplied,
      leaveApproved,
      leavePending,
      leaveRejected,
    });
  } catch (error) {
    console.error("Error fetching leave summary:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getLeaveAttachment = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const leave = await Leave.findById(leaveId);

    if (!leave || !leave.attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    res.set("Content-Type", leave.attachment.fileType);
    res.send(leave.attachment.fileData);
  } catch (error) {
    console.error("Error fetching attachment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getLeaveHistory,
  applyForLeave,
  getLeaveById,
  updateLeaveById,
  deleteLeaveById,
  getLeaveBalance,
  getAllLeaves,
  approveOrReject,
  getSummary,
  getLeaveAttachment,
};
