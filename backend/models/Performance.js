import mongoose from "mongoose";
import { Schema } from "mongoose";

const performanceSchema = new mongoose.Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  projectTitle: {
    type: String,
    required: true,
  },
  drawingType: {
    type: String,
    required: true,
  },
  drawingReleased: {
    type: String,
    required: true,
  },
  drawings: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Performance = mongoose.model("performance", performanceSchema);
export default Performance;
