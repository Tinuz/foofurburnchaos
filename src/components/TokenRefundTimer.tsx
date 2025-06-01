import React, { useEffect, useState } from 'react';

type TokenRefundTimerProps = {
  burnTime: number;
  onDone?: () => void;
};

const TokenRefundTimer: React.FC<TokenRefundTimerProps> = ({ burnTime, onDone }) => {
  const [seconds, setSeconds] = useState(burnTime);

  useEffect(() => {
    setSeconds(burnTime);
    if (burnTime <= 0) return;
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          if (onDone) onDone();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [burnTime, onDone]);

  return (
    <div className="bg-[#fffbe8] border-2 border-[#d3a96c] rounded-lg px-4 py-2 shadow retro-modal text-[#3a2f1b] text-center text-sm font-bold"
      style={{ fontFamily: "'Press Start 2P', cursive" }}>
      Token refund in: <span className="text-[#cc3d3d]">{seconds}s</span>
    </div>
  );
};

export default TokenRefundTimer;