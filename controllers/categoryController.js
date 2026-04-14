import Category from '../models/Category.js';

// @desc    Get categories by type
// @route   GET /api/categories?type=
// @access  Public
export const getCategories = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const categories = await Category.find(filter).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res) => {
    const { name, type } = req.body;

    try {
        const category = await Category.create({ name, type });
        res.status(201).json(category);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            await category.deleteOne();
            res.json({ message: 'Category removed' });
        } else {
            res.status(404);
            throw new Error('Category not found');
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};
