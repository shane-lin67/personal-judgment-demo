import {
  conversationDetails,
  conversationList,
  dashboardOverview,
  knowledgeCardList,
  knowledgeCardPreviews,
  mockImportJobs,
  tagList
} from "@/lib/mock-data";
import { DemoScenario, MockScenarioData } from "@/lib/types";

const emptyScenario: MockScenarioData = {
  overview: {
    conversationCount: 0,
    knowledgeCardCount: 0,
    tagCount: 0,
    lastImportLabel: "暂无导入"
  },
  conversations: [],
  conversationDetails: [],
  knowledgeCardPreviews: [],
  knowledgeCards: [],
  importJobs: [],
  tags: []
};

const mixedScenario: MockScenarioData = {
  overview: {
    conversationCount: 43,
    knowledgeCardCount: 126,
    tagCount: 41,
    lastImportLabel: "今天 10:28"
  },
  conversations: [
    {
      id: "conv-004",
      title: "把导入失败任务设计成用户能理解的反馈",
      summary:
        "讨论了失败任务的错误提示层级、可重试路径和失败后仍然保留部分识别结果的展示方式。",
      sourcePlatform: "Gemini",
      importedAtLabel: "今天 10:22",
      sourceUpdatedAtLabel: "2026-03-15 10:19",
      messageCount: 16,
      knowledgeCardCount: 2,
      tags: ["失败处理", "导入流程", "用户体验"]
    },
    ...conversationList
  ],
  conversationDetails: [
    {
      id: "conv-004",
      title: "把导入失败任务设计成用户能理解的反馈",
      summary:
        "讨论了失败任务的错误提示层级、可重试路径和失败后仍然保留部分识别结果的展示方式。",
      sourcePlatform: "Gemini",
      importedAtLabel: "今天 10:22",
      sourceUpdatedAtLabel: "2026-03-15 10:19",
      messageCount: 16,
      knowledgeCardCount: 2,
      tags: ["失败处理", "导入流程", "用户体验"],
      keyPoints: [
        "失败提示应告诉用户哪一步失败了，而不是只显示“失败”。",
        "用户需要看到是否已经识别出部分会话，以便判断是否重试。",
        "失败任务页最好保留再次上传或重新分析的快捷入口。"
      ],
      actionItems: [
        "导入页增加失败态说明卡片。",
        "保留最近一次失败任务的文件名和来源平台。",
        "为失败任务设计重试按钮占位。"
      ],
      messages: [
        {
          id: "msg-301",
          role: "user",
          content: "如果用户导入失败，我们怎么让他知道问题出在哪？",
          timestampLabel: "10:12"
        },
        {
          id: "msg-302",
          role: "assistant",
          content: "至少要告诉他是上传失败、解析失败还是分析失败，并给出下一步建议。",
          timestampLabel: "10:13"
        }
      ],
      knowledgeCards: [
        {
          id: "card-004",
          title: "失败提示分层设计",
          summary: "导入失败时要把失败阶段、原因和建议动作拆开显示。",
          cardTypeLabel: "流程",
          keywords: ["失败处理", "导入流程", "可恢复性"]
        },
        {
          id: "card-005",
          title: "失败后保留部分结果",
          summary: "如果解析出了部分会话，应该允许用户先预览而不是全部丢弃。",
          cardTypeLabel: "产品",
          keywords: ["失败处理", "预览", "用户体验"]
        }
      ],
      relatedConversations: [
        {
          id: "conv-002",
          title: "用 Next.js 设计聊天记录导入流程",
          summary: "上传、解析、分析三阶段任务流设计。",
          scoreLabel: "相似度 89%"
        }
      ]
    },
    ...conversationDetails
  ],
  knowledgeCardPreviews: [
    {
      id: "card-004",
      title: "失败提示分层设计",
      summary: "导入失败时要把失败阶段、原因和建议动作拆开显示。",
      cardTypeLabel: "流程",
      keywords: ["失败处理", "导入流程", "可恢复性"]
    },
    ...knowledgeCardPreviews
  ],
  knowledgeCards: [
    {
      id: "card-004",
      title: "失败提示分层设计",
      summary: "导入失败时要把失败阶段、原因和建议动作拆开显示。",
      cardTypeLabel: "流程",
      keywords: ["失败处理", "导入流程", "可恢复性"],
      sourcePlatform: "Gemini",
      sourceConversationId: "conv-004",
      sourceConversationTitle: "把导入失败任务设计成用户能理解的反馈",
      tags: ["失败处理", "用户体验"],
      createdAtLabel: "2026-03-15"
    },
    ...knowledgeCardList
  ],
  importJobs: [
    {
      id: "job-003",
      sourcePlatform: "Gemini",
      sourceFileName: "gemini-broken-export.json",
      fileType: "json",
      status: "FAILED",
      statusLabel: "失败",
      detectedConversationCount: 1,
      detectedMessageCount: 14,
      errorMessage: "解析阶段检测到文件结构不完整",
      createdAtLabel: "2026-03-15 10:20"
    },
    {
      id: "job-004",
      sourcePlatform: "ChatGPT",
      sourceFileName: "chatgpt-export-batch-2.zip",
      fileType: "zip",
      status: "ANALYZING",
      statusLabel: "分析中",
      detectedConversationCount: 18,
      detectedMessageCount: 612,
      createdAtLabel: "2026-03-15 10:28"
    },
    ...mockImportJobs
  ],
  tags: [
    { id: "tag-010", name: "失败处理", conversationCount: 2 },
    { id: "tag-011", name: "用户体验", conversationCount: 4 },
    ...tagList
  ]
};

const defaultScenario: MockScenarioData = {
  overview: dashboardOverview,
  conversations: conversationList,
  conversationDetails,
  knowledgeCardPreviews,
  knowledgeCards: knowledgeCardList,
  importJobs: mockImportJobs,
  tags: tagList
};

const scenarios: Record<DemoScenario, MockScenarioData> = {
  default: defaultScenario,
  empty: emptyScenario,
  mixed: mixedScenario
};

export function getScenarioData(scenario: DemoScenario = "default") {
  return scenarios[scenario] ?? defaultScenario;
}
