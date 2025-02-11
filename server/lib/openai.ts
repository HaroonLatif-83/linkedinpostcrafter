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
    console.log('Generating content with tone:', tone);
    console.log('Content length:', content.length);

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a professional content writer specializing in LinkedIn posts. Format your response as a JSON object with exactly these two fields:
{
  "summary": "a concise summary of the article in ${tone} tone",
  "linkedinPost": "an engaging LinkedIn post based on that summary in ${tone} tone"
}
Ensure your response is a valid JSON object.`
        },
        {
          role: "user",
          content,
        },
      ],
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No content received from OpenAI");
    }

    console.log('Raw OpenAI Response:', responseContent);

    const parsedResponse = JSON.parse(responseContent) as GenerateResponse;

    if (!parsedResponse.summary || !parsedResponse.linkedinPost) {
      throw new Error("Missing required fields in OpenAI response");
    }

    return parsedResponse;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('OpenAI API Error:', errorMessage);
    throw new Error(`Failed to generate LinkedIn post: ${errorMessage}`);
  }
}