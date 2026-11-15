import { lessons } from './lessons.js';

const $ = (id) => document.getElementById(id);
const panel = $('panel');
const body = $('panel-body');
const key = 'meow-word-town-v1';
const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const cat = (id, css = '') => `<svg class="${css}" viewBox="0 0 120 120" aria-hidden="true"><use href="/assets/cats.svg#${id}"/></svg>`;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return {
      completed: Number.isInteger(saved?.completed)
        ? Math.min(lessons.length, Math.max(0, saved.completed))
        : 0,
      sound: saved?.sound !== false,
    };
  } catch {
    return { completed: 0, sound: true };
  }
}

const state = loadState();
function save() {
  try { localStorage.setItem(key, JSON.stringify(state)); }
  catch { /* Keep the current session playable if browser storage is disabled. */ }
}

let noticeTimer;
function notify(message) {
  if (panel.open) {
    const status = $('speech-status');
    if (status) status.textContent = message;
    return;
  }
  clearTimeout(noticeTimer);
  $('notice').textContent = message;
  noticeTimer = setTimeout(() => { $('notice').textContent = ''; }, 3100);
}

function speechFor(text) {
  if (!state.sound) {
    notify('发音已关闭，可以在地图右上角重新打开。');
    return;
  }
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    notify('这个浏览器不支持发音，可以照着拼音一起读。');
    return;
  }
  const speech = window.speechSynthesis;
  speech.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.76;
  const voices = speech.getVoices();
  const voice = voices.find((v) => /^zh[-_]CN$/i.test(v.lang))
    || voices.find((v) => /^cmn\b/i.test(v.lang))
    || voices.find((v) => /^zh(?![-_]HK)/i.test(v.lang));
  if (voice) utterance.voice = voice;
  if (voices.length && !voice) {
    notify('这里还没有普通话语音，可以先照着拼音读。');
    return;
  }
  utterance.onerror = (event) => {
    if (!['canceled', 'interrupted'].includes(event.error)) {
      notify('现在没能播放发音，可以先照着拼音读。');
    }
  };
  if ($('speech-status')) $('speech-status').textContent = '';
  speech.speak(utterance);
}

function renderHome() {
  $('album-count').textContent = `${state.completed} / ${lessons.length}`;
  $('progress-count').textContent = `${state.completed} / ${lessons.length} 关`;
  $('course-progress').setAttribute('aria-valuenow', state.completed);
  $('progress-fill').style.width = `${state.completed / lessons.length * 100}%`;
  $('sound').setAttribute('aria-pressed', state.sound);
  $('sound').innerHTML = icon(state.sound ? 'sound' : 'muted');
  $('map-tip').textContent = state.completed === lessons.length
    ? '六站都探索完啦！点任意一站可以复习。'
    : '点亮的站点可以开始，完成一关就会打开下一站。';
  $('stops').innerHTML = lessons.map((lesson, i) => {
    const locked = i > state.completed;
    const done = i < state.completed;
    const label = locked ? '未解锁' : done ? '已完成，可以复习' : '开始';
    return `<button class="stop ${locked ? 'is-locked' : done ? 'is-done' : 'is-current'}"
      id="stop-${i}" aria-label="第 ${i + 1} 关：${lesson.name}，${label}" data-stop="${i}"
      style="--x:${lesson.at[0]}%;--y:${lesson.at[1]}%">
      <span class="stop-disc">${i + 1}${locked || done ? `<span class="stop-lock">${icon(locked ? 'lock' : 'check')}</span>` : ''}</span>
      <span class="stop-label">${lesson.name}${!locked && !done ? '<span class="stop-tag">出发</span>' : ''}</span>
    </button>`;
  }).join('');
}

