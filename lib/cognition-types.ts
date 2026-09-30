export type KnowledgeNodeType = "问题" | "母题" | "原则" | "方法" | "案例" | "来源";
export type KnowledgeSourceLayer = "现代聊天" | "个人经验" | "古籍原则" | "经典母题" | "历史案例";
export type FutureExpansionType = "古籍原则卡" | "经典母题卡" | "历史案例卡" | "古今映射";

export type KnowledgeNodeTreeItem = {
  id: string;
  name: string;
  type: KnowledgeNodeType;
  summary: string;
  sourceLayer?: KnowledgeSourceLayer;
  futureHooks?: FutureExpansionType[];
  children?: KnowledgeNodeTreeItem[];
};

export type RelatedNode = {
  id: string;
  name: string;
  type: KnowledgeNodeType;
  relation: string;
};

export type EvidenceItem = {
  id: string;
  title: string;
  excerpt: string;
  sourceType: "聊天片段" | "经验记录" | "案例记录";
};

export type NodeChatSnippet = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestampLabel: string;
};

export type KnowledgeNodeDetail = {
  id: string;
  name: string;
  type: KnowledgeNodeType;
  description: string;
  importance: "高" | "中" | "低";
  sourceLayer: KnowledgeSourceLayer;
  structuralRole: string;
  futureHooks: FutureExpansionType[];
  classicalAnchor?: string;
  historicalMirror?: string;
  modernMapping?: string;
  relatedNodes: RelatedNode[];
  evidence: EvidenceItem[];
  chatSnippets: NodeChatSnippet[];
};

export type SuggestedNode = {
  id: string;
  name: string;
  type: KnowledgeNodeType;
  reason: string;
};

export type DemoChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type AssetGraphNode = {
  id: string;
  name: string;
  summary: string;
  detailId?: string;
  color: string;
  glowColor: string;
  tags: string[];
  x: number;
  y: number;
  size: "sm" | "md" | "lg";
};

export type AssetGraphLink = {
  from: string;
  to: string;
};

export type AssetAutoArchive = {
  assets: string[];
  themes: string[];
  newInsight: string | null;
};

export type CognitionHomePayload = {
  nodeCount: number;
  typeCounts: Record<KnowledgeNodeType, number>;
  featuredNodes: KnowledgeNodeDetail[];
  graphNodes: AssetGraphNode[];
  graphLinks: AssetGraphLink[];
  searchHints: string[];
  quickPrompt: string;
  latestArchive: AssetAutoArchive;
  futureDirections: {
    title: FutureExpansionType;
    description: string;
  }[];
};
