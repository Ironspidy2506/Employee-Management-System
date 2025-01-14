import path from "path";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import multer from "multer";
import Department from "../models/Department.js";
import Salary from "../models/Salary.js";
import Leave from "../models/Leave.js";
import Allowance from "../models/Allowances.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const addEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      email,
      korusEmail,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      hod,
      qualification,
      yop,
      contactNo,
      altContactNo,
      aadharNo,
      pan,
      passportNo,
      passportType,
      passportpoi,
      passportdoi,
      passportdoe,
      nationality,
      uan,
      pfNo,
      esiNo,
      bank,
      branch,
      ifsc,
      accountNo,
      repperson,
      role,
      password,
      doj,
    } = req.body;

    // Check if the email already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    // Hash the password before saving
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new User
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role: role.toLowerCase(),
      profileImage: req.file ? req.file.filename : "",
    });

    const savedUser = await newUser.save();

    // Create new Employee
    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      name,
      email,
      korusEmail,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      hod,
      qualification,
      yop,
      contactNo,
      altContactNo,
      aadharNo,
      pan,
      passportNo,
      passportType,
      passportpoi,
      passportdoi,
      passportdoe,
      nationality,
      uan,
      pfNo,
      esiNo,
      bank,
      branch,
      ifsc,
      accountNo,
      repperson,
      role: role ? role.toLowerCase() : undefined,
      password: hashPassword,
      doj,
    });

    await newEmployee.save();

    return res
      .status(200)
      .json({ success: true, message: "Employee Added Successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Add Employee Server Error" });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Get Employee Server Error" });
  }
};

const getEmployee = async (req, res) => {
  try {
    const { _id } = req.params;
    const employee = await Employee.findById(_id)
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, employee });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const getEmployeeForSummary = async (req, res) => {
  try {
    const { _id } = req.params;

    const employee = await Employee.findOne({ userId: _id })
      .populate("userId", { password: 0 })
      .populate("department");

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { _id } = req.params;

    const {
      employeeId,
      name,
      email,
      korusEmail,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      hod,
      qualification,
      yop,
      contactNo,
      altContactNo,
      aadharNo,
      pan,
      passportNo,
      passportType,
      passportpoi,
      passportdoi,
      passportdoe,
      nationality,
      uan,
      pfNo,
      esiNo,
      bank,
      branch,
      ifsc,
      accountNo,
      repperson,
      role,
      doj,
    } = req.body;

    const profileImage = req.file ? req.file.path : null;

    // Find the employee document by ID
    const employee = await Employee.findById(_id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee Not Found" });
    }

    // Find the associated user document
    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    // Update the user document
    const updatedUserFields = {
      ...(name && { name }),
      ...(role && { role }),
      ...(profileImage && { profileImage }),
    };

    if (Object.keys(updatedUserFields).length > 0) {
      await User.findByIdAndUpdate(employee.userId, updatedUserFields);
    }

    // Prepare updated fields for the employee document
    const updatedEmployeeFields = {
      ...(name && { name }),
      ...(email && { email }),
      ...(korusEmail && { korusEmail }),
      ...(employeeId && { employeeId }),
      ...(dob && { dob }),
      ...(gender && { gender }),
      ...(maritalStatus && { maritalStatus }),
      ...(designation && { designation }),
      ...(department && { department }),
      ...(hod && { hod }),
      ...(qualification && { qualification }),
      ...(yop && { yop }),
      ...(contactNo && { contactNo }),
      ...(altContactNo && { altContactNo }),
      ...(aadharNo && { aadharNo }),
      ...(pan && { pan }),
      ...(passportNo && { passportNo }),
      ...(passportType && { passportType }),
      ...(passportpoi && { passportpoi }),
      ...(passportdoi && { passportdoi }),
      ...(passportdoe && { passportdoe }),
      ...(nationality && { nationality }),
      ...(uan && { uan }),
      ...(pfNo && { pfNo }),
      ...(esiNo && { esiNo }),
      ...(bank && { bank }),
      ...(branch && { branch }),
      ...(ifsc && { ifsc }),
      ...(accountNo && { accountNo }),
      ...(repperson && { repperson }),
      ...(role && { role }),
      ...(doj && { doj }),
    };

    // Update the employee document
    const updatedEmployee = await Employee.findByIdAndUpdate(
      _id,
      updatedEmployeeFields,
      { new: true } // Return the updated document
    );

    if (!updatedEmployee) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to update employee" });
    }

    return res.status(200).json({
      success: true,
      message: "Employee Updated Successfully!",
      data: updatedEmployee,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Edit Employee Server Error" });
  }
};

const fetchEmployeesByDepId = async (req, res) => {
  try {
    const { _id } = req.params;
    const employees = await Employee.find({ department: _id }).populate(
      "employeeId"
    );
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Get Employees by Department Id Server Error",
    });
  }
};

const getSalaryDetailsOfEmployee = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request parameters
    const { paymentMonth, paymentYear } = req.query; // Access from query instead of body
    // Find employee by userId (adjust query if needed)
    const employee = await Employee.findOne({ userId: userId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const empId = employee._id;

    const salary = await Salary.findOne({
      employeeId: empId,
      paymentMonth,
      paymentYear,
    }).populate("employeeId");

    if (!salary) {
      return res.status(404).json({ message: "Salary record not found." });
    }

    return res.json({
      grossSalary: salary.grossSalary,
      basicSalary: salary.basicSalary,
      payableDays: salary.payableDays,
      sundays: salary.sundays,
      netPayableDays: salary.netPayableDays,
      allowances: salary.allowances,
      deductions: salary.deductions,
      paymentMonth: salary.paymentMonth,
      paymentYear: salary.paymentYear,
    });
  } catch (error) {
    console.error("Error fetching salary details:", error);
    return res.status(500).json({ message: "Error fetching salary details." });
  }
};

const getEmployeeLeaves = async (req, res) => {
  try {
    const { _id } = req.params;
    // Fetch leaves for the given employee ID
    const leaves = await Leave.find({ employeeId: _id }).sort({
      startDate: -1,
    }); // Sort by latest start date
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leave history" });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { _id } = req.params;

    const employee = await Employee.findOne({ _id });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    await employee.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Employee Deleted Successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getEmployeeSummaryForAllowances = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await Employee.findOne({ employeeId }).populate(
      "department"
    );

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Backend Server Error" });
  }
};

const updateEmployeeLeaveBalance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { el, cl, sl, od } = req.body;

    const employee = await Employee.findOne({ employeeId: employeeId });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    const updatedLeaveBalance = {
      el: el !== undefined ? el : employee.leaveBalance.el,
      cl: cl !== undefined ? cl : employee.leaveBalance.cl,
      sl: sl !== undefined ? sl : employee.leaveBalance.sl,
      od: od !== undefined ? od : employee.leaveBalance.od,
    };

    employee.leaveBalance = updatedLeaveBalance;

    await employee.save();

    return res.status(200).json({
      success: true,
      message: "Leave balance updated successfully",
      data: employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Server error while updating leave balance",
    });
  }
};

export {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepId,
  getEmployeeForSummary,
  getSalaryDetailsOfEmployee,
  getEmployeeLeaves,
  deleteEmployee,
  getEmployeeSummaryForAllowances,
  updateEmployeeLeaveBalance,
};
