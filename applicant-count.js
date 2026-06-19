import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'POST') {
    const count = await redis.incr('applicant_count');
    return res.status(200).json({ count });
  }

  if (req.method === 'GET') {
    const count = (await redis.get('applicant_count')) || 0;
    return res.status(200).json({ count });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
