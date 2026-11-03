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

  // Check direct Gemini connectivity
  const apiKey = (
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ""
  ).trim();

  let geminiConnected = false;
  let modelName = "gemini-flash-lite-latest";

  if (apiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}?key=${apiKey}`,
        { method: "GET" }
      );
      geminiConnected = res.ok;
    } catch {
      geminiConnected = false;
    }
  }

  return NextResponse.json({
    backendOnline: false,
    gemini_configured: Boolean(apiKey),
    gemini_connected: geminiConnected,
    model: modelName,
    mode: "direct",
  });
}
