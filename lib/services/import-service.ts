import { getScenarioData } from "@/lib/mock-scenarios";
import { AnalysisResult, DemoScenario, ImportJob, ParseImportResult, ParsedConversation, SourcePlatform } from "@/lib/types";
import { isMockDataSource } from "@/lib/services/repository";
import { getImportJobByIdFromDb, getImportJobsFromDb } from "@/lib/services/prisma-service";

function buildMockParsedConversation(sourcePlatform: SourcePlatform): ParsedConversation {
  return {
    sourceConversationId: `${sourcePlatform.toLowerCase()}-conversation-001`,
    title: sourcePlatform === "ChatGPT" ? "ChatGPT 导出的产品需求讨论" : "Gemini 导出的导入流程讨论",
    sourcePlatform,
    sourceCreatedAt: "2026-03-15T08:10:00.000Z",
    sourceUpdatedAt: "2026-03-15T08:13:00.000Z",
    messages: [
      {
        role: "user",
        content: "我希望把历史 AI 聊天整理成个人知识库。",
        sourceTimestamp: "2026-03-15T08:10:00.000Z"
      },
      {
        role: "assistant",
        content: "可以先从聊天导入、摘要、标签和知识卡片这几部分开始。",
        sourceTimestamp: "2026-03-15T08:11:00.000Z"
      }
    ]
  };
}

export async function getImportJobs(scenario: DemoScenario = "default"): Promise<ImportJob[]> {
  if (isMockDataSource()) {
    return getScenarioData(scenario).importJobs;
  }

  return getImportJobsFromDb();
}

export async function getImportJobById(id: string, scenario: DemoScenario = "default"): Promise<ImportJob | null> {
  if (isMockDataSource()) {
    return getScenarioData(scenario).importJobs.find((job) => job.id === id) ?? null;
  }

  return getImportJobByIdFromDb(id);
}

export function createMockUploadJob(input: {
  sourcePlatform: SourcePlatform;
  sourceFileName: string;
  fileType?: string;
}): ImportJob {
  return {
    id: `job-${Date.now()}`,
    sourcePlatform: input.sourcePlatform,
    sourceFileName: input.sourceFileName,
    fileType: input.fileType ?? "json",
    status: "UPLOADING",
    statusLabel: "上传中",
    detectedConversationCount: 0,
    detectedMessageCount: 0,
    createdAtLabel: "刚刚"
  };
}

export function parseImportSource(input: {
  sourcePlatform: SourcePlatform;
  sourceFileName?: string;
  rawText?: string;
}): ParseImportResult {
  const conversation = buildMockParsedConversation(input.sourcePlatform);

  return {
    platform: input.sourcePlatform,
    conversations: [conversation],
    detectedConversationCount: 1,
    detectedMessageCount: conversation.messages.length
  };
}

export function analyzeParsedConversations(input: {
  conversationId?: string;
  parsedConversations?: ParsedConversation[];
}): AnalysisResult[] {
  const targetIds =
    input.parsedConversations?.map((conversation) => conversation.sourceConversationId) ??
    (input.conversationId ? [input.conversationId] : []);

  return targetIds.map((conversationId, index) => ({
    conversationId,
    summary: `这是第 ${index + 1} 个会话的 mock 分析摘要，用于占位 AI 分析结果。`,
    tags: ["知识库", "摘要", "占位分析"],
    knowledgeCardIds: [`mock-card-${index + 1}`]
  }));
}
