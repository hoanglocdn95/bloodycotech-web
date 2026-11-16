import { adminPageHtml } from "../admin-page";
import { allowAdmin, forbidden } from "../access";
import type { PagesContext } from "../env";

export async function onRequestGet(context: PagesContext): Promise<Response> {
  if (!(await allowAdmin(context.request, context.env))) return forbidden();
  return new Response(adminPageHtml(), {
    headers: {
      "cache-control": "no-store",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'",
      "content-type": "text/html; charset=utf-8",
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
      "x-robots-tag": "noindex",
    },
  });
}
