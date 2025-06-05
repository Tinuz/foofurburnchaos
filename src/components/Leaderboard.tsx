import React from 'react';

type LeaderboardProps = {
  leaderboard: { wallet: string; burned: number }[];
};

const Leaderboard: React.FC<LeaderboardProps> = ({ leaderboard }) => (
  <div
    className="mt-8 px-6 py-4 text-center retro-modal shadow-lg"
    style={{
      fontFamily: "'Press Start 2P', 'VT323', monospace",
      color: '#3a2f1b',
      textShadow: '0 0 8px #fff7e0',
      minWidth: 200,
      maxWidth: 320,
      background: 'radial-gradient(ellipse at 50% 30%, #fff7e0 60%, #d2b77c 100%)',
      border: 'none',
      borderRadius: 12,
    }}
  >
    <h2 className="text-lg font-bold mb-2" style={{ textShadow: '0 0 8px #fff7e0' }}>
      Leaderboard
    </h2>
    <ul className="list-disc list-inside">
      {leaderboard
        .sort((a, b) => b.burned - a.burned)
        .map((entry, i) => (
          <li key={entry.wallet} className="text-sm">
            <span className="font-semibold">#{i + 1}</span>{' '}
            {entry.wallet.slice(0, 4)}...{entry.wallet.slice(-4)}: {entry.burned} FOOF
          </li>
        ))}
    </ul>
  </div>
);

export default Leaderboard;