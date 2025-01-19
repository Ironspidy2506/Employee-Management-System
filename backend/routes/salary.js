import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import { addSalary, getMonthWiseSalaries, getEmployeeSalaryDetails, getSalaryDetails, updateSalary, getEmployeeWiseSalaryDetails } from '../controllers/salaryController.js';

const router = express.Router();

router.get("/monthly-wise/:month/:year", authMiddleware, getMonthWiseSalaries);

router.get("/employee-wise/:employeeId", authMiddleware, getEmployeeWiseSalaryDetails);

router.post('/add', authMiddleware, addSalary);

router.get('/:_id', authMiddleware, getSalaryDetails);

router.get('/employee/:employeeId', authMiddleware, getEmployeeSalaryDetails);

router.put('/:_id', authMiddleware, updateSalary);

export default router;