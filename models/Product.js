import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String }, // Optional image URL
    condition: { type: String, enum: ['New', 'Good', 'Used'], default: 'Good' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isSold: { type: Boolean, default: false }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
