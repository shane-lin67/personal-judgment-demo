import {
  ImportJob,
  ConversationDetail,
  ConversationListItem,
  DashboardOverview,
  TagItem,
  KnowledgeCardListItem,
  KnowledgeCardPreview
} from "@/lib/types";

export const dashboardOverview: DashboardOverview = {
  conversationCount: 28,
  knowledgeCardCount: 94,
  tagCount: 32,
  lastImportLabel: "今天 09:12"
};

export const conversationList: ConversationListItem[] = [
  {
    id: "conv-001",
    title: "为个人知识库产品梳理 MVP 需求",
    summary:
      "围绕普通用户整理 ChatGPT / Gemini 聊天记录的需求进行拆解，明确首页、导入、会话详情、知识卡片和搜索能力的第一版范围。",
    sourcePlatform: "ChatGPT",
    importedAtLabel: "刚刚导入",
    sourceUpdatedAtLabel: "2026-03-15 08:45",
    messageCount: 36,
    knowledgeCardCount: 5,
    tags: ["产品设计", "MVP", "知识库"]
  },
  {
    id: "conv-002",
    title: "用 Next.js 设计聊天记录导入流程",
    summary:
      "讨论了上传、解析、分析三个阶段的任务状态设计，以及如何预留解析器和 AI 分析接口，便于后续从 mock service 平滑切换到真实后端。",
    sourcePlatform: "Gemini",
    importedAtLabel: "今天 08:30",
    sourceUpdatedAtLabel: "2026-03-14 21:18",
    messageCount: 24,
    knowledgeCardCount: 4,
    tags: ["Next.js", "导入流程", "后端接口"]
  },
  {
    id: "conv-003",
    title: "生成适合知识管理产品的信息架构",
    summary:
      "整理了侧边导航、列表页筛选、卡片式摘要展示和详情页双栏布局，强调可读性优先、轻量动画和清晰的信息层级。",
    sourcePlatform: "ChatGPT",
    importedAtLabel: "昨天",
    sourceUpdatedAtLabel: "2026-03-13 18:06",
    messageCount: 18,
    knowledgeCardCount: 3,
    tags: ["信息架构", "UI", "知识管理"]
  }
];

export const knowledgeCardPreviews: KnowledgeCardPreview[] = [
  {
    id: "card-001",
    title: "导入任务状态机设计",
    summary: "上传中、解析中、分析中、完成、失败这五类状态足以覆盖第一版导入任务链路。",
    cardTypeLabel: "流程",
    keywords: ["导入", "状态机", "任务流"]
  },
  {
    id: "card-002",
    title: "统一中间数据结构",
    summary: "先将不同平台的聊天数据统一收敛成 Conversation + Message 格式，再进入 AI 分析环节。",
    cardTypeLabel: "架构",
    keywords: ["Parser", "Conversation", "Message"]
  },
  {
    id: "card-003",
    title: "知识卡片列表筛选维度",
    summary: "第一版按类型、来源、标签筛选，已经能覆盖大部分用户回查场景。",
    cardTypeLabel: "产品",
    keywords: ["知识卡片", "筛选", "检索"]
  }
];

