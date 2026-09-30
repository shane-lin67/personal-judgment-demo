import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4">
        <div className="pointer-events-auto flex w-full max-w-[1480px] items-center justify-between rounded-[1.6rem] border border-white/10 bg-slate-950/45 px-4 py-3 text-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.9)] backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-cyan-300/10 text-xs font-semibold text-cyan-100">
              CA
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Cognition Assets</p>
              <p className="text-sm font-medium text-white">认知资产前台 · 合成数据演示</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/knowledge-tree"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10"
            >
              资产网络
            </Link>
            <Link
              href="/chat"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10"
            >
              聊天
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 pb-4 pt-20">
        <div className="mx-auto max-w-[1480px]">{children}</div>
      </main>
    </div>
  );
}
