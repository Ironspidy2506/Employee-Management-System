import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import upload from '../config/multer.js';
import { addEmployee, getEmployee, getEmployees, updateEmployee, fetchEmployeesByDepId, getEmployeeForSummary, getSalaryDetailsOfEmployee, getEmployeeLeaves, deleteEmployee, getEmployeeSummaryForAllowances, updateEmployeeLeaveBalance, updateEmployeeJourney, getGrossSalary } from '../controllers/employeeController.js';

const router = express.Router();

router.get('/', authMiddleware, getEmployees);
router.post('/add', authMiddleware, upload.single("profileImage"), addEmployee);
router.get('/:_id', authMiddleware, getEmployee);
router.get('/summary/:_id', authMiddleware, getEmployeeForSummary);
router.get('/allowances/summary/:employeeId', authMiddleware, getEmployeeSummaryForAllowances);
router.get('/salary/:userId', authMiddleware, getSalaryDetailsOfEmployee);
router.put('/:_id', authMiddleware, upload.single("profileImage"), updateEmployee);
router.put('/edit-leave-balance/:employeeId', authMiddleware, updateEmployeeLeaveBalance);
router.put('/update-journey/:employeeId',authMiddleware, updateEmployeeJourney)
router.get('/department/:_id', authMiddleware, fetchEmployeesByDepId);
router.get('/leaves/:_id', authMiddleware, getEmployeeLeaves);
router.delete('/delete/:_id', authMiddleware, deleteEmployee);
router.get('/:employeeId/:paymentMonth/:paymentYear', authMiddleware, getGrossSalary);

export default router;