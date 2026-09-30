import { getDemoScenario, ok } from "@/lib/api";
import { getTags } from "@/lib/services/tag-service";

export async function GET(request: Request) {
  return ok(await getTags(getDemoScenario(request)));
}
