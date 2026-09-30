"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { FileUp, LoaderCircle, Sparkles, Upload } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorPanel } from "@/components/shared/error-panel";
import { LoadingPanel } from "@/components/shared/loading-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchJson } from "@/lib/api-client";
import { AnalysisResult, ImportJob, ParseImportResult, SourcePlatform } from "@/lib/types";
import { cn } from "@/lib/utils";

type ImportMode = "ChatGPT" | "Gemini" | "Text";
type FlowStatus = "idle" | "uploading" | "parsing" | "analyzing" | "completed" | "failed";

const modeOptions: { value: ImportMode; label: string; description: string }[] = [
  { value: "ChatGPT", label: "ChatGPT", description: "上传 ChatGPT conversations.json 或粘贴 JSON 内容" },
  { value: "Gemini", label: "Gemini", description: "上传 Gemini 导出文件" },
  { value: "Text", label: "粘贴文本", description: "直接粘贴聊天内容" }
];

const statusMeta: Record<FlowStatus, { label: string; tone: "secondary" | "outline" | "destructive" }> = {
  idle: { label: "等待导入", tone: "outline" },
  uploading: { label: "上传中", tone: "outline" },
  parsing: { label: "解析中", tone: "outline" },
  analyzing: { label: "分析中", tone: "outline" },
  completed: { label: "完成", tone: "secondary" },
  failed: { label: "失败", tone: "destructive" }
};

function getPlatformForMode(mode: ImportMode): SourcePlatform {
  return mode === "Gemini" ? "Gemini" : "ChatGPT";
}

