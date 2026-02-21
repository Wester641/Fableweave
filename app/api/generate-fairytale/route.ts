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

    const prompt = `Write a fairy tale for a child named ${childName}, 
  aged ${ageRange}, with the theme of ${theme}. 
  The story should be engaging, age-appropriate, 
  and include a moral lesson.`;

    const response = await client.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are a creative storyteller who writes enchanting fairy tales for children.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 300,
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
