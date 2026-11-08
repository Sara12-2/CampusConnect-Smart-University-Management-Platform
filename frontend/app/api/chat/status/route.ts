import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    // Backend health check
    const res = await fetch(`${backendUrl}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        ...data,
        backendOnline: true, // ✅ Yeh true ho raha hai
        status: "Backend is running and connected",
      });
    }
  } catch (error) {
    console.error("Backend fetch failed:", error);
  }

  // Fallback: Groq direct check
  const apiKey = (
    process.env.GROQ_API_KEY ||
    process.env.NEXT_PUBLIC_GROQ_API_KEY ||
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
    status: groqConnected
      ? "Backend offline, but Groq API is connected directly"
      : "Backend offline and Groq API not connected",
    groq_configured: Boolean(apiKey),
    groq_connected: groqConnected,
    model: modelName,
    mode: "direct",
  });
}