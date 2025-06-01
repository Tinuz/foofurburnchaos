import { useState, useEffect } from 'react';
import WalletConnect from '../components/WalletConnect';
import BurnButton from '../components/BurnButton';
import MicrowaveAnimation from '../components/MicrowaveAnimation';
import TokenRefundTimer from '../components/TokenRefundTimer';
import Leaderboard from '../components/Leaderboard';

const BURN_TIME = 30; // seconden

const Home = () => {
  const [burnedTokens, setBurnedTokens] = useState(0);
  const [showMicrowave, setShowMicrowave] = useState(false);
  const [cookieEarned, setCookieEarned] = useState(false);
  const [isBurning, setIsBurning] = useState(false);

  const handleBurnComplete = () => {
    setBurnedTokens(burnedTokens + 1);
    setCookieEarned(true);
    setShowMicrowave(false);
    setIsBurning(false);
    setTimeout(() => setCookieEarned(false), 3000);
  };

  useEffect(() => {
    if (showMicrowave) {
      setIsBurning(true);
      const timer = setTimeout(() => {
        handleBurnComplete();
      }, BURN_TIME * 1000);
      return () => clearTimeout(timer);
    }
  }, [showMicrowave]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Foofur's Cookie Burn Dash</h1>
      <WalletConnect />
      <BurnButton setShowMicrowave={setShowMicrowave} isBurning={isBurning} />
      {showMicrowave && <MicrowaveAnimation isBurning={isBurning} />}
      {cookieEarned && <p className="mt-4 text-xl">Congratulations, 1 cookie earned 🍪</p>}
      <TokenRefundTimer burnTime={BURN_TIME} />
      <Leaderboard burnedTokens={burnedTokens} />
    </div>
  );
};

export default Home;