import { lessons } from './lessons.js';
import { availability, dayAfter, dueCharacters, recordAnswer, save, state } from './progress.js';
import { setupTracing } from './tracing.js';

const $ = (id) => document.getElementById(id);
const panel = $('panel');
const journey = $('journey');
const scene = $('scene');
const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const cat = (id, css = '') => `<svg class="cat-art ${css}" viewBox="0 0 120 120" aria-hidden="true"><use href="/assets/cats.svg#${id}"/></svg>`;
const sprite = (id, css = '') => `<span class="sprite sprite-${id} ${css}" aria-hidden="true"></span>`;
const primary = (label, action, glyph = 'arrow') =>
  `<button class="primary" data-action="${action}">${label} ${icon(glyph)}</button>`;
const secondary = (label, action, glyph) =>
  `<button class="secondary" data-action="${action}">${glyph ? icon(glyph) : ''}${label}</button>`;
const statusLine = '<p id="speech-status" class="speech-status" role="status"></p>';
const stages = ['film', 'first', 'second', 'listen', 'build', 'match', 'story', 'stickers', 'drive'];
const stageNames = ['故事开场', '第一个字', '第二个字', '听音找字', '拼词跟读', '看字选图', '猫猫绘本', '贴贴纸', '开车认字'];
let run;
let timer;
let bonusTimer;
let noticeTimer;
let parentTimer;
let parentHeld = false;
let speechId = 0;
let cleanupTracing;
let panelReturn;

function notify(message) {
  clearTimeout(noticeTimer);
  $('notice').textContent = message;
  noticeTimer = setTimeout(() => { $('notice').textContent = ''; }, 3400);
}

function stopSpeech() {
  speechId++;
  window.speechSynthesis?.cancel();
}

function speak(text, hint = '') {
  stopSpeech();
  const currentId = speechId;
  const fallback = () => {
    if (currentId !== speechId) return;
    const status = $('speech-status');
    if (status) status.textContent = hint || '暂时没有普通话发音，可以请家长一起读。';
  };
  if (!state.sound || !('speechSynthesis' in window)) return fallback();

  const speech = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.78;
  const voices = speech.getVoices();
  const voice = voices.find((item) => /^zh[-_]CN$/i.test(item.lang)) ||
    voices.find((item) => /^cmn(?:-|$)/i.test(item.lang)) ||
    voices.find((item) => /^zh(?![-_]HK)/i.test(item.lang));
  if (voice) utterance.voice = voice;
  if (voices.length && !voice) return fallback();
  utterance.onerror = (event) => {
    if (!['canceled', 'interrupted'].includes(event.error)) fallback();
  };
  const status = $('speech-status');
  if (status) status.textContent = '';
  speech.speak(utterance);
}

function showHome(opened) {
  $('cover').hidden = opened;
  $('town').hidden = !opened;
  if (opened) renderMap();
}

function renderMap() {
  const count = state.completed.length;
  $('album-count').textContent = `${count} / ${lessons.length}`;
  $('progress-count').textContent = `${count} / ${lessons.length} 关`;
  $('course-progress').setAttribute('aria-valuenow', count);
  $('progress-fill').style.width = `${count / lessons.length * 100}%`;
  $('sound').setAttribute('aria-pressed', state.sound);
  $('sound').innerHTML = icon(state.sound ? 'sound' : 'muted');
  $('map-tip').textContent = count === lessons.length
    ? '六站都探索完啦！点任意一站可以重读。'
    : availability(count) === 'tomorrow'
      ? '今天的故事读完啦，下一站明天开放。'
      : '点亮的站点可以开始。每天读一站。';
  $('stops').innerHTML = lessons.map((lesson, i) => {
    const status = availability(i);
    const resumed = status === 'open' && state.resume?.index === i;
    const label = { done: '已完成，可以重读', open: resumed ? '继续' : '开始', tomorrow: '明天开放', locked: '未解锁' }[status];
    const style = status === 'open' ? 'current' : status;
    const badge = status === 'done' ? icon('check') :
      status === 'tomorrow' ? '<span aria-hidden="true">☾</span>' : icon('lock');
    return `<button class="stop is-${style}" id="stop-${i}" data-stop="${i}"
      aria-label="第 ${i + 1} 站：${lesson.name}，${label}" style="--x:${lesson.at[0]}%;--y:${lesson.at[1]}%">
      <span class="stop-disc">${i + 1}${status === 'open' ? '' : `<span class="stop-lock">${badge}</span>`}</span>
      <span class="stop-label">${lesson.name}${status === 'open' ? `<span class="stop-tag">${resumed ? '继续' : '出发'}</span>` : ''}</span>
    </button>`;
  }).join('');
}

