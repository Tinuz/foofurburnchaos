import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import TokenRefundTimer from '../components/TokenRefundTimer';
import MagnetronTimer from '../components/MagnetronTimer';
import WalletConnect from '../components/WalletConnect';
import Leaderboard from '../components/Leaderboard';
import RewardModal from '../components/RewardModal';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import FoofBalance from '../components/FoofBalance';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import Ballon from '../components/Ballon';

const ANGEL_TEXTS = [
  "Woof!",
  "Be brave!",
  "Good luck!",
  "Insert $FOOF!",
  "Hold strong!",
  "Trust vibes!",
  "No rugs!",
  "Microwave hope!",
  "Stake with love!",
  "Vibe check!",
  "HODL honor!",
  "Be kind!",
  "Toast wisely!",
  "Stay fluffy!",
  "Resist chaos!",
  "Patience, pup.",
  "Airdrop joy!",
  "Moon later!",
  "Bark softly.",
  "You got this!"
];

const DUVEL_TEXTS = [
  "Burn it all!",
  "Rug soon?",
  "Chaos time!",
  "More $FOOF!",
  "Drain LP!",
  "Dump fast!",
  "Delete roadmap!",
  "Lie harder!",
  "Stake lies!",
  "Sell now!",
  "Blame devs!",
  "Vote beep!",
  "Launch scam!",
  "Pump rug!",
  "Hide funds!",
  "DAO schmao!",
  "Mint regret!",
  "Ignore chart!",
  "Scam vibes!",
  "Exit now!"
];

const BURN_TIME = 10;
const REFUND_TIME = 30;

const REWARDS = [
  { name: 'Empty Can', image: 'empty_can.png', rarity: 'common' },
  { name: 'Poo', image: 'poo.png', rarity: 'common' },
  { name: 'Keys', image: 'keys.png', rarity: 'uncommon' },
  { name: 'Shoe', image: 'shoe.png', rarity: 'uncommon' },
  { name: 'Sausages', image: 'sausges.png', rarity: 'rare' },
  { name: 'Coin', image: 'coin.png', rarity: 'rare' },
  { name: 'Cookie', image: 'cookie.png', rarity: 'legendary' },
];

