import { MockConversationAnalyzer } from "@/lib/ai/analyzer";
import { fail, getDemoScenario, ok } from "@/lib/api";
import { getConversationById } from "@/lib/services/conversation-service";

const analyzer = new MockConversationAnalyzer();

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const conversation = await getConversationById(id, getDemoScenario(_request));

  if (!conversation) {
    return fail("会话不存在", 404, { id });
  }

  const parsedConversation = {
    sourceConversationId: conversation.id,
    title: conversation.title,
    sourcePlatform: conversation.sourcePlatform,
    messages: conversation.messages.map((message) => ({
      role: message.role,
      content: message.content
    }))
  };

  const result = await analyzer.analyze({
    conversations: [parsedConversation]
  });

  return ok(result[0]);
}
