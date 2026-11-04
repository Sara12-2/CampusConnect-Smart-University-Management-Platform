import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ""
  ).trim();

  if (!apiKey) {
    return NextResponse.json({
      connected: false,
      error: "GEMINI_API_KEY is not configured in .env.local",
    }, { status: 400 });
  }

  const model = "gemini-flash-lite-latest";
  const start = Date.now();

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}?key=${apiKey}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const latencyMs = Date.now() - start;

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        connected: true,
        model,
        displayName: data.displayName || "Gemini Flash-Lite",
        latencyMs,
        message: "Google Gemini API is connected and verified.",
      });
    }

    const errText = await res.text();
    return NextResponse.json({
      connected: false,
      status: res.status,
      error: errText,
      message: "Google Gemini API rejected request.",
    }, { status: 502 });
  } catch (err: any) {
    return NextResponse.json({
      connected: false,
      error: err.message || "Failed to contact Gemini API.",
      message: "Network error reaching Google Gemini API.",
    }, { status: 500 });
  }
}
