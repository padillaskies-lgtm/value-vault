import fs from 'fs';
import path from 'path';
export default function handler(req, res) {
  const cookie = req.headers.cookie || '';
  if (!cookie.includes('vv_auth=1')) return res.redirect('/?login=1');
  const page = req.query.page || 'index.html';
  try {
    const html = fs.readFileSync(path.join(process.cwd(), 'public', page), 'utf8');
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  } catch {
    return res.redirect('/?login=1');
  }
}
