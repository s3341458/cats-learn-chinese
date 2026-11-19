import { activityPrompts, introTrack, lessons, storyTrack, traceGuide, volumes, wordTrack } from './lessons.js';
import { availability, dayAfter, dueCharacters, recordAnswer, save, state } from './progress.js';
import { setupTracing } from './tracing.js';

const $ = (id) => document.getElementById(id);
const panel = $('panel');
const journey = $('journey');
const scene = $('scene');
const narration = $('narration');
const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const cat = (id, css = '') => `<svg class="cat-art ${css}" viewBox="0 0 120 120" aria-hidden="true"><use href="/assets/cats.svg#${id}"/></svg>`;
const sprite = (id, css = '') => `<span class="sprite sprite-${id} ${css}" aria-hidden="true"></span>`;
const primary = (label, action, glyph = 'arrow') =>
  `<button class="primary" data-action="${action}">${label} ${icon(glyph)}</button>`;
const secondary = (label, action, glyph) =>
  `<button class="secondary" data-action="${action}">${glyph ? icon(glyph) : ''}${label}</button>`;
const statusLine = '<p id="speech-status" class="speech-status" role="status"></p>';
const stages = ['film', 'first', 'second', 'listen', 'build', 'match', 'story', 'stickers', 'drive'];
const stageNames = [
  ['Story intro', '故事开场'], ['First character', '第一个字'], ['Second character', '第二个字'],
  ['Listen and find', '听音找字'], ['Build a word', '拼词跟读'], ['Match the picture', '看字选图'],
  ['Read the story', '猫猫绘本'], ['Place stickers', '贴贴纸'], ['Find road signs', '开车认字'],
];
const localize = (english, chinese) => state.language === 'zh-Hans' ? chinese : english;
const lessonName = (lesson) => localize(lesson.nameEn, lesson.name);
const stickerName = (lesson) => localize(lesson.stickerEn, lesson.sticker);
const volumeName = (volume) => localize(volume.titleEn, volume.title);
const stopName = (index) => localize(`Stop ${index + 1}`, `第 ${index + 1} 站`);
const hanzi = (text) => `<span lang="zh-Hans">${text}</span>`;
const characterLessons = new Map(lessons.flatMap(({ words }) => words.map((word) => [word.han, word])));
const chromeText = [...document.querySelectorAll('[data-zh]')].map((element) =>
  [element, element.textContent, element.dataset.zh]);
const chromeLabels = [...document.querySelectorAll('[data-zh-label]')].map((element) =>
  [element, element.getAttribute('aria-label'), element.dataset.zhLabel]);
const languageControls = document.querySelectorAll('.language-select');
let run;
let timer;
let noticeTimer;
let parentTimer;
let parentHeld = false;
let speechId = 0;
let speechTimer;
let activeUtterance;
let cleanupTracing;
let panelReturn;
const characterCount = new Set(lessons.flatMap(({ words }) => words.map(({ han }) => han))).size;
const nextStop = () => Math.min(state.completed.length, lessons.length - 1);
let activeVolume = lessons[nextStop()].volume;

function notify(message) {
  clearTimeout(noticeTimer);
  $('notice').textContent = message;
  noticeTimer = setTimeout(() => { $('notice').textContent = ''; }, 3400);
}

function stopSpeech() {
  speechId++;
  clearTimeout(speechTimer);
  activeUtterance = null;
  narration.onplaying = null;
  narration.onended = null;
  narration.onerror = null;
  narration.onwaiting = null;
  narration.pause();
  window.speechSynthesis?.cancel();
}

function setSound(enabled) {
  state.sound = enabled;
  if (!enabled) stopSpeech();
  save();
  for (const button of [$('sound'), scene.querySelector('[data-action="toggle-sound"]')]) {
    if (!button) continue;
    button.setAttribute('aria-pressed', enabled);
    button.innerHTML = icon(enabled ? 'sound' : 'muted');
  }
}

function speechStatus(message) {
  const status = $('speech-status');
  if (status) status.textContent = message;
}

function speak(text, hint = '', onFailure) {
  stopSpeech();
  const currentId = speechId;
  const fallback = () => {
    if (currentId !== speechId) return;
    speechStatus(hint || localize('Audio could not play. Tap the listen button to try again.', '语音暂时无法播放，请点朗读按钮重试。'));
  };
  if (!state.sound) return fallback();
  const tryRecording = () => {
    if (currentId !== speechId) return;
    clearTimeout(speechTimer);
    if (onFailure) onFailure();
    else fallback();
  };
  if (!('speechSynthesis' in window)) return tryRecording();

  const speech = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  activeUtterance = utterance;
  utterance.lang = 'zh-CN';
  utterance.rate = 0.78;
  const voices = speech.getVoices();
  const voice = voices.find((item) => /^zh[-_]CN$/i.test(item.lang)) ||
    voices.find((item) => /^cmn(?:[-_]|$)/i.test(item.lang)) ||
    voices.find((item) => /^zh(?![-_](?:HK|MO|yue)(?:[-_]|$))/i.test(item.lang));
  if (!voice) return tryRecording();
  utterance.voice = voice;
  utterance.onstart = () => {
    if (currentId !== speechId) return;
    clearTimeout(speechTimer);
    speechStatus('');
  };
  utterance.onend = () => {
    if (currentId !== speechId) return;
    clearTimeout(speechTimer);
    activeUtterance = null;
  };
  utterance.onerror = () => {
    if (currentId === speechId) tryRecording();
  };
  speechStatus(localize('Loading Mandarin audio…', '正在加载普通话语音……'));
  speechTimer = setTimeout(tryRecording, 1500);
  try {
    if (speech.paused) speech.resume();
    speech.speak(activeUtterance);
  } catch {
    tryRecording();
  }
}

function updateLanguage() {
  document.documentElement.lang = state.language;
  for (const [element, english, chinese] of chromeText) element.textContent = localize(english, chinese);
  for (const [element, english, chinese] of chromeLabels) element.setAttribute('aria-label', localize(english, chinese));
  for (const select of languageControls) select.value = state.language;
}

function showHome(opened) {
  $('cover').hidden = opened;
  $('town').hidden = !opened;
  if (opened) renderMap();
}

