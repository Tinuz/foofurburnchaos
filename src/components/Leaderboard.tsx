import React from 'react';

type LeaderboardProps = {
  burnedTokens: number;
};

const Leaderboard: React.FC<LeaderboardProps> = ({ burnedTokens }) => (
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
    <p>
      You have burned <span className="text-[#cc3d3d]">{burnedTokens}</span> $FOOF!
    </p>
    {/* Add a real leaderboard list here in the future */}
  </div>
);

export default Leaderboard;