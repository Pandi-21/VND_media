// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Ensure upload directories exist
// const ensureDir = (dir) => {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// };

// // ─── Storage for images (blog, services) ─────────────────────────────────────
// const imageStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "uploads/images";
//     ensureDir(dir);
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });

// // ─── Storage for resumes (careers) ───────────────────────────────────────────
// const resumeStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "uploads/resumes";
//     ensureDir(dir);
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `resume-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });

// const imageFilter = (req, file, cb) => {
//   const allowed = /jpeg|jpg|png|webp|gif/;
//   if (allowed.test(path.extname(file.originalname).toLowerCase())) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"), false);
//   }
// };

// const resumeFilter = (req, file, cb) => {
//   const allowed = /pdf|doc|docx/;
//   if (allowed.test(path.extname(file.originalname).toLowerCase())) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF/DOC files allowed for resumes!"), false);
//   }
// };

// const uploadImage = multer({ storage: imageStorage, fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });
// const uploadResume = multer({ storage: resumeStorage, fileFilter: resumeFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// module.exports = { uploadImage, uploadResume };

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Ensure upload directories exist ─────────────────────────────────────────
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Initialize all upload directories
const directories = [
  "uploads/photos",
  "uploads/videos",
  "uploads/images",
  "uploads/resumes"
];
directories.forEach(ensureDir);

// ── Storage Configurations ──────────────────────────────────────────────────

// Photos Storage
const photoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/photos"),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `photo-${unique}${path.extname(file.originalname)}`);
  },
});

// Videos Storage
const videoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/videos"),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `video-${unique}${path.extname(file.originalname)}`);
  },
});

// Images Storage (Blog, Services)
const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/images"),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Resumes Storage (Careers)
const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/resumes"),
  filename: (_req, file, cb) => {
    const uniqueName = `resume-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// ── File Filters ────────────────────────────────────────────────────────────
const imageFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) return cb(null, true);
  cb(new Error("Only image files (JPG, PNG, WEBP, GIF) are allowed."), false);
};

const videoFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("video/")) return cb(null, true);
  cb(new Error("Only video files (MP4, MOV, WEBM) are allowed."), false);
};

const resumeFilter = (_req, file, cb) => {
  const allowed = /pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) return cb(null, true);
  cb(new Error("Only PDF/DOC/DOCX files are allowed for resumes!"), false);
};

// ── Multer Instances ────────────────────────────────────────────────────────
const uploadPhoto = multer({
  storage: photoStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// ── Multer Error Handler Middleware ─────────────────────────────────────────
const handleMulterError = (err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File is too large. Check the size limits.",
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

// ── Export ──────────────────────────────────────────────────────────────────
module.exports = {
  uploadPhoto,
  uploadVideo,
  uploadImage,
  uploadResume,
  handleMulterError,
};