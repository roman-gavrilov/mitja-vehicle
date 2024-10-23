import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

export async function uploadLogo(logo) {
  const uploadDir = path.join(process.cwd(), "public/uploads");

  // Check if the uploads directory exists, if not create it
  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // Read the file into a buffer
  const bytes = await logo.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Get the file extension
  const fileExtension = path.extname(logo.name);

  // Generate a unique filename
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;

  // Define the file path
  const filePath = path.join(uploadDir, filename);

  // Save the file
  await writeFile(filePath, buffer);

  // Return the public URL
  return `/uploads/${filename}`;
}