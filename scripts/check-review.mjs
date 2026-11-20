import assert from 'node:assert/strict';
import { lessons } from '../dist/lessons.js';

const key = 'meow-word-town-v2';
const storage = new Map([[key, JSON.stringify({
  completed: Array(16).fill('2026-11-19'),
  review: {
    上: { box: 2, last: '2000-01-01', due: '2000-01-03', tries: 3, right: 2 },
  },
})]]);
globalThis.localStorage = {
  getItem: (name) => storage.get(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
};

const { dayAfter, recordAnswer, reviewCharacters, state } = await import('../dist/progress.js');
const han = (words) => words.map((word) => word.han);
assert.equal(state.completed.length, 16, 'The former finish opens stop 17');
assert.deepEqual(reviewCharacters(0), []);
assert.deepEqual(han(reviewCharacters(1)), ['人', '口']);
assert.deepEqual(han(reviewCharacters(16)), ['包', '上'], 'Mix a recent character with the overdue character');

recordAnswer('上', true, 16);
recordAnswer('手', true);
state.completed.push(dayAfter());
assert.deepEqual(han(reviewCharacters(17)), ['手', '人'], 'Mix same-day and earlier characters');
recordAnswer('人', true, 17);
assert.deepEqual(han(reviewCharacters(17)), ['手', '口'], 'Rotate the older characters without waiting a day');
recordAnswer('人', true, 1);
assert.equal(state.review.人.reviewedAt, 17, 'Replaying an old stop does not rewind review history');
const restored = await import('../dist/progress.js?restored');
assert.equal(restored.state.review.人.reviewedAt, 17);
assert.deepEqual(han(restored.reviewCharacters(17)), ['手', '口']);
assert.ok(han(restored.reviewCharacters(4)).every((character) =>
  lessons.slice(0, 4).some(({ words }) => words.some((word) => word.han === character))));
console.log('Review verified: previous-stop recall, due dates, same-day rotation, replay and saved progress.');
