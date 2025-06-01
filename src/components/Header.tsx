import React from 'react';
import Image from 'next/image';
import WalletConnect from './WalletConnect';

const Header: React.FC = () => (
  <header className="w-full flex flex-col items-center pt-10 pb-6 relative">
    {/* Logo linksboven */}
    <div className="absolute left-4 top-4">
      <Image
        src="/images/logo.jpg"
        alt="Foofur Logo"
        width={48}
        height={48}
        className="rounded-full shadow pixelated"
        style={{ imageRendering: 'pixelated' }}
        priority
      />
    </div>
    {/* WalletConnect rechtsboven */}
    <div className="absolute right-4 top-4">
      <WalletConnect />
    </div>
  </header>
);

export default Header;