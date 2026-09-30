import { ParseImportResult, SourcePlatform } from "@/lib/types";

export interface ConversationParser {
  readonly platform: SourcePlatform;
  parse(input: { fileName?: string; content?: string | Buffer }): Promise<ParseImportResult>;
}
