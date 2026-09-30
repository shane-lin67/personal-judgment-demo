import { getScenarioData } from "@/lib/mock-scenarios";
import { DemoScenario } from "@/lib/types";
import { isMockDataSource } from "@/lib/services/repository";
import { getTagsFromDb, updateConversationTagsInDb } from "@/lib/services/prisma-service";

export async function getTags(scenario: DemoScenario = "default") {
  if (isMockDataSource()) {
    return getScenarioData(scenario).tags;
  }

  return getTagsFromDb();
}

export async function updateConversationTags(input: { conversationId: string; tagIds: string[] }) {
  if (!isMockDataSource()) {
    return updateConversationTagsInDb(input);
  }

  return {
    conversationId: input.conversationId,
    tagIds: input.tagIds,
    updatedAt: new Date().toISOString()
  };
}
