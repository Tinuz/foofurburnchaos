import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import Image from 'next/image';

// Zet hier het mint address van de $FOOF token
const FOOF_MINT = 'J5k8QwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw'; // <-- Vervang door echte mint!

type FoofBalanceProps = {
  onInsert?: () => void;
  inserted?: number;
};

const FoofBalance = ({ inserted = 0 }: FoofBalanceProps) => {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isDummy, setIsDummy] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      setIsDummy(false);
      return;
    }
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const getBalance = async () => {
      try {
        // SPL Token account ophalen
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          mint: new PublicKey(FOOF_MINT),
        });
        const amount =
          tokenAccounts.value[0]?.account.data.parsed.info.tokenAmount.uiAmount || 0;
        if (amount === 0) {
          setBalance(10000);
          setIsDummy(true);
        } else {
          setBalance(amount);
          setIsDummy(false);
        }
      } catch {
        setBalance(10000);
        setIsDummy(true);
      }
    };
    getBalance();
  }, [publicKey]);

  if (!connected || !publicKey) return null;

  // Pas de getoonde balance aan met het aantal inserted tokens
  const displayBalance = balance !== null ? Math.max(0, balance - inserted) : '...';

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