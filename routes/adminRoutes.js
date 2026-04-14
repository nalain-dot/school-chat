import express from 'express';
import { 
    getAllUsers, 
    updateUserRole, 
    deleteUser, 
    getAdminStats 
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/users')
    .get(protect, admin, getAllUsers);

router.route('/users/:id')
    .delete(protect, admin, deleteUser);

router.route('/users/:id/role')
    .put(protect, admin, updateUserRole);

router.route('/stats')
    .get(protect, admin, getAdminStats);

export default router;
