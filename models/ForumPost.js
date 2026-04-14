import mongoose from 'mongoose';

const forumPostSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true }, // General, Exams, Jobs, etc.
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [{
        text: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);
export default ForumPost;
