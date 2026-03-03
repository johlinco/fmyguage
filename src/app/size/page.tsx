'use client';

import { useState, useId } from 'react';
import { calcSizes, type PatternSize } from '@/lib/size-math';
import { type Unit, swatchLabel } from '@/lib/gauge-math';

function NumInput({
  label,
  value,
  onChange,
  placeholder,
  small,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  small?: boolean;
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
        className={`w-full rounded-lg border border-sand bg-surface px-3 text-bark placeholder:text-sand focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 ${small ? 'py-2 text-base' : 'py-3 text-lg'}`}
      />
    </div>
  );
}

let nextId = 1;
function makeSize(): PatternSize {
  return { id: String(nextId++), name: '', measurement: 0 };
}

function makeDefaultSizes(): PatternSize[] {
  return [
    { id: String(nextId++), name: 'S', measurement: 0 },
    { id: String(nextId++), name: 'M', measurement: 0 },
    { id: String(nextId++), name: 'L', measurement: 0 },
  ];
}

export default function SizePage() {
  const uid = useId();
  const [unit, setUnit] = useState<Unit>('in');
  const [patternSts, setPatternSts] = useState('');
  const [yourSts, setYourSts] = useState('');
  const [target, setTarget] = useState('');
  const [sizes, setSizes] = useState<PatternSize[]>(makeDefaultSizes);

  const swatch = swatchLabel(unit);
  const pSts = parseFloat(patternSts);
  const ySts = parseFloat(yourSts);
  const tgt = parseFloat(target);

  const hasGauge = pSts > 0 && ySts > 0;
  const hasTarget = tgt > 0;
  const validSizes = sizes.filter(
    (s) => s.name.trim() !== '' && s.measurement > 0,
  );
  const canCompute = hasGauge && hasTarget && validSizes.length > 0;

  const results = canCompute ? calcSizes(pSts, ySts, tgt, validSizes) : [];

  function updateSize(id: string, field: keyof PatternSize, value: string) {
    setSizes((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              [field]: field === 'measurement' ? parseFloat(value) || 0 : value,
            }
          : s,
      ),
    );
  }

  function removeSize(id: string) {
    setSizes((prev) => prev.filter((s) => s.id !== id));
  }

  const unitLabel = unit === 'in' ? '"' : ' cm';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bark">What Size Should I Knit?</h1>
        <p className="mt-1 text-warm-muted">
          When your gauge is off, find which pattern size will fit best.
        </p>
      </div>

      {/* Unit toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-warm-muted">Measurements in</span>
        <div className="flex rounded-lg border border-sand bg-surface overflow-hidden">
          {(['in', 'cm'] as Unit[]).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                unit === u ? 'bg-bark text-cream' : 'text-warm-muted hover:text-bark'
              }`}
            >
              {u === 'in' ? 'inches' : 'cm'}
            </button>
          ))}
        </div>
      </div>

      {/* Gauge inputs */}
      <div className="rounded-xl border border-sand bg-surface p-5 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-warm-muted">Gauge</h2>
        <div className="grid grid-cols-2 gap-4">
          <NumInput
            label={`Pattern gauge (sts ${swatch})`}
            value={patternSts}
            onChange={setPatternSts}
            placeholder="20"
          />
          <NumInput
            label={`Your gauge (sts ${swatch})`}
            value={yourSts}
            onChange={setYourSts}
            placeholder="24"
          />
        </div>
      </div>

      {/* Target measurement */}
      <div className="rounded-xl border border-sand bg-surface p-5 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-warm-muted">
          Your target finished measurement
        </h2>
        <p className="text-sm text-warm-muted -mt-2">
          The actual finished width you want — your body measurement plus any ease you prefer.
        </p>
        <NumInput
          label={`Finished bust / width (${unit === 'in' ? 'inches' : 'cm'})`}
          value={target}
          onChange={setTarget}
          placeholder={unit === 'in' ? 'e.g. 40' : 'e.g. 102'}
        />
      </div>

      {/* Pattern sizes */}
      <div className="rounded-xl border border-sand bg-surface p-5 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-warm-muted">
          Pattern sizes
        </h2>
        <p className="text-sm text-warm-muted -mt-2">
          Enter the finished measurements from your pattern&apos;s size chart.
        </p>
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_2fr_auto] gap-2 text-xs font-medium uppercase tracking-wide text-warm-muted px-1">
            <span>Size name</span>
            <span>Finished measurement</span>
            <span />
          </div>
          {sizes.map((s) => (
            <div key={s.id} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-end">
              <input
                type="text"
                value={s.name}
                onChange={(e) => updateSize(s.id, 'name', e.target.value)}
                placeholder="S"
                className="rounded-lg border border-sand bg-cream px-3 py-2 text-base text-bark placeholder:text-sand focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
              />
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={s.measurement || ''}
                  onChange={(e) => updateSize(s.id, 'measurement', e.target.value)}
                  placeholder={unit === 'in' ? '38' : '97'}
                  className="w-full rounded-lg border border-sand bg-cream px-3 py-2 text-base text-bark placeholder:text-sand focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20 pr-10"
                  id={`${uid}-size-${s.id}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-warm-muted pointer-events-none">
                  {unitLabel}
                </span>
              </div>
              <button
                onClick={() => removeSize(s.id)}
                className="h-9 w-9 rounded-lg border border-sand text-warm-muted hover:border-terracotta/40 hover:text-terracotta transition-colors flex items-center justify-center text-lg"
                aria-label="Remove size"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setSizes((prev) => [...prev, makeSize()])}
          className="text-sm text-terracotta underline underline-offset-2"
        >
          + Add size
        </button>
      </div>

      {/* Results */}
      {canCompute && results.length > 0 && (
        <div className="rounded-xl border border-sand bg-surface p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-warm-muted">
            Results
          </h2>
          <div className="space-y-2">
            {results.map((r) => (
              <div
                key={r.id}
                className={`rounded-xl px-4 py-3 flex items-center gap-4 ${
                  r.isRecommended
                    ? 'border-2 border-terracotta/40 bg-terracotta/5'
                    : 'border border-sand bg-cream'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-bark text-lg">{r.name}</span>
                    {r.isRecommended && (
                      <span className="text-xs font-medium bg-terracotta text-cream px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-warm-muted mt-0.5">
                    Pattern says {r.patternMeasurement}{unitLabel} →{' '}
                    at your gauge:{' '}
                    <span className="font-semibold text-bark">
                      {r.actualMeasurement}{unitLabel}
                    </span>
                  </p>
                </div>
                <div className={`text-sm font-medium shrink-0 ${
                  r.diffFromTarget === 0
                    ? 'text-sage'
                    : Math.abs(r.diffFromTarget) <= (unit === 'in' ? 1 : 2.5)
                    ? 'text-warm-muted'
                    : 'text-terracotta'
                }`}>
                  {r.diffFromTarget > 0 ? '+' : ''}{r.diffFromTarget}{unitLabel} from target
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-warm-muted">
            Target: {tgt}{unitLabel} finished. Calculations based on stitch gauge ratio only.
          </p>
        </div>
      )}

      {!canCompute && (hasGauge || hasTarget || validSizes.length > 0) && (
        <p className="text-sm text-warm-muted">
          Fill in both gauges, your target measurement, and at least one pattern size to see results.
        </p>
      )}
    </div>
  );
}
