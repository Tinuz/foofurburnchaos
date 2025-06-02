import React from 'react';

type Reward = {
  name: string;
  image: string;
  rarity: string;
};

type RewardModalProps = {
  reward: Reward;
  onClose: () => void;
};

const rarityColors: Record<string, string> = {
  common: 'text-gray-700',
  uncommon: 'text-blue-600',
  rare: 'text-purple-700',
  legendary: 'text-yellow-500',
};

const RewardModal: React.FC<RewardModalProps> = ({ reward, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-[#fffbe8] rounded-lg shadow-lg px-8 py-6 text-center retro-modal relative animate-pop">
      <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Press Start 2P', 'VT323', monospace" }}>
        You won a reward!
      </h2>
      <img
        src={`/images/rewards/${reward.image}`}
        alt={reward.name}
        className="mx-auto mb-4 animate-pop"
        style={{ maxWidth: 180, maxHeight: 180 }}
      />
      <div className={`mb-2 font-bold text-lg ${rarityColors[reward.rarity]}`}>
        {reward.name} <span className="capitalize text-xs ml-2">{reward.rarity}</span>
      </div>
      <button
        className="mt-2 px-6 py-2 bg-[#cc3d3d] text-white rounded font-bold transition hover:scale-105"
        onClick={onClose}
      >
        Close
      </button>
    </div>
    <style jsx global>{`
      @keyframes pop {
        0% { transform: scale(0.7); opacity: 0; }
        80% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); }
      }
      .animate-pop {
        animation: pop 0.4s cubic-bezier(.36,1.7,.3,1) both;
      }
    `}</style>
  </div>
);

export default RewardModal;