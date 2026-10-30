/** Test only: sends a SAMPLE ordrebekreftelse to this store's own kontakt@ address (never to a customer), max 1 per 10 min. */
import { STORE } from "../_shared/store";
import { renderConfirmation, sendBrevo, OC_SENDER } from "../_shared/order-confirmation";
export async function onRequestPost(context: { env: { BREVO_API_KEY?: string } }) {
  if (!context.env.BREVO_API_KEY) return Response.json({ ok: false, reason: "no_brevo" });
  const cache = (globalThis as any).caches?.default;
  const req = new Request(`https://${STORE.domain}/__oc-test-rate`);
  if (cache && (await cache.match(req))) return Response.json({ ok: false, reason: "rate_limited" });
  if (cache) await cache.put(req, new Response("1", { headers: { "cache-control": "max-age=600" } }));
  const msg = renderConfirmation({ orderNumber: "TEST-0001", date: new Date(), email: OC_SENDER.email, name: "Test Kunde", address: "Test Kunde, Testveien 1, 0150 Oslo, NO",
    lines: [{ name: "Testprodukt (eksempel)", quantity: 1, amount: 49900 }], shipping: 7900, discount: 0, total: 57800 });
  msg.subject = "[TEST] " + msg.subject;
  return Response.json(await sendBrevo(context.env, OC_SENDER.email, msg, "ordrebekreftelse-test"));
}
export function onRequest() { return Response.json({ error: "Method not allowed" }, { status: 405 }); }
