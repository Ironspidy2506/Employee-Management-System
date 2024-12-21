import mongoose from "mongoose";
import { Schema } from "mongoose";

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  workingDays: {
    type: Number,
    required: true,
    min: 0,
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  allowances: [
    {
      name: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
  deductions: [
    {
      name: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
  paymentDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Salary = mongoose.model("salary", salarySchema);
export default Salary;
