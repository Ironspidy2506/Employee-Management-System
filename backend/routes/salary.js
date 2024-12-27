import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import { addSalary, getAllSalaries, getEmployeeSalaryDetails, getSalaryDetails, updateSalary } from '../controllers/salaryController.js';

const router = express.Router();

router.get("/", authMiddleware, getAllSalaries);

router.post('/add', authMiddleware, addSalary);

router.get('/:_id', authMiddleware, getSalaryDetails);

router.get('/employee/:employeeId', authMiddleware, getEmployeeSalaryDetails);

router.put('/:_id', authMiddleware, updateSalary);

export default router;