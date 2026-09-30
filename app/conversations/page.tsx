"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { ConversationCard } from "@/components/conversations/conversation-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorPanel } from "@/components/shared/error-panel";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchJson } from "@/lib/api-client";
import { ConversationListItem } from "@/lib/types";
import { getConversationFilterOptions } from "@/lib/services/conversation-service";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("全部");
  const [selectedTag, setSelectedTag] = useState("全部");
  const filters = getConversationFilterOptions();

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const matchesQuery =
        !query.trim() ||
        [conversation.title, conversation.summary, conversation.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase());
      const matchesSource = selectedSource === "全部" || conversation.sourcePlatform === selectedSource;
      const matchesTag = selectedTag === "全部" || conversation.tags.includes(selectedTag);

      return matchesQuery && matchesSource && matchesTag;
    });
  }, [conversations, query, selectedSource, selectedTag]);

  useEffect(() => {
    let cancelled = false;

    fetchJson<ConversationListItem[]>("/api/conversations")
      .then((result) => {
        if (!cancelled) {
          setConversations(result);
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
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-sm backdrop-blur">
        <div className="max-w-3xl space-y-3">
          <h1 className="font-serif text-4xl font-semibold text-slate-900">会话列表</h1>
          <p className="text-base leading-7 text-slate-600">
            浏览你导入的 AI 聊天记录，查看摘要、标签、消息量和知识卡片产出情况。
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[1.5rem] border-white/70 bg-white/85 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">总会话</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{conversations.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[1.5rem] border-white/70 bg-white/85 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">当前结果</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{filteredConversations.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[1.5rem] border-white/70 bg-white/85 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">已选筛选</p>
            <p className="mt-2 text-base font-medium text-slate-900">{selectedSource} / {selectedTag}</p>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <Card className="h-fit rounded-[1.75rem] border-white/70 bg-white/85 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">筛选与搜索</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="rounded-xl pl-9"
                placeholder="搜索标题、摘要或内容..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">来源</p>
              <div className="flex flex-wrap gap-2">
                {filters.sources.map((source) => (
                  <button key={source} type="button" onClick={() => setSelectedSource(source)}>
                    <Badge
                      variant={selectedSource === source ? "secondary" : "outline"}
                      className="rounded-full px-3 py-1"
                    >
                      {source}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">时间</p>
              <div className="flex flex-wrap gap-2">
                {filters.dateRanges.map((range) => (
                  <Badge key={range} variant="outline" className="rounded-full px-3 py-1">
                    {range}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">标签</p>
              <div className="flex flex-wrap gap-2">
                {["全部", ...filters.tags].map((tag) => (
                  <button key={tag} type="button" onClick={() => setSelectedTag(tag)}>
                    <Badge
                      variant={selectedTag === tag ? "secondary" : "outline"}
                      className="rounded-full px-3 py-1"
                    >
                      {tag}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="space-y-4">
          {loading ? <LoadingPanel message="正在加载会话列表..." /> : null}
          {error ? <ErrorPanel message={error} /> : null}
          {!loading && !error && conversations.length === 0 ? (
            <EmptyState
              title="还没有任何会话"
              description="当你导入第一份聊天记录后，这里会按会话展示标题、摘要、标签、消息条数和知识卡片数量。"
              ctaLabel="去导入聊天记录"
              ctaHref="/import"
              icon="search"
            />
          ) : null}
          {!loading && !error && filteredConversations.length === 0 ? (
            <Card className="rounded-[1.5rem] border-white/70 bg-white/85 shadow-sm">
              <CardContent className="p-6 text-sm text-slate-500">没有匹配的会话，试试调整搜索词或筛选条件。</CardContent>
            </Card>
          ) : null}
          {filteredConversations.map((conversation) => (
            <ConversationCard key={conversation.id} conversation={conversation} />
          ))}
        </section>
      </div>
    </div>
  );
}
