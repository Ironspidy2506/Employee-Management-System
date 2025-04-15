import mongoose from "mongoose";
const { Schema } = mongoose;

const appraisalSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "employee",
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "department",
      required: true,
    },
    accomplishments: {
      type: String,
    },
    supervisor: [
      {
        type: Schema.Types.ObjectId,
        ref: "employee",
        required: true,
      },
    ],
    supervisorComments: {
      type: String,
    },
    ratings: {
      Punctuality: { type: String },
      Attendance: { type: String },
      JobKnowledge: { type: String },
      HumanRelations: { type: String },
      QualityOfWork: { type: String },
      Performance: { type: String },
      ProfessionalDevelopment: { type: String },
      Dedication: { type: String },
      WorkHabits: { type: String },
      Initiative: { type: String },
    },
    totalRating: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Appraisal = mongoose.model("appraisal", appraisalSchema);
export default Appraisal;
