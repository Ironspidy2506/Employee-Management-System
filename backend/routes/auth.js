import express from "express";
import { login, resetPassword, sendResetOtp, verify } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post('/login', login);
router.get('/verify', authMiddleware, verify);
router.post('/send-reset-otp', sendResetOtp);
router.post('/reset-password', resetPassword);

export default router;
