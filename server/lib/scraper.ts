import fetch from "node-fetch";
import { load } from "cheerio";

export async function scrapeArticle(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);

    // Remove script tags, style tags, and comments
    $("script").remove();
    $("style").remove();
    $("comments").remove();

    // Get main content
    const title = $("h1").first().text();
    const content = $("article, main, .content, .post").first().text() ||
                   $("p").text();

    // Clean up text
    const cleanText = `${title}\n\n${content}`
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) {
      throw new Error("No content found");
    }

    return cleanText;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch article';
    throw new Error(`Failed to scrape article: ${errorMessage}`);
  }
}