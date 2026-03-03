'use client';

import { useState } from 'react';
import { calcMultiple } from '@/lib/stitch-multiple-math';
import { type Unit, swatchLabel } from '@/lib/gauge-math';

function NumInput({
  label,
  hint,
  value,
  onChange,
  placeholder,
  allowNegative,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  allowNegative?: boolean;
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
        min={allowNegative ? undefined : '0'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? '0'}
        className="w-full rounded-lg border border-sand bg-surface px-3 py-3 text-lg text-bark placeholder:text-sand focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
      />
    </div>
  );
}

export default function StitchMultiplePage() {
  const [unit, setUnit] = useState<Unit>('in');
  const [target, setTarget] = useState('');
  const [multiple, setMultiple] = useState('');
  const [offset, setOffset] = useState('0');
  const [gaugeSts, setGaugeSts] = useState('');

  const tgt = parseInt(target, 10);
  const mult = parseInt(multiple, 10);
  const off = parseInt(offset, 10) || 0;
  const gauge = parseInt(gaugeSts, 10);

  const canCompute = tgt > 0 && mult > 1;
  const hasGauge = gauge > 0;

  const result = canCompute
    ? calcMultiple(tgt, mult, off, hasGauge ? gauge : undefined, unit)
    : null;

  const swatch = swatchLabel(unit);
  const unitLabel = unit === 'in' ? '"' : ' cm';

  const multipleLabel =
    off === 0
      ? `multiple of ${mult || '?'}`
      : `multiple of ${mult || '?'} + ${off}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bark">Stitch Multiple Adjuster</h1>
        <p className="mt-1 text-warm-muted">
          Find the nearest stitch counts that work with your stitch pattern repeat.
        </p>
      </div>

      {/* Target + multiple */}
      <div className="rounded-xl border border-sand bg-surface p-5 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-warm-muted">
          Stitch count
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <NumInput
            label="Target stitch count"
            value={target}
            onChange={setTarget}
            placeholder="e.g. 100"
          />
          <NumInput
            label="Stitch repeat"
            hint='(the "multiple of X" number)'
            value={multiple}
            onChange={setMultiple}
            placeholder="e.g. 6"
          />
          <NumInput
            label="Offset"
            hint='(the "+ Y" part, or 0)'
            value={offset}
            onChange={setOffset}
            placeholder="0"
          />
        </div>
        {mult > 1 && (
          <p className="text-sm text-warm-muted">
            Pattern requires a <span className="font-medium text-bark">{multipleLabel}</span>.
          </p>
        )}
      </div>

      {/* Optional gauge */}
      <div className="rounded-xl border border-sand bg-surface p-5 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-warm-muted">
          Gauge <span className="normal-case font-normal text-warm-muted/70">(optional — to show width difference)</span>
        </h2>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-warm-muted">Measured</span>
          <div className="flex rounded-lg border border-sand bg-cream overflow-hidden">
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
        <NumInput
          label={`Your stitch gauge (sts ${swatch})`}
          value={gaugeSts}
          onChange={setGaugeSts}
          placeholder="e.g. 20"
        />
      </div>

      {/* Result */}
      {result && (
        <>
          {result.exactMatch ? (
            <div className="rounded-xl border-2 border-sage/30 bg-sage/5 px-5 py-4">
              <p className="text-lg font-semibold text-bark">
                {tgt} sts is already a {multipleLabel}.
              </p>
              <p className="mt-1 text-sm text-warm-muted">No adjustment needed.</p>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-terracotta/30 bg-terracotta/5 px-5 py-5 space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-warm-muted">
                Nearest valid counts
              </p>
              <div className="grid grid-cols-2 gap-4">
                {/* Lower */}
                <div className={`rounded-xl border px-4 py-4 space-y-1 ${result.lower ? 'border-sand bg-surface' : 'border-sand/40 bg-cream opacity-40'}`}>
                  <p className="text-xs uppercase tracking-wide text-warm-muted">Below target</p>
                  <p className="text-3xl font-bold text-bark">
                    {result.lower ?? '—'}
                    <span className="text-sm font-normal text-warm-muted ml-1">sts</span>
                  </p>
                  {result.lower && (
                    <p className="text-sm text-warm-muted">
                      {result.lower - tgt} sts
                      {result.lowerWidthDiff !== null && (
                        <span className="ml-1">({result.lowerWidthDiff}{unitLabel})</span>
                      )}
                    </p>
                  )}
                </div>
                {/* Upper */}
                <div className="rounded-xl border border-sand bg-surface px-4 py-4 space-y-1">
                  <p className="text-xs uppercase tracking-wide text-warm-muted">Above target</p>
                  <p className="text-3xl font-bold text-bark">
                    {result.upper}
                    <span className="text-sm font-normal text-warm-muted ml-1">sts</span>
                  </p>
                  <p className="text-sm text-warm-muted">
                    +{result.upper - tgt} sts
                    {result.upperWidthDiff !== null && (
                      <span className="ml-1">(+{result.upperWidthDiff}{unitLabel})</span>
                    )}
                  </p>
                </div>
              </div>
              {!hasGauge && (
                <p className="text-xs text-warm-muted">
                  Add your gauge above to see the width difference in {unit === 'in' ? 'inches' : 'cm'}.
                </p>
              )}
            </div>
          )}
        </>
      )}

      {!canCompute && (target || multiple) && (
        <p className="text-sm text-warm-muted">
          Enter a target stitch count and a repeat of 2 or more to see results.
        </p>
      )}
    </div>
  );
}
