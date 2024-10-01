import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(request) {
  const data = await request.formData();
  const files = data.getAll('images'); // Get all images from the form data

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), 'public/uploads');
  
  // Check if the uploads directory exists, if not create it
  if (!fs.existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true }); // Create the directory if it doesn't exist
  }

  const uploadedFiles = [];

  for (const file of files) {

    if (file instanceof File) {
      // Read the file into a buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Get the file extension
      const fileExtension = path.extname(file.name);

      // Generate a unique filename
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;

      console.log(filename);

      // Define the file path to be inside the 'public/uploads' directory
      const filePath = path.join(uploadDir, filename);

      // Save the file to the public/uploads directory
      await writeFile(filePath, buffer);

      // Generate the URL for the uploaded image (this is the public URL)
      const imageUrl = `/uploads/${filename}`;

      const imageFile = fs.readFileSync(filePath);
      const base64Image = Buffer.from(imageFile).toString('base64');
      const base64ImageString = `data:image/jpeg;base64,${base64Image}`;

      uploadedFiles.push({ imageUrl, base64ImageString, base64Image });
    }
  }

  return NextResponse.json({ uploadedFiles });
}
