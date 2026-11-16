import { allowAdmin, forbidden } from "../../access";
import type { PagesContext } from "../../env";

export async function onRequest(context: PagesContext): Promise<Response> {
  if (!(await allowAdmin(context.request, context.env))) return forbidden();
  return context.next();
}