function showPanel(title, content, returnId) {
  const opening = !panel.open;
  if (opening) panelReturn = returnId;
  $('panel-body').innerHTML = `<header class="panel-head"><h2 id="panel-title" tabindex="-1">${title}</h2>
    <button class="close" data-action="close-panel" aria-label="关闭">×</button></header>
    <div class="panel-content">${content}</div>`;
  if (opening) panel.showModal();
  $('panel-title').focus({ preventScroll: true });
  panel.scrollTop = 0;
}

function showAlbum() {
  showPanel('猫猫贴纸册', `
    <p class="reward-copy">已贴上 ${state.completed.length} / ${lessons.length} 张猫咪贴纸。${state.completed.length === lessons.length ? '六只猫猫都到齐啦！' : ''}</p>
    <ul class="sticker-grid">${lessons.map((lesson, i) => {
      const owned = i < state.completed.length;
      return `<li class="sticker${owned ? '' : ' is-empty'}">
        ${owned ? cat(lesson.cat) : icon('lock')}
        <b>${owned ? lesson.sticker : '待收集'}</b><small>${lesson.name}</small>
      </li>`;
    }).join('')}</ul>`, 'album');
}

function showGuide() {
  const review = Object.entries(state.review);
  const next = state.completed.length;
  showPanel('家长角', `
    <div class="parent-controls">
      <p>前一站完成后，下一站隔天开放。想在同一天继续，可以在这里提前开放。</p>
      <ol class="parent-days">${lessons.map((lesson, index) => {
        const status = availability(index);
        const caption = status === 'done' ? state.completed[index] :
          { open: '可开始', tomorrow: '明天开放', locked: '等待前一站' }[status];
        const action = status === 'tomorrow'
          ? `<button class="secondary" data-action="early">提前开放第 ${next + 1} 站</button>`
          : status === 'done' ? `<button class="secondary" data-replay="${index}">重读</button>` : '';
        return `<li><b>${lesson.name} · ${lesson.words.map(({ han }) => han).join('、')}</b><span>${caption}</span>${action}</li>`;
      }).join('')}</ol>
      <h3>认读记录</h3>
      <p>同一个字或词每天最多调整一次复习间隔。该复习的汉字会穿插到之后的听音题。</p>
      ${review.length ? `<div class="review-wrap"><table><thead><tr><th>字词</th><th>熟悉度</th><th>下次复习</th><th>一次答对</th></tr></thead>
      <tbody>${review.map(([han, item]) => `<tr><th>${han}</th><td aria-label="${item.box} / 5">${'●'.repeat(item.box)}${'○'.repeat(5 - item.box)}</td>
        <td>${item.due <= dayAfter() ? '到期' : item.due}</td><td>${item.right} / ${item.tries}</td></tr>`).join('')}</tbody></table></div>`
        : '<p>做过听音、拼词或选图后，就会出现记录。</p>'}
      <p>进度和贴纸保存在此浏览器。朗读使用设备的普通话语音。</p>
    </div>`, 'guide');
}

const artSymbols = {
  person: '🧍', mouth: '😮', big: '🙆', small: '🤏', sky: '🌤️',
  too: '🥵', tree: '🌳', root: '🌱', sun: '☀️', moon: '🌙', 'wood-table': '🪵',
  'stairs-up': '↗', 'stairs-down': '↘',
};

function art(value, lesson) {
  if (value === 'cat') return cat(lesson.cat);
  if (value === 'above' || value === 'below') return `<span class="position-art ${value}" aria-hidden="true"><i></i><i></i></span>`;
  if (value === 'big-small') return '<span class="size-art" aria-hidden="true">● <small>●</small></span>';
  if (value === 'big-fish' || value === 'small-fish') return `<span class="${value}" aria-hidden="true">🐟</span>`;
  if (value === 'wood-table') return '<span class="wood-table" aria-hidden="true"><i></i><i></i><i></i></span>';
  if (value === 'stairs-up' || value === 'stairs-down') {
    return `<span class="stairs-art" aria-hidden="true"><i></i>${artSymbols[value]}</span>`;
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
    run.choices = shuffle([run.round, ...[0, 1, 2, 3].filter((i) => i !== run.round).slice(0, 2)]);
  } else if (run.stage === 'drive' && run.round < 6) {
    const item = roadQuestions()[run.round];
    run.choices = shuffle([item.han, ...item.alternatives]);
  }
}

