import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(request) {
  const data = await request.formData();
  const file = data.get('image');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Read the file into a buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Get the file extension
  const fileExtension = path.extname(file.name);

  // Generate a unique filename
  const filename = `${Date.now()}${fileExtension}`;

  // Define the file path to be inside the 'public/uploads' directory
  const filePath = path.join(process.cwd(), 'public/uploads', filename);

  // Check if the uploads directory exists, if not create it
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });  // Create the directory if it doesn't exist
  }

  // Save the file to the public/uploads directory
  await writeFile(filePath, buffer);

  // Generate the URL for the uploaded image (this is the public URL)
  const imageUrl = `/uploads/${filename}`;

  const imageFile = fs.readFileSync(filePath);

  const base64Image = Buffer.from(imageFile).toString('base64');

  const base64ImageString = `data:image/jpeg;base64,${base64Image}`;

  return NextResponse.json({ imageUrl, base64ImageString });
}
