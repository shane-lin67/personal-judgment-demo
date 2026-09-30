"use client";

import { DemoScenario } from "@/lib/types";

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: {
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

function getDemoScenarioHeader() {
  if (typeof window === "undefined") {
    return null;
  }

  const scenario = window.localStorage.getItem("demo-scenario") as DemoScenario | null;
  return scenario;
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  const scenario = getDemoScenarioHeader();
  if (scenario) {
    headers.set("x-demo-scenario", scenario);
  }

  const response = await fetch(url, {
    ...init,
    headers,
    cache: "no-store"
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.success ? "请求失败" : payload.error.message);
  }

  return payload.data;
}
