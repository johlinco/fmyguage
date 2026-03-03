// "What Size Should I Knit?" math
//
// Core insight: the number of stitches in a given size is fixed.
// At a different gauge, those same stitches produce a different width.
//
// actual_width = pattern_width × (pattern_sts / your_sts)
//
// (swatch size cancels out, same as gauge translator)

export interface PatternSize {
  id: string;
  name: string;
  measurement: number; // finished measurement in display units
}

export interface SizeResult {
  id: string;
  name: string;
  patternMeasurement: number;
  actualMeasurement: number; // what you'd get at your gauge
  diffFromTarget: number; // actualMeasurement - target (negative = smaller than target)
  isRecommended: boolean;
}

export function calcSizes(
  patternSts: number,
  yourSts: number,
  target: number,
  sizes: PatternSize[],
): SizeResult[] {
  const ratio = patternSts / yourSts; // actual = pattern × ratio

  const results: SizeResult[] = sizes.map((s) => {
    const actual = Math.round(s.measurement * ratio * 10) / 10;
    return {
      id: s.id,
      name: s.name,
      patternMeasurement: s.measurement,
      actualMeasurement: actual,
      diffFromTarget: Math.round((actual - target) * 10) / 10,
      isRecommended: false,
    };
  });

  // Recommend the size whose actual measurement is closest to target
  if (results.length > 0) {
    let best = 0;
    for (let i = 1; i < results.length; i++) {
      if (
        Math.abs(results[i].diffFromTarget) <
        Math.abs(results[best].diffFromTarget)
      ) {
        best = i;
      }
    }
    results[best].isRecommended = true;
  }

  return results;
}
