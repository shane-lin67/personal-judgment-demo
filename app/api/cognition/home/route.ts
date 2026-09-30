import { ok } from "@/lib/api";
import { homePayload } from "@/lib/cognition-mock";

export async function GET() {
  return ok(homePayload);
}
