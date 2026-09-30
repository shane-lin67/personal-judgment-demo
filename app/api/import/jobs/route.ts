import { getDemoScenario, ok } from "@/lib/api";
import { getImportJobs } from "@/lib/services/import-service";

export async function GET(request: Request) {
  return ok(await getImportJobs(getDemoScenario(request)));
}
