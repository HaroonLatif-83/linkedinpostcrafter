import { Card, CardContent } from "@/components/ui/card";
import { SiLinkedin } from "react-icons/si";
import ArticleForm from "@/components/article-form";
import ResultCard from "@/components/result-card";
import { useState } from "react";
import { type Article } from "@shared/schema";

export default function Home() {
  const [result, setResult] = useState<Article | null>(null);

  return (
    <div className="min-h-screen bg-[#F3F2EF] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-6">
              <SiLinkedin className="w-8 h-8 text-[#0A66C2]" />
              <h1 className="text-2xl font-semibold text-[#191919]">
                LinkedIn Post Generator
              </h1>
            </div>
            
            <ArticleForm onSuccess={setResult} />
          </CardContent>
        </Card>

        {result && <ResultCard article={result} />}
      </div>
    </div>
  );
}
