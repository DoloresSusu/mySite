// Resolve product imagery from the live official site rather than a copied asset.
const origin = 'https://loxovi.ai/';
const fallback = {
  hero: 'https://loxovi.ai/cdn/shop/t/4/assets/flow-v2-loxovi1.webp?v=178816573911787204461794055375',
  detail: 'https://loxovi.ai/cdn/shop/t/4/assets/flow-v2-thumb-slide.webp?v=13306394638235301711794212613',
  hardware: 'https://loxovi.ai/cdn/shop/t/4/assets/flow-ks-hardware.webp?v=126447825732603303111794055375'
};
export default async function handler(req, res) {
  const slot = new URL(req.url, origin).searchParams.get('slot') || 'hero';
  if (!Object.hasOwn(fallback, slot)) { res.statusCode = 400; return res.end('Unknown image'); }
  let target = fallback[slot];
  let fresh = false;
  try {
    const response = await fetch(origin, { signal: AbortSignal.timeout(7000) });
    if (!response.ok) throw new Error('Official page unavailable');
    const html = await response.text();
    const images = [...html.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => {
      const attrs = Object.fromEntries([...tag.matchAll(/\b(src|alt)\s*=\s*(["'])(.*?)\2/gi)].map(m => [m[1].toLowerCase(), m[3].replaceAll('&amp;', '&')]));
      return attrs;
    });
    const patterns = { hero: /(?:Loxovi.*(?:phone|hand)|(?:white|black).*Loxovi)/i, detail: /(?:recording slider|record.*switch|slider.*close)/i, hardware: /Loxovi hardware details/i };
    const image = images.find(i => i.src && patterns[slot].test(i.alt || ''));
    if (image) {
      const url = new URL(image.src, origin);
      if (url.protocol === 'https:' && ['loxovi.ai','www.loxovi.ai','cdn.shopify.com'].includes(url.hostname)) {
        target = url.href;
        fresh = true;
      }
    }
  } catch { /* Keep the current approved official asset during upstream failures. */ }
  res.statusCode = 302;
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.setHeader('Vercel-CDN-Cache-Control', 'public, max-age=300');
  res.setHeader('X-Loxovi-Image-Source', fresh ? 'live' : 'fallback');
  res.setHeader('Location', target);
  res.end();
}
