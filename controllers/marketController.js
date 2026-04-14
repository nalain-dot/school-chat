import Product from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/market
// @access  Protected
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isSold: false }).populate('seller', 'name email');
        res.json(products);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Create a product
// @route   POST /api/market
// @access  Protected
export const createProduct = async (req, res) => {
    const { name, description, price, category, condition, image } = req.body;

    try {
        const product = await Product.create({
            name,
            description,
            price,
            category,
            condition,
            image,
            seller: req.user._id
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Mark product as sold
// @route   PUT /api/market/:id/sold
// @access  Protected
export const markAsSold = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if (product.seller.toString() !== req.user._id.toString()) {
                res.status(401);
                throw new Error("Only the seller can mark this as sold");
            }
            product.isSold = true;
            await product.save();
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};
