export default function handler(req, res) {
  const { password } = req.body;
  if (password === process.env.SITE_PASSWORD) {
    res.setHeader('Set-Cookie', `vv_auth=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}; Secure`);
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ error: 'Wrong password' });
}
