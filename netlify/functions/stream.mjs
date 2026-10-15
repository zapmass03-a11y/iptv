// Repassa o vídeo (ao vivo, filme, episódio). Só é usado se DIRECT_BASE estiver vazio no index.html.
const UP = (Netlify.env.get('IPTV_SERVER') || 'http://suite.lat').replace(/\/$/, '');

export default async (req) => {
  const m = new URL(req.url).pathname.match(/^\/stream\/(live|movie|series)\/([^/]+)\/([^/]+)\/([^/]+)$/);
  if (!m) return new Response('não encontrado', { status: 404 });
  const h = { 'user-agent': 'Mozilla/5.0' };
  const range = req.headers.get('range');
  if (range) h.range = range;
  try {
    const r = await fetch(`${UP}/${m[1]}/${m[2]}/${m[3]}/${m[4]}`, { headers: h, redirect: 'follow' });
    const o = new Headers();
    for (const k of ['content-type', 'content-length', 'content-range', 'accept-ranges']) {
      if (r.headers.get(k)) o.set(k, r.headers.get(k));
    }
    return new Response(r.body, { status: r.status, headers: o });
  } catch (e) {
    return new Response('servidor IPTV indisponível', { status: 502 });
  }
};

export const config = { path: '/stream/*' };
