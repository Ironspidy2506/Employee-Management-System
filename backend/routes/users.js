import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUserData, deleteUserData, updatePassword } from "../controllers/userController.js";

const router = express.Router();

router.get("/", authMiddleware, getUserData);
router.delete("/delete/:userId", authMiddleware, deleteUserData);
router.post("/update-password/:userId", authMiddleware, updatePassword);

export default router;