import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Get or Search all users
// @route   GET /api/users?search=
// @access  Protected
export const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Protected
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profilePic = req.body.profilePic || user.profilePic;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePic: updatedUser.profilePic,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

import Chat from '../models/Chat.js';
import Ride from '../models/Ride.js';
import Meeting from '../models/Meeting.js';
import Note from '../models/Note.js';
import Product from '../models/Product.js';

// @desc    Get user summary stats
// @route   GET /api/users/stats
// @access  Protected
export const getUserStats = async (req, res) => {
  try {
    const chatCount = await Chat.countDocuments({
      users: { $elemMatch: { $eq: req.user._id } }
    });

    const rideCount = await Ride.countDocuments({
      $or: [
        { driver: req.user._id },
        { passengers: { $elemMatch: { $eq: req.user._id } } }
      ]
    });

    const meetingCount = await Meeting.countDocuments({
      attendees: { $elemMatch: { $eq: req.user._id } }
    });

    const noteCount = await Note.countDocuments({
        uploadedBy: req.user._id
    });

    const totalProducts = await Product.countDocuments({
        isSold: false
    });

    // Get next upcoming meeting
    const nextMeeting = await Meeting.findOne({
        attendees: { $elemMatch: { $eq: req.user._id } },
        date: { $gte: new Date().toISOString().split('T')[0] }
    }).sort({ date: 1, time: 1 }).populate('createdBy', 'name');

    res.json({
      chats: chatCount,
      rides: rideCount,
      meetings: meetingCount,
      notes: noteCount,
      products: totalProducts,
      nextMeeting: nextMeeting
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
