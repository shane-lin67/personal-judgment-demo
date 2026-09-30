import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { KnowledgeCardListItem as KnowledgeCardListItemType } from "@/lib/types";

export function KnowledgeCardListItem({ card }: { card: KnowledgeCardListItemType }) {
  return (
    <Card className="rounded-[1.5rem] border-white/70 bg-white/90 shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{card.cardTypeLabel}</Badge>
              <Badge variant="secondary">{card.sourcePlatform}</Badge>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
          </div>
          <span className="text-sm text-slate-500">{card.createdAtLabel}</span>
        </div>

        <p className="text-sm leading-7 text-slate-600">{card.summary}</p>

        <div className="flex flex-wrap gap-2">
          {card.keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="rounded-full">
              {keyword}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <div className="flex flex-wrap gap-2">
            {card.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-full">
                {tag}
              </Badge>
            ))}
          </div>
          <Link
            href={`/conversations/${card.sourceConversationId}`}
            className="font-medium text-slate-700 underline-offset-4 hover:underline"
          >
            来源会话：{card.sourceConversationTitle}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
