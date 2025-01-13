import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addHoliday,
  deleteHoliday,
  editHoliday,
  getHolidays,
} from "../controllers/holidayController.js";

const router = express.Router();

router.get("/", authMiddleware, getHolidays);
router.post("/add-holiday", authMiddleware, addHoliday);
router.put("/edit-holiday/:_id", authMiddleware, editHoliday);
router.delete("/delete-holiday/:_id", authMiddleware, deleteHoliday);

export default router;
