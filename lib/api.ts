import { NextResponse } from "next/server";
import { DemoScenario } from "@/lib/types";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        details
      }
    },
    { status }
  );
}

export function getDemoScenario(request: Request): DemoScenario {
  const scenario = request.headers.get("x-demo-scenario");

  if (scenario === "empty" || scenario === "mixed" || scenario === "default") {
    return scenario;
  }

  return "default";
}
