export type SourcePlatform = "ChatGPT" | "Gemini";
export type ImportJobStatus = "UPLOADING" | "PARSING" | "ANALYZING" | "COMPLETED" | "FAILED";
export type DemoScenario = "default" | "empty" | "mixed";

export type ConversationListItem = {
  id: string;
  title: string;
  summary: string;
  sourcePlatform: SourcePlatform;
  importedAtLabel: string;
  sourceUpdatedAtLabel: string;
  messageCount: number;
  knowledgeCardCount: number;
  tags: string[];
};

export type KnowledgeCardPreview = {
  id: string;
  title: string;
  summary: string;
  cardTypeLabel: string;
  keywords: string[];
};

export type DashboardOverview = {
  conversationCount: number;
  knowledgeCardCount: number;
  tagCount: number;
  lastImportLabel: string;
};

export type ImportJob = {
  id: string;
  sourcePlatform: SourcePlatform;
  sourceFileName: string;
  fileType: string;
  status: ImportJobStatus;
  statusLabel: string;
  detectedConversationCount: number;
  detectedMessageCount: number;
  errorMessage?: string;
  createdAtLabel: string;
  finishedAtLabel?: string;
};

export type ConversationMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestampLabel: string;
};

export type RelatedConversationPreview = {
  id: string;
  title: string;
  summary: string;
  scoreLabel: string;
};

export type ConversationDetail = ConversationListItem & {
  keyPoints: string[];
  actionItems: string[];
  messages: ConversationMessage[];
  knowledgeCards: KnowledgeCardPreview[];
  relatedConversations: RelatedConversationPreview[];
};

export type KnowledgeCardListItem = KnowledgeCardPreview & {
  sourcePlatform: SourcePlatform;
  sourceConversationId: string;
  sourceConversationTitle: string;
  tags: string[];
  createdAtLabel: string;
};

export type TagItem = {
  id: string;
  name: string;
  conversationCount: number;
};

export type ParsedMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  sourceTimestamp?: string;
};

export type ParsedConversation = {
  sourceConversationId: string;
  title: string;
  sourcePlatform: SourcePlatform;
  sourceCreatedAt?: string;
  sourceUpdatedAt?: string;
  messages: ParsedMessage[];
};

export type ParseImportResult = {
  platform: SourcePlatform;
  conversations: ParsedConversation[];
  detectedConversationCount: number;
  detectedMessageCount: number;
};

export type AnalysisResult = {
  conversationId: string;
  summary: string;
  tags: string[];
  knowledgeCardIds: string[];
};

export type MockScenarioData = {
  overview: DashboardOverview;
  conversations: ConversationListItem[];
  conversationDetails: ConversationDetail[];
  knowledgeCardPreviews: KnowledgeCardPreview[];
  knowledgeCards: KnowledgeCardListItem[];
  importJobs: ImportJob[];
  tags: TagItem[];
};
