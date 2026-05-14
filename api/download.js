export default async function handler(req, res) {
  const { url, name } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  // Only allow Gamma PDF URLs
  if (!url.startsWith('https://assets.api.gamma.app/')) {
    return res.status(403).json({ error: 'Invalid URL domain' });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch PDF' });
    }

    const buffer = await response.arrayBuffer();
    const filename = (name || 'document') + '.pdf';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(Buffer.from(buffer));
  } catch (error) {
    return res.status(500).json({ error: 'Server error fetching PDF' });
  }
}
