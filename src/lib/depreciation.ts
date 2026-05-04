/**
 * Straight-line depreciation to a salvage floor — a common simplification
 * insurers use when deriving Actual Cash Value (ACV) from replacement cost.
 * This is an estimate only, not an appraisal or binding valuation.
 */

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const SALVAGE_RATIO = 0.1;

/** Typical useful life (years) by category for straight-line schedules. */
export function usefulLifeYearsForCategory(category: string): number {
  const c = category.trim().toLowerCase();
  if (c.includes("electronic")) return 5;
  if (c.includes("appliance")) return 10;
  if (c === "hvac") return 15;
  if (c.includes("furniture")) return 10;
  if (c.includes("automotive")) return 7;
  if (c.includes("jewelry")) return 15;
  if (c === "tools") return 10;
  if (c.includes("plumbing")) return 15;
  if (c.includes("electrical")) return 12;
  if (c.includes("eyeglass")) return 3;
  return 7;
}

export type InsuranceAcvEstimate = {
  /** Estimated ACV after straight-line depreciation to salvage. */
  estimatedActualCashValue: number;
  totalDepreciation: number;
  annualDepreciation: number;
  ageYears: number;
  usefulLifeYears: number;
  salvageFloor: number;
  methodSummary: string;
};

export function computeInsuranceStyleAcv(params: {
  salePrice: number;
  purchaseDate: string | null;
  category: string;
}): InsuranceAcvEstimate | null {
  const basis = params.salePrice;
  if (!Number.isFinite(basis) || basis <= 0) return null;
  if (!params.purchaseDate?.trim()) return null;

  const purchased = new Date(params.purchaseDate + "T12:00:00");
  if (Number.isNaN(purchased.getTime())) return null;

  const now = new Date();
  const ageYears = Math.max(
    0,
    (now.getTime() - purchased.getTime()) / MS_PER_YEAR,
  );

  const L = Math.max(1, usefulLifeYearsForCategory(params.category || "Other"));
  const salvageFloor = basis * SALVAGE_RATIO;
  const depreciable = Math.max(0, basis - salvageFloor);
  const annual = depreciable / L;
  const cappedYears = Math.min(ageYears, L);
  const totalDepreciation = Math.min(depreciable, annual * cappedYears);
  const acv = Math.max(salvageFloor, basis - totalDepreciation);

  return {
    estimatedActualCashValue: Math.round(acv * 100) / 100,
    totalDepreciation: Math.round(totalDepreciation * 100) / 100,
    annualDepreciation: Math.round(annual * 100) / 100,
    ageYears: Math.round(ageYears * 100) / 100,
    usefulLifeYears: L,
    salvageFloor: Math.round(salvageFloor * 100) / 100,
    methodSummary: `Straight-line over ${L} yr (${params.category || "Other"}), 10% salvage`,
  };
}

export const ACV_DISCLAIMER =
  "Estimate only: not an appraisal. Carriers use their own schedules; confirm with your adjuster or policy.";

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
