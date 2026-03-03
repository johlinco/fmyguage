import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#C4613E',
          borderRadius: 36,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <span
          style={{
            color: '#FAF8F5',
            fontSize: 62,
            fontWeight: 900,
            letterSpacing: '-2px',
            lineHeight: 1,
          }}
        >
          FMG
        </span>
        <span
          style={{
            color: '#FAF8F5',
            fontSize: 22,
            fontWeight: 400,
            opacity: 0.75,
            lineHeight: 1,
          }}
        >
          gauge
        </span>
      </div>
    ),
    { width: 180, height: 180 },
  );
}
