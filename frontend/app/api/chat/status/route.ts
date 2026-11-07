import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  // Check backend first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${backendUrl}/api/chat/status`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        backendOnline: true,
        ...data,
      });
    }
  } catch {
    // Backend offline
  }

  // Check direct Groq connectivity
  const apiKey = (
    process.env.GROQ_API_KEY ||
    process.env.NEXT_PUBLIC_GROQ_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ""
  ).trim();

  let groqConnected = false;
  const modelName = "openai/gpt-oss-120b";

  if (apiKey) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/models", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "User-Agent": "CampusConnect/1.0",
        },
      });
      groqConnected = res.ok;
    } catch {
      groqConnected = false;
    }
  }

  return NextResponse.json({
    backendOnline: false,
    groq_configured: Boolean(apiKey),
    groq_connected: groqConnected,
    gemini_configured: Boolean(apiKey),
    gemini_connected: groqConnected,
    model: modelName,
    mode: "direct",
  });
}
