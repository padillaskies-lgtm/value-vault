const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
  }),
});

const tokenText = await tokenRes.text();
console.log('Token status:', tokenRes.status);
console.log('Token response:', tokenText);

if (!tokenRes.ok) return res.redirect('/?error=token_failed&detail=' + encodeURIComponent(tokenText));
