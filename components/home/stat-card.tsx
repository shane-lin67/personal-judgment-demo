import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="rounded-[1.5rem] border-white/70 bg-white/85 shadow-sm">
      <CardContent className="space-y-2 p-5">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{hint}</p>
      </CardContent>
    </Card>
  );
}
