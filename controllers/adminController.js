import User from '../models/User.js';
import Chat from '../models/Chat.js';
import Ride from '../models/Ride.js';
import Meeting from '../models/Meeting.js';
import Note from '../models/Note.js';
import Product from '../models/Product.js';

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.role = req.body.role || user.role;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Get global stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const chatCount = await Chat.countDocuments();
        const rideCount = await Ride.countDocuments();
        const meetingCount = await Meeting.countDocuments();
        const noteCount = await Note.countDocuments();
        const productCount = await Product.countDocuments();

        res.json({
            users: userCount,
            chats: chatCount,
            rides: rideCount,
            meetings: meetingCount,
            notes: noteCount,
            products: productCount
        });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};
