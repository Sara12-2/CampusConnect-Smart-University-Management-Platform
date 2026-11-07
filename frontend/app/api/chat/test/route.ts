import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = (
    process.env.GROQ_API_KEY ||
    process.env.NEXT_PUBLIC_GROQ_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ""
  ).trim();

  if (!apiKey) {
    return NextResponse.json({
      connected: false,
      error: "GROQ_API_KEY is not configured in .env.local",
    }, { status: 400 });
  }

  const model = "openai/gpt-oss-120b";
  const start = Date.now();

  try {
    const url = "https://api.groq.com/openai/v1/models";
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "User-Agent": "CampusConnect/1.0",
        Accept: "application/json",
      },
    });

    const latencyMs = Date.now() - start;

    if (res.ok) {
      return NextResponse.json({
        connected: true,
        model,
        displayName: "Groq LPU (openai/gpt-oss-120b)",
        latencyMs,
        message: "Groq API is connected and verified.",
      });
    }

    const errText = await res.text();
    return NextResponse.json({
      connected: false,
      status: res.status,
      error: errText,
      message: "Groq API rejected request.",
    }, { status: 502 });
  } catch (err: any) {
    return NextResponse.json({
      connected: false,
      error: err.message || "Failed to contact Groq API.",
      message: "Network error reaching Groq API.",
    }, { status: 500 });
  }
}
