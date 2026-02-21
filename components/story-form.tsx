"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { Wand2, Loader2 } from "lucide-react";
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
import { generateFairytale } from "./generate-fairytale";

export function StoryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [childName, setChildName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [theme, setTheme] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    track("story_form_submitted", {
      ageRange,
      themeLength: theme.length,
    });
    // Simulate request
    setTimeout(() => setIsSubmitting(false), 2000);
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
          onClick={() => generateFairytale(childName, ageRange, theme)}
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
    </section>
  );
}
