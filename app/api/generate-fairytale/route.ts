import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { childName, ageRange, theme } = await request.json();

    if (!childName || !ageRange || !theme) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const prompt = `Write an engaging fairy tale for a child named ${childName}, 
  aged ${ageRange}, with the theme of ${theme}. 
  
  Important guidelines:
  - Make the story gender-neutral and inclusive, suitable for any child
  - Avoid stereotypical gender roles (e.g., not all heroes need to be princes, not all adventurers need to be princesses)
  - Focus on universal themes like courage, kindness, friendship, and adventure
  - The story should be age-appropriate and include a meaningful moral lesson
  - Use the child's name naturally throughout the story`;

    const response = await client.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are a creative storyteller who writes enchanting, gender-neutral fairy tales for all children. Your stories feature diverse characters and avoid gender stereotypes. You create adventures that any child can relate to, regardless of gender.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 500,
    });

    const fairytale = response.choices[0].message.content;

    return NextResponse.json({ fairytale });
  } catch (error) {
    console.error("Error generating fairy tale:", error);
    return NextResponse.json(
      { error: "Failed to generate fairy tale" },
      { status: 500 },
    );
  }
}
