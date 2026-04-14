import mongoose from 'mongoose';

const meetingSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    time: { type: String, required: true }, // Format: HH:mm
    location: { type: String },
    zoomLink: { type: String },
    joinUrl: { type: String },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Meeting = mongoose.model('Meeting', meetingSchema);
export default Meeting;
