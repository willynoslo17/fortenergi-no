/* Product page links: each card in #products links to /p/<slug>; /?add=<id> (from a product page) adds it to the cart. */
(function () {
  "use strict";
  function slug(name, id) {
    var base = String(name || "produkt").toLowerCase().replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/g, "");
    return (base || "produkt") + "-" + String(id || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8);
  }
  function list() {
    try { if (typeof products !== "undefined" && Array.isArray(products)) return products; } catch (_) {}
    return Array.isArray(window.products) ? window.products : [];
  }
  function link() {
    var grid = document.getElementById("products");
    if (!grid) return;
    var byName = {};
    list().forEach(function (p) { if (p && p.name && p.provider === "cj" && (p.externalId || p.cjPid)) byName[String(p.name).trim()] = p; });
    grid.querySelectorAll("article, .product, .card").forEach(function (card) {
      if (card.getAttribute("data-pp")) return;
      var h = card.querySelector("h3, h2, h4");
      var p = h && byName[h.textContent.trim()];
      if (!p) return;
      card.setAttribute("data-pp", "1");
      var href = "/p/" + slug(p.name, p.externalId || p.cjPid);
      h.innerHTML = '<a href="' + href + '" style="color:inherit;text-decoration:none">' + h.innerHTML + "</a>";
      var img = card.querySelector("img");
      if (img && !img.closest("a")) { var a = document.createElement("a"); a.href = href; img.parentNode.insertBefore(a, img); a.appendChild(img); }
    });
  }
  function addFromQuery() {
    var id = new URLSearchParams(location.search).get("add");
    if (!id) return;
    var p = list().find(function (x) { return String(x.externalId || x.cjPid) === id; });
    if (p && typeof add === "function") { add(p.id); history.replaceState(null, "", location.pathname + "#produkter"); }
  }
  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("products");
    if (grid && window.MutationObserver) new MutationObserver(link).observe(grid, { childList: true, subtree: true });
    link();
  });
  window.addEventListener("nordic:catalog-updated", link);
  window.addEventListener("nordic:catalog-ready", function () { link(); addFromQuery(); });
})();
