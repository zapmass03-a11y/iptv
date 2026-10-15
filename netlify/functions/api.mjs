// Repassa as chamadas da API (categorias, listas, episódios) para o servidor IPTV.
// Só fala com o servidor definido em IPTV_SERVER, nunca com endereços arbitrários.
const UP = (Netlify.env.get('IPTV_SERVER') || 'http://nglob.top').replace(/\/$/, '');

export default async (req) => {
  const u = new URL(req.url);
  try {
    const r = await fetch(UP + '/player_api.php' + u.search, { headers: { 'user-agent': 'Mozilla/5.0' } });
    return new Response(r.body, {
      status: r.status,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  } catch (e) {
    return new Response('{"error":"servidor IPTV indisponível"}', { status: 502, headers: { 'content-type': 'application/json' } });
  }
};

export const config = { path: '/api' };
