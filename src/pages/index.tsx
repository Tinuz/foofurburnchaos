import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import TokenRefundTimer from '../components/TokenRefundTimer';
import MagnetronTimer from '../components/MagnetronTimer';
import WalletConnect from '../components/WalletConnect';
import Leaderboard from '../components/Leaderboard';

const BURN_TIME = 5;
const FEEDBACK_TIME = 3000;
const REFUND_TIME = 30;

const Home = () => {
  const [phase, setPhase] = useState<'idle' | 'burning' | 'feedback' | 'refund'>('idle');
  const [timerKey, setTimerKey] = useState(0);
  const [burnedTokens, setBurnedTokens] = useState(0);

  const handleBurn = () => {
    setPhase('burning');
    setTimerKey((k) => k + 1);
  };

  const handleMagnetronDone = () => {
    setPhase('feedback');
    setBurnedTokens((n) => n + 1);
    setTimeout(() => {
      setPhase('refund');
    }, FEEDBACK_TIME);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between font-sans relative overflow-x-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #d2b77c 60%, #8c6b3f 100%)',
      }}
    >
      {/* WalletConnect button rechtsboven */}
      <div className="absolute right-4 top-4 z-20">
        <WalletConnect />
      </div>

      <Header />

      <header className="w-full flex flex-col items-center pt-4 pb-2 relative">
        <h1
          className="text-3xl md:text-5xl font-bold tracking-widest text-center mb-2"
          style={{
            fontFamily: "'Press Start 2P', 'VT323', monospace",
            color: '#3a2f1b',
            textShadow: '0 0 16px #fff7e0, 0 0 32px #d2b77c',
            letterSpacing: '0.12em',
          }}
        >
          Foofur Burn Chaos
        </h1>
        <div className="flex flex-col items-center w-full">
          <Image
            src="/images/microwave.png"
            alt="Microwave"
            width={320}
            height={200}
            className={`pixelated drop-shadow-lg my-2 ${phase === 'burning' ? 'animate-shake-micro' : ''}`}
            style={{
              imageRendering: 'pixelated',
              maxWidth: '90vw',
              height: 'auto',
              filter: 'drop-shadow(0 0 32px #d3a96c88)',
            }}
            priority
          />
          <p
            className="text-base md:text-lg text-center mb-1"
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              color: '#3a2f1b',
              textShadow: '0 0 8px #fff7e0',
              letterSpacing: '0.04em',
            }}
          >
            Insert $FOOF. Press Burn. Hope for Chaos.
          </p>
        </div>
      </header>

      {/* Magnetron burn-timer */}
      {phase === 'burning' && (
        <div className="w-full flex flex-col items-center py-4">
          <MagnetronTimer key={timerKey} seconds={BURN_TIME} onDone={handleMagnetronDone} />
        </div>
      )}

      {/* Burn feedback direct onder header */}
      {phase === 'feedback' && (
        <div className="w-full flex flex-col items-center py-4">
          <div
            className="shadow-lg px-6 py-4 text-center retro-modal"
            style={{
              fontFamily: "'Press Start 2P', 'VT323', monospace",
              color: '#3a2f1b',
              textShadow: '0 0 8px #fff7e0',
              minWidth: 200,
              maxWidth: 320,
              //background: 'radial-gradient(ellipse at 50% 30%, #d2b77c 60%, #8c6b3f 100%)',
              border: 'none',
            }}
          >
            <div className="flex justify-center mb-2 gap-2">
              <Image
                src="/images/coin.png"
                alt="Foof Coin"
                width={36}
                height={36}
                className="pixelated animate-bounce"
              />
              <Image
                src="/images/cookie.png"
                alt="Bone"
                width={36}
                height={36}
                className="pixelated animate-bounce"
              />
            </div>
            <div className="mb-1 text-base">Burn complete!</div>
            <div className="text-[#cc3d3d] text-xs">Chaos achieved. 🍪</div>
          </div>
        </div>
      )}

      {/* Refund timer direct onder header */}
      {phase === 'refund' && (
        <div className="w-full flex flex-col items-center py-4">
          <TokenRefundTimer
            key={timerKey + 1000}
            burnTime={REFUND_TIME}
            onDone={() => setPhase('idle')}
          />
        </div>
      )}

      {/* Burn Action */}
      <main className="flex flex-col items-center w-full flex-1 justify-end pb-8">
        <button
          className="relative group focus:outline-none mt-2 mb-2"
          style={{
            border: 'none',
            background: 'none',
            padding: 0,
          }}
          onClick={handleBurn}
          aria-label="Burn"
          disabled={phase !== 'idle'}
        >
          <Image
            src="/images/burn.png"
            alt="Burn"
            width={160}
            height={80}
            className="transition-transform duration-200 group-hover:scale-110"
            style={{
              imageRendering: 'pixelated',
              opacity: phase !== 'idle' ? 0.7 : 1,
              cursor: phase !== 'idle' ? 'not-allowed' : 'pointer',
              display: 'block',
              borderRadius: '8px',
              //boxShadow: '0 0 2px 2px #cc3d3d',
            }}
            priority
          />
        </button>

        {/* Leaderboard direct onder de burn button */}
        <Leaderboard
          burnedTokens={burnedTokens}
        />
      </main>

      {/* Footer */}
      <footer
        className="w-full py-5 px-4 mt-auto flex flex-col md:flex-row items-center justify-between text-xs"
        style={{
          color: '#3a2f1b',
          opacity: 0.85,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div>
          <span className="font-bold">Disclaimer:</span> Not financial advice. Probably not even a game.
        </div>
        <div className="flex gap-3 mt-2 md:mt-0">
          <Link
            href="https://foofurskatje-3uuf.vercel.app/"
            className="underline hover:text-[#cc3d3d]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Main Site
          </Link>
          <Link
            href="https://twitter.com/foofur"
            className="underline hover:text-[#cc3d3d]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </Link>
        </div>
      </footer>

      {/* Extra styling */}
      <style jsx global>{`
        .pixelated {
          image-rendering: pixelated;
        }
        .retro-modal {
          font-family: 'Press Start 2P', 'VT323', monospace !important;
        }
        .animate-bounce {
          animation: bounce 0.8s infinite alternate;
        }
        @keyframes bounce {
          0% { transform: translateY(0);}
          100% { transform: translateY(-18px);}
        }
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
        @media (max-width: 600px) {
          h1 { font-size: 1.3rem !important; }
          .retro-modal { min-width: 160px !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;