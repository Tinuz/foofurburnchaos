import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import Image from 'next/image';

type FoofBalanceProps = {
  balance: number | null;
  isDummy: boolean;
  inserted?: number;
};

const FoofBalance = ({ balance, isDummy, inserted = 0 }: FoofBalanceProps) => {
  if (balance === null) return null;
  const displayBalance = Math.max(0, balance - inserted);

  return (
    <div
      className="
        fixed
        right-2 bottom-2
        md:right-6 md:bottom-6
        z-30
        flex items-center
        bg-[rgba(255,247,224,0.95)]
        rounded-xl
        shadow-lg
        px-3 py-2
        md:px-5 md:py-3
        min-w-[100px] md:min-w-[120px]
        font-mono
      "
      style={{
        fontFamily: "'Press Start 2P', 'VT323', monospace",
        boxShadow: "0 4px 24px #d2b77c55",
      }}
    >
      <Image
        src="/images/coin.png"
        alt="$FOOF"
        width={36}
        height={36}
        className="mr-2 md:mr-3 md:w-12 md:h-12"
        style={{ imageRendering: "pixelated" }}
        priority
      />
      <div>
        <div className="text-[11px] md:text-[13px] font-bold" style={{ color: "#3a2f1b" }}>
          Your balance
        </div>
        <div className="text-[15px] md:text-[18px] font-bold flex items-baseline" style={{ color: "#cc3d3d" }}>
          {displayBalance}
          <span className="ml-1 text-[12px] md:text-[14px]" style={{ color: "#3a2f1b" }}>$FOOF</span>
        </div>
        {isDummy && (
          <div className="text-[10px] text-gray-500">(dummy tokens)</div>
        )}
      </div>
    </div>
  );
};

export default FoofBalance;