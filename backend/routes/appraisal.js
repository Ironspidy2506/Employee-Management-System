import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/add-appraisal", authMiddleware);

router.get("/view-all-appraisals", authMiddleware);

router.post("/edit-appraisal/:appraisalId", authMiddleware);

router.delete("delete-appraisal/:appraisalId", authMiddleware);

router.get("/get-user-appraisal/:userId");

export default router;
