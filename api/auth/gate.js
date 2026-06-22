import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/vv_session=([^;]+)/);

  if (!match) return res.redirect('/?login=1');

  try {
    const session = JSON.parse(Buffer.from(match[1], 'base64').toString('utf8'));
    if (session.exp < Date.now()) return res.redirect('/?login=1');

    const page = req.query.page || 'index.html';
    const filePath = path.join(process.cwd(), page);
    const html = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  } catch {
    return res.redirect('/?login=1');
  }
}
