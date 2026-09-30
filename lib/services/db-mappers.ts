import {
  Conversation,
  ImportJobStatus as PrismaImportJobStatus,
  KnowledgeCard,
  KnowledgeCardType,
  Message,
  MessageRole,
  SourcePlatform as PrismaSourcePlatform,
  Tag
} from "@prisma/client";

import {
  ConversationDetail,
  ConversationListItem,
  ConversationMessage,
  ImportJob,
  KnowledgeCardListItem,
  KnowledgeCardPreview,
  SourcePlatform,
  TagItem
} from "@/lib/types";

function formatDateLabel(input?: Date | null) {
  if (!input) {
    return "未知时间";
  }

  return input.toISOString().slice(0, 16).replace("T", " ");
}

function mapSourcePlatform(platform: PrismaSourcePlatform): SourcePlatform {
  return platform === "CHATGPT" ? "ChatGPT" : "Gemini";
}

function mapImportJobStatus(status: PrismaImportJobStatus) {
  const labels: Record<PrismaImportJobStatus, string> = {
    UPLOADING: "上传中",
    PARSING: "解析中",
    ANALYZING: "分析中",
    COMPLETED: "完成",
    FAILED: "失败"
  };

  return labels[status];
}

function mapMessageRole(role: MessageRole): ConversationMessage["role"] {
  if (role === "USER") {
    return "user";
  }

  if (role === "ASSISTANT") {
    return "assistant";
  }

  return "system";
}

function mapKnowledgeCardType(type: KnowledgeCardType) {
  const labels: Record<KnowledgeCardType, string> = {
    SUMMARY: "摘要",
    INSIGHT: "洞察",
    ACTION_ITEM: "行动项",
    DECISION: "决策",
    REFERENCE: "参考"
  };

  return labels[type];
}

export function mapConversationListItemFromDb(
  conversation: Conversation & {
    messages?: Message[];
    conversationTags?: { tag: Tag }[];
    knowledgeCards?: KnowledgeCard[];
  }
): ConversationListItem {
  return {
    id: conversation.id,
    title: conversation.title,
    summary: conversation.summary ?? "暂无摘要",
    sourcePlatform: mapSourcePlatform(conversation.sourcePlatform),
    importedAtLabel: formatDateLabel(conversation.createdAt),
    sourceUpdatedAtLabel: formatDateLabel(conversation.sourceUpdatedAt ?? conversation.updatedAt),
    messageCount: conversation.messages?.length ?? 0,
    knowledgeCardCount: conversation.knowledgeCards?.length ?? 0,
    tags: conversation.conversationTags?.map((item) => item.tag.name) ?? []
  };
}

export function mapKnowledgeCardPreviewFromDb(card: KnowledgeCard): KnowledgeCardPreview {
  return {
    id: card.id,
    title: card.title,
    summary: card.summary ?? card.content.slice(0, 120),
    cardTypeLabel: mapKnowledgeCardType(card.cardType),
    keywords: []
  };
}

export function mapKnowledgeCardListItemFromDb(
  card: KnowledgeCard & {
    conversation: Conversation & {
      conversationTags?: { tag: Tag }[];
    };
  }
): KnowledgeCardListItem {
  return {
    id: card.id,
    title: card.title,
    summary: card.summary ?? card.content.slice(0, 120),
    cardTypeLabel: mapKnowledgeCardType(card.cardType),
    keywords: [],
    sourcePlatform: mapSourcePlatform(card.conversation.sourcePlatform),
    sourceConversationId: card.conversation.id,
    sourceConversationTitle: card.conversation.title,
    tags: card.conversation.conversationTags?.map((item) => item.tag.name) ?? [],
    createdAtLabel: formatDateLabel(card.createdAt).slice(0, 10)
  };
}

export function mapImportJobFromDb(job: {
  id: string;
  sourcePlatform: PrismaSourcePlatform;
  sourceFileName: string;
  fileType: string;
  status: PrismaImportJobStatus;
  detectedConversationCount: number | null;
  detectedMessageCount: number | null;
  errorMessage: string | null;
  createdAt: Date;
  finishedAt: Date | null;
}): ImportJob {
  return {
    id: job.id,
    sourcePlatform: mapSourcePlatform(job.sourcePlatform),
    sourceFileName: job.sourceFileName,
    fileType: job.fileType,
    status: job.status,
    statusLabel: mapImportJobStatus(job.status),
    detectedConversationCount: job.detectedConversationCount ?? 0,
    detectedMessageCount: job.detectedMessageCount ?? 0,
    errorMessage: job.errorMessage ?? undefined,
    createdAtLabel: formatDateLabel(job.createdAt),
    finishedAtLabel: job.finishedAt ? formatDateLabel(job.finishedAt) : undefined
  };
}

export function mapTagItemFromDb(tag: Tag & { _count: { conversationTags: number } }): TagItem {
  return {
    id: tag.id,
    name: tag.name,
    conversationCount: tag._count.conversationTags
  };
}

export function mapConversationDetailFromDb(
  conversation: Conversation & {
    messages: Message[];
    conversationTags: { tag: Tag }[];
    knowledgeCards: KnowledgeCard[];
    relatedConversations: {
      score: number;
      relatedConversation: Conversation;
    }[];
  }
): ConversationDetail {
  const base = mapConversationListItemFromDb(conversation);

  return {
    ...base,
    keyPoints: conversation.knowledgeCards
      .filter((card) => card.cardType === "INSIGHT" || card.cardType === "DECISION")
      .map((card) => card.title)
      .slice(0, 3),
    actionItems: conversation.knowledgeCards
      .filter((card) => card.cardType === "ACTION_ITEM")
      .map((card) => card.title)
      .slice(0, 3),
    messages: conversation.messages.map((message) => ({
      id: message.id,
      role: mapMessageRole(message.role),
      content: message.content,
      timestampLabel: formatDateLabel(message.sourceTimestamp ?? message.createdAt)
    })),
    knowledgeCards: conversation.knowledgeCards.map(mapKnowledgeCardPreviewFromDb),
    relatedConversations: conversation.relatedConversations.map((item) => ({
      id: item.relatedConversation.id,
      title: item.relatedConversation.title,
      summary: item.relatedConversation.summary ?? "暂无摘要",
      scoreLabel: `相似度 ${Math.round(item.score * 100)}%`
    }))
  };
}
