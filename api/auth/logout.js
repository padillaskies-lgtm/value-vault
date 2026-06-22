// /api/auth/logout.js
// Clears the session cookie and redirects home

export default function handler(req, res) {
  res.setHeader('Set-Cookie', 'vv_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  res.redirect('/');
}
