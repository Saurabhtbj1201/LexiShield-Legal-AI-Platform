import multer from "multer";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/octet-stream" // for raw text/md files uploaded via some browsers
]);

const ALLOWED_EXTENSIONS = [".pdf", ".txt", ".md"];

/**
 * Memory-safe Multer Upload Configuration
 * Rejects unsupported file formats before memory buffer allocation
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum file size
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const originalName = file.originalname.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => originalName.endsWith(ext));
    const hasValidMime = ALLOWED_MIME_TYPES.has(file.mimetype);

    if (hasValidExt || hasValidMime) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format. Please upload a PDF (.pdf), Plain Text (.txt), or Markdown (.md) document."), false);
    }
  }
});
