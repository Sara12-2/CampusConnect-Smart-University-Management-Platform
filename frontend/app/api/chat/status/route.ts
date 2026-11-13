import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${BACKEND_URL}/api/chat/test-connection`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        ...data,
        backendOnline: true,
      });
    }

    return NextResponse.json(
      {
        connected: false,
        backendOnline: false,
        error: `Backend responded with status ${res.status}`,
      },
      { status: res.status }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        connected: false,
        backendOnline: false,
        error:
          "Backend is offline. Start the FastAPI server at " + BACKEND_URL,
      },
      { status: 503 }
    );
  }
}