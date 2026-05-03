import type { VercelRequest, VercelResponse } from '@vercel/node';

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL!;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;

async function redis(command: string[]) {
  const res = await fetch(`${REDIS_URL}/${command.join('/')}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  return res.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'POST') {
    const data = await redis(['incr', 'modstack_installs']);
    return res.json({ count: data.result });
  }

  if (req.method === 'GET') {
    const data = await redis(['get', 'modstack_installs']);
    return res.json({ count: parseInt(data.result ?? '0') });
  }

  res.status(405).end();
}