function renderMap() {
  const count = state.completed.length;
  const volume = volumes[activeVolume];
  const currentVolume = lessons[nextStop()].volume;
  $('album-count').textContent = `${count} / ${lessons.length}`;
  $('progress-count').textContent = `${count} / ${lessons.length}`;
  $('course-progress').setAttribute('aria-valuemax', lessons.length);
  $('course-progress').setAttribute('aria-valuenow', count);
  $('progress-fill').style.width = `${count / lessons.length * 100}%`;
  $('sound').setAttribute('aria-pressed', state.sound);
  $('sound').innerHTML = icon(state.sound ? 'sound' : 'muted');
  const nextVolume = volumeName(volumes[currentVolume]);
  let tip = localize('Tap a highlighted stop. Finish it to open the next one.', '点亮的站点可以开始。完成一站就会开放下一站。');
  if (count === lessons.length) tip = localize('All stories finished! Tap any stop to read it again.', '所有故事都读完啦！点任意一站可以重读。');
  else if (activeVolume < currentVolume) tip = localize(`This book is finished. Open ${nextVolume} to keep going.`, `这册已读完。翻到「${nextVolume}」继续。`);
  else if (activeVolume > currentVolume) tip = localize(`Finish ${nextVolume} to open this book.`, `先完成「${nextVolume}」，再来这一册。`);
  $('map-tip').textContent = tip;
  $('routes').innerHTML = volumes.map((route, index) => {
    const done = lessons.slice(0, count).filter((lesson) => lesson.volume === index).length;
    return `<button id="route-${index}" data-route="${index}" aria-pressed="${activeVolume === index}" aria-controls="map-section">
      ${volumeName(route)}<span>${done} / ${route.lessons.length}</span></button>`;
  }).join('');
  if ($('map-art').getAttribute('src') !== volume.image) $('map-art').src = volume.image;
  $('map-name').textContent = volumeName(volume);
  $('map-section').setAttribute('aria-label', localize(`${volumeName(volume)} map`, `${volumeName(volume)}地图`));
  $('stops').innerHTML = lessons.map((lesson, i) => {
    if (lesson.volume !== activeVolume) return '';
    const status = availability(i);
    const resumed = status === 'open' && state.resume?.index === i;
    const label = {
      done: localize('completed, play again', '已完成，可以重读'),
      open: resumed ? localize('resume', '继续') : localize('start', '开始'),
      locked: localize('locked', '未解锁'),
    }[status];
    const style = status === 'open' ? 'current' : status;
    const badge = icon(status === 'done' ? 'check' : 'lock');
    return `<button class="stop is-${style}" id="stop-${i}" data-stop="${i}"
      aria-label="${stopName(i)} · ${lessonName(lesson)} · ${label}" style="--x:${lesson.at[0]}%;--y:${lesson.at[1]}%">
      <span class="stop-disc">${i + 1}${status === 'open' ? '' : `<span class="stop-lock">${badge}</span>`}</span>
      <span class="stop-label">${lessonName(lesson)}${status === 'open' ? `<span class="stop-tag">${resumed ? localize('Resume', '继续') : localize('Go', '出发')}</span>` : ''}</span>
    </button>`;
  }).join('');
}

function showPanel(title, content, returnId) {
  const opening = !panel.open;
  if (opening) panelReturn = returnId;
  $('panel-body').innerHTML = `<header class="panel-head"><h2 id="panel-title" tabindex="-1">${title}</h2>
    <button class="close" data-action="close-panel" aria-label="${localize('Close', '关闭')}">×</button></header>
    <div class="panel-content">${content}</div>`;
  if (opening) panel.showModal();
  $('panel-title').focus({ preventScroll: true });
  panel.scrollTop = 0;
}

function showAlbum() {
  showPanel(localize('Sticker book', '猫猫贴纸册'), `
    <p class="reward-copy">${localize(
      `${state.completed.length} of ${lessons.length} cat stickers collected.`,
      `已贴上 ${state.completed.length} / ${lessons.length} 张猫咪贴纸。`,
    )}</p>
    <ul class="sticker-grid">${lessons.map((lesson, i) => {
      const owned = i < state.completed.length;
      return `<li class="sticker${owned ? '' : ' is-empty'}">
        ${owned ? cat(lesson.cat) : icon('lock')}
        <b>${owned ? stickerName(lesson) : localize('To collect', '待收集')}</b><small>${lessonName(lesson)}</small>
      </li>`;
    }).join('')}</ul>`, 'album');
}

function showGuide() {
  const review = Object.entries(state.review);
  showPanel(localize('Grown-ups', '家长角'), `
    <div class="parent-controls">
      <p>${localize('Each stop opens as soon as you finish the one before it.', '完成一站后，下一站立即开放。')}</p>
      <ol class="parent-days">${lessons.map((lesson, index) => {
        const status = availability(index);
        const caption = status === 'done' ? state.completed[index] :
          { open: localize('Ready', '可开始'), locked: localize('Finish the previous stop', '等待前一站') }[status];
        const action = status === 'done'
          ? `<button class="secondary" data-replay="${index}">${localize('Play again', '重读')}</button>` : '';
        return `<li><b>${lessonName(lesson)} · ${hanzi(lesson.words.map(({ han }) => han).join('、'))}</b><span>${caption}</span>${action}</li>`;
      }).join('')}</ol>
      <h3>${localize('Reading progress', '认读记录')}</h3>
      <p>${localize('Characters due for review can appear in later listening activities.', '该复习的汉字会穿插到之后的听音题。')}</p>
      ${review.length ? `<div class="review-wrap"><table><thead><tr>
        <th>${localize('Character or word', '字词')}</th><th>${localize('Familiarity', '熟悉度')}</th>
        <th>${localize('Next review', '下次复习')}</th><th>${localize('First try', '一次答对')}</th></tr></thead>
      <tbody>${review.map(([han, item]) => `<tr><th lang="zh-Hans">${han}</th><td aria-label="${item.box} / 5">${'●'.repeat(item.box)}${'○'.repeat(5 - item.box)}</td>
        <td>${item.due <= dayAfter() ? localize('Due', '到期') : item.due}</td><td>${item.right} / ${item.tries}</td></tr>`).join('')}</tbody></table></div>`
        : `<p>${localize('Your results appear here after a listening, word-building, or picture activity.', '做过听音、拼词或选图后，就会出现记录。')}</p>`}
      <p>${localize('Progress and stickers are saved in this browser. Lesson audio is always in Mandarin.', '进度和贴纸保存在此浏览器。课程语音始终使用普通话。')}</p>
    </div>`, 'guide');
}

const artSymbols = {
  person: '🧍', mouth: '😮', big: '🙆', small: '🤏', sky: '🌤️',
  too: '🥵', tree: '🌳', root: '🌱', sun: '☀️', moon: '🌙',
};

