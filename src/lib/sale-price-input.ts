/** Parse user-entered sale price string to a non-negative number or null. */
export function salePriceFromInput(s: string): number | null {
  const t = s.trim().replace(/,/g, "");
  if (t === "") return null;
  const n = Number.parseFloat(t);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}

/** Parse JSON body value (number or string) for API routes. */
export function parseSalePriceBody(input: unknown): number | null {
  if (input === null || input === undefined || input === "") return null;
  const n =
    typeof input === "number" ? input : Number(String(input).replace(/,/g, ""));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}
