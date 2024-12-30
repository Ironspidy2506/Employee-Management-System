import mongoose from "mongoose";
import { Schema } from "mongoose";
import Allowance from "./Allowances.js";
import Leave from "./Leave.js";
import User from "./User.js";
import Salary from "./Salary.js";

const employeeSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  employeeId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Transgender"],
    required: true,
  },
  maritalStatus: {
    type: String,
    enum: ["Single", "Married", "Divorced", "Others"],
    required: true,
  },
  designation: {
    type: String,
    trim: true,
    required: true,
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "department",
    required: true,
  },
  qualification: {
    type: String,
    required: true,
    trim: true,
  },
  contactNo: {
    type: Number,
    required: true,
  },
  aadharNo: {
    type: String,
    trim: true,
    required: true,
  },
  pan: {
    type: String,
    trim: true,
    required: true,
  },
  uan: {
    type: String,
    trim: true,
  },
  pfNo: {
    type: String,
    trim: true,
  },
  esiNo: {
    type: String,
    trim: true,
  },
  bank: {
    type: String,
    trim: true,
    required: true,
  },
  accountNo: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  doj: {
    type: Date,
    required: true,
  },
  leaveBalance: {
    el: { type: Number, default: 24, min: 0 },
    sl: { type: Number, default: 7, min: 0 },
    cl: { type: Number, default: 7, min: 0 },
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

employeeSchema.pre("save", function (next) {
  const oneYear = 365 * 24 * 60 * 60 * 1000; // Milliseconds in a year
  const currentTime = Date.now();

  if (currentTime - this.lastUpdated >= oneYear) {
    this.leaveBalance.el += 24; // Increment EL balance annually
    this.lastUpdated = currentTime; // Update the timestamp
  }

  next();
});

employeeSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const employee = await Employee.findOne({ _id: this._id });

      if (!employee) throw new Error("Employee not found");
      const userId = employee.userId;

      await Leave.deleteMany({ employeeId: this._id });
      await Salary.deleteMany({ employeeId: this._id });
      await Allowance.deleteMany({ employeeId: this._id });

      await User.deleteOne({ _id: userId });

      next();
    } catch (error) {
      next(error);
    }
  }
);

const Employee = mongoose.model("employee", employeeSchema);
export default Employee;
