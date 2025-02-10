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
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a professional content writer specializing in LinkedIn posts. Follow this exact format in your response:

[SUMMARY]
Write a concise summary of the article here in ${tone} tone.
[/SUMMARY]

[LINKEDIN_POST]
Write an engaging LinkedIn post based on that summary in ${tone} tone.
[/LINKEDIN_POST]`
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

    console.log("OpenAI Response:", responseContent); // Debug log

    // Extract summary
    const summaryMatch = responseContent.match(/\[SUMMARY\]([\s\S]*?)\[\/SUMMARY\]/);
    const summary = summaryMatch ? summaryMatch[1].trim() : '';

    // Extract LinkedIn post
    const linkedinMatch = responseContent.match(/\[LINKEDIN_POST\]([\s\S]*?)\[\/LINKEDIN_POST\]/);
    const linkedinPost = linkedinMatch ? linkedinMatch[1].trim() : '';

    if (!summary || !linkedinPost) {
      console.error('Parsing failed. Response content:', responseContent);
      throw new Error("Could not extract summary and LinkedIn post from response");
    }

    return { summary, linkedinPost };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to generate LinkedIn post: ${errorMessage}`);
  }
}