const artSheets = [
  ['cards-town', ['adult', 'child', 'doorway', 'yawn', 'sunny-field', 'rainy-field', 'night-field', 'sweaty-cat', 'wood-door', 'wood-table', 'notebook', 'picture-book']],
  ['cards-outdoors', ['fish', 'kitten', 'gate', 'diary', 'mountain', 'round-stone', 'stone-bridge', 'trail', 'paddy', 'earth', 'potato', 'mud-wall']],
];
const pictures = new Map(artSheets.flatMap(([sheet, items]) => items.map((item, index) =>
  [item, `<span class="atlas-picture" aria-hidden="true" style="--sheet:url('/assets/${sheet}.jpg');--column:${index % 4 * 100 / 3}%;--row:${Math.floor(index / 4) * 50}%"></span>`],
)));
const insideOption = { art: 'inside', label: ['A ball inside a box', '小球在盒子里面'] };

function art(value, lesson) {
  if (pictures.has(value)) return pictures.get(value);
  if (['white-cloud', 'dark-cloud', 'white-rabbit', 'white-paper', 'strong-wind', 'rain-drops',
    'umbrella', 'raincoat', 'kite', 'red-flower', 'green-grass', 'empty-pot', 'straw-hat'].includes(value)) {
    return `<svg class="garden-picture" viewBox="0 0 160 160" aria-hidden="true"><use href="/assets/garden-cards.svg#${value}"/></svg>`;
  }
  if (value === 'cat') return cat(lesson.cat);
  if (value === 'map-stream') return '<span class="map-art map-stream" aria-hidden="true"></span>';
  if (['field-grid', 'soil', 'water-glass'].includes(value)) {
    return `<span class="object-art ${value}" aria-hidden="true"></span>`;
  }
  if (['above', 'below', 'inside'].includes(value)) {
    return `<span class="position-art ${value}" aria-hidden="true"><i></i><i></i></span>`;
  }
  if (value === 'big-fish' || value === 'small-fish') {
    return `<span class="fish-scene ${value}" aria-hidden="true">${pictures.get('fish')}</span>`;
  }
  if (value === 'stairs-up' || value === 'stairs-down') {
    return `<span class="stairs-art" aria-hidden="true"><i></i><b>${value === 'stairs-up' ? '↗' : '↙'}</b></span>`;
  }
  if (value === 'sunrise' || value === 'sunset') {
    return `<span class="solar-art ${value}" aria-hidden="true"><i></i><i></i><b>${value === 'sunrise' ? '↑' : '↓'}</b></span>`;
  }
  return `<span class="emoji-art" aria-hidden="true">${artSymbols[value] ?? value}</span>`;
}

function shuffle(values) {
  const spread = [...values];
  for (let i = spread.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [spread[i], spread[j]] = [spread[j], spread[i]];
  }
  return spread;
}

const currentLesson = () => lessons[run.index];
const currentWord = () => currentLesson().words[run.stage === 'first' ? 0 : 1];
const currentPhrase = () => currentLesson().phrases[run.round];
const chapterLandscape = (lesson) =>
  `style="--book-map:url('${volumes[lesson.volume].image}');--book-position:${lesson.at[0]}% center"`;

function initializeRound() {
  if (run.choices) return;
  const lesson = currentLesson();
  if (run.stage === 'listen') {
    const question = run.questions[run.round];
    run.choices = shuffle([question.han, ...question.near.slice(0, run.round === 0 ? 2 : 3)]);
  } else if (run.stage === 'build') {
    const item = currentPhrase();
    run.choices = shuffle([...new Set([...item.han, item.extra])]);
  } else if (run.stage === 'match') {
    const item = currentPhrase();
    run.choices = shuffle([item.art, ...item.alternatives]);
  } else if (run.stage === 'drive' && run.round < 6) {
    const item = roadQuestions()[run.round];
    run.choices = shuffle([item.han, ...item.alternatives]);
  }
}

