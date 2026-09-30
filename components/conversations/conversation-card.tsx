import Link from "next/link";
import { CalendarDays, MessageSquareMore, Sparkles, Tags } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ConversationListItem } from "@/lib/types";

export function ConversationCard({
  conversation,
  compact = false
}: {
  conversation: ConversationListItem;
  compact?: boolean;
}) {
  return (
    <Card className="rounded-[1.5rem] border-white/70 bg-white/90 shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                {conversation.sourcePlatform}
              </Badge>
              <Badge variant="outline" className="rounded-full">
                {conversation.importedAtLabel}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              <Link href={`/conversations/${conversation.id}`} className="hover:underline">
                {conversation.title}
              </Link>
            </h3>
          </div>
          {!compact ? (
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              {conversation.knowledgeCardCount} 张知识卡片
            </div>
          ) : null}
        </div>

        <p className="text-sm leading-7 text-slate-600">{conversation.summary}</p>

        <div className="flex flex-wrap gap-2">
          {conversation.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <MessageSquareMore className="h-4 w-4" />
            <span>{conversation.messageCount} 条消息</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>{conversation.knowledgeCardCount} 张知识卡片</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>{conversation.sourceUpdatedAtLabel}</span>
          </div>
          {!compact ? (
            <div className="flex items-center gap-2">
              <Tags className="h-4 w-4" />
              <span>{conversation.tags.length} 个标签</span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
