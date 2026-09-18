import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
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

// Trust reverse proxy for deployment on Render / Cloudflare / Vercel
app.set("trust proxy", 1);

// Security & Efficiency Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://generativelanguage.googleapis.com"]
      }
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    crossOriginEmbedderPolicy: false
  })
);

// Explicit Permissions-Policy to lock down sensitive browser APIs
app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

app.use(compression());
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Rate Limiting: General API Limiter (100 requests per 15 minutes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes." }
});

// Strict Limiter for intensive GenAI Analysis & Parsing (30 requests per minute)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Rate limit exceeded for AI generation endpoints. Please wait a minute." }
});

app.use("/api/", generalLimiter);

// Configure multer for document uploads (in-memory buffer, max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "LexiShield Legal AI API",
    version: "2.0.0",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    security: {
      helmet: true,
      rateLimiting: true,
      compression: true
    }
  });
});

// Get Preset Contracts
app.get("/api/presets", (req, res) => {
  res.json({ presets: PRESET_CONTRACTS });
});

// Analyze Contract (Text input)
app.post("/api/analyze", aiLimiter, async (req, res, next) => {
  try {
    const { text, apiKey } = req.body;
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Contract text is required and must be a non-empty string." });
    }

    const analysis = await analyzeContract(text, apiKey);
    res.json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
});

// Upload and Analyze Document (PDF, TXT, MD)
app.post("/api/upload", aiLimiter, upload.single("file"), async (req, res, next) => {
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
      return res.status(400).json({ error: "Unable to extract meaningful text from the uploaded document (minimum 20 characters required)." });
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
    next(error);
  }
});

// Compare Two Contract Versions
app.post("/api/compare", aiLimiter, async (req, res, next) => {
  try {
    const { versionA, versionB, apiKey } = req.body;
    if (!versionA || !versionB) {
      return res.status(400).json({ error: "Both Version A and Version B are required for comparison." });
    }

    const comparison = await compareContracts(versionA, versionB, apiKey);
    res.json({ success: true, comparison });
  } catch (error) {
    next(error);
  }
});

// Grounded Q&A ("Talk to Your Contract")
app.post("/api/chat", aiLimiter, async (req, res, next) => {
  try {
    const { contractText, question, conversationHistory, apiKey } = req.body;
    if (!contractText || !question) {
      return res.status(400).json({ error: "Both contract text and question are required." });
    }

    const chatResponse = await answerQuestion(contractText, question, conversationHistory, apiKey);
    res.json({ success: true, ...chatResponse });
  } catch (error) {
    next(error);
  }
});

// Generate Attorney Prep Kit
app.post("/api/prep-kit", aiLimiter, async (req, res, next) => {
  try {
    const { contractAnalysis, userGoals, apiKey } = req.body;
    if (!contractAnalysis) {
      return res.status(400).json({ error: "Contract analysis data is required to generate prep kit." });
    }

    const prepKit = await generatePrepKit(contractAnalysis, userGoals, apiKey);
    res.json({ success: true, prepKit });
  } catch (error) {
    next(error);
  }
});

// Serve frontend production build if available with HTTP caching headers
const clientDistPath = path.resolve(__dirname, "../client/dist");
if (fs.existsSync(clientDistPath)) {
  app.use(
    express.static(clientDistPath, {
      maxAge: "1y",
      immutable: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        } else {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      }
    })
  );
  app.get("*", (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

// Centralized Error-Handling Middleware (Prevents stack trace leaks)
app.use((err, req, res, _next) => {
  const isDev = process.env.NODE_ENV === "development";
  console.error("🚨 LexiShield API Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "An unexpected error occurred during processing.",
    ...(isDev && { stack: err.stack })
  });
});

// Only listen if executed directly, not when imported in test suites
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun && process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`⚖️ LexiShield Legal AI server listening on http://localhost:${PORT}`);
  });
}

export { app };
export default app;
