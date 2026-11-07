/**
 * Extracts YouTube playlist ID from various URL formats or raw ID strings
 * Examples:
 * - https://www.youtube.com/playlist?list=PL0umg_TNpoZTTdZVIi5tfX69pRmoMFGna
 * - https://youtube.com/watch?v=xyz&list=PL0umg_TNpoZTTdZVIi5tfX69pRmoMFGna
 * - PL0umg_TNpoZTTdZVIi5tfX69pRmoMFGna
 */
export function extractPlaylistId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already looks like a playlist ID (typically starts with PL, RD, OLAK, etc.)
  if (/^[A-Za-z0-9_-]{10,}$/.test(trimmed) && !trimmed.includes('/') && !trimmed.includes('.')) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const listParam = url.searchParams.get('list');
    if (listParam) {
      return listParam;
    }
  } catch {
    // If not a full URL, fallback to regex search
  }

  const match = trimmed.match(/[?&]list=([A-Za-z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}

/**
 * Generates iframe embed URL for a playlist
 */
export function getPlaylistEmbedUrl(playlistId: string, autoplay: boolean = true): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams({
    listType: 'playlist',
    list: playlistId,
    autoplay: autoplay ? '1' : '0',
    enablejsapi: '1',
    origin: origin,
    rel: '0',
    modestbranding: '1',
    playsinline: '1'
  });
  return `https://www.youtube-nocookie.com/embed?${params.toString()}`;
}
