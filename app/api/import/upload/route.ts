import { createMockUploadJob } from "@/lib/services/import-service";
import { fail, ok } from "@/lib/api";
import { SourcePlatform } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { sourcePlatform?: SourcePlatform; sourceFileName?: string; fileType?: string }
    | null;

  if (!body?.sourcePlatform || !body?.sourceFileName) {
    return fail("缺少 sourcePlatform 或 sourceFileName");
  }

  return ok(
    createMockUploadJob({
      sourcePlatform: body.sourcePlatform,
      sourceFileName: body.sourceFileName,
      fileType: body.fileType
    }),
    { status: 201 }
  );
}
