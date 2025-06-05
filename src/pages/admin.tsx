import React, { useState } from "react";

type LeaderboardEntry = { wallet: string; burned: number };

function getMonthKey() {
  const now = new Date();
  return `leaderboard:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const PRIZE_DISTRIBUTION = [0.5, 0.3, 0.2]; // 1e: 50%, 2e: 30%, 3e: 20%

const AdminPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [solTop3, setSolTop3] = useState<number[]>([]);
  const [solPrize, setSolPrize] = useState<string>(""); // SOL te winnen deze maand

  // Haal leaderboard op bij laden
  React.useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setLeaderboard(Array.isArray(data) ? data : []);
    };
    fetchLeaderboard();
  }, []);

  const handleCalculate = () => {
    // Verdeel solPrize over top 3: 50%, 30%, 20%
    const prize = parseFloat(solPrize);
    if (isNaN(prize) || prize <= 0) {
      setSolTop3([]);
      return;
    }
    const sorted = [...leaderboard].sort((a, b) => b.burned - a.burned);
    const top3 = PRIZE_DISTRIBUTION.map((perc, i) =>
      sorted[i] ? +(prize * perc).toFixed(4) : 0
    );
    setSolTop3(top3);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-8">
      <button
        onClick={async () => {
          const res = await fetch("/api/mint", { method: "POST" });
          const data = await res.json();
          alert(`NFT created! ${data.nftUrl}`);
        }}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-bold text-lg"
      >
        Create Master NFT
      </button>
      <div className="flex flex-col items-center gap-2 bg-white p-6 rounded shadow min-w-[320px]">
        <h2 className="font-bold mb-2">Leaderboard – {getMonthKey().replace("leaderboard:", "")}</h2>
        <div className="mb-4 flex flex-col items-center">
          <label className="mb-1 font-semibold">SOL te winnen deze maand:</label>
          <input
            type="number"
            min={0}
            step="any"
            value={solPrize}
            onChange={e => setSolPrize(e.target.value)}
            placeholder="Bijv. 1.5"
            className="border px-2 py-1 rounded text-center w-32"
          />
          {solPrize && (
            <div className="text-sm text-gray-700 mt-1">
              Totaal te verdelen: <b>{solPrize} SOL</b>
            </div>
          )}
        </div>
        <ul className="mb-4">
          {leaderboard
            .sort((a, b) => b.burned - a.burned)
            .slice(0, 3)
            .map((entry, i) => (
              <li key={entry.wallet} className="mb-1">
                <span style={{ fontSize: 18 }}>
                  {["🥇", "🥈", "🥉"][i]}
                </span>{" "}
                {entry.wallet.slice(0, 4)}...{entry.wallet.slice(-4)}:{" "}
                <b>{entry.burned} FOOF</b>
                {solTop3[i] !== undefined && solTop3[i] > 0 && (
                  <span className="ml-2 text-green-700">
                    ≈ {solTop3[i]} SOL
                  </span>
                )}
              </li>
            ))}
        </ul>
        <button
          onClick={handleCalculate}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Bereken SOL voor top 3
        </button>
      </div>
    </div>
  );
};

export default AdminPage;