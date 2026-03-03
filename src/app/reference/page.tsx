const NEEDLE_SIZES = [
  { us: '0', mm: '2.0', uk: '14' },
  { us: '1', mm: '2.25', uk: '13' },
  { us: '1.5', mm: '2.5', uk: '—' },
  { us: '2', mm: '2.75', uk: '12' },
  { us: '2.5', mm: '3.0', uk: '11' },
  { us: '3', mm: '3.25', uk: '10' },
  { us: '4', mm: '3.5', uk: '—' },
  { us: '5', mm: '3.75', uk: '9' },
  { us: '6', mm: '4.0', uk: '8' },
  { us: '7', mm: '4.5', uk: '7' },
  { us: '8', mm: '5.0', uk: '6' },
  { us: '9', mm: '5.5', uk: '5' },
  { us: '10', mm: '6.0', uk: '4' },
  { us: '10.5', mm: '6.5', uk: '3' },
  { us: '11', mm: '8.0', uk: '0' },
  { us: '13', mm: '9.0', uk: '00' },
  { us: '15', mm: '10.0', uk: '000' },
  { us: '17', mm: '12.0', uk: '—' },
  { us: '19', mm: '15.0', uk: '—' },
  { us: '35', mm: '19.0', uk: '—' },
  { us: '50', mm: '25.0', uk: '—' },
];

const YARN_WEIGHTS = [
  { name: 'Lace', category: '0', aliases: 'Thread, Cobweb', sts4in: '33–40', needle: '1.5–2.25 mm' },
  { name: 'Fingering', category: '1', aliases: 'Sock, Baby', sts4in: '27–32', needle: '2.25–3.25 mm' },
  { name: 'Sport', category: '2', aliases: 'Baby', sts4in: '23–26', needle: '3.25–3.75 mm' },
  { name: 'DK', category: '3', aliases: 'Light Worsted', sts4in: '21–24', needle: '3.75–4.5 mm' },
  { name: 'Worsted', category: '4', aliases: 'Afghan, Aran', sts4in: '16–20', needle: '4.5–5.5 mm' },
  { name: 'Bulky', category: '5', aliases: 'Chunky, Craft', sts4in: '12–15', needle: '5.5–8 mm' },
  { name: 'Super Bulky', category: '6', aliases: 'Roving', sts4in: '7–11', needle: '8–12.75 mm' },
  { name: 'Jumbo', category: '7', aliases: 'Roving', sts4in: '6 or fewer', needle: '12.75 mm+' },
];

const EASE = [
  { garment: 'Fitted top / tank', ease: '−2" to 0"', note: 'Negative ease for stretch fabrics' },
  { garment: 'Standard sweater', ease: '+2" to 4"', note: 'Classic fit' },
  { garment: 'Relaxed sweater', ease: '+4" to 8"', note: 'Oversized / boxy' },
  { garment: 'Cardigan', ease: '+3" to 5"', note: 'Worn over other layers' },
  { garment: 'Hat', ease: '−2" to −1"', note: 'Measured against head circumference' },
  { garment: 'Socks', ease: '−1" to −0.5"', note: 'Measured against foot circumference' },
  { garment: 'Mittens', ease: '−1" to 0"', note: 'Measured against hand circumference' },
  { garment: 'Fingerless mitts', ease: '0" to +0.5"', note: '' },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-bark border-b border-sand pb-2">{children}</h2>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left text-xs font-semibold uppercase tracking-wide text-warm-muted pb-2 pr-4">
      {children}
    </th>
  );
}

function Td({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <td className={`py-2 pr-4 text-sm ${muted ? 'text-warm-muted' : 'text-bark'}`}>
      {children}
    </td>
  );
}

export default function ReferencePage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-bark">Quick Reference</h1>
        <p className="mt-1 text-warm-muted">
          Common conversions and standards knitters look up constantly.
        </p>
      </div>

      {/* Needle sizes */}
      <section className="space-y-4">
        <SectionHeading>Needle sizes</SectionHeading>
        <div className="rounded-xl border border-sand bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full px-5 py-4 border-collapse">
              <thead>
                <tr className="border-b border-sand px-5">
                  <Th>US</Th>
                  <Th>Metric (mm)</Th>
                  <Th>UK / Canada</Th>
                </tr>
              </thead>
              <tbody>
                {NEEDLE_SIZES.map((n) => (
                  <tr key={n.us} className="border-b border-sand/50 last:border-0 hover:bg-cream transition-colors">
                    <Td>{n.us}</Td>
                    <Td>{n.mm} mm</Td>
                    <Td muted={n.uk === '—'}>{n.uk}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Yarn weights */}
      <section className="space-y-4">
        <SectionHeading>Yarn weights</SectionHeading>
        <p className="text-sm text-warm-muted">
          Gauge ranges are for stockinette on recommended needles, measured over 4 inches.
        </p>
        <div className="rounded-xl border border-sand bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-sand">
                  <Th>Weight</Th>
                  <Th>Also called</Th>
                  <Th>Sts / 4"</Th>
                  <Th>Needle</Th>
                </tr>
              </thead>
              <tbody>
                {YARN_WEIGHTS.map((y) => (
                  <tr key={y.name} className="border-b border-sand/50 last:border-0 hover:bg-cream transition-colors">
                    <Td>
                      <span className="font-medium">{y.name}</span>
                      <span className="ml-1.5 text-xs text-warm-muted">#{y.category}</span>
                    </Td>
                    <Td muted>{y.aliases}</Td>
                    <Td>{y.sts4in}</Td>
                    <Td muted>{y.needle}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Ease */}
      <section className="space-y-4">
        <SectionHeading>Ease recommendations</SectionHeading>
        <p className="text-sm text-warm-muted">
          Ease = finished garment measurement minus body measurement. These are general
          guidelines — personal preference varies.
        </p>
        <div className="rounded-xl border border-sand bg-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-sand">
                  <Th>Garment</Th>
                  <Th>Typical ease</Th>
                  <Th>Notes</Th>
                </tr>
              </thead>
              <tbody>
                {EASE.map((e) => (
                  <tr key={e.garment} className="border-b border-sand/50 last:border-0 hover:bg-cream transition-colors">
                    <Td>{e.garment}</Td>
                    <Td>
                      <span className={`font-medium ${e.ease.startsWith('−') ? 'text-terracotta' : 'text-sage'}`}>
                        {e.ease}
                      </span>
                    </Td>
                    <Td muted>{e.note || '—'}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
