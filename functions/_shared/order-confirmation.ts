/**
 * Ordrebekreftelse (order confirmation) sent to the customer after a paid Stripe Checkout Session.
 * Covers angrerettloven § 8/§ 15 (confirmation on durable medium incl. seller identity, price incl. MVA, delivery,
 * angrerett 14 days + angreskjema) and forbrukerkjøpsloven. Sent via Brevo transactional API (env.BREVO_API_KEY,
 * never logged). Once per Checkout Session (Cache API lock + Brevo idempotent tag). Never affects the webhook reply.
 */
import { STORE } from "./store";

export type OcEnv = { BREVO_API_KEY?: string };
const SELLER = "MARTINEZ LOZANO INTERNASJONAL HANDEL";
const ORGNR = "935 407 095 MVA";
const ADDRESS = "Norbygata 19, 0187 Oslo, Norge";
const DELIVERY = "Normalt 5–20 virkedager fra ordren er bekreftet (se frakt og levering).";
export const OC_SENDER = { name: STORE.brand, email: `kontakt@${STORE.domain}` };
const SUPPORT = `support@${STORE.domain}`;
const BASE = `https://${STORE.domain}`;

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
const kr = (ore: number) => `${(Math.round(ore) / 100).toLocaleString("nb-NO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\u00a0/g, " ")} kr`;

export type OcLine = { name: string; quantity: number; amount: number };
export type OcOrder = { orderNumber: string; date: Date; email: string; name: string; address: string; lines: OcLine[]; shipping: number; discount: number; total: number; tax?: number };

export function orderFromSession(session: Record<string, any>, lineItems: Array<Record<string, any>>): OcOrder {
  const meta = (session.metadata || {}) as Record<string, string>;
  const cd = session.customer_details || {};
  const ship = session.shipping_details || session.collected_information?.shipping_details || {};
  const a = ship.address || cd.address || {};
  const address = [ship.name || cd.name, a.line1, a.line2, [a.postal_code, a.city].filter(Boolean).join(" "), a.country].filter(Boolean).join(", ");
  const lines = lineItems.map((li) => ({
    name: String(li.description || li.price?.product?.name || "Vare"),
    quantity: Number(li.quantity || 1),
    amount: Number(li.amount_total ?? li.amount_subtotal ?? 0),
  }));
  return {
    orderNumber: String(meta.order_id || "").trim() || String(session.id || "").slice(-12).toUpperCase(),
    date: new Date(Number(session.created || Date.now() / 1000) * 1000),
    email: String(cd.email || session.customer_email || ""),
    name: String(cd.name || ship.name || ""),
    address,
    lines,
    shipping: Number(session.shipping_cost?.amount_total ?? session.total_details?.amount_shipping ?? 0),
    discount: Number(session.total_details?.amount_discount ?? 0),
    total: Number(session.amount_total ?? 0),
    tax: Number(session.total_details?.amount_tax ?? 0) || undefined,
  };
}

