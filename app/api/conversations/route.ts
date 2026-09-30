import { getDemoScenario, ok } from "@/lib/api";
import { getConversationList } from "@/lib/services/conversation-service";

export async function GET(request: Request) {
  return ok(await getConversationList(getDemoScenario(request)));
}
