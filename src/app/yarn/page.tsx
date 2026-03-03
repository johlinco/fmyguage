'use client';

import { useState } from 'react';
import { calcYarn } from '@/lib/yarn-math';
import { swatchLabel, type Unit } from '@/lib/gauge-math';

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

function GaugeBlock({
  label,
  sts,
  rows,
  onSts,
  onRows,
  swatch,
}: {
  label: string;
  sts: string;
  rows: string;
  onSts: (v: string) => void;
  onRows: (v: string) => void;
  swatch: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-warm-muted">{label}</p>
      <NumInput label={`Sts ${swatch}`} value={sts} onChange={onSts} placeholder="20" />
      <NumInput label={`Rows ${swatch}`} value={rows} onChange={onRows} placeholder="28" />
    </div>
  );
}

export default function YarnPage() {
  const [unit, setUnit] = useState<Unit>('in');
  const [originalYardage, setOriginalYardage] = useState('');
  const [patternSts, setPatternSts] = useState('');
  const [patternRows, setPatternRows] = useState('');
  const [yourSts, setYourSts] = useState('');
  const [yourRows, setYourRows] = useState('');
  const [showWork, setShowWork] = useState(false);

  const swatch = swatchLabel(unit);
  const yardage = parseFloat(originalYardage);
  const pSts = parseFloat(patternSts);
  const pRows = parseFloat(patternRows);
  const ySts = parseFloat(yourSts);
  const yRows = parseFloat(yourRows);

  const canCompute = yardage > 0 && pSts > 0 && pRows > 0 && ySts > 0 && yRows > 0;
  const result = canCompute ? calcYarn(yardage, pSts, pRows, ySts, yRows) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bark">Yarn Quantity Estimator</h1>
        <p className="mt-1 text-warm-muted">
          Substituting a different yarn weight? Estimate how much you&apos;ll need.
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
                unit === u ? 'bg-bark text-cream' : 'text-warm-muted hover:text-bark'
              }`}
            >
              {u === 'in' ? 'per 4"' : 'per 10 cm'}
            </button>
          ))}
        </div>
      </div>

      {/* Original yardage */}
      <div className="rounded-xl border border-sand bg-surface p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-warm-muted mb-4">
          Pattern yardage
        </h2>
        <NumInput
          label="Total yards called for"
          value={originalYardage}
          onChange={setOriginalYardage}
          placeholder="e.g. 1200"
        />
      </div>

      {/* Gauge inputs */}
      <div className="rounded-xl border border-sand bg-surface p-5 space-y-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-warm-muted">Gauge</h2>
        <div className="grid grid-cols-2 gap-6">
          <GaugeBlock
            label="Pattern gauge"
            sts={patternSts}
            rows={patternRows}
            onSts={setPatternSts}
            onRows={setPatternRows}
            swatch={swatch}
          />
          <GaugeBlock
            label="Your gauge"
            sts={yourSts}
            rows={yourRows}
            onSts={setYourSts}
            onRows={setYourRows}
            swatch={swatch}
          />
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-xl border-2 border-terracotta/30 bg-terracotta/5 px-5 py-5 space-y-4">
          <p className="text-sm text-warm-muted">Estimated yardage needed:</p>
          <p className="text-5xl font-bold text-terracotta">
            {result.estimatedYardage.toLocaleString()}
            <span className="text-xl font-normal text-warm-muted ml-2">yards</span>
          </p>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-surface border border-sand px-3 py-1 text-warm-muted">
              {result.percentChange >= 0 ? '+' : ''}{result.percentChange}% vs original
            </span>
            <span className="rounded-full bg-surface border border-sand px-3 py-1 text-warm-muted">
              +{result.bufferYards} yds safety buffer
            </span>
          </div>

          <div className="rounded-lg border border-sand bg-surface px-4 py-3 text-sm text-warm-muted">
            <strong className="text-bark">Note:</strong> This is an estimate. Yarn thickness,
            stitch texture, and fiber can all affect actual yardage. Buy an extra skein
            if you can.
          </div>

          {showWork && (
            <div className="pt-3 border-t border-sand space-y-1">
              <p className="font-mono text-sm text-warm-muted">pattern:  {pSts} sts × {pRows} rows = {pSts * pRows}</p>
              <p className="font-mono text-sm text-warm-muted">yours:    {ySts} sts × {yRows} rows = {ySts * yRows}</p>
              <p className="font-mono text-sm text-warm-muted">ratio  =  {ySts * yRows} ÷ {pSts * pRows} = {result.ratio}</p>
              <p className="font-mono text-sm text-warm-muted">{yardage} × {result.ratio} = {result.exactYardage} yds (exact)</p>
              <p className="font-mono text-sm text-warm-muted">+ 10% buffer = <strong>{result.estimatedYardage} yds</strong></p>
            </div>
          )}

          <button
            onClick={() => setShowWork((s) => !s)}
            className="text-sm text-terracotta underline underline-offset-2"
          >
            {showWork ? 'Hide working' : 'Show working'}
          </button>
        </div>
      )}

      {!canCompute && (originalYardage || patternSts) && (
        <p className="text-sm text-warm-muted">
          Fill in the original yardage and both gauges (stitches and rows) to see the estimate.
        </p>
      )}
    </div>
  );
}
