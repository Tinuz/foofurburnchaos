import Image from 'next/image';

type BallonProps = {
  text: string;
  style?: React.CSSProperties;
  mirrored?: boolean;
};

const Ballon = ({ text, style, mirrored = false }: BallonProps) => (
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
        fontSize: '2.2rem',
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

export default Ballon;