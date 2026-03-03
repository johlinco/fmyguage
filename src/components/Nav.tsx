'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tools = [
  { href: '/gauge', label: 'Gauge Translator' },
  { href: '/shaping', label: 'Shaping' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="bg-bark text-cream px-4 py-3 flex items-center gap-6">
      <Link
        href="/"
        className="text-lg font-semibold tracking-tight text-cream hover:text-sand transition-colors shrink-0"
      >
        KnitShift
      </Link>
      <div className="flex items-center gap-1 overflow-x-auto">
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
    </nav>
  );
}
