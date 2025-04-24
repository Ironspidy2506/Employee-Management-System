import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
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
    message: {
      type: String,
    },
    reply: {
      type: String,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Message = mongoose.model("message", messageSchema);
export default Message;
