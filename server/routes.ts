import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertArticleSchema } from "@shared/schema";
import { scrapeArticle } from "./lib/scraper";
import { generateLinkedInPost } from "./lib/openai";

export function registerRoutes(app: Express) {
  app.post("/api/articles", async (req, res) => {
    try {
      const body = insertArticleSchema.parse(req.body);

      console.log('Scraping article from URL:', body.url);
      const content = await scrapeArticle(body.url);

      console.log('Generating LinkedIn post with tone:', body.tone, 'and length:', body.length);
      const { summary, linkedinPost } = await generateLinkedInPost(content, body.tone, body.length);

      console.log('Creating article in storage');
      const article = await storage.createArticle({
        ...body,
        summary,
        linkedinPost,
      });

      console.log('Successfully created article:', article.id);
      res.json(article);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error processing article:', errorMessage);
      res.status(400).json({ message: errorMessage });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}