function begin(index, resume = true) {
  const status = availability(index);
  if (status === 'locked') return notify(localize('Finish the previous stops to open this one.', '先完成前面的站点，再来这里喵！'));

  const lesson = lessons[index];
  const [first, second] = lesson.words;
  const saved = resume && index === state.resume?.index ? state.resume : null;
  const reviewWords = Array.isArray(saved?.reviewWords)
    ? saved.reviewWords.slice(0, 2).map((han) => lessons.slice(0, index).flatMap(({ words }) => words)
      .find((word) => word.han === han)).filter(Boolean)
    : dueCharacters(lesson);
  const questions = [first, first, second, second, ...reviewWords, first, second];
  const stage = stages.includes(saved?.stage) ? saved.stage : 'film';
  run = {
    index, stage, questions, reviewWords, visited: stages.indexOf(stage), round: 0,
    lane: 1, starred: [], stationary: matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
  if (saved) {
    const limit = { listen: questions.length - 1, build: 2, match: 3, drive: 6 }[stage] ?? 0;
    run.round = Number.isInteger(saved.round) ? Math.max(0, Math.min(limit, saved.round)) : 0;
    run.wordMode = ['glyph', 'trace'].includes(saved.wordMode) ? saved.wordMode : 'picture';
    run.stroke = Number.isInteger(saved.stroke) ? Math.max(0, saved.stroke) : 0;
    run.placed = Array.isArray(saved.placed) ? saved.placed.filter((item) => item === 'cat' || item === 'car') : [];
    run.starred = Array.isArray(saved.starred)
      ? [...new Set(saved.starred.filter((n) => Number.isInteger(n) && n >= 0 && n < 6))] : [];
  }
  if (panel.open) panel.close();
  journey.showModal();
  checkpoint();
  renderScene();
  playStageCue();
}

function checkpoint() {
  if (run.index !== state.completed.length || run.stage === 'finish') return;
  state.resume = {
    index: run.index, stage: run.stage, round: run.round, wordMode: run.wordMode,
    stroke: run.stroke, placed: run.placed, starred: run.starred,
    reviewWords: run.reviewWords.map(({ han }) => han),
  };
  save();
}

function resetRound() {
  run.choices = null;
  run.missed = new Set();
  run.hit = false;
  run.slots = '';
  run.driving = false;
  run.lane = 1;
}

function go(stage) {
  resetRound();
  Object.assign(run, { stage, round: 0, wordMode: 'picture', stroke: 0 });
  run.visited = Math.max(run.visited, stages.indexOf(stage));
  checkpoint();
  renderScene();
  playStageCue();
}

function advance() {
  go(stages[stages.indexOf(run.stage) + 1]);
}

function rounds(done, total) {
  return `<div class="rounds" aria-label="${localize(`${done} of ${total} activities completed`, `已完成 ${done} / ${total} 个小任务`)}">
    ${Array.from({ length: total }, (_, index) => `<i class="${index < done ? 'filled' : ''}"></i>`).join('')}
  </div>`;
}

function chapter(title, content, tip) {
  const index = stages.indexOf(run.stage);
  const lesson = currentLesson();
  return `<div class="chapter">
    <header class="chapter-nav">
      <button class="icon-button" data-action="home" aria-label="${localize('Back to the map', '返回地图')}">${icon('home')}</button>
      <div class="chapter-track" aria-label="${localize('Lesson steps', '关卡步骤')}">${stages.map((step, i) =>
        `<button data-stage="${step}" class="${i < index ? 'past' : ''}" aria-label="${localize(...stageNames[i])}"
          title="${localize(...stageNames[i])}" ${i > run.visited ? 'disabled' : ''} ${i === index ? 'aria-current="step"' : ''}>
          ${i === index ? cat(lesson.cat, 'track-cat') : i === stages.length - 1 ? '★' : '<i></i>'}
        </button>`).join('')}</div>
      <button class="icon-button" data-action="toggle-sound" aria-label="${localize('Sound', '发音')}" aria-pressed="${state.sound}">${icon(state.sound ? 'sound' : 'muted')}</button>
    </header>
    <div class="chapter-heading"><p>${stopName(run.index)} · ${lessonName(lesson)}</p><h2 id="scene-title" tabindex="-1">${title}</h2></div>
    <div class="chapter-content">
      ${activityPrompt() ? `<div class="prompt-controls">${secondary(localize('Hear instructions', '听题目说明'), 'hear-instructions', 'sound')}</div>` : ''}
      ${content}${statusLine}
    </div>
    <aside class="coach">${run.index === 0 ? sprite('cat') : cat(lesson.cat)}<div><b>${localize('Tip for grown-ups', '给大人的小提示')}</b><p>${tip}</p></div></aside>
  </div>`;
}

function showFilm() {
  const lesson = currentLesson();
  return chapter(hanzi(lesson.title), `
    <div class="film-frame" ${chapterLandscape(lesson)}><span class="film-scenery">${art(lesson.scene, lesson)}</span>${sprite('car', 'film-car')}<span class="film-spark" aria-hidden="true">✦</span></div>
    <p class="film-caption" lang="zh-Hans">${lesson.intro}</p>
    <div class="panel-actions">${secondary(localize('Play intro', '播放开场'), 'play-film', 'sound')}${primary(localize('Learn the characters', '开始认字'), 'advance')}</div>`,
    localize('Watch what happens to the cats, or go straight to the characters.', '先一起看看猫猫今天遇到了什么。孩子想直接认字时，可以跳过开场。'));
}

function playFilm() {
  const frame = scene.querySelector('.film-frame');
  const animate = () => {
    frame.classList.remove('playing');
    requestAnimationFrame(() => {
      if (frame.isConnected) frame.classList.add('playing');
    });
  };
  const lesson = currentLesson();
  playSceneAudio(introTrack(lesson), lesson.intro, localize('Play intro', '播放开场'), { onStart: animate });
}

function playSceneAudio(track, text, replayLabel, { hint = '', onStart, fallbackToSpeech = true } = {}) {
  stopSpeech();
  const currentId = speechId;
  if (!state.sound) {
    speechStatus(localize('Sound is off. Tap a listen button to turn it on.', '声音已关闭，点朗读按钮即可开启。'));
    onStart?.();
    return;
  }

  const failed = (error) => {
    if (currentId !== speechId) return;
    clearTimeout(speechTimer);
    onStart?.();
    if (error?.name === 'NotAllowedError') {
      stopSpeech();
      speechStatus(localize(`Tap “${replayLabel}” to listen.`, `点「${replayLabel}」听一遍。`));
    } else if (fallbackToSpeech) {
      speak(text, hint);
    } else {
      stopSpeech();
      speechStatus(localize(`Audio could not play. Tap “${replayLabel}” to try again.`, `语音暂时无法播放，请点「${replayLabel}」重试。`) + (hint ? ` ${hint}` : ''));
    }
  };
  const loading = () => {
    if (currentId !== speechId) return;
    clearTimeout(speechTimer);
    speechStatus(localize('Loading Mandarin audio…', '正在加载普通话语音……'));
    speechTimer = setTimeout(() => failed(), 8000);
  };
  narration.onplaying = () => {
    if (currentId !== speechId) return;
    clearTimeout(speechTimer);
    speechStatus('');
    onStart?.();
  };
  narration.onended = () => {
    if (currentId !== speechId) return;
    clearTimeout(speechTimer);
    speechStatus('');
  };
  narration.onerror = () => failed();
  narration.onwaiting = loading;
  if (narration.getAttribute('src') !== track) narration.src = track;
  narration.currentTime = 0;
  loading();
  narration.play().catch(failed);
}

function playTraceGuide() {
  playSceneAudio(traceGuide.track, traceGuide.text, localize('Hear tracing instructions', '听写字提示'));
}

function activityPrompt() {
  if (['first', 'second'].includes(run.stage)) return activityPrompts[run.wordMode];
  if (run.stage === 'drive' && run.round === 6) return null;
  return activityPrompts[run.stage];
}

function hearInstructions() {
  const prompt = activityPrompt();
  if (prompt) playSceneAudio(prompt.track, prompt.text, localize('Hear instructions', '听题目说明'));
}

function traceCard(word) {
  return `<svg id="trace" class="trace-card" viewBox="0 0 240 240" role="img" aria-label="${localize(`Tracing grid for ${word.han}`, `${word.han}的描红格`)}">
    <path class="trace-grid" d="M0 120H240M120 0V240M0 0l240 240M240 0 0 240"/>
    ${word.strokes.map((path) => `<path class="trace-guide" d="${path}"/>`).join('')}
    ${word.strokes.map((path) => `<path class="trace-path" pathLength="1" d="${path}"/>`).join('')}
    <circle class="trace-start" r="9"/>
  </svg>`;
}

function traceProgress(stroke, total) {
  return stroke >= total ? localize('Finished!', '写好啦！') :
    localize(`Stroke ${stroke + 1} of ${total}`, `第 ${stroke + 1} 笔，共 ${total} 笔`);
}

function showWord() {
  const word = currentWord();
  const lesson = currentLesson();
  const mode = run.wordMode;
  if (mode === 'trace') {
    const done = run.stroke >= word.strokes.length;
    return chapter(localize(`Trace ${hanzi(word.han)}`, `跟猫猫写「${word.han}」`), `
      ${traceCard(word)}
      <p class="phase-copy" id="trace-count" role="status">${traceProgress(run.stroke, word.strokes.length)}</p>
      <p class="phase-copy" id="trace-instruction" ${done ? 'hidden' : ''}>${localize('Start at the bright dot. Follow the gray line slowly.', traceGuide.text)}</p>
      <div class="panel-actions">${secondary(localize('Hear the character', '听这个字'), 'hear-word', 'sound')}</div>
      <div class="panel-actions" id="trace-actions">${done
        ? primary(localize('Continue', '继续'), 'advance') :
          `${secondary(localize('Hear tracing instructions', '听写字提示'), 'hear-trace', 'sound')}
          ${secondary(localize('Show the stroke', '看示范'), 'demo-stroke')}
          ${secondary(localize('Skip tracing', '跳过描红'), 'advance', 'arrow')}`}</div>`,
      localize('Let your child trace at their own pace. Show the next stroke if they need help.', '请让孩子照自己的速度写。需要帮忙时，可以先看这一笔怎么写。'));
  }
  const revealed = mode === 'glyph';
  return chapter(revealed ? localize(`Read ${hanzi(word.han)} aloud`, `一起读「${word.han}」`) :
    localize('Tap the picture to reveal the character', '点图，看看会变成什么字'), `
    <button class="picture-word ${revealed ? 'revealed' : ''}" data-action="turn-word"
      aria-label="${revealed ? localize(`Trace ${word.han}`, `读完了，描写${word.han}`) :
        localize(`Reveal the character for ${word.meaning}`, '点图看字')}">
      ${revealed ? `<strong class="big-han" lang="zh-Hans">${word.han}</strong><span class="pinyin" lang="zh-Latn">${word.py}</span><span class="meaning" lang="en">${word.meaning}</span>`
        : art(word.art, lesson)}
    </button>
    <div class="panel-actions">${revealed ? `${secondary(localize('Listen again', '再听一遍'), 'hear-word', 'sound')}${primary(localize('Trace it', '写一写'), 'turn-word')}`
      : secondary(localize('Show character', '看汉字'), 'turn-word', 'arrow')}</div>`,
    localize(...word.action));
}

function tile(value, index, extra = '') {
  const css = [run.missed.has(index) ? 'miss' : '', extra].join(' ');
  return `<button class="tile ${css}" data-pick="${index}" lang="zh-Hans" ${run.hit ? 'disabled' : ''}>${value}</button>`;
}

function quizFeedback(label) {
  return `<p id="feedback" class="phase-copy" role="status">${label}</p><div id="quiz-next" class="panel-actions"></div>`;
}

function showListening() {
  const question = run.questions[run.round];
  return chapter(localize('Listen and find the character', '听一听，找一找'), `
    ${rounds(run.round, run.questions.length)}
    ${secondary(localize('Hear the character', '听这个字'), 'hear-question', 'sound')}
    <div class="tile-row">${run.choices.map((han, i) => tile(han, i)).join('')}</div>
    ${quizFeedback(localize('Tap the character you hear.', '听一听，然后点出你听到的字。'))}
    <button class="text-button" data-action="show-hint">${localize('Show pinyin hint', '用拼音提示')}</button>`,
    localize(`If your child needs help, give them this hint. ${question.hint[0]}`, `需要帮忙时，想一想：${question.hint[1]}`));
}

function showBuild() {
  const item = currentPhrase();
  const ready = run.slots === item.han;
  const hearWord = secondary(localize('Hear the word', '听这个词'), 'hear-phrase', 'sound');
  return chapter(ready ? localize('Read the word aloud', '拼好啦，读一读') :
    localize('Listen and tap the characters in order', '听词语，按顺序点字'), `
    ${rounds(run.round, 3)}
    <div class="build-board">
      <div class="art-card" role="img" aria-label="${localize(...item.label)}">${art(item.art, currentLesson())}</div>
      <div class="slots" aria-label="${localize('Word slots', '拼词格')}">${[...item.han].map((_, i) => `<span class="slot ${run.slots?.[i] ? 'filled' : ''}" lang="zh-Hans">${run.slots?.[i] ?? ''}</span>`).join('')}</div>
    </div>
    ${ready ? `<div class="panel-actions">${hearWord}${primary(localize('I read it', '读过了'), 'next-item', 'check')}</div>`
      : `<div class="tile-row small-tiles">${run.choices.map((han, i) => tile(han, i)).join('')}</div>
        <div class="panel-actions">${hearWord}${run.slots ? secondary(localize('Start over', '重新拼'), 'clear-build') : ''}</div>
        <p id="feedback" class="phase-copy" role="status">${localize('Listen to the whole word, then start with the first character.', '听完整个词，再从第一个字开始点。')}</p>`}`,
    ready ? localize('Have your child read the word, then tap “I read it”.', '请孩子把拼好的词读一遍，读完点「读过了」。') :
      localize('Play the word again if your child needs help hearing which character comes first.', '可以再听一遍。请孩子想想先听到了哪个字，再听到了哪个字。'));
}

function showMatch() {
  const item = currentPhrase();
  const lesson = currentLesson();
  const positionHint = ['above', 'below'].includes(item.art)
    ? localize('Look at where the ball is in relation to the box.', '看小球在盒子的哪边。')
    : localize('Which picture matches this word?', '哪张图表示这个词？');
  return chapter(localize('Read the word and pick a picture', '读一读，选图片'), `
    ${rounds(run.round, lesson.phrases.length)}
    <div class="read-card" lang="zh-Hans">${item.han}</div>
    <span class="pinyin" lang="zh-Latn">${item.py}</span>
    <div class="panel-actions">${secondary(localize('Hear the word', '听这个词'), 'hear-phrase', 'sound')}</div>
    <p class="phase-copy">${positionHint}</p>
    <div class="tile-row picture-tiles">${run.choices.map((value, i) => {
      const option = value === 'inside' ? insideOption : lesson.phrases.find(({ art }) => art === value);
      return `<button class="tile" data-pick="${i}" aria-label="${localize(...option.label)}">${art(option.art, lesson)}</button>`;
    }).join('')}</div>
    ${quizFeedback('')}`,
    localize('Let your child try reading first. They can tap “Hear the word” for help.', '让孩子先自己读卡片。卡住时，可以点「听这个词」。'));
}

function storyText(lesson) {
  const familiar = new Set(lessons.slice(0, run.index + 1).flatMap(({ words }) => words.map(({ han }) => han)));
  return [...lesson.story].map((char) => familiar.has(char)
    ? `<button class="story-hanzi" data-say="${char}">${char}</button>` : char).join('');
}

function showStory() {
  const lesson = currentLesson();
  return chapter(localize('Read the story together', '一起读绘本'), `
    <div class="spread">
      <figure class="storybook-art" ${chapterLandscape(lesson)}>${sprite('car')}<span>${art(lesson.scene, lesson)}</span></figure>
      <article class="storybook-text" lang="zh-Hans"><h3>${lesson.title}</h3><p>${storyText(lesson)}</p></article>
    </div>
    <div class="panel-actions">${secondary(localize('Read the page aloud', '朗读整页'), 'read-story', 'sound')}${primary(localize('Done reading', '读完了'), 'advance')}</div>`,
    localize('Pause at each yellow character and let your child read it. Tap a character to hear it.', '大人读故事，读到黄色汉字就停一停，让孩子接着念。点任意黄色汉字可以听它的读音。'));
}

function showStickers() {
  const lesson = currentLesson();
  const placed = new Set(run.placed);
  const stickerLabel = (kind) => kind === 'cat' ? stickerName(lesson) : localize('Cat car', '猫猫小车');
  return chapter(localize(`Place ${stickerName(lesson)} and the cat car`, `贴上${stickerName(lesson)}和它的小车`), `
    <div class="sticker-sheet">
      ${['cat', 'car'].map((item) => `<div class="sticker-space ${placed.has(item) ? 'stuck' : ''}" data-slot="${item}">
        ${item === 'cat' && run.index ? cat(lesson.cat) : sprite(item)}
        <span>${stickerLabel(item)}</span>
      </div>`).join('')}
    </div>
    <div class="sticker-tray">
      ${['cat', 'car'].filter((item) => !placed.has(item)).map((item) => `<button class="pick-sticker" draggable="true" data-sticker="${item}" aria-label="${localize(`Place ${stickerLabel(item)}`, `贴上${stickerLabel(item)}`)}">
        ${item === 'cat' && run.index ? cat(lesson.cat) : sprite(item)}
      </button>`).join('')}
    </div>
    <div class="panel-actions">${placed.size === 2 ? primary(localize('Let’s drive', '开车出发'), 'advance') :
      `<p class="phase-copy">${localize('Tap each sticker or drag it to its outline.', '点贴纸，或者拖到上面的轮廓。')}</p>`}</div>`,
    localize('Place both stickers to take the cat car out and look for road signs.', '让孩子把两张贴纸贴到轮廓上。贴好就可以开着猫猫小车去找路牌。'));
}

function roadQuestions() {
  const lesson = currentLesson();
  const letters = lesson.words.map((word) => ({ ...word, alternatives: word.near.slice(0, 2) }));
  const words = lesson.phrases.map((item, i) => ({
    ...item,
    alternatives: lesson.phrases.filter((_, j) => i !== j).slice(0, 2).map(({ han }) => han),
  }));
  return [...letters, ...words];
}

function showDrive() {
  if (run.round === 6) {
    return chapter(localize('The cat reached the finish!', '猫猫到达终点啦！'), `
      ${rounds(6, 6)}<div class="finish-road">${sprite('car')}<span aria-hidden="true">🏁</span></div>
      <p class="phase-copy">${localize(`6 signs read · ${run.starred.length} / 6 stars`, `读过 6 块路牌 · 得到 ${run.starred.length} / 6 颗星星`)}</p>
      ${primary(localize('Finish this stop', '盖上过关印章'), 'complete', 'check')}`,
      localize('Ask your child which character they liked best, then stamp the page.', '陪孩子回想最喜欢的一个字，再盖章完成。'));
  }
  const label = [localize('Left lane', '左车道'), localize('Middle lane', '中间车道'), localize('Right lane', '右车道')];
  return chapter(localize('Drive the cat car and find the signs', '开猫猫小车，找到路牌'), `
    ${rounds(run.round, 6)}
    <div class="road ${run.driving && !run.stationary ? 'moving' : ''}" id="road">
      ${run.choices.map((han, i) => `<button data-lane="${i}" class="lane" aria-label="${label[i]} · ${han}"
        ${!run.driving || run.hit ? 'disabled' : ''}><span class="road-sign ${han.length > 2 ? 'is-long' : ''}" lang="zh-Hans">${han}</span></button>`).join('')}
      <span class="road-car" style="--lane:${run.lane}">${sprite('car')}</span>
    </div>
    <p class="phase-copy" id="road-status" role="status">${run.driving
      ? localize('Listen, then tap the lane with the matching sign.', '听清要找的字或词，再点它所在的车道。')
      : localize('Tap “Start” to hear the first sign.', '点「出发」，听听要找哪个字或词。')} · ★ ${run.starred.length}</p>
    <div class="panel-actions">${run.driving
      ? secondary(localize('Hear the sign again', '再听路牌'), 'hear-road', 'sound')
      : primary(localize('Start', '出发'), 'start-drive')}
      ${secondary(run.stationary ? localize('Turn on animation', '开启行驶动画') : localize('Turn off animation', '关闭行驶动画'), 'drive-mode')}</div>`,
    localize('Take your time. Picking the right sign on the first try earns a star.', '慢慢听，再选路牌。一次选对就能拿到星星。'));
}

function showFinish() {
  const last = run.index === lessons.length - 1;
  const lesson = currentLesson();
  const route = volumes[lesson.volume];
  const next = lessons[run.index + 1];
  const endOfVolume = last || next.volume !== lesson.volume;
  const title = last ? localize('You finished Cats Learn Chinese!', '猫猫学中文毕业啦！') :
    endOfVolume ? localize(`You finished ${volumeName(route)}!`, `${volumeName(route)}读完啦！`) :
      localize(`${lessonName(lesson)} complete!`, `${lessonName(lesson)}探险完成！`);
  const [first, second] = lesson.words.map(({ han }) => hanzi(han));
  const read = localize(`You learned ${first} and ${second}. `, `这关认识了「${first}」和「${second}」。`);
  const nextVolume = next && volumeName(volumes[next.volume]);
  const note = last ? '' : endOfVolume
    ? localize(`Open ${nextVolume} to keep going.`, `翻到「${nextVolume}」继续。`)
    : localize('The next stop is open.', '下一站已经开放。');
  return `<div class="chapter finish-page">
    <div class="finish-stamp">${icon('check')} ${stopName(run.index)}</div>
    <h2 id="scene-title" tabindex="-1">${title}</h2>
    <div class="finish-cats">${endOfVolume
      ? (last ? lessons : route.lessons).map((item) => cat(item.cat)).join('')
      : `${run.index ? cat(lesson.cat) : sprite('cat')}${sprite('car')}`}</div>
    <p>${last ? localize(
      `You read ${lessons.length} stories, learned ${characterCount} characters, and collected every sticker.`,
      `读完 ${lessons.length} 个故事，认识 ${characterCount} 个汉字，贴纸册也集齐了。`,
    ) : read + note}</p>
    <div class="panel-actions">${secondary(localize('View stickers', '看看贴纸册'), 'finish-album', 'book')}${primary(localize('Back to the map', '回到地图'), 'home', 'home')}</div>
  </div>`;
}

const renderers = {
  film: showFilm, first: showWord, second: showWord, listen: showListening,
  build: showBuild, match: showMatch, story: showStory, stickers: showStickers,
  drive: showDrive, finish: showFinish,
};

function renderScene(focus = true) {
  stopSpeech();
  clearTimeout(timer);
  run.missed ??= new Set();
  run.slots ??= '';
  run.wordMode ??= 'picture';
  run.stroke ??= 0;
  run.placed ??= [];
  initializeRound();
  scene.innerHTML = renderers[run.stage]();
  if (focus) $('scene-title').focus({ preventScroll: true });
  if (focus) journey.scrollTop = 0;
  cleanupTracing = null;
  if ($('trace')) {
    const word = currentWord();
    cleanupTracing = setupTracing($('trace'), Math.min(run.stroke, word.strokes.length), (count) => {
      run.stroke = count;
      checkpoint();
      $('trace-count').textContent = traceProgress(count, word.strokes.length);
      if (count === word.strokes.length) {
        stopSpeech();
        $('trace-instruction').hidden = true;
        $('trace-actions').innerHTML = primary(localize('Continue', '继续'), 'advance');
        $('trace-actions').querySelector('button').focus({ preventScroll: true });
      }
    });
  }
}

function nextItem() {
  const count = { listen: run.questions.length, build: 3, match: currentLesson().phrases.length }[run.stage];
  if (run.round + 1 === count) {
    return advance();
  }
  run.round++;
  resetRound();
  checkpoint();
  renderScene();
  playStageCue();
}

function playStageCue() {
  if (run.stage === 'film') playFilm();
  if (['first', 'second'].includes(run.stage)) {
    if (run.wordMode === 'glyph') hearCharacter(currentWord(), localize('Listen again', '再听一遍'));
    else hearInstructions();
  }
  if (run.stage === 'listen') hearQuestion();
  if (['build', 'match'].includes(run.stage)) hearPhrase();
  if (run.stage === 'story') readStory();
  if (run.stage === 'stickers') hearInstructions();
  if (run.stage === 'drive' && run.round < 6) {
    if (run.driving && !run.hit) hearRoad();
    else hearInstructions();
  }
}

function pinyinHint(word) {
  return localize(`Pinyin hint: ${word.py}`, `听音提示：${word.py}`);
}

function hearCharacter(word, replayLabel) {
  const hint = pinyinHint(word);
  speak(word.han, hint, () => {
    playSceneAudio(wordTrack(word), word.han, replayLabel, { hint, fallbackToSpeech: false });
  });
}

function hearQuestion() {
  const word = run.questions[run.round];
  hearCharacter(word, localize('Hear the character', '听这个字'));
}

function hearPhrase() {
  const phrase = currentPhrase();
  const hint = localize(`Ask a grown-up to read “${phrase.han}”.`, `请大人读一遍「${phrase.han}」。`);
  playSceneAudio(wordTrack(phrase), phrase.han, localize('Hear the word', '听这个词'), { hint });
}

function choose(index, button) {
  if (run.hit) return;
  const choice = run.choices[index];
  if (choice === undefined) return;
  const { stage } = run;
  if (stage === 'build') {
    const phrase = currentPhrase();
    if (run.slots === phrase.han) return;
    if (choice !== phrase.han[run.slots.length]) {
      run.missed.add(index);
      button.classList.add('miss');
      $('feedback').textContent = localize('Listen again for the next character.', '这个字还没轮到。再听一遍，找下一个字。');
      return;
    }
    run.slots += choice;
    if (run.slots === phrase.han) {
      recordAnswer(phrase.han, run.missed.size === 0);
      renderScene();
      hearPhrase();
    } else {
      const slot = scene.querySelector('.slots').children[run.slots.length - 1];
      slot.textContent = choice;
      slot.classList.add('filled');
      if (!scene.querySelector('[data-action="clear-build"]')) {
        scene.querySelector('[data-action="hear-phrase"]').insertAdjacentHTML(
          'afterend', secondary(localize('Start over', '重新拼'), 'clear-build'),
        );
      }
    }
    return;
  }

  const target = stage === 'listen' ? run.questions[run.round].han : currentPhrase().art;
  if (choice !== target) {
    run.missed.add(index);
    button.classList.add('miss');
    $('feedback').textContent = stage === 'listen'
      ? localize('Listen again and try a different character.', '再听一遍，看看另一个字。')
      : localize('Read the word again and try a different picture.', '再读一遍这个词，找一找它说的是哪张图。');
    return;
  }
  run.hit = true;
  recordAnswer(stage === 'listen' ? target : currentPhrase().han, run.missed.size === 0);
  scene.querySelectorAll('[data-pick]').forEach((option) => { option.disabled = true; });
  button.classList.remove('miss');
  button.classList.add('hit');
  $('feedback').textContent = localize('You found it!', '找对啦！');
  $('quiz-next').innerHTML = primary(localize('Continue', '继续'), 'next-item');
  $('quiz-next').querySelector('button').focus({ preventScroll: true });
}

function placeSticker(kind) {
  if (run.stage !== 'stickers' || !['cat', 'car'].includes(kind) || run.placed.includes(kind)) return;
  run.placed.push(kind);
  checkpoint();
  renderScene(false);
  scene.querySelector('.pick-sticker, [data-action="advance"]')?.focus({ preventScroll: true });
}

function hearRoad() {
  const item = roadQuestions()[run.round];
  if (!item) return;
  const label = localize('Hear the sign again', '再听路牌');
  if (item.strokes) hearCharacter(item, label);
  else playSceneAudio(wordTrack(item), item.han, label, {
    hint: localize(`Find this sign: ${item.han}`, `找这块路牌：${item.han}`),
  });
}

function readStory() {
  playSceneAudio(storyTrack(currentLesson()), currentLesson().story, localize('Read the page aloud', '朗读整页'));
}

function startDrive() {
  run.driving = true;
  run.hit = false;
  renderScene(false);
  scene.querySelector('.lane')?.focus({ preventScroll: true });
  hearRoad();
}

function chooseLane(lane) {
  if (!run.driving || run.hit) return;
  const target = roadQuestions()[run.round].han;
  run.lane = lane;
  scene.querySelector('.road-car').style.setProperty('--lane', lane);
  const button = scene.querySelector(`[data-lane="${lane}"]`);
  if (run.choices[lane] !== target) {
    run.missed.add(lane);
    scene.querySelector('.lane.miss')?.classList.remove('miss');
    button.classList.add('miss');
    $('road-status').textContent = localize('Listen again and try another lane.', '再听一遍，试试另一条车道。');
    return;
  }

  run.hit = true;
  $('road').classList.remove('moving');
  scene.querySelectorAll('[data-lane]').forEach((option) => { option.disabled = true; });
  button.classList.remove('miss');
  button.classList.add('hit');
  const firstTry = run.missed.size === 0;
  if (firstTry && !run.starred.includes(run.round)) run.starred.push(run.round);
  recordAnswer(target, firstTry);
  $('road-status').textContent = localize(`Right sign! · ★ ${run.starred.length}`, `读对了这块路牌！ · ★ ${run.starred.length}`);
  run.round++;
  checkpoint();
  timer = setTimeout(() => {
    resetRound();
    if (run.round === 6) renderScene();
    else startDrive();
  }, 650);
}

function complete() {
  if (run.index === state.completed.length) {
    state.completed.push(dayAfter());
    state.resume = null;
    save();
  }
  go('finish');
  renderMap();
}

$('open-book').addEventListener('click', () => {
  state.opened = true;
  save();
  showHome(true);
  window.scrollTo(0, 0);
  $('stop-' + nextStop())?.focus({ preventScroll: true });
});
$('cover-back').addEventListener('click', () => {
  state.opened = false;
  save();
  showHome(false);
  $('open-book').focus();
});
for (const select of languageControls) {
  select.addEventListener('change', () => {
    state.language = select.value;
    save();
    $('notice').textContent = '';
    updateLanguage();
    if (state.opened) renderMap();
  });
}
$('stops').addEventListener('click', (event) => {
  const stop = event.target.closest('[data-stop]');
  if (stop) begin(Number(stop.dataset.stop));
});
$('routes').addEventListener('click', (event) => {
  const target = event.target.closest('[data-route]');
  if (!target) return;
  activeVolume = Number(target.dataset.route);
  renderMap();
  $(`route-${activeVolume}`).focus({ preventScroll: true });
});
$('sound').addEventListener('click', () => {
  setSound(!state.sound);
  notify(state.sound ? localize('Sound is on.', '发音已开启。') : localize('Sound is off.', '发音已关闭。'));
});
$('album').addEventListener('click', showAlbum);
const guide = $('guide');
guide.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  parentHeld = false;
  clearTimeout(parentTimer);
  parentTimer = setTimeout(() => {
    parentHeld = true;
    showGuide();
  }, 700);
});
for (const type of ['pointerup', 'pointercancel', 'pointerleave']) {
  guide.addEventListener(type, () => clearTimeout(parentTimer));
}
guide.addEventListener('click', (event) => {
  if (event.detail === 0) showGuide();
  else if (!parentHeld) notify(localize('Press and hold “Grown-ups” to open.', '请按住「家长角」打开。'));
});
panel.addEventListener('close', () => {
  if (!journey.open && !panel.open) $(panelReturn)?.focus({ preventScroll: true });
});
panel.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.action === 'close-panel') panel.close();
  if (button.dataset.replay !== undefined) begin(Number(button.dataset.replay), false);
});

