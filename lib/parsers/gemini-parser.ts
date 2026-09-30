import { ConversationParser } from "@/lib/parsers/types";
import { parseImportSource } from "@/lib/services/import-service";

export class GeminiParser implements ConversationParser {
  readonly platform = "Gemini" as const;

  async parse(input: { fileName?: string; content?: string | Buffer }) {
    void input;

    // TODO: 接入真实 Gemini 导出文件解析逻辑。
    return parseImportSource({
      sourcePlatform: this.platform,
      sourceFileName: input.fileName
    });
  }
}
