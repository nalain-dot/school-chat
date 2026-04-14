import express from 'express';
import { accessChat, fetchChats, createGroupChat } from '../controllers/chatController.js';
import { sendMessage, allMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);

router.route('/messages/:chatId').get(protect, allMessages);
router.route('/messages').post(protect, sendMessage);

export default router;
