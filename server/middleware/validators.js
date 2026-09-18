/**
 * Input Validation Middleware for LexiShield Legal API
 * Ensures fail-fast validation before hitting compute-heavy services.
 */

/**
 * Validates POST /api/analyze body
 */
export function validateAnalyze(req, res, next) {
  const { text } = req.body;
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({
      error: "Contract text is required and must be a non-empty string."
    });
  }
  next();
}

/**
 * Validates POST /api/compare body
 */
export function validateCompare(req, res, next) {
  const { versionA, versionB } = req.body;
  if (!versionA || !versionB || typeof versionA !== "string" || typeof versionB !== "string") {
    return res.status(400).json({
      error: "Both Version A and Version B are required for comparison."
    });
  }
  next();
}

/**
 * Validates POST /api/chat body
 */
export function validateChat(req, res, next) {
  const { contractText, question } = req.body;
  if (!contractText || !question || typeof contractText !== "string" || typeof question !== "string") {
    return res.status(400).json({
      error: "Both contract text and question are required."
    });
  }
  next();
}

/**
 * Validates POST /api/prep-kit body
 */
export function validatePrepKit(req, res, next) {
  const { contractAnalysis } = req.body;
  if (!contractAnalysis || typeof contractAnalysis !== "object") {
    return res.status(400).json({
      error: "Contract analysis data is required to generate prep kit."
    });
  }
  next();
}
