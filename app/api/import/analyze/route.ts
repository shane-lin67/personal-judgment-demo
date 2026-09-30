import { MockConversationAnalyzer } from "@/lib/ai/analyzer";
import { fail, ok } from "@/lib/api";
import { ParsedConversation } from "@/lib/types";

const analyzer = new MockConversationAnalyzer();

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { conversations?: ParsedConversation[] }
    | null;

  if (!body?.conversations?.length) {
    return fail("缺少 conversations");
  }

  const result = await analyzer.analyze({
    conversations: body.conversations
  });

  return ok(result);
}
