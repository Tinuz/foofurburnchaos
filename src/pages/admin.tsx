import React, { useState } from "react";

type LeaderboardEntry = { wallet: string; burned: number };

function getMonthKey() {
  const now = new Date();
  return `leaderboard:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const PRIZE_DISTRIBUTION = [0.5, 0.3, 0.2]; // 1st: 50%, 2nd: 30%, 3rd: 20%

const AdminPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [solTop3, setSolTop3] = useState<number[]>([]);
  const [solPrize, setSolPrize] = useState<string>("");
  const [currentPrize, setCurrentPrize] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Barometer state
  const [barometer, setBarometer] = useState<number | null>(null);
  const [barometerInput, setBarometerInput] = useState<string>("");
  const [baroSaving, setBaroSaving] = useState(false);
  const [baroMsg, setBaroMsg] = useState<string | null>(null);

  // Barometer goal state
  const [barometerGoal, setBarometerGoal] = useState<number>(500000);
  const [barometerGoalInput, setBarometerGoalInput] = useState<string>("500000");
  const [goalSaving, setGoalSaving] = useState(false);
  const [goalMsg, setGoalMsg] = useState<string | null>(null);

  // Fetch leaderboard, prizepool, barometer, and barometer goal on load
  React.useEffect(() => {
    const fetchLeaderboard = async () => {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setLeaderboard(Array.isArray(data) ? data : []);
    };
    const fetchPrize = async () => {
      const res = await fetch("/api/prizepool");
      const data = await res.json();
      setCurrentPrize(typeof data.prizePool === "number" ? data.prizePool : null);
      setSolPrize(
        typeof data.prizePool === "number" && data.prizePool > 0
          ? String(data.prizePool)
          : ""
      );
    };
    const fetchBarometer = async () => {
      const res = await fetch("/api/barometer");
      const data = await res.json();
      setBarometer(typeof data.totalBurned === "number" ? data.totalBurned : 0);
      setBarometerInput(
        typeof data.totalBurned === "number" ? String(data.totalBurned) : ""
      );
    };
    const fetchBarometerGoal = async () => {
      const res = await fetch("/api/barometer-goal");
      const data = await res.json();
      setBarometerGoal(typeof data.goal === "number" ? data.goal : 500000);
      setBarometerGoalInput(
        typeof data.goal === "number" ? String(data.goal) : "500000"
      );
    };
    fetchLeaderboard();
    fetchPrize();
    fetchBarometer();
    fetchBarometerGoal();
  }, []);

  const handleCalculate = () => {
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

  const handlePrizeSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const prize = parseFloat(solPrize);
      if (isNaN(prize) || prize < 0) {
        setSaveMsg("Enter a valid amount.");
        setSaving(false);
        return;
      }
      const res = await fetch("/api/prizepool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prize }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentPrize(prize);
        setSaveMsg("Prize pool saved!");
      } else {
        setSaveMsg("Error saving prize pool.");
      }
    } catch {
      setSaveMsg("Error saving prize pool.");
    }
    setSaving(false);
  };

  // Handle barometer update (werkt nu met de nieuwe API)
  const handleBarometerSave = async () => {
    setBaroSaving(true);
    setBaroMsg(null);
    try {
      const amount = parseInt(barometerInput, 10);
      if (isNaN(amount) || amount < 0) {
        setBaroMsg("Enter a valid number.");
        setBaroSaving(false);
        return;
      }

      // Eerst resetten naar 0 als amount 0 is, anders verschil berekenen
      if (amount === 0) {
        const res = await fetch("/api/barometer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reset: true }),
        });
        const data = await res.json();
        if (data.success) {
          setBarometer(0);
          setBaroMsg("Barometer updated!");
        } else {
          setBaroMsg("Error updating barometer.");
        }
      } else {
        // Haal huidige waarde op
        const resCurrent = await fetch("/api/barometer");
        const dataCurrent = await resCurrent.json();
        const current = typeof dataCurrent.totalBurned === "number" ? dataCurrent.totalBurned : 0;
        // Bereken verschil
        const diff = amount - current;
        const res = await fetch("/api/barometer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: diff }),
        });
        const data = await res.json();
        if (data.success) {
          setBarometer(amount);
          setBaroMsg("Barometer updated!");
        } else {
          setBaroMsg("Error updating barometer.");
        }
      }
    } catch {
      setBaroMsg("Error updating barometer.");
    }
    setBaroSaving(false);
  };

  // Handle barometer goal update
  const handleBarometerGoalSave = async () => {
    setGoalSaving(true);
    setGoalMsg(null);
    try {
      const goal = parseInt(barometerGoalInput, 10);
      if (isNaN(goal) || goal <= 0) {
        setGoalMsg("Enter a valid goal.");
        setGoalSaving(false);
        return;
      }
      const res = await fetch("/api/barometer-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      });
      const data = await res.json();
      if (data.success) {
        setBarometerGoal(goal);
        setGoalMsg("Barometer goal updated!");
      } else {
        setGoalMsg("Error updating barometer goal.");
      }
    } catch {
      setGoalMsg("Error updating barometer goal.");
    }
    setGoalSaving(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10 px-2">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column: Prize pool & Barometer */}
        <div className="flex flex-col gap-8">
          {/* Prize Pool Card */}
          <div className="bg-white rounded shadow p-6 flex flex-col items-center">
            <h2 className="font-bold text-lg mb-2">Prize Pool</h2>
            <div className="mb-2 text-lg font-mono text-green-700">
              {currentPrize !== null ? `${currentPrize} SOL` : "Loading..."}
            </div>
            <label className="mb-1 font-semibold">Set new prize pool:</label>
            <input
              type="number"
              min={0}
              step="any"
              value={solPrize}
              onChange={e => setSolPrize(e.target.value)}
              placeholder="e.g. 1.5"
              className="border px-2 py-1 rounded text-center w-32"
              disabled={saving}
            />
            <button
              onClick={handlePrizeSave}
              className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save prize pool"}
            </button>
            {saveMsg && (
              <div className="text-sm mt-1 text-gray-700">{saveMsg}</div>
            )}
          </div>

          {/* Barometer Card */}
          <div className="bg-white rounded shadow p-6 flex flex-col items-center">
            <h2 className="font-bold text-lg mb-2">Barometer</h2>
            <div className="mb-2 text-lg font-mono text-blue-700">
              {barometer !== null ? barometer : "Loading..."}
            </div>
            <label className="mb-1 font-semibold">Set new barometer value:</label>
            <input
              type="number"
              min={0}
              step="1"
              value={barometerInput}
              onChange={e => setBarometerInput(e.target.value)}
              placeholder="e.g. 50000"
              className="border px-2 py-1 rounded text-center w-32"
              disabled={baroSaving}
            />
            <button
              onClick={handleBarometerSave}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={baroSaving}
            >
              {baroSaving ? "Saving..." : "Save barometer"}
            </button>
            {baroMsg && (
              <div className="text-sm mt-1 text-gray-700">{baroMsg}</div>
            )}
            <div className="w-full border-t mt-4 pt-4 flex flex-col items-center">
              <div className="mb-2 text-lg font-mono text-purple-700">
                Goal: {barometerGoal}
              </div>
              <label className="mb-1 font-semibold">Set new barometer goal:</label>
              <input
                type="number"
                min={1}
                step="1"
                value={barometerGoalInput}
                onChange={e => setBarometerGoalInput(e.target.value)}
                placeholder="e.g. 500000"
                className="border px-2 py-1 rounded text-center w-32"
                disabled={goalSaving}
              />
              <button
                onClick={handleBarometerGoalSave}
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                disabled={goalSaving}
              >
                {goalSaving ? "Saving..." : "Save barometer goal"}
              </button>
              {goalMsg && (
                <div className="text-sm mt-1 text-gray-700">{goalMsg}</div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Leaderboard */}
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <h2 className="font-bold text-lg mb-2">
            Leaderboard – {getMonthKey().replace("leaderboard:", "")}
          </h2>
          <ul className="mb-4 w-full max-w-xs">
            {leaderboard
              .sort((a, b) => b.burned - a.burned)
              .slice(0, 3)
              .map((entry, i) => (
                <li key={entry.wallet} className="mb-1 flex items-center gap-2">
                  <span style={{ fontSize: 18 }}>
                    {["🥇", "🥈", "🥉"][i]}
                  </span>
                  <span className="font-mono">
                    {entry.wallet.slice(0, 4)}...{entry.wallet.slice(-4)}
                  </span>
                  <b className="ml-auto">{entry.burned} FOOF</b>
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
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
          >
            Calculate SOL for top 3
          </button>
          <button
            onClick={async () => {
              if (
                window.confirm(
                  "Are you sure you want to reset the leaderboard for this month?"
                )
              ) {
                await fetch("/api/leaderboard", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ reset: true }),
                });
                setLeaderboard([]);
              }
            }}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full"
          >
            Reset Leaderboard
          </button>
        </div>
      </div>
      <button
        onClick={async () => {
          const res = await fetch("/api/mint", { method: "POST" });
          const data = await res.json();
          alert(`NFT created! ${data.nftUrl}`);
        }}
        className="fixed top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-bold"
      >
        Create Master NFT
      </button>
    </div>
  );
};

// Authentication check
if (typeof window !== "undefined") {
  const user = prompt("Username:");
  const pass = prompt("Password:");
  if (user !== "admin" || pass !== process.env.NEXT_PUBLIC_ADMIN_PASSWD) {
    window.location.href = "/";
  }
}

export default AdminPage;