function formatParsedTimestamp(timestamp?: string) {
  if (!timestamp) {
    return "未知时间";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString().slice(0, 16).replace("T", " ");
}

export default function ImportPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [mode, setMode] = useState<ImportMode>("ChatGPT");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [status, setStatus] = useState<FlowStatus>("idle");
  const [actionError, setActionError] = useState<string | null>(null);
  const [createdJob, setCreatedJob] = useState<ImportJob | null>(null);
  const [parseResult, setParseResult] = useState<ParseImportResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchJson<ImportJob[]>("/api/import/jobs")
      .then((result) => {
        if (!cancelled) {
          setJobs(result);
          setLoadingJobs(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setJobsError(err.message);
          setLoadingJobs(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function resetFlowState() {
    setActionError(null);
    setCreatedJob(null);
    setParseResult(null);
    setAnalysisResult(null);
    setStatus("idle");
  }

  function handleModeChange(nextMode: ImportMode) {
    setMode(nextMode);
    setSelectedFile(null);
    setPastedText("");
    resetFlowState();
  }

  function handleFileSelection(file: File | null) {
    setSelectedFile(file);
    setActionError(null);
    setCreatedJob(null);
    setParseResult(null);
    setAnalysisResult(null);
    setStatus("idle");
  }

  function onFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleFileSelection(event.target.files?.[0] ?? null);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0] ?? null;
    handleFileSelection(file);
  }

  async function handleImport() {
    const sourcePlatform = getPlatformForMode(mode);
    const sourceFileName = selectedFile?.name ?? (mode === "Text" ? "pasted-chat.txt" : `${sourcePlatform.toLowerCase()}-import.txt`);
    const content = mode === "Text" ? pastedText : selectedFile ? await selectedFile.text() : undefined;

    if (mode === "Text" && !pastedText.trim()) {
      setActionError("请先粘贴聊天内容。");
      setStatus("failed");
      return;
    }

    if (mode !== "Text" && !selectedFile) {
      setActionError("请先选择一个导入文件。");
      setStatus("failed");
      return;
    }

    try {
      setActionError(null);
      setAnalysisResult(null);
      setParseResult(null);

      setStatus("uploading");
      const uploadJob = await fetchJson<ImportJob>("/api/import/upload", {
        method: "POST",
        body: JSON.stringify({
          sourcePlatform,
          sourceFileName,
          fileType: selectedFile?.type || sourceFileName.split(".").pop() || "txt"
        })
      });
      setCreatedJob(uploadJob);

      setStatus("parsing");
      const parsed = await fetchJson<ParseImportResult>("/api/import/parse", {
        method: "POST",
        body: JSON.stringify({
          sourcePlatform,
          sourceFileName,
          content
        })
      });
      setParseResult(parsed);

      setStatus("analyzing");
      const analyzed = await fetchJson<AnalysisResult[]>("/api/import/analyze", {
        method: "POST",
        body: JSON.stringify({
          conversations: parsed.conversations
        })
      });
      setAnalysisResult(analyzed);
      setStatus("completed");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "导入失败，请稍后重试。");
      setStatus("failed");
    }
  }

  const currentStatus = statusMeta[status];
  const stepStatus = [
    { key: "uploading", label: "上传" },
    { key: "parsing", label: "解析" },
    { key: "analyzing", label: "分析" },
    { key: "completed", label: "完成" }
  ] as const;

  function isStepActive(step: (typeof stepStatus)[number]["key"]) {
    const order: FlowStatus[] = ["idle", "uploading", "parsing", "analyzing", "completed", "failed"];
    if (status === "failed") {
      return order.indexOf(step) <= order.indexOf("analyzing");
    }
    return order.indexOf(step) <= order.indexOf(status);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-sm backdrop-blur">
        <div className="max-w-3xl space-y-3">
          <h1 className="font-serif text-4xl font-semibold text-slate-900">导入</h1>
          <p className="text-base leading-7 text-slate-600">
            这一版先把导入流程的页面交互和接口链路跑通。真实文件解析逻辑后续再逐步替换。
          </p>
          <Badge variant="outline" className="w-fit">
            当前页面通过 upload / parse / analyze 接口驱动
          </Badge>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[1.75rem] border-white/70 bg-white/85 shadow-sm">
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {modeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleModeChange(option.value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition",
                    mode === option.value
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div>
              <CardTitle>导入入口</CardTitle>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {modeOptions.find((option) => option.value === mode)?.description}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {mode === "Text" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">粘贴聊天内容</label>
                <textarea
                  value={pastedText}
                  onChange={(event) => setPastedText(event.target.value)}
                  placeholder="把聊天内容粘贴到这里，后续会按统一结构进行解析。"
                  className="min-h-48 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-slate-400"
                />
                <p className="text-xs text-slate-500">粘贴文本模式当前默认按 ChatGPT 占位解析流程处理。</p>
              </div>
            ) : (
              <div
                onDragEnter={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                }}
                onDrop={onDrop}
                className={cn(
                  "rounded-[1.5rem] border-2 border-dashed p-8 text-center transition",
                  dragActive ? "border-slate-900 bg-slate-100" : "border-slate-200 bg-slate-50/80"
                )}
              >
                <div className="mx-auto flex max-w-md flex-col items-center gap-3">
                  <div className="rounded-full bg-white p-3 shadow-sm">
                    <Upload className="h-5 w-5 text-slate-700" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900">拖拽文件到这里，或点击选择文件</p>
                    <p className="text-sm text-slate-500">
                      {mode === "ChatGPT"
                        ? "当前优先支持 ChatGPT 的 conversations.json 结构。"
                        : "当前是占位导入流程，文件内容会进入 mock 解析链路。"}
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={onFileInputChange}
                    className="hidden"
                    accept=".json,.txt"
                  />
                  <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                    <FileUp className="h-4 w-4" />
                    选择文件
                  </Button>
                  {selectedFile ? (
                    <div className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
                      已选择：{selectedFile.name}
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {mode === "ChatGPT" ? (
              <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm leading-6 text-cyan-900">
                当前最小真实解析先支持 ChatGPT 的 `conversations.json`。整个导出 zip 包解压与自动识别，我下一步再接。
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                {status === "uploading" || status === "parsing" || status === "analyzing" ? (
                  <LoaderCircle className="h-4 w-4 animate-spin text-slate-600" />
                ) : (
                  <Sparkles className="h-4 w-4 text-slate-600" />
                )}
                <span className="text-sm text-slate-600">当前状态</span>
              </div>
              <Badge variant={currentStatus.tone}>{currentStatus.label}</Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              {stepStatus.map((step) => (
                <div
                  key={step.key}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-sm transition",
                    isStepActive(step.key)
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-500"
                  )}
                >
                  {step.label}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleImport} disabled={status === "uploading" || status === "parsing" || status === "analyzing"}>
                开始导入
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
                  setPastedText("");
                  resetFlowState();
                }}
              >
                清空
              </Button>
            </div>

            {actionError ? <ErrorPanel message={actionError} /> : null}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[1.75rem] border-white/70 bg-white/85 shadow-sm">
            <CardHeader>
              <CardTitle>解析结果预览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!parseResult ? (
                <p className="text-sm text-slate-500">导入完成后，这里会显示平台识别结果、会话数和消息数预览。</p>
              ) : (
                <>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">识别平台</p>
                      <p className="mt-2 font-medium text-slate-900">{parseResult.platform}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">会话数</p>
                      <p className="mt-2 font-medium text-slate-900">{parseResult.detectedConversationCount}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">消息数</p>
                      <p className="mt-2 font-medium text-slate-900">{parseResult.detectedMessageCount}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {parseResult.conversations.map((conversation) => (
                      <div
                        key={conversation.sourceConversationId}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-2">
                            <h3 className="font-medium text-slate-900">{conversation.title}</h3>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">{conversation.messages.length} 条消息</Badge>
                              <Badge variant="secondary">{conversation.sourcePlatform}</Badge>
                              {conversation.sourceUpdatedAt ? (
                                <Badge variant="outline">{formatParsedTimestamp(conversation.sourceUpdatedAt)}</Badge>
                              ) : null}
                            </div>
                          </div>
                          <p className="text-xs text-slate-400">ID: {conversation.sourceConversationId}</p>
                        </div>

                        <div className="mt-4 grid gap-3">
                          {conversation.messages.slice(0, 3).map((message, index) => (
                            <div
                              key={`${conversation.sourceConversationId}-${index}`}
                              className={cn(
                                "rounded-xl px-3 py-3 text-sm leading-6",
                                message.role === "user"
                                  ? "bg-slate-900 text-slate-50"
                                  : message.role === "assistant"
                                    ? "bg-white text-slate-700"
                                    : "bg-amber-50 text-amber-900"
                              )}
                            >
                              <div className="mb-2 flex items-center justify-between gap-3 text-xs opacity-70">
                                <span className="uppercase tracking-wide">{message.role}</span>
                                <span>{formatParsedTimestamp(message.sourceTimestamp)}</span>
                              </div>
                              <p className="line-clamp-3 whitespace-pre-wrap">{message.content}</p>
                            </div>
                          ))}
                        </div>

                        {conversation.messages.length > 3 ? (
                          <p className="mt-3 text-xs text-slate-500">
                            还有 {conversation.messages.length - 3} 条消息未展开显示。
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border-white/70 bg-white/85 shadow-sm">
            <CardHeader>
              <CardTitle>导入任务与分析结果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">当前来源</p>
                  <p className="mt-2 font-medium text-slate-900">{mode === "Text" ? "粘贴文本" : mode}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">输入状态</p>
                  <p className="mt-2 font-medium text-slate-900">
                    {mode === "Text"
                      ? `${pastedText.trim().length} 字符`
                      : selectedFile
                        ? selectedFile.name
                        : "未选择文件"}
                  </p>
                </div>
              </div>
              {createdJob ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{createdJob.sourceFileName}</p>
                    <Badge variant="outline">{createdJob.statusLabel}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">任务 ID：{createdJob.id}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-500">导入成功后，这里会显示任务创建结果。</p>
              )}

              {analysisResult?.length ? (
                <div className="space-y-3">
                  {analysisResult.map((item) => (
                    <div key={item.conversationId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-slate-900">{item.summary}</p>
                        <Badge variant="outline">{item.conversationId}</Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-slate-500">
                        预计将生成 {item.knowledgeCardIds.length} 张知识卡片。
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      {loadingJobs ? <LoadingPanel message="正在加载导入任务..." /> : null}
      {jobsError ? <ErrorPanel message={jobsError} /> : null}

      {!loadingJobs && !jobsError && jobs.length === 0 ? (
        <EmptyState
          title="这里会显示你的导入历史"
          description="当你第一次开始使用时，这里还是空的。你可以直接上传 ChatGPT 或 Gemini 导出文件，或者先粘贴一段聊天内容体验流程。"
          icon="import"
        />
      ) : null}

      <Card className="rounded-[1.75rem] border-white/70 bg-white/85 shadow-sm">
        <CardHeader>
          <CardTitle>最近导入任务</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {jobs.length ? (
            jobs.map((job) => (
              <div key={job.id} className="rounded-2xl border border-slate-200/70 bg-slate-50/90 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{job.sourceFileName}</p>
                    <p className="mt-1 text-sm text-slate-500">{job.sourcePlatform}</p>
                  </div>
                  <Badge variant={job.status === "COMPLETED" ? "secondary" : "outline"}>
                    {job.statusLabel}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  识别到 {job.detectedConversationCount} 个会话，{job.detectedMessageCount} 条消息
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-sm leading-7 text-slate-500">
              还没有导入任务。你可以先从上面的入口上传一个文件，或者粘贴一段聊天内容快速体验。
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
