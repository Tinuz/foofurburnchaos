import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";

type LeaderboardEntry = { wallet: string; burned: number };

// Init Redis vanuit .env (Upstash/Vercel KV)
const redis = new Redis({ url: process.env.LEADERBOARDDB_KV_REST_API_URL, token: process.env.LEADERBOARDDB_KV_REST_API_TOKEN });
function getMonthKey() {
  const now = new Date();
  return `leaderboard:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// Helper om veilig leaderboard array te krijgen
function parseLeaderboard(data: unknown): LeaderboardEntry[] {
  if (!Array.isArray(data)) return [];
  return data.filter(
    (entry): entry is LeaderboardEntry =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as any).wallet === "string" &&
      typeof (entry as any).burned === "number"
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = getMonthKey();

  if (req.method === "GET") {
    const raw = await redis.get(key);
    const leaderboard = parseLeaderboard(raw);
    return res.status(200).json(leaderboard);
  }

  if (req.method === "POST") {
    const { wallet, burned } = req.body;
    if (!wallet || typeof burned !== "number") {
      return res.status(400).json({ error: "wallet and burned required" });
    }
    const raw = await redis.get(key);
    let leaderboard = parseLeaderboard(raw);

    const idx = leaderboard.findIndex((entry) => entry.wallet === wallet);
    if (idx !== -1) {
      leaderboard[idx].burned += burned;
    } else {
      leaderboard.push({ wallet, burned });
    }
    await redis.set(key, leaderboard);
    return res.status(200).json({ success: true });
  }

  res.status(405).end();
}