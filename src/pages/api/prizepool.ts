import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";

const redis = new Redis({
  url: process.env.LEADERBOARDDB_KV_REST_API_URL!,
  token: process.env.LEADERBOARDDB_KV_REST_API_TOKEN!,
});

function getMonthKey() {
  const now = new Date();
  return `prizepool:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = getMonthKey();

  if (req.method === "GET") {
    const prize = await redis.get<number>(key);
    return res.status(200).json({ prizePool: prize ?? 0 });
  }

  if (req.method === "POST") {
    const { prize } = req.body;
    if (typeof prize !== "number" || prize < 0) {
      return res.status(400).json({ error: "prize must be a positive number" });
    }
    await redis.set(key, prize);
    return res.status(200).json({ success: true, prizePool: prize });
  }

  res.status(405).end();
}