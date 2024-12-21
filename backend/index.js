import express from "express";
import cors from "cors";
import { config } from "dotenv";
import authRouter from "./routes/auth.js";
import dbConnect from "./config/db.js";
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import salaryRouter from './routes/salary.js';
import leaveRouter from './routes/leave.js';
import allowanceRouter from './routes/allowance.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
config({ path: ".env" }); 

app.use(cors({
    origin: 'https://employee-management-system-roan-pi.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));

dbConnect();

app.use(express.static('public/uploads'));
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/leaves', leaveRouter);
app.use('/api/allowances', allowanceRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server started on ${process.env.PORT}`);
});