import FixedAllowance from "../models/FixedAllowance.js";
import Employee from "../models/Employee.js";

const addAllowanceAdmin = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    const {
      allowanceMonth,
      allowanceYear,
      allowanceType,
      client,
      projectNo,
      allowanceAmount,
    } = req.body;

    const existingAllowance = await FixedAllowance.findOne({
      employeeId: employee._id,
      client,
      projectNo,
      allowanceMonth,
      allowanceYear,
      allowanceType,
    });

    if (existingAllowance) {
      // Update the existing allowance by adding the new amount
      existingAllowance.allowanceAmount += parseFloat(allowanceAmount);
      await existingAllowance.save();

      return res.status(200).json({
        success: true,
        message: "Allowance updated successfully",
        allowance: existingAllowance,
      });
    }

    // If no existing allowance, create a new one
    const newAllowance = new FixedAllowance({
      employeeId: employee._id,
      client,
      projectNo,
      allowanceMonth,
      allowanceYear,
      allowanceType,
      allowanceAmount,
      status: "approved",
    });

    await newAllowance.save();

    res.status(201).json({
      success: true,
      message: "Allowance created successfully",
      allowance: newAllowance,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const getUserAllowance = async (req, res) => {
  try {
    const { userId } = req.params;
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const allowances = await FixedAllowance.find({ employeeId: employee._id });
    if (!allowances) {
      return res.status(404).json({ message: "No allowance history found" });
    }
    

    res.status(200).json(allowances); // Return the allowance data
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllAllowance = async (req, res) => {
  try {
    const allowances = await FixedAllowance.find().populate("employeeId");

    if (!allowances || allowances.length === 0) {
      return res.status(404).json({ message: "No allowances found" });
    }

    return res.status(200).json(allowances);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllowanceById = async (req, res) => {
  try {
    const { _id } = req.params;
    const allowance = await FixedAllowance.findById(_id).populate("employeeId");
    if (!allowance) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      allowance: allowance,
    });
    return allowance;
  } catch (error) {
    res.status(500).json({ message: "Error updating allowance", error });
  }
};

const updateAllowanceAdmin = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const {
      allowanceMonth,
      allowanceYear,
      allowanceType,
      client,
      projectNo,
      allowanceAmount,
    } = req.body;
    // Find the allowance record and update it
    const empId = employee._id;

    const searchAllowance = await FixedAllowance.findOne({
      employeeId: empId,
      allowanceMonth,
      allowanceYear,
      allowanceType,
      client,
      projectNo,
    });

    if (!searchAllowance) {
      return res.json({
        success: false,
        message: "Allowance not found, kindly add first!",
      });
    }

    const allowance = await FixedAllowance.findOneAndUpdate(
      {
        employeeId: empId,
        allowanceMonth,
        allowanceYear,
        allowanceType,
        client,
        projectNo,
        voucherNo: "",
      },
      {
        allowanceMonth,
        allowanceYear,
        allowanceType,
        client,
        projectNo,
        allowanceAmount,
      },
      { new: true }
    );

    if (!allowance) {
      return res.json({ success: false, message: "Allowance not found" });
    }

    return res.json({
      success: true,
      message: "Allowance updated successfully",
      allowance,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Error updating allowance data",
      error: err,
    });
  }
};

const deleteAllowance = async (req, res) => {
  try {
    const { _id } = req.params;

    const allowance = await FixedAllowance.findByIdAndDelete(_id);

    if (!allowance) {
      return res.json({ message: "Allowance not found" });
    }
    res.status(200).json({ message: "Allowance deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting allowance", error: err });
  }
};

export {
  addAllowanceAdmin,
  getUserAllowance,
  getAllAllowance,
  getAllowanceById,
  updateAllowanceAdmin,
  deleteAllowance,
};
