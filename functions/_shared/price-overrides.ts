/** Norway market price matching (2026-10-30). Keys are CJ product ids (pid).
 * PRICE_OVERRIDE: regular NOK price aligned to the Norwegian market, never below the profit floor.
 * HIDDEN: profit floor is above the Norwegian market price -> product is hidden (not deleted). */
export const PRICE_OVERRIDE: Record<string, number> = {"C182BBED-A4FD-46E7-B96F-FE1BCCFD13BA": 499};
export const HIDDEN = new Set<string>(["1966855904231456769", "2601200438101603500"]);