function begin(index, resume = true) {
  const status = availability(index);
  if (status === 'tomorrow') return notify('这一站明天开放。家长可以在「家长角」提前开放。');
  if (status === 'locked') return notify('先完成前面的站点，再来这里喵！');

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
    lane: 1, bonusLane: 0, starred: [], fast: matchMedia('(prefers-reduced-motion: reduce)').matches,
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
  if (run.stage === 'film') playFilm();
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
  run.selected = false;
  run.lane = 1;
}

function go(stage) {
  stopSpeech();
  resetRound();
  Object.assign(run, { stage, round: 0, wordMode: 'picture', stroke: 0 });
  run.visited = Math.max(run.visited, stages.indexOf(stage));
  checkpoint();
  renderScene();
}

function advance() {
  go(stages[stages.indexOf(run.stage) + 1]);
}

function rounds(done, total) {
  return `<div class="rounds" aria-label="已完成 ${done} / ${total} 个小任务">
    ${Array.from({ length: total }, (_, index) => `<i class="${index < done ? 'filled' : ''}"></i>`).join('')}
  </div>`;
}

function chapter(title, content, tip) {
  const index = stages.indexOf(run.stage);
  const lesson = currentLesson();
  return `<div class="chapter">
    <header class="chapter-nav">
      <button class="icon-button" data-action="home" aria-label="返回小镇地图">${icon('home')}</button>
      <div class="chapter-track" aria-label="关卡步骤">${stages.map((step, i) =>
        `<button data-stage="${step}" class="${i < index ? 'past' : ''}" aria-label="${stageNames[i]}"
          title="${stageNames[i]}" ${i > run.visited ? 'disabled' : ''} ${i === index ? 'aria-current="step"' : ''}>
          ${i === index ? cat(lesson.cat, 'track-cat') : i === stages.length - 1 ? '★' : '<i></i>'}
        </button>`).join('')}</div>
      <button class="icon-button" data-action="toggle-sound" aria-label="发音" aria-pressed="${state.sound}">${icon(state.sound ? 'sound' : 'muted')}</button>
    </header>
    <div class="chapter-heading"><p>第 ${run.index + 1} 站 · ${lesson.name}</p><h2 id="scene-title" tabindex="-1">${title}</h2></div>
    <div class="chapter-content">${content}${statusLine}</div>
    <aside class="coach">${run.index === 0 ? sprite('cat') : cat(lesson.cat)}<div><b>给大人的小提示</b><p>${tip}</p></div></aside>
  </div>`;
}

function showFilm() {
  const lesson = currentLesson();
  return chapter(lesson.title, `
    <div class="film-frame"><span class="film-scenery">${art(lesson.scene, lesson)}</span>${sprite('car', 'film-car')}<span class="film-spark" aria-hidden="true">✦</span></div>
    <p class="film-caption">${lesson.intro}</p>
    <div class="panel-actions">${secondary('播放开场', 'play-film', 'sound')}${primary('开始认字', 'advance')}</div>`,
    '先一起看看猫猫今天遇到了什么。孩子想直接认字时，可以跳过开场。');
}

function playFilm() {
  const frame = scene.querySelector('.film-frame');
  frame.classList.remove('playing');
  requestAnimationFrame(() => frame.classList.add('playing'));
  speak(currentLesson().intro);
}

function traceCard(word) {
  return `<svg id="trace" class="trace-card" viewBox="0 0 240 240" role="img" aria-label="${word.han}的描红格">
    <path class="trace-grid" d="M0 120H240M120 0V240M0 0l240 240M240 0 0 240"/>
    ${word.strokes.map((path) => `<path class="trace-guide" d="${path}"/>`).join('')}
    ${word.strokes.map((path) => `<path class="trace-path" pathLength="1" d="${path}"/>`).join('')}
    <circle class="trace-start" r="9"/>
  </svg>`;
}

