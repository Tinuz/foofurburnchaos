import React, { useEffect, useState } from 'react';

type MagnetronTimerProps = {
  seconds: number;
  onDone: () => void;
};

const MagnetronTimer: React.FC<MagnetronTimerProps> = ({ seconds, onDone }) => {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    setTime(seconds);
  }, [seconds]);

  useEffect(() => {
    if (time === 0) {
      onDone();
      return;
    }
    const interval = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [time, onDone]);

  return (
    <div className="flex flex-col items-center">
      <span
        style={{
          fontFamily: "'Press Start 2P', 'VT323', monospace",
          color: '#cc3d3d',
          fontSize: '1.2rem',
          textShadow: '0 0 8px #fff7e0',
        }}
      >
        Burning in progress...
      </span>
      <div
        className="mt-2 px-4 py-2 rounded retro-modal"
        style={{
          background: 'rgba(255,255,255,0.15)',
          fontFamily: "'Press Start 2P', 'VT323', monospace",
          color: '#3a2f1b',
          fontSize: '1.4rem',
          textShadow: '0 0 8px #fff7e0',
        }}
      >
        {time}s
      </div>
    </div>
  );
};

export default MagnetronTimer;