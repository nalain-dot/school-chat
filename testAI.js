import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const testAI = async () => {
    console.log("Testing Gemini API...");
    console.log("Key ends with:", process.env.GEMINI_API_KEY?.slice(-4));
    
    if (!process.env.GEMINI_API_KEY) {
        console.error("ERROR: No API Key found in .env");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say 'AI is working' if you can hear me.");
        console.log("RESULT:", result.response.text());
        console.log("SUCCESS: Gemini API is connected and working.");
    } catch (error) {
        console.error("DIAGNOSTIC FAILED:", error.message);
        if (error.message.includes("403")) console.error("HINT: Your API key might be restricted or invalid.");
        if (error.message.includes("429")) console.error("HINT: You have hit the rate limit.");
    }
};

testAI();
