"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

function SuccessContent() {
  const searchParams = useSearchParams();
  const storyId = searchParams.get("story_id");
  const [story, setStory] = useState<{
    tale: string;
    childName: string;
    ageRange: string;
    theme: string;
  } | null>(null);

  useEffect(() => {
    if (storyId) {
      const saved = localStorage.getItem(`story_${storyId}`);
      if (saved) {
        setStory(JSON.parse(saved));
        localStorage.removeItem(`story_${storyId}`);
      }
    }
  }, [storyId]);

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading your story...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-7 w-7 text-amber-500" />
          <h1 className="font-serif text-3xl font-bold text-purple-900">
            {story.childName}&apos;s Fairy Tale
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Age {story.ageRange} · {story.theme}
        </p>
      </div>

      {/* Story */}
      <div className="rounded-2xl border bg-amber-50/30 p-8">
        <div className="mb-6 flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-amber-600" />
          <div className="h-px flex-1 bg-amber-200" />
        </div>

        <div className="font-serif text-base leading-relaxed text-foreground/90 prose prose-purple max-w-none">
          <ReactMarkdown>{story.tale}</ReactMarkdown>
        </div>

        <div className="mt-8 text-center font-serif text-sm italic text-muted-foreground">
          The End
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading your story...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
