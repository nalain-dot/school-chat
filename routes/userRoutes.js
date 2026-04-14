import express from 'express';
import { allUsers, updateUserProfile, getUserStats } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, allUsers);
router.route('/profile').put(protect, updateUserProfile);
router.route('/stats').get(protect, getUserStats);

export default router;
