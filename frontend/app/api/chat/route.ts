import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = (body?.message || "").trim();
    const history = body?.history || [];
    const useRag = body?.use_rag !== false;

    if (!message) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    // Forward to FastAPI backend (backend handles all AI logic + RAG)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          use_rag: useRag,
          history,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!backendRes.ok) {
        const errText = await backendRes.text().catch(() => "");
        return NextResponse.json(
          {
            error: `Backend error (${backendRes.status}): ${errText.slice(0, 200)}`,
            reply:
              "The assistant is temporarily unavailable. Please try again.",
            sources: [],
            mode: "error",
          },
          { status: backendRes.status }
        );
      }

      const data = await backendRes.json();
      return NextResponse.json({
        reply: data.reply || "",
        sources: data.sources || [],
        mode: data.mode || "rag",
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error("Backend fetch failed:", fetchError);

      return NextResponse.json(
        {
          error: "Backend unreachable",
          reply:
            "Unable to connect to the CampusConnect backend. Please ensure the server is running at " +
            BACKEND_URL,
          sources: [],
          mode: "error",
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to process chat request",
        reply: "An unexpected error occurred. Please try again.",
        sources: [],
        mode: "error",
      },
      { status: 500 }
    );
  }
}