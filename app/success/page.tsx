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

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    // ── helpers ──────────────────────────────────────────────────────────────
    const hex2rgb = (hex: string): [number, number, number] => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };

    // Soft starfield background (tiny dots)
    const drawBackground = (isCover = false) => {
      if (isCover) {
        // Deep navy/midnight gradient simulation (top → bottom)
        const bands = 30;
        for (let i = 0; i < bands; i++) {
          const t = i / bands;
          const r = Math.round(10 + t * 25);
          const g = Math.round(8 + t * 18);
          const b = Math.round(40 + t * 55);
          doc.setFillColor(r, g, b);
          doc.rect(
            0,
            (pageHeight / bands) * i,
            pageWidth,
            pageHeight / bands + 0.5,
            "F",
          );
        }
        // Subtle stars
        doc.setFillColor(255, 255, 255);
        const stars = [
          [15, 12],
          [40, 8],
          [70, 20],
          [100, 6],
          [140, 15],
          [170, 10],
          [22, 35],
          [55, 50],
          [130, 28],
          [165, 40],
          [180, 22],
          [195, 55],
          [10, 65],
          [88, 70],
          [150, 72],
          [185, 80],
          [30, 90],
          [120, 88],
        ];
        stars.forEach(([x, y]) => {
          doc.circle(x, y, 0.4, "F");
        });
      } else {
        // Warm parchment / aged paper
        doc.setFillColor(254, 249, 239);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
        // Subtle texture dots
        doc.setFillColor(220, 200, 170);
        for (let i = 0; i < 60; i++) {
          const x = (i * 37) % pageWidth;
          const y = (i * 53) % pageHeight;
          doc.circle(x, y, 0.15, "F");
        }
      }
    };

    // Ornate decorative border
    const drawBorder = (isCover = false) => {
      const color: [number, number, number] = isCover
        ? [212, 175, 55]
        : [180, 140, 80];
      const pad = 8;

      // Outer rect
      doc.setDrawColor(...color);
      doc.setLineWidth(1.5);
      doc.rect(pad, pad, pageWidth - pad * 2, pageHeight - pad * 2);
      // Inner rect
      doc.setLineWidth(0.4);
      doc.rect(
        pad + 3,
        pad + 3,
        pageWidth - (pad + 3) * 2,
        pageHeight - (pad + 3) * 2,
      );

      // Corner ornaments — four-petal flower
      const corners: [number, number][] = [
        [pad, pad],
        [pageWidth - pad, pad],
        [pad, pageHeight - pad],
        [pageWidth - pad, pageHeight - pad],
      ];
      doc.setFillColor(...color);
      corners.forEach(([cx, cy]) => {
        [-1, 1].forEach((dx) =>
          [-1, 1].forEach((dy) => {
            doc.circle(cx + dx * 2.5, cy + dy * 2.5, 1.2, "F");
          }),
        );
        doc.circle(cx, cy, 1.8, "F");
      });
    };

    // Small divider
    const drawDivider = (y: number, centerX: number, width = 40) => {
      doc.setDrawColor(180, 140, 80);
      doc.setLineWidth(0.3);
      doc.line(centerX - width / 2, y, centerX - 6, y);
      doc.line(centerX + 6, y, centerX + width / 2, y);
      doc.setFillColor(212, 175, 55);
      doc.circle(centerX, y, 1.5, "F");
      doc.circle(centerX - 4, y, 0.8, "F");
      doc.circle(centerX + 4, y, 0.8, "F");
    };

    // ── COVER PAGE ────────────────────────────────────────────────────────────
    drawBackground(true);
    drawBorder(true);

    const cx = pageWidth / 2;

    // Moon glow circle behind title
    doc.setFillColor(255, 230, 100);
    doc.circle(cx, pageHeight * 0.38, 28, "F");
    doc.setFillColor(255, 240, 150);
    doc.circle(cx, pageHeight * 0.38, 22, "F");
    doc.setFillColor(255, 248, 200);
    doc.circle(cx, pageHeight * 0.38, 15, "F");

    // Castle silhouette (simplified shapes)
    const castleY = pageHeight * 0.38 + 10;
    doc.setFillColor(15, 12, 45);
    // Main tower
    doc.rect(cx - 6, castleY - 14, 12, 18, "F");
    // Battlements
    [-5, -2, 1, 4].forEach((dx) => doc.rect(cx + dx, castleY - 17, 2, 4, "F"));
    // Side towers
    doc.rect(cx - 14, castleY - 8, 8, 12, "F");
    doc.rect(cx + 6, castleY - 8, 8, 12, "F");
    // Tower tops (triangles via polygon)
    doc.triangle(
      cx - 14,
      castleY - 8,
      cx - 6,
      castleY - 8,
      cx - 10,
      castleY - 14,
      "F",
    );
    doc.triangle(
      cx + 6,
      castleY - 8,
      cx + 14,
      castleY - 8,
      cx + 10,
      castleY - 14,
      "F",
    );
    // Window
    doc.setFillColor(255, 220, 80);
    doc.rect(cx - 2, castleY - 8, 4, 5, "F");

    // Sparkle stars around moon
    const sparklePositions = [
      [cx - 22, castleY - 20],
      [cx + 20, castleY - 22],
      [cx - 30, castleY - 5],
      [cx + 28, castleY - 10],
      [cx - 18, castleY + 6],
      [cx + 18, castleY + 4],
    ];
    sparklePositions.forEach(([sx, sy]) => {
      doc.setFillColor(255, 240, 100);
      doc.circle(sx, sy, 0.8, "F");
      doc.setDrawColor(255, 240, 100);
      doc.setLineWidth(0.4);
      doc.line(sx - 2.5, sy, sx + 2.5, sy);
      doc.line(sx, sy - 2.5, sx, sy + 2.5);
    });

    // "A Magical Story for" label
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(180, 160, 220);
    doc.text("✦  A Magical Story For  ✦", cx, castleY + 16, {
      align: "center",
    });

    // Child name — golden, large
    doc.setFont("helvetica", "bold");
    doc.setFontSize(34);
    doc.setTextColor(212, 175, 55);
    doc.text(story.childName, cx, castleY + 32, { align: "center" });

    drawDivider(castleY + 38, cx, 60);

    // Theme label
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.setTextColor(200, 185, 240);
    // Truncate theme if too long
    const themeText =
      story.theme.length > 45 ? story.theme.slice(0, 42) + "…" : story.theme;
    doc.text(themeText, cx, castleY + 50, {
      align: "center",
      maxWidth: maxWidth - 20,
    });

    // Age badge
    doc.setFillColor(212, 175, 55);
    doc.roundedRect(cx - 20, castleY + 55, 40, 10, 5, 5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 10, 40);
    doc.text(`Age ${story.ageRange}`, cx, castleY + 61.5, { align: "center" });

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 110, 160);
    doc.text("✨  Once upon a time…  ✨", cx, pageHeight - 18, {
      align: "center",
    });

    // ── STORY PAGES ───────────────────────────────────────────────────────────
    doc.addPage();

    let yPos = margin + 14;
    let pageNum = 1;

    const addPageDecorations = (isFirst = false) => {
      drawBackground(false);
      drawBorder(false);

      if (isFirst) {
        // Decorative chapter header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(140, 100, 50);
        doc.text("✦  Once Upon A Time…  ✦", cx, margin - 1, {
          align: "center",
        });
      }

      // Page number
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(160, 130, 80);
      doc.text(`— ${pageNum} —`, cx, pageHeight - margin + 4, {
        align: "center",
      });
      pageNum++;
    };

    addPageDecorations(true);

    // Drop cap styling for first paragraph
    let isFirstParagraph = true;
    const lineH = 6; // line height in mm
    const fontSize = 11;
    doc.setFontSize(fontSize);

    const paragraphs = story.tale
      .replace(/#{1,6}\s*/g, "") // strip markdown headings
      .split(/\n{2,}/);

    paragraphs.forEach((paragraph) => {
      const rawText = paragraph
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\*(.+?)\*/g, "$1")
        .replace(/\n/g, " ")
        .trim();

      if (!rawText) return;

      // Check space: need at least 2 lines
      if (yPos > pageHeight - margin - lineH * 3) {
        doc.addPage();
        yPos = margin + 14;
        addPageDecorations();
      }

      // Drop cap for very first paragraph
      if (isFirstParagraph) {
        const dropChar = rawText[0];
        const restText = rawText.slice(1);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(28);
        doc.setTextColor(180, 120, 40);
        doc.text(dropChar, margin, yPos + 7);

        const dropCapWidth = doc.getTextWidth(dropChar) + 3;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);
        doc.setTextColor(50, 35, 20);

        // Wrap rest of paragraph with indent for drop cap (2 lines)
        const wrappedFirst = doc.splitTextToSize(
          restText,
          maxWidth - dropCapWidth,
        );
        wrappedFirst.slice(0, 2).forEach((line: string, i: number) => {
          doc.text(line, margin + dropCapWidth, yPos + i * lineH);
        });
        if (wrappedFirst.length > 2) {
          const remaining = wrappedFirst.slice(2).join(" ");
          const wrappedRest = doc.splitTextToSize(remaining, maxWidth);
          wrappedRest.forEach((line: string, i: number) => {
            const ly = yPos + (i + 2) * lineH;
            if (ly > pageHeight - margin - lineH) {
              doc.addPage();
              yPos = margin + 14;
              addPageDecorations();
            }
            doc.text(
              line,
              margin,
              ly > pageHeight - margin - lineH
                ? ((yPos = margin + 14), margin + 14)
                : ly,
            );
          });
          yPos += wrappedFirst.length * lineH;
        } else {
          yPos += 2 * lineH + 8; // after drop cap block
        }

        isFirstParagraph = false;
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(fontSize);
        doc.setTextColor(50, 35, 20);

        const lines = doc.splitTextToSize(rawText, maxWidth);
        lines.forEach((line: string) => {
          if (yPos > pageHeight - margin - lineH * 2) {
            doc.addPage();
            yPos = margin + 14;
            addPageDecorations();
          }
          doc.text(line, margin, yPos);
          yPos += lineH;
        });
        yPos += 4; // paragraph gap
      }
    });

    // ── THE END ───────────────────────────────────────────────────────────────
    yPos += 10;
    if (yPos > pageHeight - margin - 30) {
      doc.addPage();
      yPos = margin + 14;
      addPageDecorations();
    }

    drawDivider(yPos, cx, 50);
    yPos += 10;

    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(20);
    doc.setTextColor(140, 90, 30);
    doc.text("~ The End ~", cx, yPos, { align: "center" });

    yPos += 8;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(160, 130, 80);
    doc.text(
      `A story written especially for ${story.childName}  ✨`,
      cx,
      yPos,
      { align: "center" },
    );

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
        <p className="text-muted-foreground">Loading your story…</p>
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
          <p className="text-muted-foreground">Loading your story…</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
