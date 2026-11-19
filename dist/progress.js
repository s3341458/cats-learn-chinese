import { lessons } from './lessons.js';

const key = 'meow-word-town-v2';
const intervals = [1, 2, 4, 7, 14];
const knownItems = new Set(lessons.flatMap(({ words, phrases }) =>
  [...words, ...phrases].map(({ han }) => han)));
const validDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

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
  for (const han of knownItems) {
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
