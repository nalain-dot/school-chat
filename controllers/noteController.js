import Note from '../models/Note.js';

// @desc    Get all notes
// @route   GET /api/notes
// @access  Protected
export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({}).populate('uploadedBy', 'name');
        res.json(notes);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Create a note
// @route   POST /api/notes
// @access  Protected
export const createNote = async (req, res) => {
    const { title, description, category, fileUrl } = req.body;

    try {
        const note = await Note.create({
            title,
            description,
            category,
            fileUrl,
            uploadedBy: req.user._id
        });
        res.status(201).json(note);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Protected
export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (note) {
            if (note.uploadedBy.toString() !== req.user._id.toString()) {
                res.status(401);
                throw new Error("You cannot delete someone else's note");
            }
            await Note.deleteOne({ _id: req.params.id });
            res.json({ message: 'Note removed' });
        } else {
            res.status(404);
            throw new Error('Note not found');
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};
