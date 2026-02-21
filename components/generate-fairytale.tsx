import OpenAI from "openai";

const API_KEY =
  "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";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateFairytale(
  childName: string,
  ageRange: string,
  theme: string,
) {
  const prompt = `Write a fairy tale for a child named ${childName}, 
  aged ${ageRange}, with the theme of ${theme}. 
  The story should be engaging, age-appropriate, 
  and include a moral lesson.`;

  try {
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

    return console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error generating fairy tale:", error);
    throw new Error("Failed to generate fairy tale");
  }
}
