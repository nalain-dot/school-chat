import express from 'express';
import { getMeetings, createMeeting, joinMeeting } from '../controllers/meetingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getMeetings).post(protect, createMeeting);
router.route('/:id/join').post(protect, joinMeeting);

export default router;
