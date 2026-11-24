import assert from 'node:assert/strict';
import { lessons } from '../dist/lessons.js';
import { missions } from '../dist/missions.js';
import {
  createMission, missionFinished, missionLabels, missionSnapshot, missionTarget, paints,
  playMission, renderMission, trailOptions,
} from '../dist/mission-game.js';

assert.deepEqual(Object.keys(missions).sort(), lessons.map(({ cat }) => cat).sort());
const reverse = values => [...values].reverse();
const counts = {};
const select = (game, action, i) => playMission(game, action, i);

function checkMarkup(game) {
  for (const language of [0, 1]) {
    const { title, content } = renderMission(game, {
      t: (...text) => text[language], art: () => '', cat: '', landscape: '', icon: () => '',
      primary: () => '<button data-action="complete"></button>', secondary: () => '<button></button>',
    });
    assert.ok(title && content.includes(game.prompt[language]));
    assert.ok(!content.includes('undefined'));
    assert.equal(content.includes('data-action="complete"'), missionFinished(game));
  }
}

for (const lesson of lessons) {
  const plan = missions[lesson.cat];
  const { mode } = plan;
  counts[mode] = (counts[mode] ?? 0) + 1;
  assert.ok(Object.hasOwn(missionLabels, mode));
  assert.equal(plan.prompt.length, 2);
  if (plan.sequence) assert.deepEqual([...plan.sequence].sort(), [0, 1, 2, 3]);
  if (mode === 'sort') {
    assert.ok(plan.left.length > 0 && plan.left.length < 4);
    assert.deepEqual([...new Set(plan.left)].filter(i => [0, 1, 2, 3].includes(i)), plan.left);
  }
  if (mode === 'cloze') {
    assert.equal(plan.lines.length, 4);
    assert.ok(plan.lines.every(line => line.split('＿').length === 2));
  }
  if (mode === 'paint') assert.ok(lesson.words.every(({ han }) => Object.hasOwn(paints, han)));

  let game = createMission(lesson, null, reverse);
  checkMarkup(game);
  if (mode === 'pattern') {
    assert.equal(select(game, 'pick', plan.sequence[0]).answer, undefined);
    select(game, 'preview');
  }
  for (let step = 0; step < game.items.length; step++) {
    const target = missionTarget(game);
    let result;
    if (mode === 'trail') {
      const options = trailOptions(game);
      const right = options.indexOf(game.items[target].han);
      assert.equal(options.length, 3);
      assert.equal(new Set(options).size, 3);
      if (step === 0) assert.equal(select(game, 'pick', (right + 1) % 3).answer, undefined);
      result = select(game, 'pick', right);
    } else if (mode === 'sort') {
      const bin = Number(!plan.left.includes(step));
      assert.equal(select(game, 'bin', bin).answer, undefined);
      select(game, 'pick', step);
      if (step === 0) assert.equal(select(game, 'bin', 1 - bin).answer, undefined);
      result = select(game, 'bin', bin);
    } else if (mode === 'memory') {
      if (step === 0) {
        select(game, 'pick', 0);
        select(game, 'pick', 5);
        assert.equal(game.flipped.length, 2);
        assert.equal(game.completed.length, 0);
        select(game, 'reset');
      }
      select(game, 'pick', step);
      result = select(game, 'pick', step + 4);
    } else if (mode === 'search') {
      assert.equal(select(game, 'pick', 4).answer, undefined);
      result = select(game, 'pick', game.items.length - 1 - step);
    } else {
      if (step === 0) assert.equal(select(game, 'pick', (target + 1) % 4).answer, undefined);
      result = select(game, 'pick', target);
    }
    const expected = mode === 'search' ? game.items.length - 1 - step : target;
    assert.equal(result.answer, game.items[expected], lesson.name);
    assert.equal(result.firstTry, mode === 'search' || step > (mode === 'memory' ? 1 : 0), lesson.name);
    assert.equal(game.completed.length, step + 1);
    checkMarkup(game);
    if (step === 0) {
      const saved = JSON.parse(JSON.stringify(missionSnapshot(game)));
      game = createMission(lesson, saved, values => values);
      assert.deepEqual(missionSnapshot(game), saved);
      if (mode === 'pattern') select(game, 'preview');
    }
  }
  assert.ok(missionFinished(game), lesson.name);
  assert.equal(select(game, 'pick', 0).answer, undefined);
}
assert.deepEqual(Object.keys(counts).sort(), Object.keys(missionLabels).sort());
console.log(`Missions verified: ${lessons.length} stops, ${Object.keys(counts).length} mechanics, both languages, retry and resume.`);
