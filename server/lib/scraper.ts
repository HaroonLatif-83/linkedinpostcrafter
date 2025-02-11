import fetch from "node-fetch";
import { load } from "cheerio";

export async function scrapeArticle(url: string): Promise<string> {
  try {
    console.log('Fetching content from URL:', url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log('Successfully fetched HTML content');

    const $ = load(html);

    // Remove script tags, style tags, and comments
    $("script").remove();
    $("style").remove();
    $("comments").remove();

    // Get main content
    const title = $("h1").first().text();
    console.log('Extracted title:', title);

    const content = $("article, main, .content, .post").first().text() ||
                   $("p").text();

    // Clean up text
    const cleanText = `${title}\n\n${content}`
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) {
      throw new Error("No content found in the article");
    }

    console.log('Successfully extracted and cleaned content, length:', cleanText.length);
    return cleanText;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch article';
    console.error('Scraper error:', errorMessage);
    throw new Error(`Failed to scrape article: ${errorMessage}`);
  }
}