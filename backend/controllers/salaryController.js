import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";

export const addSalary = async (req, res) => {
    const { employeeId, workingDays, basicSalary, allowances, deductions, paymentDate } = req.body;

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(400).json({ success: false, message: 'Employee not found' });
        }

        const newSalary = new Salary({
            employeeId,
            workingDays,
            basicSalary,
            allowances,
            deductions,
            paymentDate,
        });

        await newSalary.save();

        res.status(201).json({ success: true, salary: newSalary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getSalaryDetails = async (req, res) => {
    const { _id } = req.params; // Get employeeId from URL

    try {
        const salaries = await Salary.find({ employeeId: _id }).populate('employeeId');

        if (!salaries.length) {
            return res.status(404).json({ message: 'No salary history found for this employee.' });
        }

        res.json(salaries);
    } catch (error) {
        console.error('Error fetching salary details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update salary details for a specific employee
export const updateSalary = async (req, res) => {
    const { _id } = req.params; // Now we get employeeId from URL
    const { basicSalary,
        workingDays,
        paymentDate,
        allowances,
        deductions } = req.body;

    try {
        // Find the salary document for the given employeeId
        const salary = await Salary.findOne({ employeeId: _id })
            .sort({ paymentDate: -1 })  // Sort by most recent paymentDate
            .limit(1)  // Limit to only one document
            .exec();

        if (!salary) {
            return res.status(404).json({ message: 'Salary details not found' });
        }

        // Update the salary details
        if (basicSalary !== undefined) salary.basicSalary = basicSalary;
        if (workingDays !== undefined) salary.workingDays = workingDays;
        if (paymentDate !== undefined) salary.paymentDate = paymentDate;
        if (allowances !== undefined) salary.allowances = allowances;
        if (deductions !== undefined) salary.deductions = deductions;
        // Save the updated salary
        await salary.save();

        res.json({ message: 'Salary updated successfully', salary });
    } catch (error) {
        console.error('Error updating salary:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllSalaries = async (req, res) => {
    try {
        const salaries = await Salary.find().populate("employeeId");
        res.status(200).json(salaries);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch salaries", error });
    }
}

export const getMostRecentSalaryDetails = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const salary = await Salary.findOne({ employeeId: employeeId }).populate('employeeId')
            .sort({ createdAt: -1 })
            .exec();

        if (!salary) {
            return res.status(404).json({ message: 'Salary details not found' });
        }

        res.status(200).json(salary);
    } catch (error) {
        console.error('Error fetching salary details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
