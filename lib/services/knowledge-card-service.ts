import { getScenarioData } from "@/lib/mock-scenarios";
import { DemoScenario } from "@/lib/types";
import { isMockDataSource } from "@/lib/services/repository";
import { getKnowledgeCardByIdFromDb, getKnowledgeCardsFromDb } from "@/lib/services/prisma-service";

export async function getKnowledgeCardList(scenario: DemoScenario = "default") {
  if (isMockDataSource()) {
    return getScenarioData(scenario).knowledgeCards;
  }

  return getKnowledgeCardsFromDb();
}

export async function getKnowledgeCardById(id: string, scenario: DemoScenario = "default") {
  if (isMockDataSource()) {
    return getScenarioData(scenario).knowledgeCards.find((item) => item.id === id) ?? null;
  }

  return getKnowledgeCardByIdFromDb(id);
}

export function getKnowledgeCardFilterOptions() {
  return {
    types: ["全部", "流程", "架构", "产品"],
    sources: ["全部", "ChatGPT", "Gemini"],
    tags: ["产品设计", "MVP", "知识库", "导入流程", "后端接口", "UI"]
  };
}
