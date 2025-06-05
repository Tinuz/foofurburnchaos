import type { NextApiRequest, NextApiResponse } from "next";

// In-memory opslag (vervang door database voor productie)
let leaderboard: { wallet: string; burned: number }[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Geef het leaderboard terug, gesorteerd
    return res.status(200).json(
      leaderboard.sort((a, b) => b.burned - a.burned)
    );
  }
  if (req.method === "POST") {
    const { wallet, burned } = req.body;
    if (!wallet || typeof burned !== "number") {
      return res.status(400).json({ error: "wallet and burned required" });
    }
    const existing = leaderboard.find((entry) => entry.wallet === wallet);
    if (existing) {
      existing.burned += burned;
    } else {
      leaderboard.push({ wallet, burned });
    }
    return res.status(200).json({ success: true });
  }
  res.status(405).end();
}