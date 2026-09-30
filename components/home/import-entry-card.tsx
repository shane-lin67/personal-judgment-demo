import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function ImportEntryCard({
  title,
  description,
  href = "/import"
}: {
  title: string;
  description: string;
  href?: Route;
}) {
  return (
    <Link href={href} className="min-w-[220px] flex-1">
      <Card className="h-full rounded-[1.5rem] border-slate-200/70 bg-slate-50/90 transition hover:-translate-y-0.5 hover:shadow-md">
        <CardContent className="flex h-full items-start justify-between gap-4 p-5">
          <div className="space-y-2">
            <h3 className="font-medium text-slate-900">{title}</h3>
            <p className="text-sm leading-6 text-slate-600">{description}</p>
          </div>
          <div className="rounded-full bg-white p-2 text-slate-500 shadow-sm">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
