import { fail, getDemoScenario, ok } from "@/lib/api";
import { getConversationById } from "@/lib/services/conversation-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const conversation = await getConversationById(id, getDemoScenario(_request));

  if (!conversation) {
    return fail("会话不存在", 404, { id });
  }

  return ok(conversation);
}