journey.addEventListener('close', () => {
  if (journey.open) return;
  let index = run?.index;
  if (run?.stage === 'finish' && index + 1 === state.completed.length) index = nextStop();
  if (lessons[index]) activeVolume = lessons[index].volume;
  clearTimeout(timer);
  stopSpeech();
  run = null;
  renderMap();
  if (!panel.open) $(`stop-${index}`)?.focus({ preventScroll: true });
});

scene.addEventListener('dragstart', (event) => {
  const kind = event.target.closest('[data-sticker]')?.dataset.sticker;
  if (kind) event.dataTransfer.setData('text/plain', kind);
});
scene.addEventListener('dragover', (event) => {
  if (run?.stage === 'stickers' && event.target.closest('[data-slot]')) event.preventDefault();
});
scene.addEventListener('drop', (event) => {
  const slot = event.target.closest('[data-slot]');
  if (!slot) return;
  event.preventDefault();
  const kind = event.dataTransfer.getData('text/plain');
  if (kind === slot.dataset.slot) placeSticker(kind);
});

scene.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button || !run) return;
  const { action, pick, stage, say, sticker, lane } = button.dataset;
  if (pick !== undefined) return choose(Number(pick), button);
  if (sticker) return placeSticker(sticker);
  if (lane !== undefined) return chooseLane(Number(lane));
  if (stage && stage !== run.stage && stages.indexOf(stage) <= run.visited) return go(stage);
  const playsAudio = say || action?.startsWith('hear-') ||
    ['play-film', 'read-story', 'start-drive'].includes(action);
  if (playsAudio && !state.sound) setSound(true);
  if (say) return hearCharacter(characterLessons.get(say), say);
  switch (action) {
    case 'home':
      journey.close();
      break;
    case 'toggle-sound':
      setSound(!state.sound);
      if (state.sound) playStageCue();
      break;
    case 'advance':
      advance();
      break;
    case 'play-film':
      playFilm();
      break;
    case 'turn-word':
      run.wordMode = run.wordMode === 'picture' ? 'glyph' : 'trace';
      checkpoint();
      renderScene();
      if (run.wordMode === 'glyph') hearCharacter(currentWord(), localize('Listen again', '再听一遍'));
      else if (run.stroke < currentWord().strokes.length) playTraceGuide();
      break;
    case 'hear-instructions':
      hearInstructions();
      break;
    case 'hear-trace':
      playTraceGuide();
      break;
    case 'demo-stroke':
      cleanupTracing?.();
      break;
    case 'hear-word':
      hearCharacter(currentWord(), localize('Listen again', '再听一遍'));
      break;
    case 'hear-question':
      hearQuestion();
      break;
    case 'show-hint':
      $('speech-status').textContent = pinyinHint(run.questions[run.round]);
      break;
    case 'next-item':
      nextItem();
      break;
    case 'hear-phrase':
      hearPhrase();
      break;
    case 'clear-build':
      run.slots = '';
      renderScene();
      hearPhrase();
      break;
    case 'read-story':
      readStory();
      break;
    case 'start-drive':
      startDrive();
      break;
    case 'hear-road':
      hearRoad();
      break;
    case 'drive-mode': {
      run.stationary = !run.stationary;
      $('road').classList.toggle('moving', run.driving && !run.stationary && !run.hit);
      button.textContent = run.stationary
        ? localize('Turn on animation', '开启行驶动画') : localize('Turn off animation', '关闭行驶动画');
      break;
    }
    case 'complete':
      complete();
      break;
    case 'finish-album':
      journey.close();
      showAlbum();
      break;
  }
});

window.addEventListener('focus', () => {
  if (!journey.open && state.opened) renderMap();
});
updateLanguage();
showHome(state.opened);