function showWord() {
  const word = currentWord();
  const lesson = currentLesson();
  const mode = run.wordMode;
  if (mode === 'trace') {
    const done = run.stroke >= word.strokes.length;
    return chapter(`跟着笔顺写「${word.han}」`, `
      ${traceCard(word)}
      <p class="phase-copy" id="trace-count" role="status">${done ? '写好啦！' : `第 ${run.stroke + 1} 笔 / 共 ${word.strokes.length} 笔，从圆点开始。`}</p>
      <div class="panel-actions" id="trace-actions">${done
        ? primary('继续', 'advance') : `${secondary('演示这一笔', 'demo-stroke')}${secondary('跳过描红', 'advance', 'arrow')}`}</div>`,
      '请孩子从亮点开始，顺着灰色笔画慢慢描。可以先看一笔示范，也可以跳过。');
  }
  const revealed = mode === 'glyph';
  return chapter(revealed ? `一起读「${word.han}」` : '点图，看看会变成什么字', `
    <button class="picture-word ${revealed ? 'revealed' : ''}" data-action="turn-word"
      aria-label="${revealed ? `读完了，描写${word.han}` : `点图看字：${word.meaning}`}">
      ${revealed ? `<strong class="big-han">${word.han}</strong><span class="pinyin">${word.py}</span><span class="meaning" lang="en">${word.meaning}</span>`
        : art(word.art, lesson)}
    </button>
    <div class="panel-actions">${revealed ? `${secondary('再听一遍', 'hear-word', 'sound')}${primary('写一写', 'turn-word')}`
      : secondary('看汉字', 'turn-word', 'arrow')}</div>`,
    word.action);
}

function tile(value, index, extra = '') {
  const css = [run.missed.has(index) ? 'miss' : '', extra].join(' ');
  return `<button class="tile ${css}" data-pick="${index}" ${run.hit ? 'disabled' : ''}>${value}</button>`;
}

function quizFeedback(label) {
  return `<p id="feedback" class="phase-copy" role="status">${label}</p><div id="quiz-next" class="panel-actions"></div>`;
}

function showListening() {
  const question = run.questions[run.round];
  return chapter('听猫猫说，点出那个字', `
    ${rounds(run.round, run.questions.length)}
    ${secondary('听题', 'hear-question', 'sound')}
    <div class="tile-row">${run.choices.map((han, i) => tile(han, i)).join('')}</div>
    ${quizFeedback('听到以后再选。')}
    <button class="text-button" data-action="show-hint">用拼音提示</button>`,
    `先听读音，再认字形。答错可以继续试。需要帮忙时，想一想：${question.hint}`);
}

function showBuild() {
  const item = currentPhrase();
  const ready = run.slots === item.han;
  return chapter(ready ? '拼好啦，读给大人听' : '按顺序拼出词语', `
    ${rounds(run.round, 3)}
    <div class="build-board">
      <div class="art-card" role="img" aria-label="${item.label}">${art(item.art, currentLesson())}</div>
      <div class="slots" aria-label="拼词格">${[...item.han].map((_, i) => `<span class="slot ${run.slots?.[i] ? 'filled' : ''}">${run.slots?.[i] ?? ''}</span>`).join('')}</div>
    </div>
    ${ready ? `<div class="panel-actions">${secondary('听这个词', 'hear-phrase', 'sound')}${primary('读过了', 'next-item', 'check')}</div>`
      : `<div class="tile-row small-tiles">${run.choices.map((han, i) => tile(han, i)).join('')}</div>
        <div class="panel-actions">${secondary('听要拼的词', 'hear-phrase', 'sound')}${run.slots ? secondary('重新拼', 'clear-build') : ''}</div>
        <p id="feedback" class="phase-copy" role="status">先听听词语，再点下面的字。</p>`}`,
    ready ? '请孩子把拼好的词完整读一遍。读完以后，点右边的勾。' :
      '请孩子听完整的词，再按读音顺序点字卡。点错一个字可以再选。');
}

function showMatch() {
  const item = currentPhrase();
  const lesson = currentLesson();
  return chapter('读词语，选图画', `
    ${rounds(run.round, lesson.phrases.length)}
    <div class="read-card">${item.han}</div>
    <div class="tile-row picture-tiles">${run.choices.map((index, i) => {
      const option = lesson.phrases[index];
      return `<button class="tile" data-pick="${i}" aria-label="${option.label}">${art(option.art, lesson)}</button>`;
    }).join('')}</div>
    ${quizFeedback('哪个图和上面的词语一样？')}`,
    '这一幕没有提示音。让孩子自己读上面的词，再点符合意思的图。');
}

