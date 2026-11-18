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
    review[han] = { box: item.box, last: item.last, due: item.due, tries, right };
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

export function dueCharacters(lesson) {
  return lessons.slice(0, state.completed.length).flatMap(({ words }) => words)
    .filter(({ han }) => !lesson.words.some((word) => word.han === han)
      && state.review[han]?.due <= dayAfter())
    .slice(0, 2);
}

export function recordAnswer(han, firstTry) {
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
  };
  save();
}
