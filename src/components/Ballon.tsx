import Image from 'next/image';

type BallonProps = {
  text: string;
  style?: React.CSSProperties;
  mirrored?: boolean;
};

const Ballon = ({ text, style, mirrored = false }: BallonProps) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;
  const ballonWidth = isMobile ? 70 : 240;
  const ballonHeight = isMobile ? 100 : 360;

  return (
    <div
      style={{
        position: 'absolute',
        width: ballonWidth,
        height: ballonHeight,
        ...style,
        pointerEvents: 'none',
      }}
    >
      <Image
        src="/images/ballon.png"
        alt="Ballon"
        width={ballonWidth}
        height={ballonHeight}
        className="pixelated"
        style={{
          imageRendering: 'pixelated',
          position: 'absolute',
          top: 0,
          left: 0,
          transform: mirrored ? 'scaleX(-1)' : undefined, // spiegel alleen de afbeelding
        }}
        priority
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          textAlign: 'center',
          color: '#3a2f1b',
          fontFamily: "'Press Start 2P', system-ui, sans-serif",
          fontSize: isMobile ? '1rem' : '2.2rem',
          textShadow: '0 0 8px #fffbe8, 0 0 2px #d2b77c',
          zIndex: 21,
          pointerEvents: 'none',
          lineHeight: 1.2,
          wordBreak: 'break-word',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default Ballon;