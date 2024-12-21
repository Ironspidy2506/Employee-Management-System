import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import { addAllowance, getUserAllowance, getAllAllowance, approveOrReject, getAllowanceById, updateAllowance, deleteAllowance } from '../controllers/allowanceController.js';

const router = express.Router();

router.post('/add/:_id', authMiddleware, addAllowance);
router.get('/history/:userId', authMiddleware, getUserAllowance);
router.get('/fetchAllHistory', authMiddleware, getAllAllowance);
router.put('/:id', authMiddleware, approveOrReject)
router.get('/edit/:_id', authMiddleware, getAllowanceById)
router.put('/edit/:_id', authMiddleware, updateAllowance)
router.delete('/delete/:_id',authMiddleware, deleteAllowance);

export default router;