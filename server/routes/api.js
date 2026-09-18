import { Router } from "express";
import pdfParse from "pdf-parse";
import { PRESET_CONTRACTS } from "../data/presetContracts.js";
import {
  analyzeContract,
  compareContracts,
  answerQuestion,
  generatePrepKit
} from "../services/legalAiService.js";
import { aiLimiter } from "../middleware/security.js";
import { upload } from "../middleware/upload.js";
import {
  validateAnalyze,
  validateCompare,
  validateChat,
  validatePrepKit
} from "../middleware/validators.js";

const router = Router();

/**
 * GET /api/health
 * Returns service status, operational configuration, and active security middleware
 */
router.get("/health", (req, res) => {
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

/**
 * GET /api/presets
 * Returns curated preset legal agreements for evaluation and demonstration
 */
router.get("/presets", (req, res) => {
  res.json({ presets: PRESET_CONTRACTS });
});

/**
 * POST /api/analyze
 * Analyzes raw contract text for risk scores, unconscionable clauses, and translations
 */
router.post("/analyze", aiLimiter, validateAnalyze, async (req, res, next) => {
  try {
    const { text, apiKey } = req.body;
    const analysis = await analyzeContract(text, apiKey);
    res.json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/upload
 * Uploads and extracts text from PDF, TXT, or MD documents, followed by full analysis
 */
router.post("/upload", aiLimiter, upload.single("file"), async (req, res, next) => {
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
      return res.status(400).json({
        error: "Unable to extract meaningful text from the uploaded document (minimum 20 characters required)."
      });
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

/**
 * POST /api/compare
 * Performs side-by-side redline comparison of two contract versions
 */
router.post("/compare", aiLimiter, validateCompare, async (req, res, next) => {
  try {
    const { versionA, versionB, apiKey } = req.body;
    const comparison = await compareContracts(versionA, versionB, apiKey);
    res.json({ success: true, comparison });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/chat
 * Context-grounded legal Q&A strictly cited against contract text
 */
router.post("/chat", aiLimiter, validateChat, async (req, res, next) => {
  try {
    const { contractText, question, conversationHistory, apiKey } = req.body;
    const chatResponse = await answerQuestion(contractText, question, conversationHistory, apiKey);
    res.json({ success: true, ...chatResponse });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/prep-kit
 * Generates structured 5-question attorney consultation briefing
 */
router.post("/prep-kit", aiLimiter, validatePrepKit, async (req, res, next) => {
  try {
    const { contractAnalysis, userGoals, apiKey } = req.body;
    const prepKit = await generatePrepKit(contractAnalysis, userGoals, apiKey);
    res.json({ success: true, prepKit });
  } catch (error) {
    next(error);
  }
});

export default router;
