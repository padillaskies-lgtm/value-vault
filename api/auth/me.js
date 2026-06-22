// /api/auth/me.js
// Returns the current logged-in user from the session cookie

export default function handler(req, res) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/vv_session=([^;]+)/);

  if (!match) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const sessionPayload = JSON.parse(
      Buffer.from(match[1], 'base64').toString('utf8')
    );

    if (sessionPayload.exp < Date.now()) {
      return res.status(401).json({ error: 'Session expired' });
    }

    return res.status(200).json({
      id: sessionPayload.id,
      username: sessionPayload.username,
      avatar: sessionPayload.avatar,
    });
  } catch {
    return res.status(401).json({ error: 'Invalid session' });
  }
}
