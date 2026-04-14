import mongoose from 'mongoose';

const noteSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    fileUrl: { type: String },
    content: { type: String }, // For summarization
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
export default Note;
