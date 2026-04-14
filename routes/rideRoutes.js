import express from 'express';
import { getRides, createRide, joinRide } from '../controllers/rideController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getRides).post(protect, createRide);
router.route('/:id/join').post(protect, joinRide);

export default router;
