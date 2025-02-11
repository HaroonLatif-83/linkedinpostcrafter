import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Edit2, Save, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Article } from "@shared/schema";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";

interface ResultCardProps {
  article: Article;
}

export default function ResultCard({ article }: ResultCardProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(article.linkedinPost);
  const [isPolishing, setIsPolishing] = useState(false);
  const [glowEffect, setGlowEffect] = useState(false);

  const triggerGlowEffect = () => {
    setGlowEffect(true);
    setTimeout(() => setGlowEffect(false), 2000);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    triggerGlowEffect();
    toast({
      title: "Saved!",
      description: "Your changes have been saved",
    });
  };

  const handlePolish = async () => {
    try {
      setIsPolishing(true);
      const res = await apiRequest("POST", "/api/polish", { text: editedPost });
      const data = await res.json();
      setEditedPost(data.polishedPost);
      triggerGlowEffect();
      toast({
        title: "Text Polished!",
        description: "Your LinkedIn post has been refined and improved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to polish text",
        variant: "destructive",
      });
    } finally {
      setIsPolishing(false);
    }
  };

  // Trigger glow effect when initial post is loaded
  useEffect(() => {
    if (article.linkedinPost) {
      triggerGlowEffect();
    }
  }, [article.linkedinPost]);

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

      <Card className={`border-none shadow-sm transition-all ${glowEffect ? 'glow-success' : ''}`}>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-[#191919]">
              LinkedIn Post
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePolish}
                disabled={isPolishing || isEditing}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {isPolishing ? "Polishing..." : "Polish"}
              </Button>
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