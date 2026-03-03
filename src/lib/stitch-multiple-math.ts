// Stitch Multiple Adjuster
//
// Finds the nearest stitch counts that satisfy "multiple of N [+ offset]".
// Valid counts: N*k + offset, for k = 0, 1, 2, ...
//
// Optionally converts count differences to inches/cm using stitch gauge.

export type Unit = 'in' | 'cm';

export interface MultipleResult {
  lower: number | null; // nearest valid count ≤ target (null if would be ≤ 0)
  upper: number; // nearest valid count ≥ target
  exactMatch: boolean;
  lowerWidthDiff: number | null; // width difference in display units (if gauge given)
  upperWidthDiff: number | null;
}

export function calcMultiple(
  target: number,
  multiple: number,
  offset: number,
  gaugeSts?: number, // sts per swatch (optional)
  unit?: Unit,
): MultipleResult {
  // Normalize offset to 0 ≤ offset < multiple
  const o = ((offset % multiple) + multiple) % multiple;

  // Find k such that multiple*k + o ≤ target
  const k = Math.floor((target - o) / multiple);

  const lower = multiple * k + o;
  const upper = lower + multiple;

  const exactMatch = lower === target;

  // Width differences (in display units) using stitch gauge
  let lowerWidthDiff: number | null = null;
  let upperWidthDiff: number | null = null;

  if (gaugeSts && gaugeSts > 0 && unit) {
    const swatchSize = unit === 'in' ? 4 : 10;
    const stsPerUnit = gaugeSts / swatchSize;
    if (!exactMatch) {
      lowerWidthDiff =
        lower > 0
          ? Math.round(((lower - target) / stsPerUnit) * 10) / 10
          : null;
      upperWidthDiff = Math.round(((upper - target) / stsPerUnit) * 10) / 10;
    }
  }

  return {
    lower: lower > 0 ? lower : null,
    upper,
    exactMatch,
    lowerWidthDiff,
    upperWidthDiff,
  };
}
