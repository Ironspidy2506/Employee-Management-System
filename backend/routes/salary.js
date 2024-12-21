import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import { addSalary, getAllSalaries, getMostRecentSalaryDetails, getSalaryDetails, updateSalary } from '../controllers/salaryController.js';

const router = express.Router();

router.get("/", authMiddleware, getAllSalaries);

router.post('/add', authMiddleware, addSalary);

router.get('/:_id', authMiddleware, getSalaryDetails);

router.get('/edit/:employeeId', authMiddleware, getMostRecentSalaryDetails);

router.put('/:_id', authMiddleware, updateSalary);

export default router;