import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  helmetMiddleware,
  permissionsPolicyMiddleware,
  generalLimiter
} from "./middleware/security.js";
import apiRouter from "./routes/api.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxy for deployment on Render / Cloudflare / Vercel
app.set("trust proxy", 1);

// Security & Browser Policy Headers
app.use(helmetMiddleware);
app.use(permissionsPolicyMiddleware);

// Optimized HTTP Response Compression (Threshold 1KB, CPU-balanced level 6)
app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    }
  })
);

// CORS & Memory-efficient Body Parsing (5MB limit prevents heap overload)
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// General Rate Limiter for all API routes
app.use("/api/", generalLimiter);

// Mount Modular API Routes
app.use("/api", apiRouter);

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
