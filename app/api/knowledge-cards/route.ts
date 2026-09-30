import { getDemoScenario, ok } from "@/lib/api";
import { getKnowledgeCardList } from "@/lib/services/knowledge-card-service";

export async function GET(request: Request) {
  return ok(await getKnowledgeCardList(getDemoScenario(request)));
}
