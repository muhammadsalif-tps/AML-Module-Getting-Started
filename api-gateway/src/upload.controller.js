import { publishFileUploaded } from "./pubsub.js";
import { saveFileToStorage } from "./storage.js";

const uploadController = {
  async handleUpload(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const savedPath = await saveFileToStorage(req.file);

      // publish event so Temporal Worker starts AMLWorkflow
      await publishFileUploaded({
        filename: req.file.originalname,
        storedPath: savedPath,
        uploadedAt: new Date().toISOString()
      });

      res.json({
        message: "File uploaded successfully",
        storedPath: savedPath
      });

    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
};

export default uploadController;
