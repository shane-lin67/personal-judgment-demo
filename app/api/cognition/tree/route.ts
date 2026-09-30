import { ok } from "@/lib/api";
import { knowledgeTree } from "@/lib/cognition-mock";

export async function GET() {
  return ok(knowledgeTree);
}
