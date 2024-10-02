import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  try {
    const resizedImageBuffer = await sharp(buffer)
      .resize(800) // Resize to 800px width, maintaining aspect ratio
      .jpeg({ quality: 80 })
      .toBuffer();

    const base64Image = `data:image/jpeg;base64,${resizedImageBuffer.toString('base64')}`;
    return NextResponse.json({ image: base64Image });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Error processing image' }, { status: 500 });
  }
}