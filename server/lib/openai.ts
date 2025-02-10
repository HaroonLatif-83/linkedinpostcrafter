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
          content: `You are a professional content writer specializing in LinkedIn posts. Your task is to:
1. Create a concise summary of the article
2. Generate an engaging LinkedIn post based on that summary
Use a ${tone} tone for both outputs.`
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

    try {
      // Try to parse as JSON first
      const parsedResponse = JSON.parse(responseContent) as GenerateResponse;
      if (!parsedResponse.summary || !parsedResponse.linkedinPost) {
        throw new Error("Invalid response format");
      }
      return parsedResponse;
    } catch (parseError) {
      // If JSON parsing fails, try to extract summary and post from text
      const lines = responseContent.split('\n');
      let summary = '';
      let linkedinPost = '';
      let currentSection = '';

      for (const line of lines) {
        if (line.toLowerCase().includes('summary:')) {
          currentSection = 'summary';
          continue;
        } else if (line.toLowerCase().includes('linkedin post:')) {
          currentSection = 'linkedinPost';
          continue;
        }

        if (currentSection === 'summary') {
          summary += line + '\n';
        } else if (currentSection === 'linkedinPost') {
          linkedinPost += line + '\n';
        }
      }

      summary = summary.trim();
      linkedinPost = linkedinPost.trim();

      if (!summary || !linkedinPost) {
        throw new Error("Could not extract summary and LinkedIn post from response");
      }

      return { summary, linkedinPost };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to generate LinkedIn post: ${errorMessage}`);
  }
}