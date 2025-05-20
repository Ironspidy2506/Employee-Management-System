import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";
import {
  getLeaveHistory,
  applyForLeave,
  getLeaveById,
  updateLeaveById,
  deleteLeaveById,
  getLeaveBalance,
  getAllLeaves,
  approveOrReject,
  getSummary,
  getLeaveAttachment,
  updateReasonOfRejection,
} from "../controllers/leaveController.js";

const router = express.Router();

router.post(
  "/apply/:userId",
  authMiddleware,
  upload.single("attachment"),
  applyForLeave
);
router.get("/history/:userId", authMiddleware, getLeaveHistory);
router.get("/edit/:_id", authMiddleware, getLeaveById);
router.put(
  "/edit/:_id",
  authMiddleware,
  upload.single("attachment"),
  updateLeaveById
);

router.delete("/:_id", authMiddleware, deleteLeaveById);
router.get("/:userId", authMiddleware, getLeaveBalance);
router.get("/admin/getLeaves", authMiddleware, getAllLeaves);
router.post("/:action/:leaveId", authMiddleware, approveOrReject);
router.get("/fetch/summary", authMiddleware, getSummary);
router.get("/attachment/:leaveId", getLeaveAttachment);
router.post(
  "/update-leave-ror/:leaveId",
  authMiddleware,
  updateReasonOfRejection
);

router.get('/admin-hr/get-all-leaves', authMiddleware, getAllLeaves)

export default router;
