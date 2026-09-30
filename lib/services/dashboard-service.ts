import { getScenarioData } from "@/lib/mock-scenarios";
import { DemoScenario } from "@/lib/types";
import { isMockDataSource } from "@/lib/services/repository";
import { getDashboardDataFromDb } from "@/lib/services/prisma-service";

export async function getDashboardOverview(scenario: DemoScenario = "default") {
  if (isMockDataSource()) {
    return getScenarioData(scenario).overview;
  }

  return (await getDashboardDataFromDb()).overview;
}

export async function getRecentConversations(scenario: DemoScenario = "default") {
  if (isMockDataSource()) {
    return getScenarioData(scenario).conversations.slice(0, 3);
  }

  return (await getDashboardDataFromDb()).recentConversations;
}

export async function getRecentKnowledgeCards(scenario: DemoScenario = "default") {
  if (isMockDataSource()) {
    return getScenarioData(scenario).knowledgeCardPreviews.slice(0, 3);
  }

  return (await getDashboardDataFromDb()).recentKnowledgeCards;
}
