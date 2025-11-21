import express from "express";
import uploadRoutes from "./upload.routes.js";

const app = express();

app.use(express.json());
app.use("/upload", uploadRoutes);

app.get("/health", (req, res) => res.send("API Gateway OK"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
