import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface GenerateResponse {
  summary: string;
  linkedinPost: string;
}

export async function generateLinkedInPost(
  content: string,
  tone: string
): Promise<GenerateResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional content writer specializing in LinkedIn posts. Generate a concise summary and an engaging LinkedIn post in ${tone} tone. Format your response as a valid JSON object with exactly these fields:
{
  "summary": "your summary here",
  "linkedinPost": "your LinkedIn post here"
}`,
        },
        {
          role: "user",
          content,
        },
      ],
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No content received from OpenAI");
    }

    const parsedResponse = JSON.parse(responseContent) as GenerateResponse;
    if (!parsedResponse.summary || !parsedResponse.linkedinPost) {
      throw new Error("Invalid response format from OpenAI");
    }

    return parsedResponse;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to generate LinkedIn post: ${errorMessage}`);
  }
}