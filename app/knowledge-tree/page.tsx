"use client";

import { useEffect, useState } from "react";

import { CosmosExplorer } from "@/components/cognition/cosmos-explorer";
import { ErrorPanel } from "@/components/shared/error-panel";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { fetchJson } from "@/lib/api-client";
import { CognitionHomePayload } from "@/lib/cognition-types";

export default function KnowledgeTreePage() {
  const [data, setData] = useState<CognitionHomePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchJson<CognitionHomePayload>("/api/cognition/home")
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <ErrorPanel message={error} />;
  }

  if (!data) {
    return <LoadingPanel message="正在加载认知资产网络..." />;
  }

  return <CosmosExplorer data={data} mode="network" />;
}
