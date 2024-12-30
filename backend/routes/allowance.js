import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import { addAllowance, getUserAllowance, getAllAllowance, approveOrReject, getAllowanceById, updateAllowance, deleteAllowance, addAllowanceAdmin, updateAllowanceAdmin } from '../controllers/allowanceController.js';

const router = express.Router();

router.post('/add/:userId', authMiddleware, addAllowance);
router.post('/admin/add-allowance/:employeeId', authMiddleware, addAllowanceAdmin)
router.get('/history/:userId', authMiddleware, getUserAllowance);
router.get('/fetchAllHistory', authMiddleware, getAllAllowance);
router.put('/:id', authMiddleware, approveOrReject)
router.get('/edit/:_id', authMiddleware, getAllowanceById)
router.put('/edit/:_id', authMiddleware, updateAllowance)
router.put('/admin/edit-allowance/:employeeId', authMiddleware, updateAllowanceAdmin)
router.delete('/delete/:_id',authMiddleware, deleteAllowance);

export default router;