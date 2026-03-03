// Yarn Quantity Estimator
//
// Estimates yardage needed when substituting a different-gauge yarn.
// Yardage scales with the area ratio of the two gauges:
//
//   ratio = (your_sts × your_rows) / (pattern_sts × pattern_rows)
//
// (swatch size cancels when both gauges use the same swatch convention)
//
// This is an approximation — yarn weight, fiber, and stitch texture
// all affect actual consumption, so we apply a 10% buffer.

const BUFFER = 0.10;

export interface YarnResult {
  ratio: number;
  estimatedYardage: number; // with buffer
  exactYardage: number; // without buffer
  bufferYards: number;
  percentChange: number; // relative to original
}

export function calcYarn(
  originalYardage: number,
  patternSts: number,
  patternRows: number,
  yourSts: number,
  yourRows: number,
): YarnResult {
  const ratio = (yourSts * yourRows) / (patternSts * patternRows);
  const exact = originalYardage * ratio;
  const buffer = exact * BUFFER;
  const estimated = Math.ceil(exact + buffer);
  const percentChange = Math.round((ratio - 1) * 100);

  return {
    ratio: Math.round(ratio * 1000) / 1000,
    estimatedYardage: estimated,
    exactYardage: Math.round(exact),
    bufferYards: Math.round(buffer),
    percentChange,
  };
}
