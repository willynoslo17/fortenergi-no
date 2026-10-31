/* Språkvelger NO / EN / SV / PL. Norsk er standard; andre språk lastes fra /i18n/<lang>.json. */
(function () {
  "use strict";
  var LANGS = ["nb", "en", "sv", "pl"];
  var LABEL = { nb: "NO", en: "EN", sv: "SV", pl: "PL" };
  var NAME = { nb: "Norsk", en: "English", sv: "Svenska", pl: "Polski" };
  var q = (new URLSearchParams(location.search).get("lang") || "").toLowerCase();
  if (q === "no") q = "nb";
  var h = (location.hash || "").slice(1).toLowerCase();
  var saved = null;
  try { saved = localStorage.getItem("site_lang"); } catch (e) {}
  var lang = LANGS.indexOf(q) >= 0 ? q : (["en", "sv", "pl"].indexOf(h) >= 0 ? h : (LANGS.indexOf(saved) >= 0 ? saved : "nb"));
  try { localStorage.setItem("site_lang", lang); } catch (e) {}
  window.SITE_LANG = lang;
  document.documentElement.lang = lang;
  var D = null, done = new WeakMap(), produced = new Set();
  var ATTRS = ["placeholder", "title", "aria-label", "alt"];
  function tr(s) {
    if (!D || !s) return null;
    var t = s.trim();
    if (!t) return null;
    var v = D[t];
    return v ? s.replace(t, v) : null;
  }
  window.t = function (s) { var v = tr(String(s)); return v == null ? s : v; };
  function skip(el) { return !el || el.closest("script,style,noscript,[data-no-i18n]"); }
  function textNode(n) {
    if (skip(n.parentElement)) return;
    var cur = n.nodeValue;
    if (produced.has(cur)) return;
    var v = tr(cur);
    if (v != null && v !== cur) { produced.add(v); n.nodeValue = v; }
  }
  function attrs(el) {
    if (skip(el)) return;
    ATTRS.forEach(function (a) {
      var cur = el.getAttribute && el.getAttribute(a);
      if (!cur || produced.has(cur)) return;
      var v = tr(cur);
      if (v != null) { produced.add(v); el.setAttribute(a, v); }
    });
    if (el.tagName === "INPUT" && /^(button|submit)$/i.test(el.type) && el.value) {
      var v2 = tr(el.value); if (v2 != null) el.value = v2;
    }
  }
  function walk(root) {
    if (root.nodeType === 3) return textNode(root);
    if (root.nodeType !== 1) return;
    attrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    var n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) textNode(n); else attrs(n); }
  }
  function sections() {
    /* Juridiske sider kan ha <article id="no"> og <article id="en">: vis riktig versjon. */
    var no = document.querySelector('article#no'), en = document.querySelector('article#en');
    if (en) { en.hidden = lang !== "en"; if (no) no.hidden = lang === "en"; }
    if (no && !document.getElementById(lang) && lang !== "nb") {
      var a = document.createElement("span"); a.id = lang; no.parentNode.insertBefore(a, no);
    }
  }
  function switcher() {
    if (document.getElementById("langSwitch")) return;
    var sel = document.createElement("select");
    sel.id = "langSwitch"; sel.setAttribute("data-no-i18n", "");
    sel.setAttribute("aria-label", "Språk / Language");
    sel.style.cssText = "font:600 13px/1.2 inherit;padding:6px 8px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#111;cursor:pointer;margin:0 6px";
    LANGS.forEach(function (l) {
      var o = document.createElement("option"); o.value = l; o.textContent = LABEL[l] + " · " + NAME[l];
      if (l === lang) o.selected = true; sel.appendChild(o);
    });
    sel.addEventListener("change", function () {
      try { localStorage.setItem("site_lang", sel.value); } catch (e) {}
      var u = new URL(location.href); u.searchParams.set("lang", sel.value === "nb" ? "no" : sel.value);
      if (["en", "sv", "pl"].indexOf(u.hash.slice(1)) >= 0) u.hash = "";
      location.href = u.toString();
    });
    var host = document.querySelector(".navRight, nav .nav-right, header nav, nav, header");
    if (host) host.appendChild(sel);
    else { sel.style.cssText += ";position:fixed;top:10px;right:10px;z-index:9999"; document.body.appendChild(sel); }
  }
  function start() {
    var mk = document.getElementById("market"); if (mk) mk.style.display = "none";
    sections(); switcher();
    /* nb.json inneholder kun produktnavn/-beskrivelser fra leverandørdata som ikke er på norsk. */
    if (lang !== "nb") {
      var oa = window.alert, oc = window.confirm;
      window.alert = function (m) { return oa.call(window, window.t(m)); };
      window.confirm = function (m) { return oc.call(window, window.t(m)); };
    }
    fetch("/i18n/" + lang + ".json", { cache: "force-cache" }).then(function (r) { return r.json(); }).then(function (d) {
      D = d;
      if (D[document.title.trim()]) document.title = D[document.title.trim()];
      walk(document.body);
      new MutationObserver(function (ms) {
        ms.forEach(function (m) {
          if (m.type === "characterData") textNode(m.target);
          else if (m.type === "attributes") attrs(m.target);
          else m.addedNodes.forEach(walk);
        });
      }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    }).catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
