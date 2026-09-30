"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { DemoScenario } from "@/lib/types";

const STORAGE_KEY = "demo-scenario";

const options: { value: DemoScenario; label: string; hint: string }[] = [
  { value: "default", label: "默认数据", hint: "标准原型" },
  { value: "empty", label: "空数据", hint: "新用户首次进入" },
  { value: "mixed", label: "混合状态", hint: "有失败任务与更多内容" }
];

export function DemoScenarioSwitcher() {
  const [scenario, setScenario] = useState<DemoScenario>("default");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as DemoScenario | null;
    if (stored && options.some((option) => option.value === stored)) {
      setScenario(stored);
    }
  }, []);

  function handleChange(next: DemoScenario) {
    setScenario(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    window.location.reload();
  }

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-100">演示场景</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">切换不同 mock 数据场景，方便产品演示。</p>
        </div>
        <Badge className="rounded-full bg-white/10 text-slate-100 hover:bg-white/10">
          prototype
        </Badge>
      </div>

      <div className="mt-4 space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleChange(option.value)}
            className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
              scenario === option.value
                ? "border-cyan-300/30 bg-cyan-300/10 text-white"
                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{option.label}</span>
              <span className="text-xs text-slate-400">{option.hint}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
