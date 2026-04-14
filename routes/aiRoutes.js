import express from 'express';
import { aiChat, aiSummarize } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', protect, aiChat);
router.post('/summarize', protect, aiSummarize);

export default router;
