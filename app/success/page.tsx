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
    const margin = 25;
    const maxWidth = pageWidth - 2 * margin;

    // ========== COVER PAGE ==========
    // Gradient-like background with rectangles
    doc.setFillColor(147, 51, 234); // Purple
    doc.rect(0, 0, pageWidth, pageHeight / 3, "F");
    doc.setFillColor(157, 78, 221);
    doc.rect(0, pageHeight / 3, pageWidth, pageHeight / 3, "F");
    doc.setFillColor(167, 105, 208);
    doc.rect(0, (2 * pageHeight) / 3, pageWidth, pageHeight / 3, "F");

    // Decorative border
    doc.setDrawColor(251, 191, 36); // Amber
    doc.setLineWidth(3);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Title with shadow effect
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.setTextColor(30, 30, 30);
    doc.text(`${story.childName}'s`, pageWidth / 2 + 1, pageHeight / 2 - 19, {
      align: "center",
    });
    doc.setTextColor(255, 255, 255);
    doc.text(`${story.childName}'s`, pageWidth / 2, pageHeight / 2 - 20, {
      align: "center",
    });

    doc.setFontSize(36);
    doc.setTextColor(30, 30, 30);
    doc.text("Fairy Tale", pageWidth / 2 + 1, pageHeight / 2 + 1, {
      align: "center",
    });
    doc.setTextColor(255, 255, 255);
    doc.text("Fairy Tale", pageWidth / 2, pageHeight / 2, {
      align: "center",
    });

    // Decorative stars
    doc.setFontSize(24);
    doc.text("✨", 30, pageHeight / 2);
    doc.text("✨", pageWidth - 35, pageHeight / 2);

    // Metadata box
    doc.setFillColor(255, 255, 255, 0.9);
    const boxWidth = 120;
    const boxHeight = 20;
    doc.roundedRect(
      pageWidth / 2 - boxWidth / 2,
      pageHeight / 2 + 20,
      boxWidth,
      boxHeight,
      3,
      3,
      "F",
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Age ${story.ageRange}`, pageWidth / 2, pageHeight / 2 + 30, {
      align: "center",
    });
    doc.setFontSize(9);
    doc.text(story.theme, pageWidth / 2, pageHeight / 2 + 36, {
      align: "center",
      maxWidth: boxWidth - 10,
    });

    // ========== STORY PAGES ==========
    doc.addPage();
    let yPosition = margin + 10;
    let pageNumber = 1;

    // Helper function to add page decorations
    const addPageDecorations = () => {
      // Top border decoration
      doc.setDrawColor(147, 51, 234);
      doc.setLineWidth(0.5);
      doc.line(margin, margin - 5, pageWidth - margin, margin - 5);

      // Bottom border decoration
      doc.line(
        margin,
        pageHeight - margin + 5,
        pageWidth - margin,
        pageHeight - margin + 5,
      );

      // Page number with decoration
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(`~ ${pageNumber} ~`, pageWidth / 2, pageHeight - margin + 12, {
        align: "center",
      });
      pageNumber++;

      // Corner decorations
      doc.setFontSize(8);
      doc.text("✦", margin - 5, margin);
      doc.text("✦", pageWidth - margin + 5, margin);
    };

    addPageDecorations();

    // Parse markdown and render with formatting
    const parseMarkdown = (text: string) => {
      const segments: Array<{ text: string; bold: boolean; italic: boolean }> =
        [];
      let currentPos = 0;

      // Simple markdown parser for bold and italic
      const boldRegex = /\*\*(.+?)\*\*/g;
      const italicRegex = /\*(.+?)\*/g;

      let match;
      const processedText = text
        .replace(boldRegex, "|BOLD_START|$1|BOLD_END|")
        .replace(italicRegex, "|ITALIC_START|$1|ITALIC_END|");

      const parts = processedText.split("|");
      let isBold = false;
      let isItalic = false;

      parts.forEach((part) => {
        if (part === "BOLD_START") isBold = true;
        else if (part === "BOLD_END") isBold = false;
        else if (part === "ITALIC_START") isItalic = true;
        else if (part === "ITALIC_END") isItalic = false;
        else if (part) {
          segments.push({ text: part, bold: isBold, italic: isItalic });
        }
      });

      return segments;
    };

    // Story content with preserved formatting
    doc.setFontSize(13);
    doc.setTextColor(40, 40, 40);

    const paragraphs = story.tale.split("\n\n");
    let isFirstParagraph = true;

    paragraphs.forEach((paragraph) => {
      if (!paragraph.trim()) return;

      const segments = parseMarkdown(paragraph);
      let currentLine = "";
      const lineHeight = 8;
      const paragraphIndent = isFirstParagraph ? 0 : 5;

      segments.forEach((segment, idx) => {
        // Set font style
        if (segment.bold && segment.italic) {
          doc.setFont("helvetica", "bolditalic");
        } else if (segment.bold) {
          doc.setFont("helvetica", "bold");
        } else if (segment.italic) {
          doc.setFont("helvetica", "italic");
        } else {
          doc.setFont("helvetica", "normal");
        }

        const words = segment.text.split(" ");
        words.forEach((word, widx) => {
          const testLine = currentLine + (currentLine ? " " : "") + word;
          const textWidth = doc.getTextWidth(testLine);

          if (textWidth > maxWidth - paragraphIndent && currentLine) {
            // Print current line
            if (yPosition > pageHeight - margin - 15) {
              doc.addPage();
              yPosition = margin + 10;
              addPageDecorations();
            }
            doc.text(currentLine, margin + paragraphIndent, yPosition);
            yPosition += lineHeight;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });
      });

      // Print remaining line
      if (currentLine) {
        if (yPosition > pageHeight - margin - 15) {
          doc.addPage();
          yPosition = margin + 10;
          addPageDecorations();
        }
        doc.text(currentLine, margin + paragraphIndent, yPosition);
        yPosition += lineHeight;
      }

      // Paragraph spacing
      yPosition += 6;
      isFirstParagraph = false;
    });

    // ========== THE END PAGE ==========
    yPosition += 15;
    if (yPosition > pageHeight - margin - 40) {
      doc.addPage();
      yPosition = margin + 10;
      addPageDecorations();
    }

    // Decorative line before "The End"
    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(1);
    yPosition += 5;
    doc.line(pageWidth / 2 - 30, yPosition, pageWidth / 2 + 30, yPosition);

    // "The End" text
    yPosition += 12;
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(18);
    doc.setTextColor(147, 51, 234);
    doc.text("The End", pageWidth / 2, yPosition, { align: "center" });

    // Stars decoration
    doc.setFontSize(14);
    doc.text("✨", pageWidth / 2 - 25, yPosition);
    doc.text("✨", pageWidth / 2 + 25, yPosition);

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
