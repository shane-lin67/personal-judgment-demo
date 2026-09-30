import { AnalysisResult, ParsedConversation } from "@/lib/types";
import { analyzeParsedConversations } from "@/lib/services/import-service";

export interface ConversationAnalyzer {
  analyze(input: { conversations: ParsedConversation[] }): Promise<AnalysisResult[]>;
}

export class MockConversationAnalyzer implements ConversationAnalyzer {
  async analyze(input: { conversations: ParsedConversation[] }) {
    // TODO: 后续替换为真实 LLM 分析流程。
    return analyzeParsedConversations({
      parsedConversations: input.conversations
    });
  }
}
