"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { KnowledgeCardListItem } from "@/components/knowledge-cards/knowledge-card-list-item";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorPanel } from "@/components/shared/error-panel";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchJson } from "@/lib/api-client";
import { KnowledgeCardListItem as KnowledgeCardListItemType } from "@/lib/types";
import { getKnowledgeCardFilterOptions } from "@/lib/services/knowledge-card-service";

export default function KnowledgeCardsPage() {
  const [cards, setCards] = useState<KnowledgeCardListItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("全部");
  const [selectedSource, setSelectedSource] = useState("全部");
  const [selectedTag, setSelectedTag] = useState("全部");
  const filters = getKnowledgeCardFilterOptions();

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesQuery =
        !query.trim() ||
        [card.title, card.summary, card.sourceConversationTitle, card.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase());
      const matchesType = selectedType === "全部" || card.cardTypeLabel === selectedType;
      const matchesSource = selectedSource === "全部" || card.sourcePlatform === selectedSource;
      const matchesTag = selectedTag === "全部" || card.tags.includes(selectedTag);
      return matchesQuery && matchesType && matchesSource && matchesTag;
    });
  }, [cards, query, selectedType, selectedSource, selectedTag]);

  useEffect(() => {
    let cancelled = false;

    fetchJson<KnowledgeCardListItemType[]>("/api/knowledge-cards")
      .then((result) => {
        if (!cancelled) {
          setCards(result);
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
          <h1 className="font-serif text-4xl font-semibold text-slate-900">知识卡片</h1>
          <p className="text-base leading-7 text-slate-600">
            当前先用 mock 数据验证页面和信息结构，后续再接数据库查询和筛选能力。
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[1.5rem] border-white/70 bg-white/85 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">知识卡片总数</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{cards.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[1.5rem] border-white/70 bg-white/85 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">当前结果</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{filteredCards.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[1.5rem] border-white/70 bg-white/85 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">当前筛选</p>
            <p className="mt-2 text-base font-medium text-slate-900">{selectedType} / {selectedSource}</p>
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
                placeholder="搜索知识卡片..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">类型</p>
              <div className="flex flex-wrap gap-2">
                {filters.types.map((type) => (
                  <button key={type} type="button" onClick={() => setSelectedType(type)}>
                    <Badge
                      variant={selectedType === type ? "secondary" : "outline"}
                      className="rounded-full px-3 py-1"
                    >
                      {type}
                    </Badge>
                  </button>
                ))}
              </div>
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
          {loading ? <LoadingPanel message="正在加载知识卡片..." /> : null}
          {error ? <ErrorPanel message={error} /> : null}
          {!loading && !error && cards.length === 0 ? (
            <EmptyState
              title="还没有知识卡片"
              description="知识卡片会在聊天导入并完成分析后自动生成。这里会成为你回顾观点、决策、行动项和经验的入口。"
              ctaLabel="先去导入内容"
              ctaHref="/import"
              icon="sparkles"
            />
          ) : null}
          {!loading && !error && filteredCards.length === 0 ? (
            <Card className="rounded-[1.5rem] border-white/70 bg-white/85 shadow-sm">
              <CardContent className="p-6 text-sm text-slate-500">没有匹配的知识卡片，试试调整筛选条件。</CardContent>
            </Card>
          ) : null}
          {filteredCards.map((card) => (
            <KnowledgeCardListItem key={card.id} card={card} />
          ))}
        </section>
      </div>
    </div>
  );
}
