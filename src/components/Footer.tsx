'use client';

import { usePwa } from './PwaProvider';

export default function Footer() {
  const { canInstall, install, isIos, isStandalone } = usePwa();

  return (
    <footer className="mt-12 border-t border-sand px-4 py-6 space-y-4">
      {/* Offline badge — always visible */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-full border border-sage/40 bg-sage/10 px-3 py-1 text-xs font-medium text-sage">
          <span className="h-1.5 w-1.5 rounded-full bg-sage" />
          Works offline
        </span>
        <span className="text-xs text-warm-muted">
          All calculators run locally — no internet needed after first load.
        </span>
      </div>

      {/* Android / desktop install prompt */}
      {canInstall && !isStandalone && (
        <div className="rounded-xl border border-sand bg-surface p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-bark">Add to Home Screen</p>
            <p className="text-xs text-warm-muted mt-0.5">
              Install F My Gauge for quick access — works just like an app.
            </p>
          </div>
          <button
            onClick={install}
            className="shrink-0 rounded-lg bg-terracotta px-4 py-2 text-sm font-medium text-cream hover:bg-terracotta/90 transition-colors"
          >
            Install
          </button>
        </div>
      )}

      {/* iOS install tip */}
      {isIos && !isStandalone && (
        <div className="rounded-xl border border-sand bg-surface p-4 space-y-1">
          <p className="text-sm font-medium text-bark">Add to Home Screen</p>
          <p className="text-xs text-warm-muted leading-relaxed">
            In Safari, tap the{' '}
            <span className="font-medium text-bark">Share</span> button (the box
            with an arrow), then tap{' '}
            <span className="font-medium text-bark">Add to Home Screen</span>.
            The app will open full-screen with no browser bar.
          </p>
        </div>
      )}

      {/* Already installed */}
      {isStandalone && (
        <p className="text-xs text-warm-muted">
          Running as installed app.
        </p>
      )}
    </footer>
  );
}
