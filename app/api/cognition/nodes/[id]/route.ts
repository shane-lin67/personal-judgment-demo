import { fail, ok } from "@/lib/api";
import { nodeDetails } from "@/lib/cognition-mock";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const node = nodeDetails.find((item) => item.id === id) ?? null;

  if (!node) {
    return fail("节点不存在", 404, { id });
  }

  return ok(node);
}
