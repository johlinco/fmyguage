'use client';

import { useState } from 'react';
import {
  calcShaping,
  formatScheduleSentence,
  verifySchedule,
  type ShapingResult,
} from '@/lib/shaping-math';

function NumInput({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium uppercase tracking-wide text-warm-muted">
        {label}
        {hint && <span className="ml-1 normal-case font-normal text-warm-muted/70">{hint}</span>}
      </label>
      <input
        type="number"
        inputMode="numeric"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? '0'}
        className="w-full rounded-lg border border-sand bg-surface px-3 py-3 text-lg text-bark placeholder:text-sand focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
      />
    </div>
  );
}

function WorkLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-sm text-warm-muted leading-relaxed">{children}</p>
  );
}

function ResultSection({ result, rows, showWork }: {
  result: ShapingResult;
  rows: number;
  showWork: boolean;
}) {
  if (result.type === 'no-change') {
    return (
      <div className="rounded-xl border border-sand bg-surface px-5 py-4 text-warm-muted text-sm">
        Start and end stitch counts are the same — no shaping needed.
      </div>
    );
  }

  if (result.type === 'error-odd') {
    return (
      <div className="rounded-xl border border-terracotta/40 bg-terracotta/5 px-5 py-4 space-y-1">
        <p className="font-semibold text-bark">Stitch count can&apos;t be split evenly</p>
        <p className="text-sm text-warm-muted">
          You need to change {result.absChange} stitches, but with two-sided shaping each
          row changes 2 stitches, so the total must be even. Try adjusting your start or end
          count by 1.
        </p>
      </div>
    );
  }

  if (result.type === 'error-too-few-rows') {
    return (
      <div className="rounded-xl border border-terracotta/40 bg-terracotta/5 px-5 py-4 space-y-1">
        <p className="font-semibold text-bark">Not enough rows</p>
        <p className="text-sm text-warm-muted">
          You need {result.events} shaping rows but only have {rows} rows available —
          that would require shaping more than once per row. Try adding more rows or
          reducing the stitch count change.
        </p>
      </div>
    );
  }

  const { direction, sides, events, absChange, schedule, isMixed } = result;
  const sentence = formatScheduleSentence(result);
  const rowsUsed = verifySchedule(result);
  const sideLabel = sides === 2 ? 'each side' : 'one side';
  const dirLabel = direction === 'increase' ? '+' : '−';

  return (
    <div className="rounded-xl border-2 border-terracotta/30 bg-terracotta/5 px-5 py-5 space-y-4">
      {/* Main sentence */}
      <p className="text-xl font-semibold text-bark leading-snug">{sentence}</p>

      {/* Summary tags */}
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-surface border border-sand px-3 py-1 text-warm-muted">
          {dirLabel}{absChange} sts total
        </span>
        <span className="rounded-full bg-surface border border-sand px-3 py-1 text-warm-muted">
          {events} shaping rows
        </span>
        <span className="rounded-full bg-surface border border-sand px-3 py-1 text-warm-muted">
          {sideLabel}
        </span>
      </div>

      {/* Mixed-rate explanation */}
      {isMixed && (
        <div className="rounded-lg border border-sand bg-surface px-4 py-3 text-sm text-warm-muted space-y-1">
          <p className="font-medium text-bark">Why two different rates?</p>
          <p>
            {rows} rows ÷ {events} shaping rows doesn&apos;t divide evenly, so we mix two
            intervals to use up all the rows exactly. You can work them in either order —
            the stitch math works out the same.
          </p>
        </div>
      )}

      {/* Show your work */}
      {showWork && (
        <div className="pt-3 border-t border-sand space-y-1">
          <WorkLine>total change:    {dirLabel}{absChange} sts</WorkLine>
          {sides === 2 && (
            <WorkLine>per side:        {dirLabel}{absChange / 2} sts ({events} shaping rows)</WorkLine>
          )}
          <WorkLine>rows ÷ events:   {rows} ÷ {events} = {Math.floor(rows / events)} remainder {rows % events}</WorkLine>
          {isMixed ? (
            <>
              <WorkLine>→ {schedule[0].times}× every {schedule[0].every} rows  + {schedule[1].times}× every {schedule[1].every} rows</WorkLine>
              <WorkLine>   = ({schedule[0].times}×{schedule[0].every}) + ({schedule[1].times}×{schedule[1].every}) = {rowsUsed} rows ✓</WorkLine>
            </>
          ) : (
            <WorkLine>→ {events}× every {schedule[0].every} rows = {rowsUsed} rows ✓</WorkLine>
          )}
        </div>
      )}
    </div>
  );
}

export default function ShapingPage() {
  const [sides, setSides] = useState<1 | 2>(2);
  const [startSts, setStartSts] = useState('');
  const [endSts, setEndSts] = useState('');
  const [totalRows, setTotalRows] = useState('');
  const [showWork, setShowWork] = useState(false);

  const start = parseInt(startSts, 10);
  const end = parseInt(endSts, 10);
  const rows = parseInt(totalRows, 10);

  const hasInputs = start > 0 && end > 0 && rows > 0;
  const result = hasInputs ? calcShaping(start, end, rows, sides) : null;

  const isSuccess = result?.type === 'success';
  const isIncrease = isSuccess && result.direction === 'increase';
  const isDecrease = isSuccess && result.direction === 'decrease';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-bark">Shaping Calculator</h1>
        <p className="mt-1 text-warm-muted">
          Evenly space increases or decreases over a set number of rows.
        </p>
      </div>

      {/* Sides toggle */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-warm-muted">Shaping on</span>
        <div className="flex rounded-lg border border-sand bg-surface overflow-hidden">
          {([2, 1] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSides(s)}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                sides === s
                  ? 'bg-bark text-cream'
                  : 'text-warm-muted hover:text-bark'
              }`}
            >
              {s === 2 ? 'Both sides' : 'One side'}
            </button>
          ))}
        </div>
        <span className="text-xs text-warm-muted">
          {sides === 2 ? '(sleeve, waist shaping)' : '(neckline, dart)'}
        </span>
      </div>

      {/* Inputs */}
      <div className="rounded-xl border border-sand bg-surface p-5 space-y-4">
        {/* Direction indicator */}
        {hasInputs && start !== end && (
          <div className={`text-sm font-medium px-3 py-1.5 rounded-lg w-fit ${
            isIncrease
              ? 'bg-sage/15 text-sage'
              : isDecrease
              ? 'bg-terracotta/15 text-terracotta'
              : ''
          }`}>
            {isIncrease ? '▲ Increasing' : isDecrease ? '▼ Decreasing' : ''}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <NumInput
            label="Start stitches"
            value={startSts}
            onChange={setStartSts}
            placeholder="e.g. 80"
          />
          <NumInput
            label="End stitches"
            value={endSts}
            onChange={setEndSts}
            placeholder="e.g. 110"
          />
          <NumInput
            label="Total rows"
            hint="available"
            value={totalRows}
            onChange={setTotalRows}
            placeholder="e.g. 40"
          />
        </div>
      </div>

      {/* Result */}
      {result && (
        <ResultSection result={result} rows={rows} showWork={showWork} />
      )}

      {/* Show working toggle */}
      {isSuccess && (
        <button
          onClick={() => setShowWork((s) => !s)}
          className="text-sm text-terracotta underline underline-offset-2"
        >
          {showWork ? 'Hide working' : 'Show working'}
        </button>
      )}

      {/* Empty state prompt */}
      {!hasInputs && (
        <p className="text-sm text-warm-muted">
          Fill in all three fields to see your shaping schedule.
        </p>
      )}
    </div>
  );
}