let current;
let restoreFocus;
function showPanel(kicker, title, content, returnId) {
  const opening = !panel.open;
  if (opening) restoreFocus = returnId ?? document.activeElement?.id;
  body.innerHTML = `
    <header class="panel-head">
      <div><p class="panel-kicker">${kicker}</p><h2 id="panel-title" tabindex="-1">${title}</h2></div>
      <button class="close" data-action="close" aria-label="关闭">×</button>
    </header><div class="panel-content">${content}</div>`;
  if (opening) panel.showModal();
  $('panel-title').focus({ preventScroll: true });
  panel.scrollTop = 0;
}
panel.addEventListener('close', () => {
  current = undefined;
  window.speechSynthesis?.cancel();
  if (restoreFocus) $(restoreFocus)?.focus({ preventScroll: true });
});

function lessonHeader() {
  const lesson = lessons[current.index];
  return `第 ${current.index + 1} 关 · ${lesson.name}`;
}

const steps = (number) => `<div class="steps" role="img" aria-label="第 ${number} 步，共 4 步">
  ${Array.from({ length: 4 }, (_, i) => `<span class="${i < number ? 'reached' : ''}"></span>`).join('')}
</div>`;
const speechStatus = '<p id="speech-status" class="speech-status" role="status"></p>';
const speakButton = (label, action = 'speak') => `<button class="secondary" data-action="${action}">${icon('sound')} ${label}</button>`;
const nextButton = (label, action) => `<button class="primary" data-action="${action}">${label} ${icon('arrow')}</button>`;

function start(i) {
  if (i > state.completed) {
    notify(`先完成「${lessons[i - 1].name}」，就能打开这里喵！`);
    return;
  }
  current = { index: i, word: 0 };
  showWord();
}

function showWord() {
  const lesson = lessons[current.index];
  const word = lesson.words[current.word];
  const last = current.word === lesson.words.length - 1;
  showPanel(lessonHeader(), `跟猫猫读 · ${lesson.subtitle}`, `
    ${steps(current.word + 1)}
    <div class="word-card">
      <span class="word-art" aria-hidden="true">${word.art}</span>
      <div><div class="hanzi">${word.han}</div><span class="pinyin">${word.py}</span><span class="meaning" lang="en">${word.meaning}</span></div>
    </div>
    <p class="sentence">${word.line}</p>
    <div class="panel-actions">${speakButton('听汉字')}${speakButton('听句子', 'sentence')}${nextButton(last ? '开始挑战' : '认识下一个字', 'next-word')}</div>
    ${speechStatus}`, `stop-${current.index}`);
}

function showQuiz() {
  const word = lessons[current.index].words[current.word];
  const options = [word.han, ...word.distractors];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  showPanel(lessonHeader(), `帮猫猫找字 · ${current.word + 1} / 2`, `
    ${steps(current.word + 3)}
    <div class="clue"><span aria-hidden="true">${word.art}</span><span>${word.py}</span></div>
    <p class="quiz-prompt">哪个汉字读作「${word.py}」？</p>
    ${speakButton('听一遍')}
    <div class="options">${options.map((option) => `<button class="answer" data-answer="${option}">${option}</button>`).join('')}</div>
    <p id="feedback" class="feedback" role="status">找到了就点一下。</p>
    <div id="quiz-next"></div>${speechStatus}`);
}

function checkAnswer(button) {
  if (!current || $('quiz-next').firstChild) return;
  const word = lessons[current.index].words[current.word];
  if (button.dataset.answer !== word.han) {
    button.classList.add('miss');
    $('feedback').textContent = '差一点！听听读音，再选一个字吧。';
    return;
  }
  for (const option of body.querySelectorAll('.answer')) option.disabled = true;
  button.classList.add('hit');
  $('feedback').textContent = `答对啦！「${word.han}」读作 ${word.py}。`;
  const last = current.word + 1 === lessons[current.index].words.length;
  if (last) {
    if (current.index === state.completed) {
      state.completed++;
      save();
      renderHome();
    }
    restoreFocus = `stop-${Math.min(state.completed, lessons.length - 1)}`;
  }
  $('quiz-next').innerHTML = nextButton(last ? '看看猫咪贴纸' : '下一题', last ? 'reward' : 'next-quiz');
  $('quiz-next').querySelector('button').focus({ preventScroll: true });
}

