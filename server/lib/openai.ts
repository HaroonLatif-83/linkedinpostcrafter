import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface GenerateResponse {
  summary: string;
  linkedinPost: string;
}

interface PolishResponse {
  polishedPost: string;
}

export async function generateLinkedInPost(
  content: string,
  tone: string,
  length: string = "medium"
): Promise<GenerateResponse> {
  try {
    console.log('Generating content with tone:', tone, 'and length:', length);
    console.log('Content length:', content.length);

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a professional content writer specializing in LinkedIn posts. Format your response as a JSON object with exactly these two fields:
{
  "summary": "a concise summary of the article in ${tone} tone",
  "linkedinPost": "an engaging LinkedIn post based on that summary in ${tone} tone. Make it ${length} length (short: ~50 words max for a snappy post, medium: ~200 words)"
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

export async function polishLinkedInPost(post: string): Promise<PolishResponse> {
  try {
    console.log('Polishing LinkedIn post content');

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert LinkedIn content polisher. Your task is to:
1. Make the text more engaging and authentic
2. Improve readability and flow
3. Update or add relevant hashtags
4. Ensure the content maintains its core message while being more human and relatable

Format your response as a JSON object with exactly this field:
{
  "polishedPost": "the polished LinkedIn post with improved text and hashtags"
}
Ensure your response is a valid JSON object.`
        },
        {
          role: "user",
          content: post,
        },
      ],
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("No content received from OpenAI");
    }

    console.log('Raw OpenAI Polish Response:', responseContent);

    const parsedResponse = JSON.parse(responseContent) as PolishResponse;

    if (!parsedResponse.polishedPost) {
      throw new Error("Missing polished post in OpenAI response");
    }

    return parsedResponse;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('OpenAI API Error:', errorMessage);
    throw new Error(`Failed to polish LinkedIn post: ${errorMessage}`);
  }
}