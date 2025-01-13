import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  date: {
    type: Date,
  },
});

const Holiday = mongoose.model("holiday", holidaySchema);
export default Holiday;