function showReward() {
  const lesson = lessons[current.index];
  const next = lessons[current.index + 1];
  showPanel('任务完成 · MISSION COMPLETE', `${lesson.sticker}到贴纸册啦！`, `
    ${cat(lesson.cat, 'reward-cat')}
    <p class="reward-copy">你认识了 <b>${lesson.words.map((word) => word.han).join(' 和 ')}</b>。<br>
    ${next ? `下一站：${next.name}。` : '六站都完成啦，猫猫为你鼓掌！'}</p>
    <div class="panel-actions">
      <button class="secondary" data-action="album">${icon('book')} 看贴纸册</button>
      ${next ? nextButton('去下一站', 'next-stop') : nextButton('回小镇地图', 'close')}
    </div>`);
}

function showAlbum() {
  showPanel('我的收藏 · STICKER BOOK', '猫猫贴纸册', `
    <p class="reward-copy">已收集 ${state.completed} / ${lessons.length} 张。每完成一站，就会遇到一只猫咪！</p>
    <ul class="sticker-grid">${lessons.map((lesson, i) => {
      const owned = i < state.completed;
      return `<li class="sticker${owned ? '' : ' is-empty'}">
        ${owned ? cat(lesson.cat) : icon('lock')}
        <b>${owned ? lesson.sticker : '待收集'}</b><small>${lesson.name}</small>
      </li>`;
    }).join('')}</ul>`, 'album');
}

function showGuide() {
  showPanel('陪孩子一起玩 · GROWN-UPS', '家长小提示', `
    <ol class="guide-copy">
      <li><b>先听，再跟读。</b> 点「听汉字」和「听句子」，请孩子读出大字，再一起读一遍例句。</li>
      <li><b>让孩子自己找。</b> 每站只有两题。答错可以慢慢试，完成后贴纸会自动收入贴纸册。</li>
      <li><b>把字带回生活里。</b> 例如读到「水」，可以问孩子：“家里哪里有水？”</li>
      <li>进度保存在当前浏览器。发音使用设备的普通话语音；如果听不到，也可以照着拼音读。</li>
    </ol>`, 'guide');
}

$('stops').addEventListener('click', (event) => {
  const stop = event.target.closest('[data-stop]');
  if (stop) start(Number(stop.dataset.stop));
});
$('sound').addEventListener('click', () => {
  state.sound = !state.sound;
  save();
  $('sound').setAttribute('aria-pressed', state.sound);
  $('sound').innerHTML = icon(state.sound ? 'sound' : 'muted');
  if (!state.sound) window.speechSynthesis?.cancel();
  notify(state.sound ? '发音已开启。' : '发音已关闭。');
});
$('album').addEventListener('click', showAlbum);
$('guide').addEventListener('click', showGuide);
body.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.answer) return checkAnswer(button);
  const action = button.dataset.action;
  if (action === 'close') return panel.close();
  if (action === 'album') return showAlbum();
  if (!current) return;
  const lesson = lessons[current.index];
  const word = lesson.words[current.word];
  if (action === 'speak') speechFor(word.han);
  if (action === 'sentence') speechFor(word.line);
  if (action === 'next-word') {
    window.speechSynthesis?.cancel();
    if (++current.word === lesson.words.length) {
      current.word = 0;
      showQuiz();
    } else showWord();
  }
  if (action === 'next-quiz') {
    window.speechSynthesis?.cancel();
    current.word++;
    showQuiz();
  }
  if (action === 'reward') showReward();
  if (action === 'next-stop') {
    restoreFocus = `stop-${current.index + 1}`;
    start(current.index + 1);
  }
});
renderHome();
