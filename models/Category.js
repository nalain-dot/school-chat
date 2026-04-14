import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['Note', 'Product'], required: true },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;
