import express from 'express';
import { getPosts, createPost, addComment } from '../controllers/forumController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getPosts).post(protect, createPost);
router.route('/:id/comment').post(protect, addComment);

export default router;
