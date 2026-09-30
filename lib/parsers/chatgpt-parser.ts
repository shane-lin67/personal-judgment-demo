import { ConversationParser } from "@/lib/parsers/types";
import { parseImportSource } from "@/lib/services/import-service";
import { ParseImportResult, ParsedConversation, ParsedMessage } from "@/lib/types";

type ChatGPTMappingNode = {
  id?: string;
  parent?: string | null;
  message?: {
    id?: string;
    author?: {
      role?: string;
    };
    create_time?: number | null;
    content?:
      | string
      | {
          parts?: unknown[];
          text?: string;
        }
      | null;
  } | null;
};

function normalizeTimestamp(input?: number | string | null) {
  if (typeof input === "number" && Number.isFinite(input)) {
    return new Date(input * 1000).toISOString();
  }

  if (typeof input === "string" && input.trim()) {
    const parsed = new Date(input);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return undefined;
}

function getTextContent(content: unknown): string {
  if (!content) {
    return "";
  }

  if (typeof content === "string") {
    return content.trim();
  }

  if (typeof content === "object") {
    const record = content as { parts?: unknown[]; text?: string };

    if (typeof record.text === "string") {
      return record.text.trim();
    }

    if (Array.isArray(record.parts)) {
      return record.parts
        .map((part) => (typeof part === "string" ? part.trim() : ""))
        .filter(Boolean)
        .join("\n\n");
    }
  }

  return "";
}

function mapRole(role?: string): ParsedMessage["role"] | null {
  if (role === "user") {
    return "user";
  }

  if (role === "assistant") {
    return "assistant";
  }

  if (role === "system" || role === "tool") {
    return "system";
  }

  return null;
}

function parseMessageNode(node: ChatGPTMappingNode): ParsedMessage | null {
  const message = node.message;
  const role = mapRole(message?.author?.role);
  const content = getTextContent(message?.content);

  if (!role || !content) {
    return null;
  }

  return {
    role,
    content,
    sourceTimestamp: normalizeTimestamp(message?.create_time)
  };
}

function isParsedMessage(message: ParsedMessage | null): message is ParsedMessage {
  return message !== null;
}

function parseMappingConversation(rawConversation: Record<string, unknown>): ParsedConversation | null {
  const mapping = rawConversation.mapping as Record<string, ChatGPTMappingNode> | undefined;
  const currentNode = rawConversation.current_node as string | undefined;

  if (!mapping || !currentNode) {
    return null;
  }

  const chain: ChatGPTMappingNode[] = [];
  const visited = new Set<string>();
  let cursor: string | null | undefined = currentNode;

  while (cursor && mapping[cursor] && !visited.has(cursor)) {
    visited.add(cursor);
    const currentNodeData: ChatGPTMappingNode = mapping[cursor];
    chain.push(currentNodeData);
    cursor = currentNodeData.parent;
  }

  const messages = chain.reverse().map(parseMessageNode).filter(isParsedMessage);

  if (!messages.length) {
    return null;
  }

  return {
    sourceConversationId: String(rawConversation.id ?? crypto.randomUUID()),
    title:
      (typeof rawConversation.title === "string" && rawConversation.title.trim()) ||
      messages.find((message) => message.role === "user")?.content.slice(0, 40) ||
      "未命名会话",
    sourcePlatform: "ChatGPT",
    sourceCreatedAt: normalizeTimestamp(rawConversation.create_time as number | string | null | undefined),
    sourceUpdatedAt: normalizeTimestamp(rawConversation.update_time as number | string | null | undefined),
    messages
  };
}

function parseMessagesArrayConversation(rawConversation: Record<string, unknown>): ParsedConversation | null {
  const rawMessages = rawConversation.messages;
  if (!Array.isArray(rawMessages)) {
    return null;
  }

  const messages = rawMessages.flatMap((item) => {
      const raw = item as {
        role?: string;
        author?: { role?: string };
        content?: unknown;
        text?: string;
        create_time?: number | string | null;
      };

      const role = mapRole(raw.role ?? raw.author?.role);
      const content = getTextContent(raw.content ?? raw.text);

      if (!role || !content) {
        return [];
      }

      return [
        {
          role,
          content,
          sourceTimestamp: normalizeTimestamp(raw.create_time)
        } satisfies ParsedMessage
      ];
    });

  if (!messages.length) {
    return null;
  }

  return {
    sourceConversationId: String(rawConversation.id ?? crypto.randomUUID()),
    title:
      (typeof rawConversation.title === "string" && rawConversation.title.trim()) ||
      messages.find((message) => message.role === "user")?.content.slice(0, 40) ||
      "未命名会话",
    sourcePlatform: "ChatGPT",
    sourceCreatedAt: normalizeTimestamp(rawConversation.create_time as number | string | null | undefined),
    sourceUpdatedAt: normalizeTimestamp(rawConversation.update_time as number | string | null | undefined),
    messages
  };
}

function parsePlainTextConversation(content: string): ParsedConversation | null {
  const text = content.trim();
  if (!text) {
    return null;
  }

  return {
    sourceConversationId: crypto.randomUUID(),
    title: text.slice(0, 40),
    sourcePlatform: "ChatGPT",
    messages: [
      {
        role: "user",
        content: text
      }
    ]
  };
}

function buildResult(conversations: ParsedConversation[]): ParseImportResult {
  return {
    platform: "ChatGPT",
    conversations,
    detectedConversationCount: conversations.length,
    detectedMessageCount: conversations.reduce((total, conversation) => total + conversation.messages.length, 0)
  };
}

export class ChatGPTParser implements ConversationParser {
  readonly platform = "ChatGPT" as const;

  async parse(input: { fileName?: string; content?: string | Buffer }) {
    const rawContent =
      typeof input.content === "string"
        ? input.content
        : Buffer.isBuffer(input.content)
          ? input.content.toString("utf-8")
          : "";

    if (!rawContent.trim()) {
      return parseImportSource({
        sourcePlatform: this.platform,
        sourceFileName: input.fileName
      });
    }

    try {
      const parsedJson = JSON.parse(rawContent) as unknown;
      const rawConversations = Array.isArray(parsedJson)
        ? parsedJson
        : typeof parsedJson === "object" && parsedJson !== null && Array.isArray((parsedJson as { conversations?: unknown[] }).conversations)
          ? (parsedJson as { conversations: unknown[] }).conversations
          : [parsedJson];

      const conversations = rawConversations
        .map((item) => {
          if (!item || typeof item !== "object") {
            return null;
          }

          const record = item as Record<string, unknown>;
          return parseMappingConversation(record) ?? parseMessagesArrayConversation(record);
        })
        .filter((conversation): conversation is ParsedConversation => Boolean(conversation));

      if (conversations.length) {
        return buildResult(conversations);
      }
    } catch {
      const fallback = parsePlainTextConversation(rawContent);
      if (fallback) {
        return buildResult([fallback]);
      }
    }

    return parseImportSource({
      sourcePlatform: this.platform,
      sourceFileName: input.fileName
    });
  }
}
