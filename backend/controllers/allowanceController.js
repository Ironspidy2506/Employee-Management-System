import Allowance from "../models/Allowances.js";
import Employee from "../models/Employee.js";

const addAllowance = async (req, res) => {
    const { _id } = req.params; // Get employeeId from URL params
    const { empName, allowanceType, client, projectNo, startDate, endDate, placeOfVisit, allowances, designation, department } = req.body;

    try {
        const employee = await Employee.findOne({ _id }).populate('department');

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const newAllowance = new Allowance({
            employeeId: employee._id,
            empName,
            designation,
            department,
            allowanceType,
            client,
            projectNo,
            startDate,
            endDate,
            placeOfVisit,
            allowances,
        });

        await newAllowance.save();

        return res.status(200).json({ message: 'Allowance added successfully', allowance: newAllowance });
    } catch (err) {
        console.error('Error adding allowance:', err);
        return res.status(500).json({ message: 'Error adding allowance', error: err.message });
    }
};

const getUserAllowance = async (req, res) => {
    try {
        const { userId } = req.params;
        const employee = await Employee.findOne({ userId });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const allowances = await Allowance.find({ employeeId: employee._id })
        if (!allowances) {
            return res.status(404).json({ message: 'No allowance history found' });
        }

        res.status(200).json(allowances); // Return the allowance data
    } catch (err) {
        console.error("Error fetching allowance history:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAllAllowance = async (req, res) => {
    try {
        const allowances = await Allowance.find().populate('employeeId').sort({ startDate: -1 });

        if (!allowances || allowances.length === 0) {
            return res.status(404).json({ message: 'No allowances found' });
        }

        return res.status(200).json(allowances);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const approveOrReject = async (req, res) => {
    const { id } = req.params;
    const { status, voucherNo } = req.body;

    try {
        const updatedAllowance = await Allowance.findByIdAndUpdate(
            id,
            { status, voucherNo },
            { new: true }
        );
        res.json(updatedAllowance);
    } catch (error) {
        res.status(500).json({ message: 'Error updating allowance', error });
    }
}

const getAllowanceById = async (req, res) => {
    const { _id } = req.params;

    try {
        const allowance = await Allowance.findById(_id).populate('employeeId');
        if (!allowance) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        res.status(200).json({
            success: true,
            allowance: allowance,
        });
        return allowance;
    } catch (error) {
        res.status(500).json({ message: 'Error updating allowance', error });
    }
}

const updateAllowance = async (req, res) => {
    try {
        // Destructure the updated form data from the request body
        const { _id } = req.params;
        const {
            empName,
            designation,
            department,
            client,
            projectNo,
            placeOfVisit,
            startDate,
            endDate,
            allowances,
        } = req.body;

        // Find the allowance record and update it
        const allowance = await Allowance.findByIdAndUpdate(
            _id,
            {
                empName,
                designation,
                department,
                client,
                projectNo,
                placeOfVisit,
                startDate,
                endDate,
                allowances, // Ensure you handle updating the allowances array here
            },
            { new: true } // This returns the updated document
        );

        if (!allowance) {
            return res.status(404).json({ message: 'Allowance not found' });
        }

        // Send the updated allowance data as response
        res.status(200).json({ message: 'Allowance updated successfully', allowance });
    } catch (err) {
        res.status(500).json({ message: 'Error updating allowance data', error: err });
    }
};


const deleteAllowance = async (req, res) => {
    try {
        const { _id } = req.params;

        const allowance = await Allowance.findByIdAndDelete(_id);

        if (!allowance) {
            return res.status(404).json({ message: 'Allowance not found' });
        }

        res.status(200).json({ message: 'Allowance deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting allowance', error: err });
    }
};


export { addAllowance, getUserAllowance, getAllAllowance, approveOrReject, getAllowanceById, updateAllowance, deleteAllowance };