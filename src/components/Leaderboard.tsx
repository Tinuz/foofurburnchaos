import React from 'react';

type LeaderboardProps = {
  burnedTokens: number;
};

const Leaderboard: React.FC<LeaderboardProps> = ({ burnedTokens }) => (
  <div className="mt-8 p-4 bg-white rounded shadow">
    <h2 className="text-2xl font-bold mb-2">Leaderboard</h2>
    <p>Jij hebt {burnedTokens} $FOOF verbrand!</p>
    {/* Hier kun je later een echte leaderboard lijst tonen */}
  </div>
);

export default Leaderboard;