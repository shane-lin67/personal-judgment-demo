import Link from "next/link";
import type { Route } from "next";
import { FileUp, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const iconMap = {
  import: FileUp,
  search: Search,
  sparkles: Sparkles
} as const;

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  icon = "sparkles"
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: Route;
  icon?: keyof typeof iconMap;
}) {
  const Icon = iconMap[icon];

  return (
    <Card className="rounded-[1.75rem] border-white/70 bg-white/90 shadow-sm">
      <CardContent className="flex flex-col items-start gap-4 p-8">
        <div className="rounded-full bg-slate-100 p-3 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
        </div>
        {ctaLabel && ctaHref ? (
          <Button asChild className="rounded-full">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
