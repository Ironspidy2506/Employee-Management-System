import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addMessage,
  deleteMessage,
  editMessage,
  getAllMessages,
  getMessageById,
  getUsersMessage,
  replyMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/get-all-messages", authMiddleware, getAllMessages);

router.post("/add-message", authMiddleware, addMessage);

router.post("/edit-message/:messageId", authMiddleware, editMessage);

router.delete("/delete-message/:messageId", authMiddleware, deleteMessage);

router.get("/get-users-message/:userId", authMiddleware, getUsersMessage);

router.get("/get-message-by-id/:messageId", authMiddleware, getMessageById);

router.post("/reply-message/:messageId", authMiddleware, replyMessage);



export default router;
