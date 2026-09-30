import { ok } from "@/lib/api";
import { chatMessages, latestArchive, suggestedNodes } from "@/lib/cognition-mock";

export async function GET() {
  return ok({
    messages: chatMessages,
    suggestedNodes,
    latestArchive
  });
}
