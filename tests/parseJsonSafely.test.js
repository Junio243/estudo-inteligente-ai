import assert from 'node:assert/strict';
import { parseJsonSafely } from '../test-dist/services/parseJsonSafely.js';
import { test } from 'node:test';

test('removes markdown fences', () => {
  const input = '```json\n{"a":1}\n```';
  const result = parseJsonSafely(input);
  assert.deepEqual(result, {a:1});
});

test('returns parsed object without fences', () => {
  const input = '{"b":2}';
  const result = parseJsonSafely(input);
  assert.deepEqual(result, {b:2});
});

test('throws on invalid json', () => {
  assert.throws(() => parseJsonSafely('invalid'), /Formato de JSON inválido/);
});
