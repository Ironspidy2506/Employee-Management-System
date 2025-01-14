import mongoose from "mongoose";
import Employee from "./Employee.js";
import Leave from "./Leave.js";
import Salary from "./Salary.js";
import Allowance from "./Allowances.js";

const departmentSchema = new mongoose.Schema({
    departmentId: {
        type: String,
        required: true
    },
    departmentName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Department = mongoose.model("department", departmentSchema);
export default Department;