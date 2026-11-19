// Curriculum integrity: catch silent audio and unanswerable picture questions
// before publishing additional chapters.
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { activityPrompts, introTrack, lessons, storyTrack, volumes, wordTrack } from '../dist/lessons.js';

const asset = (path) => fileURLToPath(new URL(`../dist${path}`, import.meta.url));
const cats = readFileSync(asset('/assets/cats.svg'), 'utf8');
const gardenCards = readFileSync(asset('/assets/garden-cards.svg'), 'utf8');
const seenCats = new Set();
const seenCharacters = new Set();
const audio = new Set(Object.values(activityPrompts).map(({ track }) => track));
for (const volume of volumes) assert.ok(statSync(asset(volume.image)).isFile(), volume.title);
for (const lesson of lessons) {
  assert.ok(!seenCats.has(lesson.cat), `Duplicate lesson audio key: ${lesson.cat}`);
  seenCats.add(lesson.cat);
  assert.ok(cats.includes(`id="${lesson.cat}"`), `Missing cat illustration: ${lesson.cat}`);
  assert.equal(lesson.words.length, 2, lesson.name);
  assert.equal(lesson.phrases.length, 4, lesson.name);
  audio.add(introTrack(lesson));
  audio.add(storyTrack(lesson));
  for (const word of lesson.words) {
    assert.equal([...word.han].length, 1, word.han);
    assert.ok(!seenCharacters.has(word.han), `Duplicate target character: ${word.han}`);
    seenCharacters.add(word.han);
    assert.ok(word.strokes?.length > 0 && word.strokes.every((path) => path.startsWith('M')), `Missing strokes: ${word.han}`);
    assert.ok(word.py && word.action.length === 2 && word.hint.length === 2, word.han);
    assert.equal(new Set([word.han, ...word.near]).size, 4, `Ambiguous character choices: ${word.han}`);
    audio.add(wordTrack(word));
  }
  const pictures = new Set(lesson.phrases.map(({ art }) => art));
  assert.equal(pictures.size, 4, `Repeated picture meanings: ${lesson.name}`);
  for (const phrase of lesson.phrases) {
    assert.equal(phrase.py?.split(' ').length, [...phrase.han].length, `Missing pinyin: ${phrase.han}`);
    assert.equal(phrase.label.length, 2, phrase.han);
    assert.equal(phrase.alternatives.length, 2, phrase.han);
    assert.equal(new Set([phrase.art, ...phrase.alternatives]).size, 3, `Duplicate choices: ${phrase.han}`);
    assert.ok(phrase.alternatives.every((picture) => picture === 'inside' || pictures.has(picture)), `Unresolvable choices: ${phrase.han}`);
    if (volumes[lesson.volume].image === '/assets/garden.svg') {
      assert.ok(gardenCards.includes(`id="${phrase.art}"`), `Missing picture: ${phrase.art}`);
    }
    audio.add(wordTrack(phrase));
  }
}
for (const path of audio) assert.ok(statSync(asset(path)).size > 1000, `Missing or empty recording: ${path}`);
console.log(`Curriculum verified: ${volumes.length} books, ${lessons.length} lessons, ${seenCharacters.size} characters, ${audio.size} recordings.`);
