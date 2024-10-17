import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

const MAX_RETRIES = 3; // Set the maximum number of retries

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

    // Retry logic implementation
    let completion, resultText;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        completion = await openai.chat.completions.create({
          model: "chatgpt-4o-latest",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 1,
          max_tokens: 500,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          response_format:{ "type":"json_object" }
        });

        resultText = completion.choices?.[0]?.message?.content;

        if (resultText) {
          // Break out of the loop if we get a valid response
          break;
        } else {
          console.warn(`Attempt ${attempt} received no response. Retrying...`);
        }

      } catch (error) {
        console.error(`Attempt ${attempt} failed with error: ${error.message}`);
        // Optionally, break the loop on certain types of errors if retrying won't help
        if (attempt === MAX_RETRIES) {
          return NextResponse.json({
            error: {
              message: `Failed after ${MAX_RETRIES} attempts. Error: ${error.message}`,
            }
          }, { status: 500 });
        }
      }
    }

    // If no valid response after retries, return fallback
    if (!resultText) {
      console.warn(`No valid response after ${MAX_RETRIES} attempts.`);
      return NextResponse.json({
        result: "No response from the model after multiple attempts."
      }, { status: 200 });
    }

    // Return the result
    return NextResponse.json({ result: resultText });

  } catch (error) {
    if (error.response) {
      // Handle known API errors
      console.error(error.response.status, error.response.data);
      return NextResponse.json(error.response.data, { status: error.response.status });
    } else {
      // Handle unexpected errors
      console.error(`Error with OpenAI API request: ${error.message}`);
      return NextResponse.json({
        error: {
          message: 'An error occurred during your request.',
        }
      }, { status: 500 });
    }
  }
}
