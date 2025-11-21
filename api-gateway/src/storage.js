import fs from "fs";
import path from "path";

export async function saveFileToStorage(file) {
  const targetDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const newPath = path.join(targetDir, file.originalname);

  fs.renameSync(file.path, newPath);

  return newPath;
}
