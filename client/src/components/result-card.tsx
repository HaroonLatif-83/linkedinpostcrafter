import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Edit2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Article } from "@shared/schema";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface ResultCardProps {
  article: Article;
}

export default function ResultCard({ article }: ResultCardProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(article.linkedinPost);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Saved!",
      description: "Your changes have been saved",
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
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(editedPost)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              )}
            </div>
          </div>
          {isEditing ? (
            <Textarea
              value={editedPost}
              onChange={(e) => setEditedPost(e.target.value)}
              className="min-h-[200px] text-[#191919]"
            />
          ) : (
            <p className="text-[#191919] whitespace-pre-wrap">{editedPost}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}