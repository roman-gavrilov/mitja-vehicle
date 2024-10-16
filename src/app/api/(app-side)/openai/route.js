import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI ({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

export async function POST(req) {
  if (!openai.apiKey) {
    return NextResponse.json({
      error: {
        message: "OpenAI API key not configured",
      }
    }, { status: 500 });
  }

  try {
    const body = await req.json();
    let prompt = body || '';
    
    // if (prompt.trim().length === 0) {
    //   return NextResponse.json({
    //     error: {
    //       message: "Please enter a valid prompt",
    //     }
    //   }, { status: 400 });
    // }

    // prompt = JSON.parse(prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          "role": "user",
          "content": prompt
        }
      ],
      temperature: 1,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format:{ "type":"json_object" }
    });

    const resultText = completion.choices[0]?.message?.content || "No response";

    return NextResponse.json({ result: resultText });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return NextResponse.json(error.response.data, { status: error.response.status });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return NextResponse.json({
        error: {
          message: 'An error occurred during your request.',
        }
      }, { status: 500 });
    }
  }
}