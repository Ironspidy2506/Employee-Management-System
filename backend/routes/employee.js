import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import { addEmployee, upload, getEmployee, getEmployees, updateEmployee, fetchEmployeesByDepId, getEmployeeForSummary, getSalaryDetailsOfEmployee, getEmployeeLeaves, deleteEmployee } from '../controllers/employeeController.js';

const router = express.Router();

router.get('/', authMiddleware, getEmployees);
router.post('/add', authMiddleware, upload.single("profileImage"), addEmployee);
router.get('/:_id', authMiddleware, getEmployee);
router.get('/summary/:_id', authMiddleware, getEmployeeForSummary);
router.get('/salary/:userId', authMiddleware, getSalaryDetailsOfEmployee);
router.put('/:_id', authMiddleware, updateEmployee);
router.get('/department/:_id', authMiddleware, fetchEmployeesByDepId);
router.get('/leaves/:_id', authMiddleware, getEmployeeLeaves);
router.delete('/delete/:_id', authMiddleware, deleteEmployee);

export default router;