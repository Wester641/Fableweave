export async function generateFairytale(
  childName: string,
  ageRange: string,
  theme: string,
) {
  try {
    const response = await fetch("/api/generate-fairytale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ childName, ageRange, theme }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate fairy tale");
    }

    const data = await response.json();
    return data.fairytale;
  } catch (error) {
    console.error("Error generating fairy tale:", error);
    throw new Error("Failed to generate fairy tale");
  }
}
