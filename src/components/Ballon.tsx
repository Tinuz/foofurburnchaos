import { useEffect, useState } from 'react';
import Image from 'next/image';

type BallonProps = {
  text: string;
  style?: React.CSSProperties;
  mirrored?: boolean;
};

const Ballon = ({ text, style, mirrored = false }: BallonProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 600);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        width: 240,
        height: 360,
        ...style,
        pointerEvents: 'none',
      }}
    >
      <Image
        src="/images/ballon.png"
        alt="Ballon"
        width={240}
        height={360}
        className="pixelated"
        style={{
          imageRendering: 'pixelated',
          position: 'absolute',
          top: 0,
          left: 0,
          transform: mirrored ? 'scaleX(-1)' : undefined,
          width: '100%',
          height: '100%',
        }}
        priority
      />
      <div
        style={{
          position: 'absolute',
          top: isMobile ? '18%': '40%',
          left: isMobile ? '20%' : '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          textAlign: 'center',
          color: '#3a2f1b',
          fontFamily: "'Press Start 2P', system-ui, sans-serif",
          fontSize: isMobile
      ? 'clamp(0.7rem, 3vw, 1rem)'
      : 'clamp(1.2rem, 2.5vw, 2.2rem)',
    textShadow: '0 0 8px #fffbe8, 0 0 2px #d2b77c',
          zIndex: 21,
          pointerEvents: 'none',
          lineHeight: 1.2,
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
    whiteSpace: 'pre-line',
    maxHeight: '80%',
    overflowY: 'auto',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default Ballon;