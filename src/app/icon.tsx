import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#C4613E',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: '#FAF8F5',
            fontSize: 14,
            fontWeight: 900,
            letterSpacing: '-0.5px',
          }}
        >
          FMG
        </span>
      </div>
    ),
    { width: 32, height: 32 },
  );
}
