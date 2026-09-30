"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { ErrorPanel } from "@/components/shared/error-panel";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { fetchJson } from "@/lib/api-client";
import { KnowledgeNodeDetail } from "@/lib/cognition-types";

export default function NodeDetailPage() {
  const params = useParams<{ id: string }>();
  const [asset, setAsset] = useState<KnowledgeNodeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!params?.id) {
      return;
    }

    fetchJson<KnowledgeNodeDetail>(`/api/cognition/nodes/${params.id}`)
      .then((result) => {
        if (!cancelled) {
          setAsset(result);
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
  }, [params?.id]);

  const relatedJudgments = useMemo(() => {
    return asset?.relatedNodes.filter((item) => item.type === "问题" || item.type === "母题") ?? [];
  }, [asset]);

  const relatedPrinciples = useMemo(() => {
    return asset?.relatedNodes.filter((item) => item.type === "原则" || item.type === "方法") ?? [];
  }, [asset]);

  const relatedCases = useMemo(() => {
    return asset?.relatedNodes.filter((item) => item.type === "案例" || item.type === "来源") ?? [];
  }, [asset]);

  if (error) {
    return <ErrorPanel message={error} />;
  }

  if (!asset) {
    return <LoadingPanel message="正在加载认知资产..." />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-sm backdrop-blur">
        <Link href="/knowledge-tree" className="mb-4 inline-block text-sm text-slate-600 hover:text-slate-900">
          返回认知资产网络
        </Link>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">认知资产</span>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">重要度：{asset.importance}</span>
          </div>
          <h1 className="font-serif text-4xl font-semibold text-slate-900">{asset.name}</h1>
          <p className="max-w-4xl text-base leading-7 text-slate-600">{asset.description}</p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">这是什么局面</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-4">
                <p className="text-sm text-slate-500">局面描述</p>
                <p className="mt-2">{asset.description}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-4">
                <p className="text-sm text-slate-500">核心冲突</p>
                <p className="mt-2">{asset.structuralRole}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">相关聊天</h2>
            <div className="mt-4 space-y-4">
              {asset.chatSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className={`rounded-2xl px-4 py-4 ${
                    snippet.role === "user" ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-800"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs opacity-70">
                    <span className="uppercase tracking-wide">{snippet.role}</span>
                    <span>{snippet.timestampLabel}</span>
                  </div>
                  <p className="text-sm leading-7">{snippet.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">判断时先看什么</h2>
            <div className="mt-4 space-y-3">
              {relatedJudgments.length ? (
                relatedJudgments.map((item) => (
                  <Link
                    key={item.id}
                    href={`/nodes/${item.id}`}
                    className="block rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-4 transition hover:bg-slate-100"
                  >
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="mt-2 text-sm text-slate-500">{item.relation}</p>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                  这项资产当前还没有单独拆出更多相关判断。
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">可以先怎么做</h2>
            <div className="mt-4 space-y-3">
              {relatedPrinciples.length ? (
                relatedPrinciples.map((item) => (
                  <Link
                    key={item.id}
                    href={`/nodes/${item.id}`}
                    className="block rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-4 transition hover:bg-slate-100"
                  >
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="mt-2 text-sm text-slate-500">{item.relation}</p>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                  这项资产当前还没有拆出更具体的原则或做法。
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">我过去的相关经验</h2>
            <div className="mt-4 space-y-3">
              {relatedCases.length ? (
                relatedCases.map((item) => (
                  <Link
                    key={item.id}
                    href={`/nodes/${item.id}`}
                    className="block rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-4 transition hover:bg-slate-100"
                  >
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="mt-2 text-sm text-slate-500">{item.relation}</p>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                  这项资产当前更多还是来自聊天与个人经验。
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3">
              {asset.evidence.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.excerpt}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">相关历史镜像</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              {asset.historicalMirror ? (
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">历史上类似的局面</p>
                  <p className="mt-2">{asset.historicalMirror}</p>
                </div>
              ) : null}
              {asset.classicalAnchor ? (
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">古籍里可能对应的表达</p>
                  <p className="mt-2">{asset.classicalAnchor}</p>
                </div>
              ) : null}
              {asset.modernMapping ? (
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">今天还能映射到哪里</p>
                  <p className="mt-2">{asset.modernMapping}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
