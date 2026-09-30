import { ChatGPTParser } from "@/lib/parsers/chatgpt-parser";
import { GeminiParser } from "@/lib/parsers/gemini-parser";
import { fail, ok } from "@/lib/api";
import { SourcePlatform } from "@/lib/types";

const parsers = {
  ChatGPT: new ChatGPTParser(),
  Gemini: new GeminiParser()
} as const;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { sourcePlatform?: SourcePlatform; sourceFileName?: string; content?: string }
    | null;

  if (!body?.sourcePlatform) {
    return fail("缺少 sourcePlatform");
  }

  const parser = parsers[body.sourcePlatform];

  if (!parser) {
    return fail("暂不支持该来源平台", 400, { sourcePlatform: body.sourcePlatform });
  }

  const result = await parser.parse({
    fileName: body.sourceFileName,
    content: body.content
  });

  return ok(result);
}
