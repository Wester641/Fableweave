"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, BookOpen, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const storyId = searchParams.get("story_id");
  const [story, setStory] = useState<{
    tale: string;
    childName: string;
    ageRange: string;
    theme: string;
  } | null>(null);

  const generatePDF = () => {
    if (!story) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Add decorative header
    doc.setFillColor(147, 51, 234); // Purple
    doc.rect(0, 0, pageWidth, 15, "F");

    // Title
    doc.setFontSize(22);
    doc.setTextColor(147, 51, 234); // Purple
    yPosition = 30;
    doc.text(`${story.childName}'s Fairy Tale`, pageWidth / 2, yPosition, {
      align: "center",
    });

    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    yPosition += 10;
    doc.text(
      `Age ${story.ageRange} • ${story.theme}`,
      pageWidth / 2,
      yPosition,
      { align: "center" },
    );

    // Add decorative line
    doc.setDrawColor(251, 191, 36); // Amber
    doc.setLineWidth(0.5);
    yPosition += 8;
    doc.line(margin, yPosition, pageWidth - margin, yPosition);

    // Story content
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    yPosition += 15;

    // Remove markdown formatting for PDF
    const plainText = story.tale
      .replace(/\*\*/g, "") // Remove bold
      .replace(/\*/g, "") // Remove italic
      .replace(/_/g, "") // Remove underscores
      .replace(/#{1,6}\s?/g, ""); // Remove headers

    const lines = doc.splitTextToSize(plainText, maxWidth);

    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += 7;
    });

    // Add "The End"
    yPosition += 10;
    if (yPosition > pageHeight - margin - 20) {
      doc.addPage();
      yPosition = margin;
    }
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("The End", pageWidth / 2, yPosition, { align: "center" });

    // Add footer
    doc.setFillColor(147, 51, 234);
    doc.rect(0, pageHeight - 10, pageWidth, 10, "F");

    // Save the PDF
    doc.save(`${story.childName}-fairytale.pdf`);
  };

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
        <p className="text-sm text-muted-foreground mb-4">
          Age {story.ageRange} · {story.theme}
        </p>
        <Button
          onClick={generatePDF}
          size="lg"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Download as PDF
        </Button>
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
