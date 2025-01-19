import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String, // e.g., "09:00"
        required: true, // Make it required if you always expect this field
    },
    endDate: {
        type: Date,
        required: true,
    },
    endTime: {
        type: String, // e.g., "18:00"
        required: true, // Make it required if you always expect this field
    },
    reason: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['el', 'sl', 'cl'],
        required: true,
    },
    days: {
        type: Number,
        required: true,
        min: 0.5,
    },
    status: {
        type: String,
        default: 'pending',
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;
