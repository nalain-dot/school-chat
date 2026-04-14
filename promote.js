import mongoose from 'mongoose';
import User from './models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import dotenv from 'dotenv';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const promoteUser = async (email) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ email });
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`SUCCESS: ${email} has been promoted to ADMIN.`);
        } else {
            console.error(`ERROR: User with email ${email} not found.`);
        }
    } catch (error) {
        console.error("Migration Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

// Replace with your email
const targetEmail = process.argv[2];
if (!targetEmail) {
    console.log("Usage: node promote.js <email>");
} else {
    promoteUser(targetEmail);
}
