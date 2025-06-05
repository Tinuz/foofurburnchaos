import React from 'react';

type LegendaryModalProps = {
  image: string;
  name: string;
  onClose: () => void;
};

const LegendaryModal: React.FC<LegendaryModalProps> = ({ image, name, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
    <div className="bg-[#fffbe8] rounded-xl shadow-2xl px-10 py-8 text-center relative animate-pop max-w-md w-full border-4 border-yellow-400">
      <h2 className="text-2xl font-extrabold text-yellow-600 mb-4" style={{ fontFamily: "'Press Start 2P', 'VT323', monospace" }}>
        Legendary Chaos Unlocked!
      </h2>
      <img
        src={`/images/rewards/${image}`}
        alt={name}
        className="mx-auto mb-4 animate-pop"
        style={{ maxWidth: 200, maxHeight: 200 }}
      />
      <p className="text-sm font-mono text-gray-800 mb-4 leading-5">
        Foofur went full rogue and minted you an NFT.<br />
        It smells like ambition and burnt fur.<br />
        <span className="text-yellow-700 font-bold">Check your wallet. It's there. Probably.</span>
      </p>
      <button
        className="mt-2 px-6 py-2 bg-yellow-600 text-white rounded font-bold transition hover:scale-105"
        onClick={onClose}
      >
        Close
      </button>
    </div>
    <style jsx global>{`
      @keyframes pop {
        0% { transform: scale(0.6); opacity: 0; }
        80% { transform: scale(1.15); opacity: 1; }
        100% { transform: scale(1); }
      }
      .animate-pop {
        animation: pop 0.5s cubic-bezier(.36,1.7,.3,1) both;
      }
    `}</style>
  </div>
);

export default LegendaryModal;
