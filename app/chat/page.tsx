"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ErrorPanel } from "@/components/shared/error-panel";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { fetchJson } from "@/lib/api-client";
import { AssetAutoArchive, DemoChatMessage, SuggestedNode } from "@/lib/cognition-types";

type ChatPayload = {
  messages: DemoChatMessage[];
  suggestedNodes: SuggestedNode[];
  latestArchive: AssetAutoArchive;
};

export default function ChatPage() {
  const [data, setData] = useState<ChatPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("对方表面上一直很积极，但真到要出人、出时间、担责任时就开始退。我该继续给资源，还是先拉开距离？");

  useEffect(() => {
    let cancelled = false;

    fetchJson<ChatPayload>("/api/cognition/chat")
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

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-sm backdrop-blur">
        <div className="max-w-3xl space-y-3">
          <h1 className="font-serif text-4xl font-semibold text-slate-900">聊天</h1>
          <p className="text-base leading-7 text-slate-600">
            把你现在卡住的现实问题直接说出来，系统会一边回答，一边把它归入已有认知资产，识别相关标签，并提示有没有新的判断正在形成。
          </p>
        </div>
      </section>

      {error ? <ErrorPanel message={error} /> : null}
      {!data && !error ? <LoadingPanel message="正在加载聊天与自动归档结果..." /> : null}

      {data ? (
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-slate-900">真实对话场景</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">系统后台自动归档</span>
            </div>

            <div className="mt-4 space-y-4">
              {data.messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl px-4 py-4 ${
                    message.role === "user" ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-800"
                  }`}
                >
                  <div className="mb-2 text-xs uppercase tracking-wide opacity-70">{message.role}</div>
                  <p className="text-sm leading-7">{message.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200/70 bg-white p-3">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="min-h-28 w-full resize-none border-0 bg-transparent text-sm leading-7 text-slate-700 outline-none"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">你只管说现实问题，系统负责把它放回资产网络里。</p>
                <button type="button" className="rounded-2xl bg-slate-950 px-4 py-2 text-sm text-white">
                  发送
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900">系统刚刚帮我归了什么档</h2>
                <Link href="/knowledge-tree" className="text-sm text-slate-600 hover:text-slate-900">
                  打开资产网络
                </Link>
              </div>

              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">已归入哪些认知资产</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.latestArchive.assets.map((item) => (
                      <span key={item} className="rounded-full bg-white px-3 py-1.5 text-sm text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">识别出哪些标签</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.latestArchive.themes.map((item) => (
                      <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4">
                  <p className="text-sm text-slate-500">发现了哪些新判断</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{data.latestArchive.newInsight}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">系统觉得这段对话更像什么局面</h2>
              <div className="mt-4 space-y-3">
                {data.suggestedNodes.map((node) => (
                  <div key={node.id} className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                    <p className="font-medium text-slate-900">{node.name}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{node.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
