import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildVideoSearches } from '../test-dist/services/videoSuggestions.js';

test('searches preserve accents and escape query parameters without fabricated metadata', () => {
  const results = buildVideoSearches('  Células & energia?  ');
  assert.equal(results.length, 3);
  for (const result of results) {
    const url = new URL(result.youtubeUrl);
    assert.equal(url.origin, 'https://www.youtube.com');
    assert.equal(url.pathname, '/results');
    assert.equal([...url.searchParams].length, 1);
    assert.ok(url.searchParams.get('search_query').includes('Células & energia?'));
    assert.equal(result.thumbnailUrl, '');
    assert.equal(result.duration, '');
  }
});
test('does not build misleading search links for an empty topic', () => {
  assert.deepEqual(buildVideoSearches('   '), []);
});
