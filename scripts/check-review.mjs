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

const { dayAfter, recordAnswer, reviewCharacters, state, testQuestions, testReviewItems } = await import('../dist/progress.js');
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

const date = dayAfter();
const reverse = (items) => [...items].reverse();
assert.equal(state.latestTest, null, 'Progress from before tests were added still loads');
for (let completed = 0; completed <= lessons.length; completed++) {
  state.completed = Array(completed).fill(date);
  state.resume = { index: completed, stage: 'drive' };
  const earlier = lessons.slice(0, completed);
  const learnedCharacters = new Set(earlier.flatMap(({ words }) => words));
  const questions = testQuestions(reverse);
  assert.equal(questions.length, Math.min(completed * 6, 10));
  assert.equal(new Set(han(questions.map(({ answer }) => answer))).size, questions.length);
  assert.equal(questions.filter(({ lesson }) => !lesson).length, Math.min(completed * 2, 5));
  for (const { answer, choices, lesson } of questions) {
    assert.ok(choices.includes(answer));
    assert.ok(choices.length >= 2 && new Set(han(choices)).size === choices.length);
    if (lesson) {
      assert.ok(earlier.includes(lesson));
      assert.ok(choices.every((item) => lesson.phrases.includes(item)));
      assert.ok(choices.every((item) => item === answer || answer.alternatives.includes(item.art)));
    } else {
      assert.ok(choices.every((item) => learnedCharacters.has(item)));
      assert.ok(choices.every((item) => item === answer || item.py !== answer.py));
    }
  }
}

const saved = JSON.parse(storage.get(key));
const result = { total: 6, missed: ['人', '大人'] };
storage.set(key, JSON.stringify({ ...saved, latestTest: result }));
const withTest = await import('../dist/progress.js?with-test');
assert.deepEqual(withTest.state.latestTest, result);
assert.deepEqual(testReviewItems(result).map(({ py }) => py), ['rén', 'dà ren']);
assert.deepEqual(withTest.state.review, restored.state.review);
storage.set(key, JSON.stringify({ ...saved, completed: [date], latestTest: { total: 6, missed: ['太'] } }));
assert.equal((await import('../dist/progress.js?locked-item')).state.latestTest, null);
console.log('Tests verified: learned content only, both question types, distinct answers and saved results.');
