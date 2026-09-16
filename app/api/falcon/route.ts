import { NextResponse } from "next/server";
import { generateGeminiResponse } from "@/lib/gemini/analyzer";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const generatedText = await generateGeminiResponse(prompt);

    return NextResponse.json({
      text: generatedText,
      success: true,
      data: { text: generatedText, result: generatedText },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process AI query" },
      { status: 500 }
    );
  }
}
