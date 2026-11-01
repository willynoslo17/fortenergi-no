/* GPSR (EU 2023/988): produsent og ansvarlig markedsfører for Printify-varer (trykk på bestilling i EU). */
(function () {
  "use strict";
  var RESP = "ML Internasjonal Handel, Norbygata 19, 0187 Oslo, Norge · kontakt@mlinternasjonal.no";
  var MAKER = { Germany: "Textildruck Europa GmbH, Tyskland (trykkpartner via Printify)", "Czech Republic": "OPT OnDemand s.r.o., Tsjekkia (trykkpartner via Printify)" };
  var byImg = {};
  function key(u) { return String(u || "").split("?")[0]; }
  function tag() {
    document.querySelectorAll("#products img, .product img, .card img").forEach(function (img) {
      var p = byImg[key(img.getAttribute("src"))];
      var card = img.closest("article, .product, .card");
      if (!p || !card || card.querySelector(".gpsr")) return;
      var d = document.createElement("details"); d.className = "gpsr";
      d.style.cssText = "font-size:11px;color:#666;margin:6px 0";
      d.innerHTML = "<summary style=\"cursor:pointer\">Produktsikkerhet (GPSR)</summary><div>Produsent: " + (MAKER[p.origin] || "Trykkpartner i EU via Printify") +
        "<br>Ansvarlig markedsfører i EØS: " + RESP + "<br>Vare-ID: " + p.sku + "</div>";
      var btn = card.querySelector("button"); (btn ? btn.parentNode.insertBefore(d, btn) : card.appendChild(d));
    });
  }
  fetch("/api/printify-products").then(function (r) { return r.json(); }).then(function (d) {
    (d.products || []).forEach(function (p) { if (p.image) byImg[key(p.image)] = p; });
    tag(); new MutationObserver(tag).observe(document.body, { childList: true, subtree: true });
  }).catch(function () {});
})();
