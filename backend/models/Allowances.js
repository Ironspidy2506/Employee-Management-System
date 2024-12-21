import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const allowanceSchema = new mongoose.Schema({
    allowanceType: {
        type: String,
        required: true,
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'employee',
        required: true,
    },
    empName: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    client: {
        type: String,
        required: true,
    },
    projectNo: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    placeOfVisit: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
    },
    voucherNo: {
        type: String,
        default: ""
    },
    pdf: {
        type: Buffer,
    },
    allowances: [
        {
            detail: {
                type: String,
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
        },
    ],
});

const Allowance = mongoose.model('allowance', allowanceSchema);
export default Allowance;
