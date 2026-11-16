import type { PagesContext } from "../env";
import { json } from "../http";
import { listPublished } from "../store";

export async function onRequestGet(context: PagesContext): Promise<Response> {
  if (!context.env.DB) return json({ error: "Catalog is unavailable." }, 503);
  try {
    const experiences = await listPublished(context.env.DB);
    return json({ experiences });
  } catch {
    return json({ error: "Catalog is unavailable." }, 503);
  }
}
