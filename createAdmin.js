import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the same directory as this script
dotenv.config({ path: path.join(__dirname, '.env') });

const createAdmin = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        
        const email = 'admin@admin.com';
        const password = 'admin123@';
        const name = 'Super Admin';

        const userExists = await User.findOne({ email });

        if (userExists) {
            userExists.role = 'admin';
            userExists.password = password; // Will be hashed by pre-save hook
            await userExists.save();
            console.log(`SUCCESS: Admin account updated.`);
        } else {
            await User.create({
                name,
                email,
                password,
                role: 'admin'
            });
            console.log(`SUCCESS: Admin account created.`);
        }

        console.log(`--------------------------------`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`--------------------------------`);

    } catch (error) {
        console.error("Setup Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
