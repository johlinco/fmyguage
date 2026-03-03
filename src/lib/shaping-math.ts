export type ShapingDirection = 'increase' | 'decrease';

export interface ScheduleItem {
  every: number; // row interval
  times: number;
}

export type ShapingResult =
  | { type: 'no-change' }
  | { type: 'error-odd'; absChange: number }
  | { type: 'error-too-few-rows'; events: number; rows: number }
  | {
      type: 'success';
      direction: ShapingDirection;
      sides: 1 | 2;
      events: number; // number of shaping rows
      absChange: number; // total stitches changed (always positive)
      schedule: ScheduleItem[];
      isMixed: boolean; // true if two different intervals are used
    };

export function calcShaping(
  start: number,
  end: number,
  rows: number,
  sides: 1 | 2,
): ShapingResult {
  const totalChange = end - start;
  const absChange = Math.abs(totalChange);

  if (absChange === 0) return { type: 'no-change' };

  // With 2-sided shaping, each shaping row changes stitches by 2 (1 per side),
  // so the total change must be even.
  if (sides === 2 && absChange % 2 !== 0) {
    return { type: 'error-odd', absChange };
  }

  const events = absChange / sides;

  if (events > rows) {
    return { type: 'error-too-few-rows', events, rows };
  }

  const direction: ShapingDirection = totalChange > 0 ? 'increase' : 'decrease';
  const baseInterval = Math.floor(rows / events);
  const remainder = rows % events;

  // Split into two rates to use up all the rows:
  // - (events - remainder) shaping rows spaced [baseInterval] rows apart
  // - (remainder) shaping rows spaced [baseInterval + 1] rows apart
  // Check: (events - remainder)*baseInterval + remainder*(baseInterval+1)
  //      = events*baseInterval + remainder = rows ✓
  const schedule: ScheduleItem[] = [];

  if (remainder === 0) {
    schedule.push({ every: baseInterval, times: events });
  } else {
    const fastTimes = events - remainder; // tighter spacing
    const slowTimes = remainder; // looser spacing
    if (fastTimes > 0) schedule.push({ every: baseInterval, times: fastTimes });
    if (slowTimes > 0) schedule.push({ every: baseInterval + 1, times: slowTimes });
  }

  return {
    type: 'success',
    direction,
    sides,
    events,
    absChange,
    schedule,
    isMixed: remainder !== 0,
  };
}

function ordinal(n: number): string {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

function rowLabel(every: number): string {
  return every === 1 ? 'every row' : `every ${ordinal(every)} row`;
}

function timesLabel(times: number): string {
  if (times === 1) return 'once';
  if (times === 2) return 'twice';
  return `${times} times`;
}

export function formatScheduleSentence(
  result: Extract<ShapingResult, { type: 'success' }>,
): string {
  const { direction, sides, schedule } = result;
  const verb = direction === 'increase' ? 'Increase' : 'Decrease';
  const sideLabel = sides === 2 ? ' each side' : '';

  const parts = schedule.map(
    (item) => `${rowLabel(item.every)}, ${timesLabel(item.times)}`,
  );

  const scheduleStr =
    parts.length === 1 ? parts[0] : parts[0] + ', then ' + parts[1];

  return `${verb} 1 st${sideLabel} ${scheduleStr}.`;
}

export function verifySchedule(
  result: Extract<ShapingResult, { type: 'success' }>,
): number {
  // Returns the total rows consumed — should equal the input rows
  return result.schedule.reduce((sum, item) => sum + item.every * item.times, 0);
}