export function renderConfirmation(o: OcOrder): { subject: string; html: string; text: string } {
  const mva = o.tax ?? Math.round(o.total - o.total / 1.25); // 25 % MVA included in all prices
  const date = o.date.toLocaleDateString("nb-NO", { timeZone: "Europe/Oslo", day: "2-digit", month: "2-digit", year: "numeric" });
  const rows = o.lines.map((l) => `<tr><td style="padding:6px 0">${esc(l.name)}</td><td style="text-align:center">${l.quantity}</td><td style="text-align:right">${kr(l.amount)}</td></tr>`).join("");
  const subject = `Ordrebekreftelse ${o.orderNumber} – ${STORE.brand}`;
  const html = `<!doctype html><html lang="nb"><body style="font-family:Arial,sans-serif;color:#222;max-width:620px;margin:auto;padding:16px">
<h2 style="margin:0 0 8px">Takk for bestillingen${o.name ? ", " + esc(o.name.split(" ")[0]) : ""}!</h2>
<p>Dette er din ordrebekreftelse fra <b>${esc(STORE.brand)}</b>. Ta vare på e-posten.</p>
<p><b>Ordrenummer:</b> ${esc(o.orderNumber)}<br><b>Ordredato:</b> ${date}<br><b>Betaling:</b> Betalt med kort via Stripe${o.address ? `<br><b>Leveringsadresse:</b> ${esc(o.address)}` : ""}</p>
<table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr style="border-bottom:1px solid #ccc"><th style="text-align:left">Vare</th><th>Antall</th><th style="text-align:right">Pris</th></tr></thead><tbody>${rows}
<tr style="border-top:1px solid #ccc"><td colspan="2" style="padding:6px 0">Frakt</td><td style="text-align:right">${o.shipping ? kr(o.shipping) : "Gratis"}</td></tr>
${o.discount ? `<tr><td colspan="2">Rabatt</td><td style="text-align:right">−${kr(o.discount)}</td></tr>` : ""}
<tr><td colspan="2" style="padding:6px 0"><b>Totalt (inkl. MVA)</b></td><td style="text-align:right"><b>${kr(o.total)}</b></td></tr>
<tr><td colspan="2" style="color:#666">Herav 25 % MVA</td><td style="text-align:right;color:#666">${kr(mva)}</td></tr></tbody></table>
<h3>Levering</h3><p>${DELIVERY} Du får beskjed med sporingsinformasjon når pakken er sendt. <a href="${BASE}/frakt-og-levering.html">Frakt og levering</a></p>
<h3>Angrerett – 14 dager</h3><p>Du har 14 dagers angrerett etter angrerettloven. Fristen løper fra dagen du mottar varen (ved flere varer levert hver for seg: fra siste vare). Gi oss beskjed innen fristen, f.eks. med <a href="${BASE}/angreskjema.html">angreskjemaet</a> eller en e-post til ${SUPPORT}. Du må returnere varen senest 14 dager etter at du har gitt melding, og bærer selv returkostnaden. Vi tilbakebetaler hele beløpet inkl. standard frakt innen 14 dager. Les mer: <a href="${BASE}/angrerett.html">angrerett</a> og <a href="${BASE}/kjopsvilkar.html">kjøpsvilkår</a>.</p>
<h3>Reklamasjon</h3><p>Du har reklamasjonsrett etter forbrukerkjøpsloven (2 år, 5 år for varer ment å vare vesentlig lenger).</p>
<hr><p style="font-size:12px;color:#666">Selger: ${SELLER} (driver nettbutikken ${esc(STORE.brand)}), org.nr. ${ORGNR}<br>${ADDRESS}<br>Kontakt: <a href="mailto:${SUPPORT}">${SUPPORT}</a> · <a href="${BASE}/">${STORE.domain}</a></p></body></html>`;
  const text = [`Ordrebekreftelse ${o.orderNumber} – ${STORE.brand}`, `Ordredato: ${date}`, ...o.lines.map((l) => `${l.quantity} x ${l.name}: ${kr(l.amount)}`),
    `Frakt: ${o.shipping ? kr(o.shipping) : "Gratis"}`, o.discount ? `Rabatt: -${kr(o.discount)}` : "", `Totalt inkl. MVA: ${kr(o.total)} (herav MVA ${kr(mva)})`,
    `Levering: ${DELIVERY}`, `Angrerett 14 dager: ${BASE}/angreskjema.html eller ${SUPPORT}. Vilkår: ${BASE}/kjopsvilkar.html`,
    `Selger: ${SELLER}, org.nr. ${ORGNR}, ${ADDRESS}. Kontakt: ${SUPPORT}`].filter(Boolean).join("\n");
  return { subject, html, text };
}

async function lock(key: string): Promise<boolean> {
  try {
    const cache = (globalThis as any).caches?.default; if (!cache) return true;
    const req = new Request(`${BASE}/__oc-lock/${encodeURIComponent(key)}`);
    if (await cache.match(req)) return false;
    await cache.put(req, new Response("1", { headers: { "cache-control": "max-age=604800" } }));
  } catch (_) {}
  return true;
}

export async function sendBrevo(env: OcEnv, to: string, msg: { subject: string; html: string; text: string }, tag: string) {
  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": String(env.BREVO_API_KEY), "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ sender: OC_SENDER, to: [{ email: to }], replyTo: { email: SUPPORT, name: STORE.brand }, subject: msg.subject, htmlContent: msg.html, textContent: msg.text, tags: [STORE.slug, tag] }),
    signal: AbortSignal.timeout(10000),
  });
  return { ok: r.ok, status: r.status, body: r.ok ? "" : (await r.text()).slice(0, 200) };
}

export async function sendOrderConfirmation(env: OcEnv, session: Record<string, any>, lineItems: Array<Record<string, any>>) {
  if (!env.BREVO_API_KEY) return { sent: false, reason: "no_brevo" };
  const o = orderFromSession(session, lineItems);
  if (!o.email) return { sent: false, reason: "no_email" };
  if (!(await lock(String(session.id || o.orderNumber)))) return { sent: false, reason: "already_sent" };
  return sendBrevo(env, o.email, renderConfirmation(o), "ordrebekreftelse");
}
