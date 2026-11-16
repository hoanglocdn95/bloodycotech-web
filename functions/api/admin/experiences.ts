import { allowAdmin, forbidden, sameOrigin } from "../../access";
import type { PagesContext } from "../../env";
import { json } from "../../http";
import { listAdmin, parseAdminBody, saveAdmin } from "../../store";

export async function onRequestGet(context: PagesContext): Promise<Response> {
  if (!(await allowAdmin(context.request, context.env))) return forbidden();
  if (!context.env.DB) return json({ error: "Catalog is unavailable." }, 503);
  try {
    return json({ experiences: await listAdmin(context.env.DB) });
  } catch {
    return json({ error: "Catalog is unavailable." }, 503);
  }
}

export async function onRequestPut(context: PagesContext): Promise<Response> {
  if (!(await allowAdmin(context.request, context.env))) return forbidden();
  if (!sameOrigin(context.request)) return forbidden();
  if (!context.env.DB) return json({ error: "Catalog is unavailable." }, 503);
  const raw = await context.request.text();
  if (raw.length > 100_000) return json({ error: "Catalog payload is too large." }, 413);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Catalog payload is not valid JSON." }, 400);
  }
  const experiences = parseAdminBody(body);
  if (!experiences) return json({ error: "Catalog payload is incomplete." }, 400);
  try {
    await saveAdmin(context.env.DB, experiences);
    return json({ experiences: await listAdmin(context.env.DB) });
  } catch {
    return json({ error: "Catalog could not be saved." }, 503);
  }
}
