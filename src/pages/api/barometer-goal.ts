import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";

const redis = new Redis({
  url: process.env.LEADERBOARDDB_KV_REST_API_URL!,
  token: process.env.LEADERBOARDDB_KV_REST_API_TOKEN!,
});

function getMonthKey() {
  const now = new Date();
  return `barometer-goal:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = getMonthKey();

  if (req.method === "GET") {
    const goal = await redis.get<number>(key);
    return res.status(200).json({ goal: goal ?? 500000 });
  }

  if (req.method === "POST") {
    const { goal } = req.body;
    if (typeof goal !== "number" || goal <= 0) {
      return res.status(400).json({ error: "goal must be a positive number" });
    }
    await redis.set(key, goal);
    return res.status(200).json({ success: true, goal });
  }

  res.status(405).end();
}