function storyText(lesson) {
  const familiar = new Set(lessons.slice(0, run.index + 1).flatMap(({ words }) => words.map(({ han }) => han)));
  return [...lesson.story].map((char) => familiar.has(char)
    ? `<button class="story-hanzi" data-say="${char}" aria-label="听 ${char}">${char}</button>` : char).join('');
}

function showStory() {
  const lesson = currentLesson();
  return chapter('一起读绘本', `
    <div class="spread">
      <figure class="storybook-art">${sprite('car')}<span>${art(lesson.scene, lesson)}</span></figure>
      <article class="storybook-text"><h3>${lesson.title}</h3><p>${storyText(lesson)}</p></article>
    </div>
    <div class="panel-actions">${secondary('朗读整页', 'read-story', 'sound')}${primary('读完了', 'advance')}</div>`,
    '大人读故事，读到黄色汉字就停一停，让孩子接着念。点任意黄色汉字可以听它的读音。');
}

function showStickers() {
  const lesson = currentLesson();
  const placed = new Set(run.placed);
  return chapter(`贴上${lesson.sticker}和它的小车`, `
    <div class="sticker-sheet">
      ${['cat', 'car'].map((item) => `<div class="sticker-space ${placed.has(item) ? 'stuck' : ''}" data-slot="${item}">
        ${item === 'cat' && run.index ? cat(lesson.cat) : sprite(item)}
        <span>${item === 'cat' ? lesson.sticker : '猫猫小车'}</span>
      </div>`).join('')}
    </div>
    <div class="sticker-tray">
      ${['cat', 'car'].filter((item) => !placed.has(item)).map((item) => `<button class="pick-sticker" draggable="true" data-sticker="${item}" aria-label="贴上${item === 'cat' ? lesson.sticker : '猫猫小车'}">
        ${item === 'cat' && run.index ? cat(lesson.cat) : sprite(item)}
      </button>`).join('')}
    </div>
    <div class="panel-actions">${placed.size === 2 ? primary('开车出发', 'advance') : '<p class="phase-copy">点贴纸，或者拖到上面的轮廓。</p>'}</div>`,
    '让孩子把两张贴纸贴到轮廓上。贴好就可以开着猫猫小车去找路牌。');
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
    return chapter('猫猫到达终点啦！', `
      ${rounds(6, 6)}<div class="finish-road">${sprite('car')}<span aria-hidden="true">🏁</span></div>
      <p class="phase-copy">读过 6 块路牌 · 得到 ${run.starred.length} 颗星星</p>
      ${primary('盖上过关印章', 'complete', 'check')}`,
      '陪孩子回想今天最喜欢的一个字，再盖章完成。');
  }
  const label = ['左车道', '中间车道', '右车道'];
  const bonus = run.driving && !run.starred.includes(run.round);
  return chapter('开猫猫小车，找到路牌', `
    ${rounds(run.round, 6)}
    <div class="road ${run.driving && !run.fast ? 'moving' : ''}" id="road">
      ${run.choices.map((han, i) => `<button data-lane="${i}" class="lane" aria-label="${label[i]}：${han}"
        ${!run.driving || run.hit ? 'disabled' : ''}><span class="road-sign">${han}</span></button>`).join('')}
      <span class="road-car" style="--lane:${run.lane}">${sprite('car')}</span>
      ${bonus && !run.fast ? `<span class="road-treat" style="--lane:${run.bonusLane}" aria-hidden="true">★</span>` : ''}
    </div>
    <p class="phase-copy" id="road-status" role="status">${run.driving ? '听到路牌后，点它所在的车道。' : '按出发，听猫猫说要找哪张路牌。'} · <span id="road-stars">★ ${run.starred.length}</span></p>
    <div class="panel-actions">${run.driving ? secondary('再听路牌', 'hear-road', 'sound') : primary('出发', 'start-drive')}
      ${secondary(run.fast ? '切换为行驶模式' : '切换为静止练习', 'drive-mode')}</div>`,
    '点车道转向。开过星星可以收集它，选对路牌才能到终点。需要多一点时间时，可以切换到静止练习。');
}

