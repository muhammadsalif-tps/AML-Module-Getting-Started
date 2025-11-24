import express from "express";
import multer from "multer";
import uploadController from "./upload.controller.js";

const router = express.Router();

// Configure multer with file size and type validation
const upload = multer({ 
  dest: "uploads/",
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/csv', 'application/json', 'text/plain', 'application/vnd.ms-excel'];
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(csv|json|txt|xlsx)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV, JSON, TXT, and XLSX files are allowed.'));
    }
  }
});

router.post("/", upload.single("file"), uploadController.handleUpload);

export default router;
