import mongoose from 'mongoose';
import Category from './models/Category.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const seedDefaults = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const count = await Category.countDocuments();
        if (count > 0) {
            console.log("Categories already exist. Skipping seed.");
            return;
        }

        const defaults = [
            { name: 'Computer Science', type: 'Note' },
            { name: 'Artificial Intelligence', type: 'Note' },
            { name: 'Business Administration', type: 'Note' },
            { name: 'Engineering', type: 'Note' },
            { name: 'Textbooks', type: 'Product' },
            { name: 'Electronics', type: 'Product' },
            { name: 'Furniture', type: 'Product' },
            { name: 'Stationery', type: 'Product' },
        ];

        await Category.insertMany(defaults);
        console.log("SUCCESS: Default Categories seeded.");

    } catch (error) {
        console.error("Seed Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

seedDefaults();
