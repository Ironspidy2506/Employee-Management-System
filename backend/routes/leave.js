import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import { getLeaveHistory, applyForLeave, getLeaveById, updateLeaveById, deleteLeaveById, getLeaveBalance, getAllLeaves, approveOrReject, getSummary } from '../controllers/leaveController.js';

const router = express.Router();

router.post('/apply/:userId', authMiddleware, applyForLeave);
router.get("/history/:userId", authMiddleware, getLeaveHistory);
router.get("/edit/:_id", authMiddleware, getLeaveById);
router.put("/edit/:_id", authMiddleware, updateLeaveById);
router.delete('/:_id', authMiddleware, deleteLeaveById);
router.get("/:userId", authMiddleware, getLeaveBalance);
router.get("/admin/getLeaves", authMiddleware, getAllLeaves);
router.post('/:action/:leaveId', authMiddleware, approveOrReject);
router.get('/fetch/summary', authMiddleware, getSummary)


export default router;