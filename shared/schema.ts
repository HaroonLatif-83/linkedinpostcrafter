import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  tone: text("tone").notNull(),
  summary: text("summary").notNull(),
  linkedinPost: text("linkedin_post").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertArticleSchema = createInsertSchema(articles)
  .pick({
    url: true,
    tone: true,
  })
  .extend({
    url: z.string().url("Please enter a valid URL"),
    tone: z.enum(["Friendly", "Professional", "Casual", "Formal"]),
  });

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export const toneOptions = ["Friendly", "Professional", "Casual", "Formal"] as const;
