import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getUserData,
  deleteUserData,
  updatePassword,
  getUserLeaveForApprovals,
  approveOrRejectLeaveTeamLead,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", authMiddleware, getUserData);
router.delete("/delete/:userId", authMiddleware, deleteUserData);
router.post("/update-password/:userId", authMiddleware, updatePassword);
router.get(
  "/get-leave-for-approvals/:userId",
  authMiddleware,
  getUserLeaveForApprovals
);
router.post(
  "/leave-action/:userId",
  authMiddleware,
  approveOrRejectLeaveTeamLead
);

export default router;
