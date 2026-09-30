export function LoadingPanel({ message = "正在加载数据..." }: { message?: string }) {
  return <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-6 text-sm text-slate-500 shadow-sm">{message}</div>;
}
