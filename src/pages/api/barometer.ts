import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";

const redis = new Redis({
  url: process.env.LEADERBOARDDB_KV_REST_API_URL!,
  token: process.env.LEADERBOARDDB_KV_REST_API_TOKEN!,
});

function getMonthKey() {
  const now = new Date();
  return `barometer:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = getMonthKey();

  if (req.method === "GET") {
    const burned = await redis.get<number>(key);
    return res.status(200).json({ totalBurned: burned || 0 });
  }

  if (req.method === "POST") {
    const { amount, reset } = req.body;

    // Reset barometer direct naar 0 als reset:true wordt meegegeven
    if (reset === true) {
      await redis.set(key, 0);
      return res.status(200).json({ success: true, totalBurned: 0 });
    }

    if (typeof amount !== "number") {
      return res.status(400).json({ error: "amount must be a number" });
    }
    const newValue = await redis.incrby(key, amount);
    return res.status(200).json({ success: true, totalBurned: newValue });
  }

  res.status(405).end();
}