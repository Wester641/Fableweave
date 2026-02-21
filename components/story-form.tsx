"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { Wand2, Loader2, BookOpen, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateFairytale } from "./generate-fairytale";

export function StoryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [childName, setChildName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [theme, setTheme] = useState("");
  const [fairytale, setFairytale] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    track("story_form_submitted", {
      ageRange,
      themeLength: theme.length,
    });

    try {
      const story = await generateFairytale(childName, ageRange, theme);
      setFairytale(story || "");
      setShowDialog(true);
    } catch (error) {
      console.error("Failed to generate fairytale:", error);
      alert("Sorry, we couldn't generate your fairy tale. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="create" className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-serif text-3xl font-bold text-foreground md:text-4xl">
          Create Your Story
        </h2>
        <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
          Fill in three simple details and we'll weave a one-of-a-kind fairy
          tale for your child.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 max-w-lg rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
      >
        <div className="flex flex-col gap-5">
          {/* Child's name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="child-name">{"Child's Name"}</Label>
            <Input
              id="child-name"
              placeholder="e.g. Luna"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              required
            />
          </div>

          {/* Age range */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="age-range">Age Range</Label>
            <Select value={ageRange} onValueChange={setAgeRange} required>
              <SelectTrigger id="age-range" className="w-full">
                <SelectValue placeholder="Select age range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2-4">2 &ndash; 4 years</SelectItem>
                <SelectItem value="5-7">5 &ndash; 7 years</SelectItem>
                <SelectItem value="8-10">8 &ndash; 10 years</SelectItem>
                <SelectItem value="11-13">11 &ndash; 13 years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Story theme */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="theme">Story Theme</Label>
            <Input
              id="theme"
              placeholder="e.g. A brave dragon who loves to bake"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Describe a character, adventure, or idea you'd like the story to
              explore.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-8 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Weaving your story...
            </>
          ) : (
            <>
              <Wand2 />
              Generate Fairy Tale
            </>
          )}
        </Button>
      </form>

      {/* Saved Story Alert - Shows when story exists but dialog is closed */}
      {fairytale && !showDialog && (
        <div className="mx-auto mt-6 max-w-lg">
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <BookOpen className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-sm">
                Your fairy tale for <strong>{childName}</strong> is saved!
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDialog(true)}
                className="ml-4"
              >
                View Story
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden p-0">
          <div className="relative overflow-y-auto">
            {/* Decorative Header Background */}
            <div className="sticky top-0 z-10 border-b border-border/40 bg-linear-to-br from-purple-50 via-pink-50 to-amber-50 px-6 py-6 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-amber-950/30">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 font-serif text-3xl text-purple-900 dark:text-purple-100">
                  <Sparkles className="h-7 w-7 text-amber-500" />
                  {childName}&apos;s Fairy Tale
                </DialogTitle>
                <DialogDescription className="mt-2 flex items-center gap-2 text-base">
                  <span className="rounded-full bg-white/60 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
                    Age {ageRange}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-purple-600 dark:text-purple-300">
                    {theme}
                  </span>
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Story Content */}
            <div className="bg-linear-to-b from-amber-50/30 to-white px-8 py-8 dark:from-amber-950/10 dark:to-background">
              {/* Decorative Opening Quote */}
              <div className="mb-6 flex items-start gap-3">
                <BookOpen className="mt-1 h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="h-px flex-1 self-center bg-linear-to-r from-amber-300 to-transparent dark:from-amber-600"></div>
              </div>

              {/* Story Text */}
              <div className="relative">
                {/* First Half - Normal (with Decorative Drop Cap) */}
                <div className="prose prose-purple max-w-none font-serif text-base leading-relaxed text-foreground/90 first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-4xl first-letter:font-bold first-letter:text-purple-600 dark:text-foreground/95 dark:first-letter:text-purple-400">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="whitespace-pre-wrap">{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-bold text-purple-700 dark:text-purple-300">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                    }}
                  >
                    {fairytale.slice(0, Math.floor(fairytale.length / 6))}
                  </ReactMarkdown>
                </div>

                {/* Second Half - Blurred with Unlock Button */}
                <div className="relative">
                  <div className="prose prose-purple max-w-none font-serif text-base leading-relaxed text-foreground/90 blur-[2px] select-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="whitespace-pre-wrap">{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic">{children}</em>
                        ),
                      }}
                    >
                      {fairytale.slice(Math.floor(fairytale.length / 6))}
                    </ReactMarkdown>
                  </div>

                  {/* Unlock Button Overlay */}
                  <div className="absolute inset-0 flex items-start justify-center pt-4">
                    <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 shadow-xl"
                      onClick={() => {
                        window.location.href = "/payment";
                      }}
                    >
                      <Sparkles className="h-4 w-4" />
                      Unlock Full Story
                    </Button>
                  </div>
                </div>
              </div>

              {/* Decorative Closing */}
              <div className="mt-8 flex items-center gap-3">
                <div className="h-px flex-1 bg-linear-to-l from-amber-300 to-transparent dark:from-amber-600"></div>
                <Sparkles className="h-5 w-5 text-amber-500" />
                <div className="h-px flex-1 bg-linear-to-r from-amber-300 to-transparent dark:from-amber-600"></div>
              </div>

              {/* The End */}
              <p className="mt-4 text-center font-serif text-sm italic text-muted-foreground">
                The End
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
