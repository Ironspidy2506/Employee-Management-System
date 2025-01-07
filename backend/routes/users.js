import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUserData, deleteUserData } from "../controllers/userController.js";

const router = express.Router();

router.get("/", authMiddleware, getUserData);
router.delete("/delete/:userId", authMiddleware, deleteUserData);

export default router;
