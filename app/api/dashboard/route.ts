import { getDemoScenario, ok } from "@/lib/api";
import {
  getDashboardOverview,
  getRecentConversations,
  getRecentKnowledgeCards
} from "@/lib/services/dashboard-service";

export async function GET(request: Request) {
  const scenario = getDemoScenario(request);
  return ok({
    overview: await getDashboardOverview(scenario),
    recentConversations: await getRecentConversations(scenario),
    recentKnowledgeCards: await getRecentKnowledgeCards(scenario)
  });
}
