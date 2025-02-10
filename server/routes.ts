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

      const content = await scrapeArticle(body.url);
      const { summary, linkedinPost } = await generateLinkedInPost(content, body.tone);

      const article = await storage.createArticle({
        ...body,
        summary,
        linkedinPost,
      });

      res.json(article);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ message: errorMessage });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}