function showFinish() {
  const last = run.index === lessons.length - 1;
  const lesson = currentLesson();
  return `<div class="chapter finish-page">
    <div class="finish-stamp">${icon('check')} 第 ${run.index + 1} 站</div>
    <h2 id="scene-title" tabindex="-1">${last ? '喵喵识字镇毕业啦！' : `${lesson.name}探险完成！`}</h2>
    <div class="finish-cats">${last
      ? lessons.map((item) => cat(item.cat)).join('')
      : `${run.index ? cat(lesson.cat) : sprite('cat')}${sprite('car')}`}</div>
    <p>${last ? '十二个汉字、六个故事，六只猫猫都在你的贴纸册里。' :
      `今天认识了「${lesson.words[0].han}」和「${lesson.words[1].han}」。${availability(run.index + 1) === 'tomorrow' ? '明天再来找下一只猫猫。' : ''}`}</p>
    <div class="panel-actions">${secondary('看看贴纸册', 'finish-album', 'book')}${primary('回到小镇地图', 'home', 'home')}</div>
  </div>`;
}

const renderers = {
  film: showFilm, first: showWord, second: showWord, listen: showListening,
  build: showBuild, match: showMatch, story: showStory, stickers: showStickers,
  drive: showDrive, finish: showFinish,
};

function renderScene(focus = true) {
  clearTimeout(timer);
  clearTimeout(bonusTimer);
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
      if (count < word.strokes.length) {
        $('trace-count').textContent = `第 ${count + 1} 笔 / 共 ${word.strokes.length} 笔，从圆点开始。`;
      } else {
        $('trace-count').textContent = '写好啦！';
        $('trace-actions').innerHTML = primary('继续', 'advance');
        $('trace-actions').querySelector('button').focus({ preventScroll: true });
      }
    });
  }
}

function nextItem() {
  const count = { listen: run.questions.length, build: 3, match: currentLesson().phrases.length }[run.stage];
  if (run.round + 1 === count) {
    advance();
    if (run.stage === 'listen') hearQuestion();
    if (run.stage === 'build') hearPhrase();
    return;
  }
  run.round++;
  resetRound();
  checkpoint();
  renderScene();
  if (run.stage === 'listen') hearQuestion();
  if (run.stage === 'build') hearPhrase();
}

function hearQuestion() {
  const word = run.questions[run.round];
  speak(`请找出读作「${word.han}」的字。`, `听音提示：${word.py}`);
}

function hearPhrase() {
  const phrase = currentPhrase();
  speak(phrase.han, `请大人领读「${phrase.han}」。`);
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
      $('feedback').textContent = '这个字的位置不对，按词语的读音再试。';
      return;
    }
    run.slots += choice;
    if (run.slots === phrase.han) recordAnswer(phrase.han, run.missed.size === 0);
    renderScene();
    if (run.slots === phrase.han) hearPhrase();
    return;
  }

  const target = stage === 'listen' ? run.questions[run.round].han : run.round;
  if (choice !== target) {
    run.missed.add(index);
    button.classList.add('miss');
    $('feedback').textContent = stage === 'listen' ? '这个字不一样。再听一遍，试试别的字。' : '再读一遍词语，找找另一张图。';
    return;
  }
  run.hit = true;
  recordAnswer(stage === 'listen' ? target : currentPhrase().han, run.missed.size === 0);
  scene.querySelectorAll('[data-pick]').forEach((option) => { option.disabled = true; });
  button.classList.remove('miss');
  button.classList.add('hit');
  $('feedback').textContent = '找对啦！';
  $('quiz-next').innerHTML = primary('继续', 'next-item');
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
  if (item) speak(`开到「${item.han}」的路牌。`, `找到路牌：${item.py ?? item.han}`);
}

function startDrive() {
  run.driving = true;
  run.selected = false;
  run.hit = false;
  run.bonusLane = (run.round + 2) % 3;
  renderScene(false);
  scene.querySelector('.lane')?.focus({ preventScroll: true });
  hearRoad();
  if (!run.fast) {
    bonusTimer = setTimeout(() => {
      if (run.lane === run.bonusLane && !run.starred.includes(run.round)) {
        run.starred.push(run.round);
        $('road-stars').textContent = `★ ${run.starred.length}`;
        checkpoint();
      }
      scene.querySelector('.road-treat')?.remove();
    }, 2500);
    timer = setTimeout(resolveLane, 5800);
  }
}

function steer(lane) {
  if (!run.driving || run.hit) return;
  run.lane = lane;
  run.selected = true;
  scene.querySelector('.road-car').style.setProperty('--lane', lane);
  scene.querySelectorAll('[data-lane]').forEach((button, i) =>
    button.classList.toggle('chosen', i === lane));
  if (run.fast) resolveLane();
}

