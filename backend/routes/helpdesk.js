import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  applyHelp,
  getMyHelps,
  getHelp,
  updateHelp,
  getAllHelps,
  resolveHelp,
  deleteHelp,
  addResponse
} from "../controllers/helpdeskController.js";

const router = express.Router();

router.get("/", authMiddleware, getAllHelps);
router.put("/apply-help", authMiddleware, applyHelp);
router.get("/my-queries/:_id", authMiddleware, getMyHelps);
router.get("/:_id", authMiddleware, getHelp);
router.put("/update-help/:_id", authMiddleware, updateHelp);
router.put("/resolve-help/:_id", authMiddleware, resolveHelp);
router.put("/add-response/:helpId", authMiddleware, addResponse);
router.delete("/delete-help/:_id", authMiddleware, deleteHelp);

export default router;
