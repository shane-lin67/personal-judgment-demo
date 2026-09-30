import { getScenarioData } from "@/lib/mock-scenarios";
import { DemoScenario } from "@/lib/types";
import { isMockDataSource } from "@/lib/services/repository";
import { getConversationByIdFromDb, getConversationListFromDb } from "@/lib/services/prisma-service";

export async function getConversationList(scenario: DemoScenario = "default") {
  if (isMockDataSource()) {
    return getScenarioData(scenario).conversations;
  }

  return getConversationListFromDb();
}

export async function getConversationById(id: string, scenario: DemoScenario = "default") {
  if (isMockDataSource()) {
    return getScenarioData(scenario).conversationDetails.find((conversation) => conversation.id === id) ?? null;
  }

  return getConversationByIdFromDb(id);
}

export function getConversationFilterOptions() {
  return {
    sources: ["全部", "ChatGPT", "Gemini"],
    dateRanges: ["最近 7 天", "最近 30 天", "今年"],
    tags: ["产品设计", "MVP", "知识库", "导入流程", "UI", "后端接口"]
  };
}