function resolveLane() {
  if (!run || run.stage !== 'drive' || !run.driving) return;
  const target = roadQuestions()[run.round].han;
  run.hit = true;
  $('road').classList.remove('moving');
  scene.querySelectorAll('[data-lane]').forEach((button) => { button.disabled = true; });
  if (run.selected && run.choices[run.lane] === target) {
    $('road-status').textContent = `读对了这块路牌！ · ★ ${run.starred.length}`;
    scene.querySelector(`[data-lane="${run.lane}"]`).classList.add('hit');
    recordAnswer(target, run.missed.size === 0);
    timer = setTimeout(() => {
      run.round++;
      resetRound();
      checkpoint();
      if (run.round === 6) renderScene();
      else if (run.fast) renderScene();
      else startDrive();
    }, 650);
  } else {
    run.missed.add(run.lane);
    $('road-status').textContent = '这块路牌还会回来，准备再找一次。';
    timer = setTimeout(() => {
      if (!run.fast) startDrive();
      else {
        run.hit = false;
        renderScene(false);
        hearRoad();
      }
    }, 850);
  }
}

function complete() {
  if (run.index === state.completed.length) {
    state.completed.push(dayAfter());
    state.early = null;
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
  $('stop-' + Math.min(state.completed.length, lessons.length - 1))?.focus({ preventScroll: true });
});
$('cover-back').addEventListener('click', () => {
  state.opened = false;
  save();
  showHome(false);
  $('open-book').focus();
});
$('stops').addEventListener('click', (event) => {
  const stop = event.target.closest('[data-stop]');
  if (stop) begin(Number(stop.dataset.stop));
});
$('sound').addEventListener('click', () => {
  state.sound = !state.sound;
  stopSpeech();
  save();
  $('sound').setAttribute('aria-pressed', state.sound);
  $('sound').innerHTML = icon(state.sound ? 'sound' : 'muted');
  notify(state.sound ? '发音已开启。' : '发音已关闭。');
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
  else if (!parentHeld) notify('请按住「家长角」打开设置。');
});
panel.addEventListener('close', () => {
  if (!journey.open && !panel.open) $(panelReturn)?.focus({ preventScroll: true });
});
panel.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.action === 'close-panel') panel.close();
  if (button.dataset.action === 'early' && availability(state.completed.length) === 'tomorrow') {
    state.early = state.completed.length;
    save();
    renderMap();
    showGuide();
  }
  if (button.dataset.replay !== undefined) begin(Number(button.dataset.replay), false);
});

journey.addEventListener('close', () => {
  if (journey.open) return;
  const index = run?.index;
  clearTimeout(timer);
  clearTimeout(bonusTimer);
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
  if (lane !== undefined) return steer(Number(lane));
  if (stage && stage !== run.stage && stages.indexOf(stage) <= run.visited) return go(stage);
  if (say) return speak(say);
  switch (action) {
    case 'home':
      journey.close();
      break;
    case 'toggle-sound':
      state.sound = !state.sound;
      if (!state.sound) stopSpeech();
      save();
      button.setAttribute('aria-pressed', state.sound);
      button.innerHTML = icon(state.sound ? 'sound' : 'muted');
      break;
    case 'advance':
      advance();
      if (run.stage === 'listen') hearQuestion();
      break;
    case 'play-film':
      playFilm();
      break;
    case 'turn-word':
      run.wordMode = run.wordMode === 'picture' ? 'glyph' : 'trace';
      checkpoint();
      renderScene();
      if (run.wordMode === 'glyph') speak(currentWord().han, currentWord().py);
      break;
    case 'demo-stroke':
      cleanupTracing?.();
      break;
    case 'hear-word':
      speak(currentWord().han, currentWord().py);
      break;
    case 'hear-question':
      hearQuestion();
      break;
    case 'show-hint':
      $('speech-status').textContent = `听音提示：${run.questions[run.round].py}`;
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
      break;
    case 'read-story':
      speak(currentLesson().story);
      break;
    case 'start-drive':
      startDrive();
      break;
    case 'hear-road':
      hearRoad();
      break;
    case 'drive-mode': {
      const driving = run.driving;
      run.fast = !run.fast;
      if (driving && !run.hit) startDrive();
      else if (!run.hit) renderScene();
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
showHome(state.opened);
