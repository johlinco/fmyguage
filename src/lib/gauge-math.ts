export type Unit = 'in' | 'cm';

export interface Gauge {
  stitches: number;
  rows: number;
}

// Swatch size in display units: 4 inches or 10 cm
const SWATCH_SIZE: Record<Unit, number> = { in: 4, cm: 10 };

// stitches per display unit (inch or cm)
function stsPerUnit(g: Gauge, unit: Unit): number {
  return g.stitches / SWATCH_SIZE[unit];
}

export type AdjustResult = {
  adjusted: number;
  exact: number;
  ratio: number;
};

// Stitch count → adjusted stitch count for the same physical width
export function adjustStitchCount(
  original: number,
  pattern: Gauge,
  yours: Gauge,
): AdjustResult {
  // Ratio simplifies to yours.stitches / pattern.stitches
  // (swatch size cancels out — both must be measured the same way)
  const ratio = yours.stitches / pattern.stitches;
  const exact = original * ratio;
  return { adjusted: Math.round(exact), exact, ratio };
}

export type MeasToStsResult = {
  stitches: number;
  exact: number;
};

// Measurement (in display units) → stitch count at your gauge
export function measurementToStitches(
  measurement: number,
  yours: Gauge,
  unit: Unit,
): MeasToStsResult {
  const exact = measurement * stsPerUnit(yours, unit);
  return { stitches: Math.round(exact), exact };
}

export type StsToMeasResult = {
  measurement: number;
  unit: Unit;
};

// Stitch count → measurement at your gauge (in display units)
export function stitchesToMeasurement(
  stitches: number,
  yours: Gauge,
  unit: Unit,
): StsToMeasResult {
  const measurement = stitches / stsPerUnit(yours, unit);
  return { measurement: Math.round(measurement * 10) / 10, unit };
}

export function formatMeasurement(value: number, unit: Unit): string {
  return unit === 'in' ? `${value}"` : `${value} cm`;
}

export function swatchLabel(unit: Unit): string {
  return unit === 'in' ? 'per 4"' : 'per 10 cm';
}
