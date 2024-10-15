import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const prompt = formData.get('prompt');
    const model = formData.get('model');
    const files = formData.getAll('file');

    let messages = [{ role: 'user', content: prompt }];

    // Handle image uploads if any
    if (files.length > 0) {
      const imageBase64 = await Promise.all(
        files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          return `data:${file.type};base64,${base64}`;
        })
      );

      messages = [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            ...imageBase64.map((image) => ({ type: 'image_url', image_url: { url: image } })),
          ],
        },
      ];
    }
    
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      max_tokens: 1500,
    });

    console.log('OpenAI API call successful');

    const result = completion.choices[0].message.content;

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error details:', error);
    let errorMessage = 'An error occurred while processing your request.';
    if (error.response) {
      errorMessage = `OpenAI API error: ${error.response.status} - ${error.response.data.error.message}`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}