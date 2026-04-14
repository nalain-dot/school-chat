import ForumPost from '../models/ForumPost.js';

// @desc    Get all posts
// @route   GET /api/forums
// @access  Protected
export const getPosts = async (req, res) => {
    try {
        const posts = await ForumPost.find({})
            .populate('author', 'name profilePic')
            .populate('comments.author', 'name profilePic')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Create a post
// @route   POST /api/forums
// @access  Protected
export const createPost = async (req, res) => {
    const { title, content, category } = req.body;

    try {
        const post = await ForumPost.create({
            title,
            content,
            category,
            author: req.user._id
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Add comment to post
// @route   POST /api/forums/:id/comment
// @access  Protected
export const addComment = async (req, res) => {
    const { text } = req.body;

    try {
        const post = await ForumPost.findById(req.params.id);

        if (post) {
            const comment = {
                text,
                author: req.user._id
            };
            post.comments.push(comment);
            await post.save();
            const updatedPost = await ForumPost.findById(req.params.id)
                .populate('author', 'name profilePic')
                .populate('comments.author', 'name profilePic');
            res.status(201).json(updatedPost);
        } else {
            res.status(404);
            throw new Error('Post not found');
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};
