import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addAppraisal,
  deleteAppraisal,
  editAppraisal,
  getAppraisalById,
  getAppraisals,
  getAppraisalsTeamLead,
  getUserAppraisals,
} from "../controllers/appraisalController.js";
const router = express.Router();

router.get("/get-appraisal-by-id/:id", authMiddleware, getAppraisalById);

router.post("/add-appraisal", authMiddleware, addAppraisal);

router.get("/view-all-appraisals", authMiddleware, getAppraisals);

router.post("/edit-appraisal/:id", authMiddleware, editAppraisal);

router.delete("/delete-appraisal/:id", authMiddleware, deleteAppraisal);

router.get("/get-user-appraisal/:userId", authMiddleware, getUserAppraisals);

router.get('/view-teamlead-appraisals/:userId', authMiddleware, getAppraisalsTeamLead)

export default router;
