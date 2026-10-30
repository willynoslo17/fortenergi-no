/** Shared product slug: /p/<name>-<first 8 chars of the catalog id>. Same rule in product-links.js. */
export function productSlug(name: string, id: string) {
  const base = String(name || "produkt").toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/g, "");
  const key = String(id || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
  return (base || "produkt") + "-" + key;
}
