# Kategorier – Fortenergi (fortenergi.no)

Guía de categorías de la tienda (trening og friluft). Fecha: 2026-11-01. Documento de referencia: **no cambia nada publicado**. Cuando Willy pida ordenar/añadir productos, se aplica esto.

## Principios

- Categorías por **tipo de producto** (estilo Clas Ohlson / Europris / Jollyroom / Kid Interiør), nombres en **noruego bokmål**, orden fijo abajo.
- **Sin filtros ni colecciones por marca/proveedor** (CJ, Printful, Gelato, Printify no son categorías).
- Cada producto en **una** categoría principal + **una** subcategoría. Sin huérfanos (`Beauty`, `Energy`, `Home & Living`, `Diverse` en inglés/genéricos no valen).
- **No publicar categorías vacías**: una categoría/subcategoría sin productos se oculta del menú hasta tener al menos 1 producto (ideal ≥3).
- Slug URL en minúsculas sin æøå (æ→ae, ø→o, å→a): `/kategori/<slug>`.
- Títulos de producto en noruego describiendo lo que ES (no títulos SEO del proveedor en inglés).
- No tocar precios ni textos legales al recategorizar.

## Árbol de categorías (orden del menú)

| # | Kategori | Slug | Underkategorier | Regla: qué entra |
|---|---|---|---|---|
| 1 | **Vekter og styrke** | `vekter-og-styrke` | Manualer · Vektsekker og vektutstyr · Manualstativ · Vektløfterbelter og støtte | Frivekter og tilbehør. |
| 2 | **Treningsstrikk** | `treningsstrikk` | Strikk med håndtak · Strikk for knebøy og sete · Yogastrikk | Alle elastiske bånd. |
| 3 | **Yoga og pilates** | `yoga-og-pilates` | Yogamatter · Pilatesringer og -stenger | Matter, ringer, stenger. |
| 4 | **Kjerne og hjemmetrening** | `kjerne-og-hjemmetrening` | Magehjul · Hjemmetreningsapparater | Apparater for hjemme. |
| 5 | **Grep og håndstyrke** | `grep-og-handstyrke` | Grepstrenere og armtrenere · Håndflatebeskyttere | Grep, underarm. |
| 6 | **Treningstilbehør** | `treningstilbehor` | Pannebånd · Drikkeflasker | Småtilbehør. |
| 7 | **Tur og camping** | `tur-og-camping` | Turutstyr | Kun når det finnes produkter. |

## Reglas de asignación

1. Lee el título/descripción y decide qué ES el producto (función principal), no dónde se usa ni quién lo vende.
2. Elige la primera categoría de la tabla cuya regla encaje; si encaja en dos, gana la más específica.
3. Si no encaja en ninguna: no inventes categoría nueva por un solo producto; usa la categoría más cercana y anótalo aquí. Nueva categoría solo con ≥3 productos del mismo tipo.
4. Campo `category` en `catalog/*.json` = nombre noruego exacto de la tabla; añadir `subcategory` con el nombre exacto de la subcategoría.
5. Cada categoría visible necesita su texto en `catalog/category-intros.json` (`no` = nombre exacto).

## Estado actual (diagnóstico 2026-11-01, sin cambios aplicados)

- Intros existentes en `category-intros.json`: Løping og drikkeflasker, Strikk og mobilitet, Treningsutstyr, Tur og camping, Yoga og pilates.
- Valores actuales de `category` en el catálogo: ver `catalog/selected-products.json`; los genéricos/en inglés deben migrarse a esta tabla cuando se ordene.

## Al aplicar (cuando se ordene)

Rama nueva → backup en `/workspace/backups/<tienda>-AAAAMMDD` → reasignar `category`/`subcategory` → build local → deploy Cloudflare Pages según README → verificar menú, una página de categoría y un producto en el dominio .no. Rollback: Cloudflare Pages → Deployments → *Rollback* al despliegue anterior, o redeploy del commit previo.
