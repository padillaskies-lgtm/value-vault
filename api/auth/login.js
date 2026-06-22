export default function handler(req, res) {
  const redirectUri = process.env.DISCORD_REDIRECT_URI;
  console.log('REDIRECT_URI value:', JSON.stringify(redirectUri));
  
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify guilds.members.read',
  });

  const fullUrl = `https://discord.com/api/oauth2/authorize?${params}`;
  console.log('Full URL being sent:', fullUrl);
  
  res.redirect(fullUrl);
}
