import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Article } from "@shared/schema";

interface ResultCardProps {
  article: Article;
}

export default function ResultCard({ article }: ResultCardProps) {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-[#191919]">Summary</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(article.summary)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
          <p className="text-[#191919] whitespace-pre-wrap">{article.summary}</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-[#191919]">
              LinkedIn Post
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(article.linkedinPost)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
          <p className="text-[#191919] whitespace-pre-wrap">
            {article.linkedinPost}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
