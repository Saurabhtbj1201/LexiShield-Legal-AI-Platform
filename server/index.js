import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import pdfParse from "pdf-parse";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { PRESET_CONTRACTS } from "./data/presetContracts.js";
import {
  analyzeContract,
  compareContracts,
  answerQuestion,
  generatePrepKit
} from "./services/legalAiService.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Configure multer for file uploads in-memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "LexiShield Legal AI API",
    version: "1.0.0",
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Get Preset Contracts
app.get("/api/presets", (req, res) => {
  res.json({ presets: PRESET_CONTRACTS });
});

// Analyze Contract (Text input)
app.post("/api/analyze", async (req, res) => {
  try {
    const { text, apiKey } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Contract text is required." });
    }

    const analysis = await analyzeContract(text, apiKey);
    res.json({ success: true, analysis });
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze contract: " + error.message });
  }
});

// Upload and Analyze Document (PDF, TXT, MD)
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No document file uploaded." });
    }

    let extractedText = "";
    const mimeType = req.file.mimetype;
    const originalName = req.file.originalname.toLowerCase();

    if (mimeType === "application/pdf" || originalName.endsWith(".pdf")) {
      const pdfData = await pdfParse(req.file.buffer);
      extractedText = pdfData.text;
    } else {
      // Plain text or markdown
      extractedText = req.file.buffer.toString("utf-8");
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(400).json({ error: "Unable to extract meaningful text from the uploaded document." });
    }

    const apiKey = req.body.apiKey || null;
    const analysis = await analyzeContract(extractedText, apiKey);

    res.json({
      success: true,
      fileName: req.file.originalname,
      extractedText,
      analysis
    });
  } catch (error) {
    console.error("Upload parsing error:", error);
    res.status(500).json({ error: "Failed to parse document: " + error.message });
  }
});

// Compare Two Contract Versions
app.post("/api/compare", async (req, res) => {
  try {
    const { versionA, versionB, apiKey } = req.body;
    if (!versionA || !versionB) {
      return res.status(400).json({ error: "Both Version A and Version B are required for comparison." });
    }

    const comparison = await compareContracts(versionA, versionB, apiKey);
    res.json({ success: true, comparison });
  } catch (error) {
    console.error("Compare Error:", error);
    res.status(500).json({ error: "Failed to compare contracts: " + error.message });
  }
});

// Grounded Q&A ("Talk to Your Contract")
app.post("/api/chat", async (req, res) => {
  try {
    const { contractText, question, conversationHistory, apiKey } = req.body;
    if (!contractText || !question) {
      return res.status(400).json({ error: "Both contract text and question are required." });
    }

    const chatResponse = await answerQuestion(contractText, question, conversationHistory, apiKey);
    res.json({ success: true, ...chatResponse });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Failed to process chat query: " + error.message });
  }
});

// Generate Attorney Prep Kit
app.post("/api/prep-kit", async (req, res) => {
  try {
    const { contractAnalysis, userGoals, apiKey } = req.body;
    if (!contractAnalysis) {
      return res.status(400).json({ error: "Contract analysis data is required to generate prep kit." });
    }

    const prepKit = await generatePrepKit(contractAnalysis, userGoals, apiKey);
    res.json({ success: true, prepKit });
  } catch (error) {
    console.error("Prep Kit Error:", error);
    res.status(500).json({ error: "Failed to generate prep kit: " + error.message });
  }
});

// Serve frontend production build if available
const clientDistPath = path.resolve(__dirname, "../client/dist");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`⚖️ LexiShield Legal AI server listening on http://localhost:${PORT}`);
});
