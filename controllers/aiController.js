import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import dns from "dns";

// Fix for MongoDB and API connection issues on some networks
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

// Debug: Check if key is loaded (only logged to backend terminal)
if (!process.env.GEMINI_API_KEY) {
    console.error("AI_DEBUG: GEMINI_API_KEY is UNDEFINED. Check your .env file location.");
} else {
    console.log(`AI_DEBUG: Key loaded (ends with ...${process.env.GEMINI_API_KEY.slice(-4)})`);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Real Gemini AI Chat
// @route   POST /api/ai/chat
// @access  Protected
export const aiChat = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: "No message provided" });
    }

    try {
        if (!process.env.GEMINI_API_KEY) {
            console.error("CRITICAL: GEMINI_API_KEY is missing from .env");
            return res.status(500).json({ message: "AI Configuration Error: Missing API Key" });
        }

        console.log(`AI Chat Request: "${message.substring(0, 50)}..."`);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const systemPrompt = "You are an academic assistant for university students at Air University. Help them with their queries about computer science, artificial intelligence, and campus life. Keep answers concise and helpful.";
        const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}`;

        const result = await model.generateContent(fullPrompt);
        const response = result.response.text();
        console.log("AI Chat Success!");

        res.json({ response });
    } catch (error) {
        console.error("GEMINI API ERROR:", error.message);
        res.status(500).json({ message: "AI Service Error", error: error.message });
    }
};

// @desc    Real Gemini AI Summarizer
// @route   POST /api/ai/summarize
// @access  Protected
export const aiSummarize = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: "No content provided for summarization" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Summarize the following academic notes into key bullet points and a brief conclusion: \n\n ${text}`;
        
        const result = await model.generateContent(prompt);
        const summary = result.response.text();

        res.json({ summary });
    } catch (error) {
        console.error("Gemini Summarize Error:", error);
        res.status(500).json({ message: "AI Service Error", error: error.message });
    }
};
