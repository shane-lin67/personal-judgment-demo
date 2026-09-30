import { fail, getDemoScenario, ok } from "@/lib/api";
import { getConversationById } from "@/lib/services/conversation-service";
import { updateConversationTags } from "@/lib/services/tag-service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const conversation = await getConversationById(id, getDemoScenario(request));
  const body = (await request.json().catch(() => null)) as { tagIds?: string[] } | null;

  if (!conversation) {
    return fail("会话不存在", 404, { id });
  }

  if (!body?.tagIds) {
    return fail("缺少 tagIds");
  }

  return ok(await updateConversationTags({ conversationId: id, tagIds: body.tagIds }));
}
