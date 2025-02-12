import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // e.g., "09:00"
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  endTime: {
    type: String, // e.g., "18:00"
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["el", "sl", "cl", "od", "others"],
    required: true,
  },
  days: {
    type: Number,
    required: true,
    min: 0.5,
  },
  status: {
    type: String,
    default: "pending",
  },
  appliedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },
  ],
  approvedBy: {
    type: String,
  },
  rejectedBy: {
    type: String,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
