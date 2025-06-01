import { useState } from 'react';

interface LeaderboardEntry {
  username: string;
  cookieScore: number;
}

const LEADERBOARD_KEY = 'foofurs_leaderboard';

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const storedLeaderboard = localStorage.getItem(LEADERBOARD_KEY);
    return storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
  });

  const updateLeaderboard = (username: string, cookieScore: number) => {
    const newEntry: LeaderboardEntry = { username, cookieScore };
    const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.cookieScore - a.cookieScore);
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedLeaderboard));
  };

  const getLeaderboard = () => {
    return leaderboard;
  };

  return { leaderboard, updateLeaderboard, getLeaderboard };
};