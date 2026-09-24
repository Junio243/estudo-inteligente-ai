import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { getStudyHistory, saveStudySession, clearStudyHistory } from '../test-dist/services/localStorageService.js';

const key = 'estudoInteligenteHistory';
const session = { id: 'one', pdfName: 'Aula.pdf', date: '2026-01-01T12:00:00Z' };
let values;
beforeEach(() => {
  values = new Map();
  globalThis.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
});
test('saves, updates without duplicates, and reloads newest first', () => {
  assert.equal(saveStudySession(session), true);
  saveStudySession({ ...session, id: 'two', date: '2026-02-01T12:00:00Z' });
  saveStudySession({ ...session, summary: 'Revisão' });
  const history = getStudyHistory();
  assert.deepEqual(history.map(item => item.id), ['two', 'one']);
  assert.equal(history[1].summary, 'Revisão');
});
test('reports quota failure and preserves previously saved sessions', () => {
  saveStudySession(session);
  const previous = values.get(key);
  localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
  assert.equal(saveStudySession({ ...session, id: 'new' }), false);
  assert.equal(values.get(key), previous);
});
test('reports blocked deletion without pretending history was removed', () => {
  saveStudySession(session);
  localStorage.removeItem = () => { throw new Error('SecurityError'); };
  assert.equal(clearStudyHistory(), false);
  assert.equal(getStudyHistory().length, 1);
});
test('clears only the study history', () => {
  values.set('theme', 'dark');
  saveStudySession(session);
  assert.equal(clearStudyHistory(), true);
  assert.deepEqual(getStudyHistory(), []);
  assert.equal(values.get('theme'), 'dark');
});
