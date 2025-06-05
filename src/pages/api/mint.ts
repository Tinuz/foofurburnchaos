import type { NextApiRequest, NextApiResponse } from 'next';
import { createMasterNft } from '../../libs/mintMaster';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const result = await createMasterNft();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}