import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addAllowanceAdmin, getAllAllowance, updateAllowanceAdmin, getUserAllowance } from "../controllers/fixedallowancecontroller.js";

const router = express.Router();

router.post(
  "/admin/add-fixed-allowance/:employeeId",
  authMiddleware,
  addAllowanceAdmin
);
router.get('/history/:userId', authMiddleware, getUserAllowance);
router.get("/fetchAllHistory", authMiddleware, getAllAllowance);
// router.put('/:id', authMiddleware, approveOrReject)
// router.get('/edit/:_id', authMiddleware, getAllowanceById)
// router.put('/edit/:_id', authMiddleware, updateAllowance)
router.put(
  "/admin/edit-fixed-allowance/:employeeId",
  authMiddleware,
  updateAllowanceAdmin
);

export default router;