function getRandomReward() {
  const roll = Math.random() * 100;
  let pool;
  if (roll < 60) {
    pool = REWARDS.filter(r => r.rarity === 'common');
  } else if (roll < 90) {
    pool = REWARDS.filter(r => r.rarity === 'uncommon');
  } else if (roll < 99.9) {
    pool = REWARDS.filter(r => r.rarity === 'rare');
  } else {
    pool = REWARDS.filter(r => r.rarity === 'legendary');
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

const FOOF_MINT = 'J5k8QwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw'; // <-- Vervang door echte mint!

const Home = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;

  const [phase, setPhase] = useState<'idle' | 'burning' | 'feedback' | 'refund'>('idle');
  const [timerKey, setTimerKey] = useState(0);
  const [burnedTokens, setBurnedTokens] = useState(0);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [reward, setReward] = useState<null | { name: string; image: string; rarity: string }>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [inserted, setInserted] = useState(0);
  const { width, height } = useWindowSize();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isDummy, setIsDummy] = useState(false);

// Kies random tekst of op basis van state
const [angelText, setAngelText] = useState(ANGEL_TEXTS[0]);
const [duvelText, setDuvelText] = useState(DUVEL_TEXTS[0]);

// Voor random tekst bijv. bij elke burn/insert:
const randomAngelText = () => setAngelText(ANGEL_TEXTS[Math.floor(Math.random() * ANGEL_TEXTS.length)]);
const randomDuvelText = () => setDuvelText(DUVEL_TEXTS[Math.floor(Math.random() * DUVEL_TEXTS.length)]);


  useEffect(() => {
    // Hier zou je de echte $FOOF balance ophalen, bijvoorbeeld via een API call
    // Voor nu een dummy waarde na 1 seconde
    if (connected && publicKey) {
      setTimeout(() => {
        setBalance(100); // Dummy balance
      }, 1000);
    } else {
      setBalance(null);
    }
  }, [connected, publicKey]);

  useEffect(() => {
    if (!connected || !publicKey) {
      setBalance(null);
      setIsDummy(false);
      return;
    }
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const getBalance = async () => {
      try {
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
  }, [connected, publicKey]);

  const handleBurn = () => {
    randomAngelText();
    randomDuvelText();
    setPhase('burning');
    setTimerKey((k) => k + 1);

    // Dummy audio (optioneel) - niet blocking
    setTimeout(() => {
      const audio = new Audio('/microwave.mp3');
      audio.play().catch(() => {});
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 11700); // stop na 12 seconden
    }, 0);
  };

  const handleMagnetronDone = () => {
    console.debug('Magnetron done: about to show reward modal');

    // Dummy audio (optioneel) - eerst afspelen
    const audio = new Audio('/horn.mp3');
    audio.play().catch(() => {});

    // Daarna reward tonen
    const selected = getRandomReward();
    setReward(selected);
    setShowRewardModal(true);
    setBurnedTokens((n) => n + 1);

    // Confetti tonen
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 6000); // confetti na 6s weer weg
  };

  const handleCloseRewardModal = () => {
    // Debug: check wanneer de modal gesloten wordt
    console.debug('Reward modal closed');
    setShowRewardModal(false);
    setTimeout(() => {
      setPhase('refund');
    }, 300);
  };

  const handleInsert = () => {
    randomAngelText();
    randomDuvelText();
    setInserted((n) => n + 1); // elke klik vermindert 1 token

    // Speel coin geluid af (optioneel)
    const audio = new Audio('/coin.mp3');
    audio.play().catch(() => {});
  };

  // Disable knoppen als geen wallet of geen $FOOF
  const disableActions =
    !connected ||
    !publicKey ||
    balance === null ||
    balance <= 0;

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
        {/* Ballon afbeelding linksboven angel */}
         <Ballon
  text={angelText}
  style={{
    left: isMobile ? '19vw' : '270px',
    top: isMobile ? '13vw' : '60px',
    zIndex: 20,
    width: isMobile ? 70 : 240,
    height: isMobile ? 100 : 360,
  }}
/>  {/* Ballon bij duvel, gespiegeld */}
  <Ballon
    text={duvelText}
    style={{
      right: isMobile ? '19vw': '250px',
      top: isMobile ? '13vw': '90px',
      width: isMobile ? 70 : 240,
    height: isMobile ? 100 : 360,
      zIndex: 20,
    }}
    mirrored
  />
        <h1
          className="text-3xl md:text-5xl font-bold tracking-widest text-center mb-2 uppercase"
          style={{
            fontFamily: "'Press Start 2P', system-ui, sans-serif",
            color: '#3a2f1b',
            textShadow: '0 0 16px #fff7e0, 0 0 32px #d2b77c',
            letterSpacing: '0.12em',
          }}
        >
          FOOFUR BURN CHAOS
        </h1>
        <div className="flex flex-row items-center w-full justify-center relative">
          {/* Angel image absoluut gepositioneerd links onder */}
          <div
            className="" //className="hidden md:block"
            style={{
             position: 'absolute',
    left: isMobile ? '7vw' : '64px',
    bottom: isMobile ? '-20px' : '-220px',
    width: isMobile ? '80px' : '320px',
    height: isMobile ? '120px' : '480px',
              zIndex: 10,
            }}
          >
            <Image
              src="/images/angel.png"
              alt="Angel"
               width={isMobile ? 60 : 320}
  height={isMobile ? 100 : 480}
  className="pixelated"
  style={{
    imageRendering: 'pixelated',
    maxHeight: isMobile ? 120 : 480,
    width: 'auto',
  }}
              priority
            />
          </div>
          {/* Microwave blijft gecentreerd */}
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
          {/* Duvel image absoluut gepositioneerd rechts onder */}
          <div
            className="" //className="hidden md:block"
            style={{
              position: 'absolute',
    right: isMobile ? '5vw' : '64px',
    bottom: isMobile ? '-20px' : '-220px',
    width: isMobile ? '80px' : '320px',
    height: isMobile ? '120px' : '480px',
              zIndex: 10,
            }}
          >
            <Image
              src="/images/duvel.png"
              alt="Duvel"
               width={isMobile ? 60 : 320}
  height={isMobile ? 100 : 480}
  className="pixelated"
  style={{
    imageRendering: 'pixelated',
    maxHeight: isMobile ? 120 : 480,
    width: 'auto',
  }}
              priority
            />
          </div>
        </div>
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
        <div className="flex gap-4">
          <button
            className="relative group focus:outline-none mt-2 mb-2"
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              boxShadow: 'none',
            }}
            onClick={handleBurn}
            aria-label="Burn"
            disabled={phase !== 'idle' || disableActions}
          >
            <Image
              src="/images/burn.png"
              alt="Burn"
              width={isMobile ? 80 : 160}      // kleiner op mobiel
              height={isMobile ? 40 : 80}      // kleiner op mobiel
              className="transition-all duration-300 group-hover:scale-105 group-hover:animate-pulse group-active:animate-shake-micro"
              style={{
                imageRendering: 'pixelated',
                opacity: phase !== 'idle' ? 0.7 : 1,
                cursor: phase !== 'idle' ? 'not-allowed' : 'pointer',
                display: 'block',
                borderRadius: 0,
                background: 'transparent',
              }}
              priority
            />
          </button>
          <button
            className="ml-2 relative group focus:outline-none mt-2 mb-2"
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              boxShadow: 'none',
            }}
            onClick={handleInsert}
            aria-label="Insert"
            disabled={phase !== 'idle' || disableActions}
          >
            <Image
              src="/images/insert.png"
              alt="Insert"
              width={isMobile ? 90 : 180}      // kleiner op mobiel
              height={isMobile ? 45 : 90}      // kleiner op mobiel
              className="transition-all duration-300 group-hover:scale-105 group-hover:animate-pulse group-active:animate-shake-micro"
              style={{
                imageRendering: 'pixelated',
                opacity: phase !== 'idle' ? 0.7 : 1,
                cursor: phase !== 'idle' ? 'not-allowed' : 'pointer',
                display: 'block',
                borderRadius: 0,
                background: 'transparent',
              }}
              priority
            />
            <span
              className="absolute inset-0 flex items-center justify-center font-bold text-xl"
              style={{
                color: '#3a2f1b',
                fontFamily: "'Press Start 2P', monospace",
                pointerEvents: 'none',
                textShadow: '0 0 8px #fffbe8, 0 0 2px #d2b77c',
                letterSpacing: '0.08em',
              }}
            >
            </span>
          </button>
        </div>
        {/* Leaderboard direct onder de burn button */}
        <Leaderboard burnedTokens={burnedTokens} />
      </main>

      {/* Reward Modal */}
      {showRewardModal && reward && (
        <>
          {console.debug('Rendering RewardModal with', reward)}
          <RewardModal reward={reward} onClose={handleCloseRewardModal} />
        </>
      )}

      {/* Confetti */}
      {showConfetti && <Confetti width={width} height={height} />}

      <FoofBalance balance={balance} isDummy={isDummy} inserted={inserted} />
      
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