import { STORE } from "../_shared/store";
import { productSlug } from "../_shared/product-slug";
import { onRequestGet as cjProducts } from "../api/cj-products";

/* Product page /p/<slug>: rendered from the same live catalog the storefront grid uses (/api/cj-products),
   so hidden/removed products have no page. Supplier names are never shown. */
const QUERY = "fitness";
const CATEGORY = "Trening og friluft";
const CJ_LOCAL_FALLBACK = true;

function esc(v: unknown) {
  return String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
function clean(v: unknown) {
  return String(v || "").replace(/\b(cj(?:\s*dropshipping)?|printify|gelato|printful|dropi)\b/gi, " ").replace(/<[^>]*>/g, " ").replace(/\s{2,}/g, " ").trim();
}

async function loadCatalog(context: any): Promise<any[]> {
  const origin = new URL(context.request.url).origin;
  try {
    const apiUrl = origin + "/api/cj-products?q=" + encodeURIComponent(QUERY);
    const res: Response = await (cjProducts as any)({ ...context, request: new Request(apiUrl, { headers: { accept: "application/json" } }) });
    if (res.ok) {
      const data: any = await res.json();
      if (Array.isArray(data.products) && data.products.length) return data.products;
    }
  } catch (_) {}
  if (!CJ_LOCAL_FALLBACK) return [];
  try {
    const res = await context.env.ASSETS.fetch(new Request(origin + "/catalog/selected-products.json"));
    if (res.ok) { const d: any = await res.json(); return Array.isArray(d) ? d : Array.isArray(d.products) ? d.products : []; }
  } catch (_) {}
  return [];
}

function notFound(origin: string) {
  return new Response(`<!doctype html><html lang="nb"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Produktet finnes ikke – ${esc(STORE.brand)}</title><link rel="stylesheet" href="/legal.css"></head><body><main style="max-width:720px;margin:60px auto;padding:0 20px;font-family:Inter,Arial,sans-serif"><h1>Produktet er ikke tilgjengelig</h1><p>Det kan være utsolgt eller fjernet fra sortimentet.</p><p><a href="/#produkter">Se alle produkter</a></p></main></body></html>`, { status: 404, headers: { "content-type": "text/html; charset=utf-8" } });
}

export async function onRequestGet(context: any) {
  const url = new URL(context.request.url);
  const slug = String(context.params.slug || "").toLowerCase();
  const list = (await loadCatalog(context)).filter((p) => p && p.image && Number(p.priceNok) > 0);
  const product = list.find((p) => productSlug(clean(p.name), String(p.id)) === slug)
    || list.find((p) => slug.endsWith("-" + productSlug("", String(p.id)).split("-").pop()));
  if (!product) return notFound(url.origin);
  const canonicalSlug = productSlug(clean(product.name), String(product.id));
  if (canonicalSlug !== slug) return Response.redirect(url.origin + "/p/" + canonicalSlug, 301);

  const name = clean(product.name) || "Produkt";
  const price = Math.round(Number(product.priceNok));
  const images: string[] = [product.image, ...(Array.isArray(product.images) ? product.images : [])].filter((x, i, a) => x && a.indexOf(x) === i).slice(0, 6);
  const cat = clean(product.category || product.cat) || CATEGORY;
  const desc = clean(product.description) || `${name} fra ${STORE.brand}. ${cat}. Pris ${price} kr inkl. 25 % MVA, frakt 79 kr per ordre, levering 5–20 virkedager og 14 dagers angrerett.`;
  const short = desc.slice(0, 200);
  const pageUrl = STORE.siteUrl.replace(/\/$/, "") + "/p/" + canonicalSlug;
  const ld = {
    "@context": "https://schema.org/", "@type": "Product", name, image: images, description: short,
    sku: String(product.sku || product.id), brand: { "@type": "Brand", name: STORE.brand }, category: cat,
    offers: { "@type": "Offer", url: pageUrl, priceCurrency: "NOK", price: String(price), availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition", seller: { "@type": "Organization", name: STORE.brand } },
  };
  const addUrl = "/?add=" + encodeURIComponent(String(product.id)) + "#produkter";
  const html = `<!doctype html><html lang="nb"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(name)} – ${esc(STORE.brand)}</title>
<meta name="description" content="${esc(short)}">
<link rel="canonical" href="${esc(pageUrl)}">
<meta property="og:type" content="product"><meta property="og:site_name" content="${esc(STORE.brand)}">
<meta property="og:title" content="${esc(name)}"><meta property="og:description" content="${esc(short)}">
<meta property="og:url" content="${esc(pageUrl)}"><meta property="og:image" content="${esc(images[0])}">
<meta property="product:price:amount" content="${price}"><meta property="product:price:currency" content="NOK">
<meta property="og:price:amount" content="${price}"><meta property="og:price:currency" content="NOK"><meta property="og:availability" content="instock">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/legal.css">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
<style>body{margin:0;font-family:Inter,Arial,sans-serif;background:#fff;color:#172033}.pp-top{display:flex;justify-content:space-between;align-items:center;padding:16px 5%;border-bottom:1px solid #e5e7eb}.pp-top a{color:inherit;text-decoration:none;font-weight:800;letter-spacing:2px}.pp{max-width:1100px;margin:0 auto;padding:32px 5%;display:grid;grid-template-columns:1.1fr .9fr;gap:40px}.pp-main{width:100%;aspect-ratio:1;object-fit:cover;border-radius:14px;background:#f3f4f6}.pp-thumbs{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}.pp-thumbs img{width:70px;height:70px;object-fit:cover;border-radius:8px;cursor:pointer;border:1px solid #e5e7eb}.pp-tag{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#64748b}.pp h1{font-size:34px;line-height:1.15;margin:10px 0}.pp-price{font-size:28px;font-weight:800;margin:14px 0}.pp-btn{display:inline-block;background:#111827;color:#fff;padding:15px 26px;border-radius:10px;text-decoration:none;font-weight:800}.pp ul{line-height:1.8;color:#475569;padding-left:18px}.pp p{line-height:1.6;color:#334155}@media(max-width:800px){.pp{grid-template-columns:1fr}.pp h1{font-size:26px}}</style>
</head><body>
<header class="pp-top"><a href="/">${esc(STORE.brand.toUpperCase())}</a><a href="/#produkter" style="font-weight:600;letter-spacing:0">← Alle produkter</a></header>
<main class="pp" itemscope itemtype="https://schema.org/Product">
<div><img class="pp-main" id="ppMain" src="${esc(images[0])}" alt="${esc(name)}" itemprop="image">${images.length > 1 ? `<div class="pp-thumbs">${images.map((src) => `<img src="${esc(src)}" alt="${esc(name)}" loading="lazy" onclick="document.getElementById('ppMain').src=this.src">`).join("")}</div>` : ""}</div>
<div><div class="pp-tag">${esc(cat)}</div><h1 itemprop="name">${esc(name)}</h1>
<div class="pp-price">${price.toLocaleString("nb-NO")} kr</div>
<p itemprop="description">${esc(desc)}</p>
<a class="pp-btn" href="${esc(addUrl)}">LEGG I HANDLEKURVEN</a>
<ul><li>Priser i NOK inkl. 25 % MVA</li><li>Frakt 79 kr per ordre · levering 5–20 virkedager</li><li>14 dagers angrerett – <a href="/angrerett">les mer</a></li><li>Sikker betaling via Stripe</li></ul>
</div></main>
<footer style="padding:30px 5%;border-top:1px solid #e5e7eb;font-size:13px;color:#64748b"><strong>${esc(STORE.brand)}</strong> er et varemerke for Martinez Lozano Internasjonal Handel, org.nr 935 407 095 MVA · <a href="/kjopsvilkar">Kjøpsvilkår</a> · <a href="/personvern">Personvern</a> · <a href="/kontakt">Kontakt</a></footer>
<script src="/black-friday.js" defer></script></body></html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } });
}
