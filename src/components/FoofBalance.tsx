import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import Image from 'next/image';

// Zet hier het mint address van de $FOOF token
const FOOF_MINT = 'J5k8QwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw'; // <-- Vervang door echte mint!

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
      className="fixed right-4 z-30 flex items-center bg-white/90 rounded-full px-4 py-2 shadow-lg border border-yellow-300"
      style={{ bottom: '4rem' }}
    >
      <Image
        src="/images/coin.png"
        alt="$FOOF"
        width={28}
        height={28}
        className="mr-2"
        style={{ imageRendering: 'pixelated' }}
      />
      <span className="font-bold text-yellow-700" style={{ fontFamily: "'Press Start 2P', monospace" }}>
        {displayBalance} $FOOF
      </span>
      {isDummy && (
        <span className="ml-2 text-xs text-gray-500">(dummy tokens)</span>
      )}
    </div>
  );
};

export default FoofBalance;