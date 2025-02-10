import { type Article, type InsertArticle } from "@shared/schema";

export interface IStorage {
  createArticle(article: InsertArticle & { summary: string; linkedinPost: string }): Promise<Article>;
  getArticle(id: number): Promise<Article | undefined>;
}

export class MemStorage implements IStorage {
  private articles: Map<number, Article>;
  private currentId: number;

  constructor() {
    this.articles = new Map();
    this.currentId = 1;
  }

  async createArticle(
    article: InsertArticle & { summary: string; linkedinPost: string }
  ): Promise<Article> {
    const id = this.currentId++;
    const newArticle: Article = {
      id,
      ...article,
      createdAt: new Date(),
    };
    this.articles.set(id, newArticle);
    return newArticle;
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }
}

export const storage = new MemStorage();
