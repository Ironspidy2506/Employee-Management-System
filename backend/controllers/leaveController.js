import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const getLeaveHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const employee = await Employee.findOne({ userId });
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        const leaveHistory = await Leave.find({ employeeId: employee._id })
            .populate({
                path: "employeeId",
            })
            .sort({ startDate: -1 });

        res.status(200).json(leaveHistory);
    } catch (error) {
        console.error("Error fetching leave history:", error);
        res.status(500).json({ error: "Failed to fetch leave history" });
    }
};

const applyForLeave = async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate, reason, leaveType, days } = req.body;

        // Validate if the employee has enough leave balance
        const employee = await Employee.findOne({ userId });
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Check if the employee has enough leave balance
        const leaveBalance = employee.leaveBalance[leaveType];
        if (leaveBalance < days) {
            return res.status(400).json({ message: "Not enough leave balance" });
        }

        // Create a new leave entry
        const newLeave = new Leave({
            employeeId: employee._id,
            startDate,
            endDate,
            reason,
            type: leaveType,
            days,
        });

        await newLeave.save();

        await employee.save();

        // Return success response
        res.status(201).json({ message: "Leave applied successfully", leave: newLeave });
    } catch (error) {
        console.error("Error applying for leave:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getLeaveById = async (req, res) => {
    const { _id } = req.params;

    try {
        const leaveHistory = await Leave.findById({ _id });
        res.status(200).json(leaveHistory);
    } catch (error) {
        console.error("Error fetching leave history:", error);
        res.status(500).json({ error: "Failed to fetch leave history" });
    }
}

const updateLeaveById = async (req, res) => {
    const { _id } = req.params; // Get leave ID from request parameters
    const { leaveType, startDate, endDate, days } = req.body; // Get updated leave data from request body

    try {
        // Fetch existing leave document
        const leaveHistory = await Leave.findById(_id);
        if (!leaveHistory) {
            return res.status(404).json({ error: "Leave record not found" });
        }

        // Update the leave document with new data
        leaveHistory.leaveType = leaveType;
        leaveHistory.startDate = startDate;
        leaveHistory.endDate = endDate;
        leaveHistory.days = days;

        // Save the updated leave document
        const updatedLeave = await leaveHistory.save();

        res.status(200).json(updatedLeave); // Respond with the updated leave document
    } catch (error) {
        console.error("Error updating leave record:", error);
        res.status(500).json({ error: "Failed to update leave record" });
    }
};

const deleteLeaveById = async (req, res) => {
    const { _id } = req.params;

    try {
        // Find the leave record
        const leave = await Leave.findById(_id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave record not found",
            });
        }

        // Delete the leave record
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
    const { userId } = req.params;

    try {
        // Find the employee by userId
        const employee = await Employee.findOne({ userId });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        // Return the leave balance
        res.status(200).json({
            success: true,
            leaveBalance: employee.leaveBalance,
        });
    } catch (error) {
        console.error("Error fetching leave balance:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching leave balance",
        });
    }
};

const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate('employeeId');
        res.status(200).json(leaves);
    } catch (error) {
        console.error("Error fetching all leaves:", error);
        res.status(500).json({ message: "An error occurred while fetching leaves" });
    }
};

const approveOrReject = async (req, res) => {
    const { leaveId, action } = req.params; // Extract `leaveId` and `action` from params

    if (!['approved', 'rejected'].includes(action)) {
        return res.status(400).json({ error: "Invalid action. Must be 'approve' or 'reject'." });
    }

    try {
        // Find the leave request by ID
        const leave = await Leave.findById(leaveId).populate('employeeId');
        if (!leave) {
            return res.status(404).json({ error: 'Leave request not found.' });
        }

        if (leave.status !== 'pending') {
            return res.status(400).json({ error: 'Only pending leave requests can be updated.' });
        }

        const employee = leave.employeeId; // Populated employee document

        if (action === 'approved') {
            // Deduct leave days from the appropriate leave type
            const leaveType = leave.type.toLowerCase();
            if (employee.leaveBalance[leaveType] < leave.days) {
                return res.status(400).json({ error: 'Insufficient leave balance.' });
            }

            employee.leaveBalance[leaveType] -= leave.days; // Deduct leave balance
            leave.status = 'approved'; // Update leave status

            // Save updated employee document
            await employee.save();
        } else if (action === 'rejected') {
            leave.status = 'rejected'; // Update leave status
        }

        // Save updated leave document
        await leave.save();

        res.status(200).json({ message: `Leave successfully ${action}d.`, leave });
    } catch (error) {
        console.error(`Error while ${action}ing leave:`, error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const getSummary = async (req, res) => {
    try {
        // Calculate the total number of applied, approved, pending, and rejected leaves
        const leaveApplied = await Leave.countDocuments();
        const leaveApproved = await Leave.countDocuments({ status: "approved" });
        const leavePending = await Leave.countDocuments({ status: "pending" });
        const leaveRejected = await Leave.countDocuments({ status: "rejected" });

        // Respond with the leave data
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


export { getLeaveHistory, applyForLeave, getLeaveById, updateLeaveById, deleteLeaveById, getLeaveBalance, getAllLeaves, approveOrReject, getSummary };