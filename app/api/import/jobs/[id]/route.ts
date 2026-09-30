import { fail, getDemoScenario, ok } from "@/lib/api";
import { getImportJobById } from "@/lib/services/import-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = await getImportJobById(id, getDemoScenario(_request));

  if (!job) {
    return fail("导入任务不存在", 404, { id });
  }

  return ok(job);
}
