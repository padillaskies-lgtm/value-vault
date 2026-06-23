export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) return res.redirect('/?error=no_code');

  try {
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

    if (!tokenRes.ok) return res.redirect('/?error=token_failed');

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) return res.redirect('/?error=user_fetch_failed');

    const user = await userRes.json();
    console.log('User ID:', user.id);
    console.log('Guild ID:', process.env.DISCORD_GUILD_ID);

    const memberRes = await fetch(
      `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${user.id}`,
      { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` } }
    );

    console.log('Member check status:', memberRes.status);
    const memberData = await memberRes.json();
    console.log('Member check response:', JSON.stringify(memberData));

    if (!memberRes.ok) return res.redirect('/?error=not_member');

    const sessionPayload = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      verified: true,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    const sessionValue = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    res.setHeader('Set-Cookie', [
      `vv_session=${sessionValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}; Secure`,
    ]);

    res.redirect('/youtube-automation.html');

  } catch (err) {
    console.error(err);
    res.redirect('/?error=server_error');
  }
}
