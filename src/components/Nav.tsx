'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePwa } from './PwaProvider';

const tools = [
  { href: '/gauge', label: 'Gauge Translator' },
  { href: '/shaping', label: 'Shaping' },
  { href: '/size', label: 'What Size?' },
  { href: '/stitch-multiple', label: 'Stitch Multiple' },
  { href: '/yarn', label: 'Yarn Estimator' },
  { href: '/reference', label: 'Quick Reference' },
];

export default function Nav() {
  const pathname = usePathname();
  const { canInstall, install, isStandalone } = usePwa();

  return (
    <nav className="bg-bark text-cream px-4 py-3 flex items-center gap-3">
      <Link
        href="/"
        className="text-lg font-semibold tracking-tight text-cream hover:text-sand transition-colors shrink-0 flex items-center gap-2"
      >
        F My Gauge
        {/* Offline dot — always visible, signals the app works offline */}
        <span
          title="Works offline"
          className="h-2 w-2 rounded-full bg-sage shrink-0"
        />
      </Link>

      <div className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0">
        {tools.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? 'bg-terracotta text-cream'
                  : 'text-sand hover:text-cream hover:bg-white/10'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Install button — only shown when browser offers the prompt */}
      {canInstall && !isStandalone && (
        <button
          onClick={install}
          className="shrink-0 flex items-center gap-1.5 rounded-full border border-sand/40 px-3 py-1.5 text-xs font-medium text-sand hover:border-sand hover:text-cream transition-colors whitespace-nowrap"
        >
          <span>⬇</span> Install
        </button>
      )}
    </nav>
  );
}
