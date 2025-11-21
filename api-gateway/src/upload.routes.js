import express from "express";
import multer from "multer";
import uploadController from "./upload.controller.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), uploadController.handleUpload);

export default router;
