import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req) {
  const formData = await req.formData();
  const files = formData.getAll('files');

  const resizedImages = [];

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    try {
      const resizedImageBuffer = await sharp(buffer)
        .resize(800) // Resize to 800px width, maintaining aspect ratio
        .jpeg({ quality: 80 })
        .toBuffer();

      const base64Image = `data:image/jpeg;base64,${resizedImageBuffer.toString('base64')}`;
      resizedImages.push(base64Image);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }

  return NextResponse.json({ images: resizedImages });
}