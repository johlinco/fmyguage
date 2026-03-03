'use client';

import { useState } from 'react';
import {
  type Unit,
  type Gauge,
  adjustStitchCount,
  measurementToStitches,
  stitchesToMeasurement,
  formatMeasurement,
  swatchLabel,
} from '@/lib/gauge-math';

type Mode = 'sts-to-sts' | 'meas-to-sts' | 'sts-to-meas';

const MODES: { id: Mode; label: string }[] = [
  { id: 'sts-to-sts', label: 'Adjust a stitch count' },
  { id: 'meas-to-sts', label: 'Measurement → stitches' },
  { id: 'sts-to-meas', label: 'Stitches → measurement' },
];

function NumInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium uppercase tracking-wide text-warm-muted">
        {label}
      </label>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? '0'}
        className="w-full rounded-lg border border-sand bg-surface px-3 py-3 text-lg text-bark placeholder:text-sand focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
      />
    </div>
  );
}

function ResultBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border-2 border-terracotta/30 bg-terracotta/5 px-5 py-4">
      {children}
    </div>
  );
}

function WorkLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-sm text-warm-muted leading-relaxed">
      {children}
    </p>
  );
}

export default function GaugePage() {
  const [unit, setUnit] = useState<Unit>('in');
  const [patternSts, setPatternSts] = useState('');
  const [yourSts, setYourSts] = useState('');
  const [mode, setMode] = useState<Mode>('sts-to-sts');
  const [inputValue, setInputValue] = useState('');
  const [showWork, setShowWork] = useState(false);

  const swatch = swatchLabel(unit);
  const pSts = parseFloat(patternSts);
  const ySts = parseFloat(yourSts);
  const val = parseFloat(inputValue);

  const hasGauge = pSts > 0 && ySts > 0;
  const hasInput = val > 0;
  const canCompute = hasGauge && hasInput;

  const pattern: Gauge = { stitches: pSts || 0, rows: 0 };
  const yours: Gauge = { stitches: ySts || 0, rows: 0 };

  function renderResult() {
    if (!canCompute) return null;

    if (mode === 'sts-to-sts') {
      const r = adjustStitchCount(val, pattern, yours);
      const pStsPerUnit = (pSts / (unit === 'in' ? 4 : 10)).toFixed(2);
      const yStsPerUnit = (ySts / (unit === 'in' ? 4 : 10)).toFixed(2);
      return (
        <ResultBox>
          <p className="text-sm text-warm-muted mb-1">At your gauge, cast on:</p>
          <p className="text-4xl font-bold text-terracotta">{r.adjusted} sts</p>
          {r.adjusted !== Math.round(r.exact) ? null : (
            <p className="mt-1 text-sm text-warm-muted">
              (exact: {r.exact.toFixed(1)} → rounded to nearest whole stitch)
            </p>
          )}
          {showWork && (
            <div className="mt-4 pt-4 border-t border-sand space-y-1">
              <WorkLine>pattern: {pSts} sts {swatch} = {pStsPerUnit} sts/{unit === 'in' ? 'inch' : 'cm'}</WorkLine>
              <WorkLine>yours:   {ySts} sts {swatch} = {yStsPerUnit} sts/{unit === 'in' ? 'inch' : 'cm'}</WorkLine>
              <WorkLine>ratio  = {ySts} ÷ {pSts} = {r.ratio.toFixed(4)}</WorkLine>
              <WorkLine>{val} × {r.ratio.toFixed(4)} = {r.exact.toFixed(2)} → <strong>{r.adjusted} sts</strong></WorkLine>
            </div>
          )}
        </ResultBox>
      );
    }

    if (mode === 'meas-to-sts') {
      const r = measurementToStitches(val, yours, unit);
      const yStsPerUnit = (ySts / (unit === 'in' ? 4 : 10)).toFixed(2);
      return (
        <ResultBox>
          <p className="text-sm text-warm-muted mb-1">
            Cast on at your gauge:
          </p>
          <p className="text-4xl font-bold text-terracotta">{r.stitches} sts</p>
          {showWork && (
            <div className="mt-4 pt-4 border-t border-sand space-y-1">
              <WorkLine>your gauge: {ySts} sts {swatch} = {yStsPerUnit} sts/{unit === 'in' ? 'inch' : 'cm'}</WorkLine>
              <WorkLine>{val} {unit === 'in' ? '"' : 'cm'} × {yStsPerUnit} = {r.exact.toFixed(2)} → <strong>{r.stitches} sts</strong></WorkLine>
            </div>
          )}
        </ResultBox>
      );
    }

    if (mode === 'sts-to-meas') {
      const r = stitchesToMeasurement(val, yours, unit);
      const yStsPerUnit = (ySts / (unit === 'in' ? 4 : 10)).toFixed(2);
      return (
        <ResultBox>
          <p className="text-sm text-warm-muted mb-1">
            At your gauge, {val} sts will measure:
          </p>
          <p className="text-4xl font-bold text-terracotta">
            {formatMeasurement(r.measurement, unit)}
          </p>
          {showWork && (
            <div className="mt-4 pt-4 border-t border-sand space-y-1">
              <WorkLine>your gauge: {ySts} sts {swatch} = {yStsPerUnit} sts/{unit === 'in' ? 'inch' : 'cm'}</WorkLine>
              <WorkLine>{val} ÷ {yStsPerUnit} = <strong>{r.measurement} {unit === 'in' ? '"' : 'cm'}</strong></WorkLine>
            </div>
          )}
        </ResultBox>
      );
    }
  }

  const modeConfig: Record<Mode, { inputLabel: string; placeholder: string; unit?: string }> = {
    'sts-to-sts': {
      inputLabel: 'Pattern stitch count',
      placeholder: 'e.g. 180',
    },
    'meas-to-sts': {
      inputLabel: `Desired width (${unit === 'in' ? 'inches' : 'cm'})`,
      placeholder: unit === 'in' ? 'e.g. 20' : 'e.g. 50',
    },
    'sts-to-meas': {
      inputLabel: 'Stitch count',
      placeholder: 'e.g. 180',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-bark">Gauge Translator</h1>
        <p className="mt-1 text-warm-muted">
          Enter both gauges, then convert any stitch count or measurement.
        </p>
      </div>

      {/* Unit toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-warm-muted">Gauge measured</span>
        <div className="flex rounded-lg border border-sand bg-surface overflow-hidden">
          {(['in', 'cm'] as Unit[]).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                unit === u
                  ? 'bg-bark text-cream'
                  : 'text-warm-muted hover:text-bark'
              }`}
            >
              {u === 'in' ? 'per 4"' : 'per 10 cm'}
            </button>
          ))}
        </div>
      </div>

      {/* Gauge inputs */}
      <div className="rounded-xl border border-sand bg-surface p-5 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-warm-muted">
          Gauge
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-warm-muted uppercase tracking-wide">
              Pattern gauge
            </p>
            <div className="flex items-end gap-2">
              <NumInput
                label={`Sts ${swatch}`}
                value={patternSts}
                onChange={setPatternSts}
                placeholder="20"
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-warm-muted uppercase tracking-wide">
              Your gauge
            </p>
            <div className="flex items-end gap-2">
              <NumInput
                label={`Sts ${swatch}`}
                value={yourSts}
                onChange={setYourSts}
                placeholder="24"
              />
            </div>
          </div>
        </div>
        {hasGauge && (
          <p className="text-sm text-warm-muted">
            Ratio: <span className="font-semibold text-bark">{(ySts / pSts).toFixed(3)}</span>
            {' '}— {ySts > pSts ? 'your stitches are tighter' : ySts < pSts ? 'your stitches are looser' : 'gauges match'}.
          </p>
        )}
      </div>

      {/* Conversion mode + input */}
      <div className="rounded-xl border border-sand bg-surface p-5 space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-warm-muted">
          Convert
        </h2>

        {/* Mode tabs */}
        <div className="flex flex-col gap-2 sm:flex-row">
          {MODES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => { setMode(id); setInputValue(''); setShowWork(false); }}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium text-left sm:text-center transition-colors ${
                mode === id
                  ? 'bg-terracotta text-cream'
                  : 'border border-sand text-warm-muted hover:border-terracotta/40 hover:text-bark'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Conversion input */}
        <NumInput
          label={modeConfig[mode].inputLabel}
          value={inputValue}
          onChange={setInputValue}
          placeholder={modeConfig[mode].placeholder}
        />

        {/* Result */}
        {renderResult()}

        {/* Show your work toggle */}
        {canCompute && (
          <button
            onClick={() => setShowWork((s) => !s)}
            className="text-sm text-terracotta underline underline-offset-2"
          >
            {showWork ? 'Hide working' : 'Show working'}
          </button>
        )}

        {/* Prompt if gauge not set */}
        {!hasGauge && hasInput && (
          <p className="text-sm text-warm-muted">
            Fill in both gauges above to see the result.
          </p>
        )}
      </div>
    </div>
  );
}
