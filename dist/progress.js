import { lessons } from './lessons.js';

const key = 'meow-word-town-v2';
const intervals = [1, 2, 4, 7, 14];
const maxTestQuestions = 10;
const knownItems = new Map(lessons.flatMap(({ words, phrases }) =>
  [...words, ...phrases].map((item) => [item.han, item])));
const validDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

function readTest(result, completedCount) {
  if (!completedCount || !Number.isInteger(result?.total) || result.total < 1 || result.total > maxTestQuestions ||
      !Array.isArray(result.missed) || result.missed.length > result.total) return null;
  const learned = new Set(lessons.slice(0, completedCount).flatMap(({ words, phrases }) =>
    [...words, ...phrases].map(({ han }) => han)));
  if (new Set(result.missed).size !== result.missed.length ||
      !result.missed.every((han) => learned.has(han))) return null;
  return { total: result.total, missed: result.missed };
}

export function dayAfter(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part, i) => String(part).padStart(i === 0 ? 4 : 2, '0')).join('-');
}

function read() {
  let saved;
  let old;
  try {
    saved = JSON.parse(localStorage.getItem(key));
    old = JSON.parse(localStorage.getItem('meow-word-town-v1'));
  } catch { /* The game is still playable without stored progress. */ }
  const completed = [];
  for (let i = 0; i < lessons.length && validDate(saved?.completed?.[i]); i++) {
    completed.push(saved.completed[i]);
  }
  const review = Object.create(null);
  for (const han of knownItems.keys()) {
    const item = saved?.review?.[han];
    if (!item || !Number.isInteger(item.box) || item.box < 1 || item.box > 5 ||
        !validDate(item.last) || !validDate(item.due)) continue;
    const tries = Number.isSafeInteger(item.tries) && item.tries >= 0 ? item.tries : 0;
    const right = Number.isSafeInteger(item.right) && item.right >= 0 ? Math.min(item.right, tries) : 0;
    const reviewedAt = Number.isInteger(item.reviewedAt) && item.reviewedAt >= 0 && item.reviewedAt < lessons.length
      ? item.reviewedAt : undefined;
    review[han] = { box: item.box, last: item.last, due: item.due, tries, right, reviewedAt };
  }
  const resume = saved?.resume;
  return {
    opened: saved?.opened === true,
    sound: (saved?.sound ?? old?.sound) !== false,
    language: saved?.language === 'zh-Hans' ? 'zh-Hans' : 'en',
    completed,
    review,
    resume: resume?.index === completed.length ? resume : null,
    latestTest: readTest(saved?.latestTest, completed.length),
  };
}

export const state = read();

export function save() {
  try { localStorage.setItem(key, JSON.stringify(state)); }
  catch { /* Keep the current session playable if storage is disabled. */ }
}

export function availability(index) {
  if (index < state.completed.length) return 'done';
  return index === state.completed.length ? 'open' : 'locked';
}

export function reviewCharacters(index) {
  const earlier = lessons.slice(0, Math.min(index, state.completed.length)).flatMap(({ words }) => words);
  if (!earlier.length) return [];
  // Revisit the preceding stop even when several lessons are played on one day.
  const recent = earlier[earlier.length - 2 + (index - 1) % 2];
  const today = dayAfter();
  const due = (word) => Number(state.review[word.han]?.due <= today);
  const reviewedAt = (word) => state.review[word.han]?.reviewedAt ?? -1;
  const older = earlier.filter((word) => word !== recent)
    .sort((a, b) => due(b) - due(a) || reviewedAt(a) - reviewedAt(b))[0];
  return [recent, older];
}

export function testQuestions(shuffle) {
  const completed = lessons.slice(0, state.completed.length);
  const words = completed.flatMap((lesson) => lesson.words);
  const listening = shuffle(words).slice(0, maxTestQuestions / 2).map((answer) => {
    // A character with the same reading would also be right in an audio question.
    const others = words.filter((word) => word.py !== answer.py);
    const similar = others.filter((word) => answer.near.includes(word.han));
    const rest = others.filter((word) => !answer.near.includes(word.han));
    const choices = [...shuffle(similar), ...shuffle(rest)].slice(0, 3);
    return { answer, choices: shuffle([answer, ...choices]) };
  });
  const phrases = new Map();
  for (const lesson of completed) {
    for (const answer of lesson.phrases) phrases.set(answer.han, { answer, lesson });
  }
  const pictures = shuffle([...phrases.values()]).slice(0, maxTestQuestions - listening.length)
    .map(({ answer, lesson }) => {
      const others = lesson.phrases.filter((item) => answer.alternatives.includes(item.art));
      return { answer, lesson, choices: shuffle([answer, ...others]) };
    });
  return shuffle([...listening, ...pictures]);
}

export function testReviewItems(result) {
  return result.missed.map((han) => knownItems.get(han));
}

export function recordAnswer(han, firstTry, reviewStop) {
  if (!knownItems.has(han)) return;
  const today = dayAfter();
  const previous = state.review[han];
  let box = previous?.box ?? 1;
  if (previous && previous.last !== today) {
    box = Math.min(5, Math.max(1, box + (firstTry ? 1 : -1)));
  }
  state.review[han] = {
    box,
    last: today,
    due: previous?.last === today ? previous.due : dayAfter(intervals[box - 1]),
    tries: (previous?.tries ?? 0) + 1,
    right: (previous?.right ?? 0) + Number(firstTry),
    reviewedAt: reviewStop === undefined ? previous?.reviewedAt : Math.max(reviewStop, previous?.reviewedAt ?? -1),
  };
  save();
}
