import mongoose from "mongoose";
import { Schema } from "mongoose";
import Allowance from "./Allowances.js";
import Leave from "./Leave.js";
import User from "./User.js";
import Salary from "./Salary.js";
import Helpdesk from "./Helpdesk.js";
import Performance from "./Performance.js";

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
  korusEmail: {
    type: String,
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
  hod: {
    type: String,
    trim: true,
  },
  qualification: {
    type: String,
    required: true,
    trim: true,
  },
  yop: {
    type: String,
    trim: true,
  },
  contactNo: {
    type: Number,
    required: true,
  },
  altContactNo: {
    type: Number,
  },
  permanentAddress: {
    type: String,
    trim: true,
  },
  localAddress: {
    type: String,
    trim: true,
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
  passportNo: {
    type: String,
    trim: true,
  },
  passportType: {
    type: String,
    trim: true,
  },
  passportpoi: {
    type: String,
    trim: true,
  },
  passportdoi: {
    type: Date,
  },
  passportdoe: {
    type: Date,
  },
  nationality: {
    type: String,
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
  },
  branch: {
    type: String,
    trim: true,
  },
  ifsc: {
    type: String,
    trim: true,
  },
  accountNo: {
    type: String,
    trim: true,
  },
  repperson: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  doj: {
    type: Date,
    required: true,
  },
  dol: {
    type: Date,
  },
  profileImage: {
    type: String,
  },
  leaveBalance: {
    el: { type: Number, default: 30 },
    sl: { type: Number, default: 6 },
    cl: { type: Number, default: 6 },
    od: { type: Number, default: 0 },
    lwp: { type: Number, default: 0 },
    lhd: { type: Number, default: 0 },
    others: { type: Number, default: 0 },
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model("employee", employeeSchema);
export default Employee;
