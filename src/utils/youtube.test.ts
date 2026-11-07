import test from 'node:test';
import assert from 'node:assert/strict';
import { extractPlaylistId, getPlaylistEmbedUrl } from './youtube.ts';

test('extractPlaylistId parses raw playlist IDs', () => {
  const id = 'PL0umg_TNpoZTTdZVIi5tfX69pRmoMFGna';
  assert.equal(extractPlaylistId(id), id);
});

test('extractPlaylistId parses standard youtube playlist URL', () => {
  const url = 'https://www.youtube.com/playlist?list=PLQSN0EC5GK3TSTXo6cz3CO6j0RfKUS6Mb';
  assert.equal(extractPlaylistId(url), 'PLQSN0EC5GK3TSTXo6cz3CO6j0RfKUS6Mb');
});

test('extractPlaylistId parses youtube watch URL with list parameter', () => {
  const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLl2jQn4j1xPhjPgjze0Ks19_z7gT7Eq1l&index=1';
  assert.equal(extractPlaylistId(url), 'PLl2jQn4j1xPhjPgjze0Ks19_z7gT7Eq1l');
});

test('extractPlaylistId returns null for invalid inputs', () => {
  assert.equal(extractPlaylistId(''), null);
  assert.equal(extractPlaylistId('https://example.com/not-youtube'), null);
});

test('getPlaylistEmbedUrl generates valid embed URL', () => {
  const embed = getPlaylistEmbedUrl('PL0umg_TNpoZTTdZVIi5tfX69pRmoMFGna', true);
  assert.match(embed, /youtube-nocookie\.com\/embed/);
  assert.match(embed, /list=PL0umg_TNpoZTTdZVIi5tfX69pRmoMFGna/);
  assert.match(embed, /autoplay=1/);
});
