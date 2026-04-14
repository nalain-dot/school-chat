import Meeting from '../models/Meeting.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Helper to get Zoom Access Token
const getZoomToken = async () => {
    try {
        const { ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_ACCOUNT_ID } = process.env;
        
        console.log("Attempting Zoom Token Request for Account:", ZOOM_ACCOUNT_ID);
        
        const auth = Buffer.from(`${ZOOM_CLIENT_ID.trim()}:${ZOOM_CLIENT_SECRET.trim()}`).toString('base64');
        
        const response = await axios.post(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID.trim()}`,
            {},
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        console.log("Zoom Token Success! Scopes granted:", response.data.scope);
        return response.data.access_token;
    } catch (error) {
        console.error("Zoom Token Error Details:", error.response?.data || error.message);
        return null;
    }
};

// @desc    Get all meetings
// @route   GET /api/meetings
// @access  Protected
export const getMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find({}).populate('createdBy', 'name').populate('attendees', 'name');
        res.json(meetings);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Create a meeting with Zoom link
// @route   POST /api/meetings
// @access  Protected
export const createMeeting = async (req, res) => {
    const { title, description, date, time, location } = req.body;

    try {
        let joinUrl = "";
        const token = await getZoomToken();

        if (token) {
            const zoomResponse = await axios.post(
                'https://api.zoom.us/v2/users/me/meetings',
                {
                    topic: title,
                    type: 2, // Scheduled meeting
                    start_time: `${date}T${time}:00Z`,
                    duration: 60,
                    settings: {
                        join_before_host: true,
                        mute_upon_entry: true,
                        participant_video: true
                    }
                },
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                    }
                }
            );
            joinUrl = zoomResponse.data.join_url;
        } else {
            console.warn("Zoom integration disabled or misconfigured. Using mock link.");
            joinUrl = `https://zoom.us/mock-meeting-${Math.random().toString(36).substring(7)}`;
        }

        const meeting = await Meeting.create({
            title,
            description,
            date,
            time,
            location,
            joinUrl: joinUrl,
            createdBy: req.user._id,
            attendees: [req.user._id]
        });
        res.status(201).json(meeting);
    } catch (error) {
        console.error("Meeting Creation Error:", error.response?.data || error.message);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Join a meeting
// @route   POST /api/meetings/:id/join
// @access  Protected
export const joinMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (meeting) {
            if (meeting.attendees.includes(req.user._id)) {
                return res.status(400).json({ message: "Already attending" });
            }
            meeting.attendees.push(req.user._id);
            await meeting.save();
            res.json(meeting);
        } else {
            res.status(404);
            throw new Error('Meeting not found');
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};