export const conversationDetails: ConversationDetail[] = [
  {
    ...conversationList[0],
    keyPoints: [
      "第一版只支持 ChatGPT 和 Gemini，先不做插件采集和实时抓取。",
      "产品核心价值是把原始对话转成可搜索的摘要、标签和知识卡片。",
      "开发顺序应该先保证页面和数据结构可跑，再逐步接真实导入流程。"
    ],
    actionItems: [
      "建立统一的 Conversation + Message 中间结构。",
      "先用 mock data 跑通首页、会话、详情和知识卡片页面。",
      "预留导入、解析、分析 API 路由和服务接口。"
    ],
    messages: [
      {
        id: "msg-001",
        role: "user",
        content: "我想做一个把 AI 聊天记录整理成个人知识库的 Web 产品，用户不懂编程。",
        timestampLabel: "08:10"
      },
      {
        id: "msg-002",
        role: "assistant",
        content: "可以先聚焦历史聊天导入场景，围绕会话、摘要、标签、知识卡片和搜索建立 MVP。",
        timestampLabel: "08:11"
      },
      {
        id: "msg-003",
        role: "user",
        content: "第一版只做 ChatGPT 和 Gemini，技术栈用 Next.js、TypeScript、Tailwind、Prisma。",
        timestampLabel: "08:12"
      },
      {
        id: "msg-004",
        role: "assistant",
        content: "建议先用 mock 数据把页面跑通，同时设计好后续文件解析器和 AI 分析接口的扩展点。",
        timestampLabel: "08:13"
      }
    ],
    knowledgeCards: [
      knowledgeCardPreviews[0],
      knowledgeCardPreviews[1]
    ],
    relatedConversations: [
      {
        id: "conv-002",
        title: "用 Next.js 设计聊天记录导入流程",
        summary: "上传、解析、分析三阶段任务流设计。",
        scoreLabel: "相似度 92%"
      }
    ]
  },
  {
    ...conversationList[1],
    keyPoints: [
      "导入任务流程可以先用状态机表达，不必一开始做真实队列。",
      "解析器和 AI 分析器都应该走接口抽象，方便后续替换。",
      "页面层先只读取 service 层，避免页面直接耦合数据库。"
    ],
    actionItems: [
      "新增 import service 和 parser 占位结构。",
      "预留 POST /api/import/upload、parse、analyze 路由。",
      "补充导入结果预览组件。"
    ],
    messages: [
      {
        id: "msg-101",
        role: "user",
        content: "导入流程要怎么拆，才能先跑通页面又不影响后面扩展？",
        timestampLabel: "20:55"
      },
      {
        id: "msg-102",
        role: "assistant",
        content: "先拆成 upload、parse、analyze 三段，每段都保留独立状态和可重试入口。",
        timestampLabel: "20:56"
      },
      {
        id: "msg-103",
        role: "assistant",
        content: "同时定义统一中间结构，把 ChatGPT 和 Gemini 先归一为同一种会话数据模型。",
        timestampLabel: "20:57"
      }
    ],
    knowledgeCards: [
      knowledgeCardPreviews[0],
      knowledgeCardPreviews[2]
    ],
    relatedConversations: [
      {
        id: "conv-001",
        title: "为个人知识库产品梳理 MVP 需求",
        summary: "面向普通用户的第一版范围拆解。",
        scoreLabel: "相似度 92%"
      }
    ]
  },
  {
    ...conversationList[2],
    keyPoints: [
      "知识管理产品应优先强调可读性和层级清晰。",
      "详情页适合双栏布局，左侧原始聊天，右侧结构化结果。",
      "视觉上保持简洁，不需要复杂动画。"
    ],
    actionItems: [
      "补齐会话详情页的消息气泡和摘要面板。",
      "整理知识卡片的展示字段和筛选方式。"
    ],
    messages: [
      {
        id: "msg-201",
        role: "user",
        content: "我希望这个产品看起来干净现代，不要做得太花哨。",
        timestampLabel: "17:58"
      },
      {
        id: "msg-202",
        role: "assistant",
        content: "可以采用卡片式布局、浅色背景和稳定的信息层级，减少视觉噪音。",
        timestampLabel: "17:59"
      }
    ],
    knowledgeCards: [knowledgeCardPreviews[2]],
    relatedConversations: [
      {
        id: "conv-001",
        title: "为个人知识库产品梳理 MVP 需求",
        summary: "围绕 MVP 范围和信息结构的拆解。",
        scoreLabel: "相似度 84%"
      }
    ]
  }
];

export const knowledgeCardList: KnowledgeCardListItem[] = [
  {
    id: "card-001",
    title: "导入任务状态机设计",
    summary: "上传中、解析中、分析中、完成、失败这五类状态足以覆盖第一版导入任务链路。",
    cardTypeLabel: "流程",
    keywords: ["导入", "状态机", "任务流"],
    sourcePlatform: "Gemini",
    sourceConversationId: "conv-002",
    sourceConversationTitle: "用 Next.js 设计聊天记录导入流程",
    tags: ["导入流程", "后端接口"],
    createdAtLabel: "2026-03-14"
  },
  {
    id: "card-002",
    title: "统一中间数据结构",
    summary: "先将不同平台的聊天数据统一收敛成 Conversation + Message 格式，再进入 AI 分析环节。",
    cardTypeLabel: "架构",
    keywords: ["Parser", "Conversation", "Message"],
    sourcePlatform: "ChatGPT",
    sourceConversationId: "conv-001",
    sourceConversationTitle: "为个人知识库产品梳理 MVP 需求",
    tags: ["MVP", "知识库"],
    createdAtLabel: "2026-03-15"
  },
  {
    id: "card-003",
    title: "知识卡片列表筛选维度",
    summary: "第一版按类型、来源、标签筛选，已经能覆盖大部分用户回查场景。",
    cardTypeLabel: "产品",
    keywords: ["知识卡片", "筛选", "检索"],
    sourcePlatform: "ChatGPT",
    sourceConversationId: "conv-003",
    sourceConversationTitle: "生成适合知识管理产品的信息架构",
    tags: ["产品设计", "UI"],
    createdAtLabel: "2026-03-13"
  }
];

export const mockImportJobs: ImportJob[] = [
  {
    id: "job-001",
    sourcePlatform: "ChatGPT",
    sourceFileName: "chatgpt-export-2026-03-15.zip",
    fileType: "zip",
    status: "COMPLETED",
    statusLabel: "完成",
    detectedConversationCount: 12,
    detectedMessageCount: 486,
    createdAtLabel: "2026-03-15 09:10",
    finishedAtLabel: "2026-03-15 09:12"
  },
  {
    id: "job-002",
    sourcePlatform: "Gemini",
    sourceFileName: "gemini-history.json",
    fileType: "json",
    status: "PARSING",
    statusLabel: "解析中",
    detectedConversationCount: 5,
    detectedMessageCount: 102,
    createdAtLabel: "2026-03-15 08:58"
  }
];

export const tagList: TagItem[] = [
  { id: "tag-001", name: "产品设计", conversationCount: 8 },
  { id: "tag-002", name: "MVP", conversationCount: 5 },
  { id: "tag-003", name: "知识库", conversationCount: 11 },
  { id: "tag-004", name: "导入流程", conversationCount: 4 },
  { id: "tag-005", name: "后端接口", conversationCount: 3 },
  { id: "tag-006", name: "UI", conversationCount: 6 }
];
