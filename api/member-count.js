// Vercel Serverless Function — /api/member-count
// Proxies Discord invite API server-side to bypass CORS

export default async function handler(req, res) {
  // Allow your site to call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120'); // cache 60s

  try {
    const r = await fetch(
      'https://discord.com/api/v9/invites/vGE3tRvK44?with_counts=true',
      { headers: { 'User-Agent': 'ValueVaultBot/1.0' } }
    );
    if (!r.ok) throw new Error(`Discord API ${r.status}`);
    const data = await r.json();
    const count = data.approximate_member_count ?? null;
    res.status(200).json({ count });
  } catch (e) {
    res.status(200).json({ count: null, error: e.message });
  }
}
