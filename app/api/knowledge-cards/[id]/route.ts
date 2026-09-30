import { fail, getDemoScenario, ok } from "@/lib/api";
import { getKnowledgeCardById } from "@/lib/services/knowledge-card-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const card = await getKnowledgeCardById(id, getDemoScenario(_request));

  if (!card) {
    return fail("知识卡片不存在", 404, { id });
  }

  return ok(card);
}
