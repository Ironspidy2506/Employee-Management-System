import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addPerformance,
  deletePerformance,
  editPerformance,
  getEmployeePerformance,
  getPerformances,
  getUserPerformances,
} from "../controllers/performanceController.js";

const router = express.Router();

router.get("/month-year-basis/:month/:year", authMiddleware, getPerformances);
router.get(
  "/get-user-performances/:userId",
  authMiddleware,
  getUserPerformances
);
router.post("/get-employee-performance", authMiddleware, getEmployeePerformance);
router.post("/add-performance", authMiddleware, addPerformance);
router.put("/edit-performance/:performanceId", authMiddleware, editPerformance);
router.delete(
  "/delete-performance/:performanceId",
  authMiddleware,
  deletePerformance
);

export default router;
