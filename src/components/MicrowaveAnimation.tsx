import React from 'react';
import Image from 'next/image';

type MicrowaveAnimationProps = {
  isBurning: boolean;
  size?: number;
};

const MicrowaveAnimation: React.FC<MicrowaveAnimationProps> = ({ isBurning, size = 180 }) => (
  <div className="flex flex-col items-center">
    <Image
      src="/images/microwave.png"
      alt="Microwave"
      width={size}
      height={size * 0.66}
      className={`pixelated drop-shadow-lg transition-transform duration-300 ${isBurning ? 'animate-shake-micro' : ''}`}
      style={{ imageRendering: 'pixelated' }}
      priority
    />
    {isBurning && (
      <div className="mt-2 text-[#cc3d3d] retro-modal text-xs font-bold" style={{ fontFamily: "'Press Start 2P', cursive" }}>
        Burning...
      </div>
    )}
    <style jsx global>{`
      @keyframes shake-micro {
        0% { transform: translateX(0); }
        10% { transform: translateX(-8px); }
        20% { transform: translateX(8px); }
        30% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        50% { transform: translateX(-4px); }
        60% { transform: translateX(4px); }
        70% { transform: translateX(-2px); }
        80% { transform: translateX(2px); }
        90% { transform: translateX(0); }
        100% { transform: translateX(0); }
      }
      .animate-shake-micro {
        animation: shake-micro 0.6s cubic-bezier(.36,.07,.19,.97) both infinite;
      }
    `}</style>
  </div>
);

export default MicrowaveAnimation;