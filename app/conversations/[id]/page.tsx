"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { MessageBubble } from "@/components/conversations/message-bubble";
import { ErrorPanel } from "@/components/shared/error-panel";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchJson } from "@/lib/api-client";
import { ConversationDetail } from "@/lib/types";

export default function ConversationDetailPage() {
  const params = useParams<{ id: string }>();
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!params?.id) {
      return;
    }

    fetchJson<ConversationDetail>(`/api/conversations/${params.id}`)
      .then((result) => {
        if (!cancelled) {
          setConversation(result);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [params?.id]);

  if (loading) {
    return <LoadingPanel message="正在加载会话详情..." />;
  }

  if (error || !conversation) {
    return <ErrorPanel message={error ?? "会话不存在或加载失败。"} />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-sm backdrop-blur">
        <Button asChild variant="ghost" className="mb-4 rounded-full px-0">
          <Link href="/conversations">
            <ArrowLeft className="h-4 w-4" />
            返回会话列表
          </Link>
        </Button>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{conversation.sourcePlatform}</Badge>
            <Badge variant="outline">{conversation.sourceUpdatedAtLabel}</Badge>
          </div>
          <h1 className="font-serif text-4xl font-semibold text-slate-900">{conversation.title}</h1>
          <p className="max-w-4xl text-base leading-7 text-slate-600">{conversation.summary}</p>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3">
            <p className="text-sm text-slate-500">消息数</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{conversation.messageCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3">
            <p className="text-sm text-slate-500">知识卡片</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{conversation.knowledgeCardCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3">
            <p className="text-sm text-slate-500">标签</p>
            <p className="mt-1 text-base font-medium text-slate-900">{conversation.tags.join(" / ")}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[1.75rem] border-white/70 bg-slate-100/80 shadow-sm">
          <CardHeader>
            <CardTitle>原始聊天内容</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {conversation.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[1.75rem] border-white/70 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>摘要与重点</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-700">摘要</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{conversation.summary}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">重点结论</p>
                <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-600">
                  {conversation.keyPoints.map((point) => (
                    <li key={point} className="rounded-xl bg-slate-50 px-3 py-2">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">行动项</p>
                <ul className="mt-2 space-y-2 text-sm leading-7 text-slate-600">
                  {conversation.actionItems.map((item) => (
                    <li key={item} className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-900">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border-white/70 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>知识卡片</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {conversation.knowledgeCards.map((card) => (
                <div key={card.id} className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium text-slate-900">{card.title}</h3>
                    <Badge variant="outline">{card.cardTypeLabel}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{card.summary}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border-white/70 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>相似历史会话</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {conversation.relatedConversations.map((related) => (
                <Link
                  key={related.id}
                  href={`/conversations/${related.id}`}
                  className="block rounded-2xl border border-slate-200/70 bg-slate-50 p-4 transition hover:bg-slate-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium text-slate-900">{related.title}</h3>
                    <Badge variant="secondary">{related.scoreLabel}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{related.summary}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
