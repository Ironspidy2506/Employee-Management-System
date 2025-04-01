import mongoose from "mongoose";
import { Schema } from "mongoose";

const appraisalSchema = new mongoose.Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  
});

const Appraisal = mongoose.model("appraisal", appraisalSchema);
export default Appraisal;
