import { missions } from './missions.js';

export const missionLabels = {
  trail: ['Follow the signs', '听音走路线'],
  search: ['Find the pictures', '按清单寻宝'],
  sort: ['Sort the objects', '动手分一分'],
  order: ['Fill the order', '照单依次摆放'],
  memory: ['Turn over and pair', '翻牌配对'],
  cloze: ['Finish the sentences', '读句子填词'],
  paint: ['Paint the swatches', '照调色单上色'],
  pattern: ['Remember the order', '看图记顺序'],
};

const instructions = {
  trail: ['Listen to the clue and tap the matching sign to move the cat.', '听线索，点对应的路牌，让小猫前进一步。'],
  search: ['Read the checklist and tap only the pictures it names. Tap a word on the list to hear it.', '读清单，只点清单上列出的图。点清单上的词可以听发音。'],
  sort: ['Pick a picture, then tap the place it belongs.', '先点一幅图，再点它该去的地方。'],
  order: ['Read the list from left to right and set out the pictures in that order.', '从左到右读清单，照这个顺序摆图。'],
  memory: ['Turn over one picture card and one word card. Find all four pairs.', '翻一张图卡和一张词卡，找齐四对。'],
  cloze: ['Read the whole sentence, then put a word in the blank.', '读完整句话，再把合适的词填进空格。'],
  paint: ['Read the highlighted color and choose a paint from the palette.', '读亮起来的颜色字，再从调色盘里选颜料。'],
  pattern: ['Study the pictures. When you’re ready, hide them and tap the words in the same order.', '看图记顺序。准备好后，把图藏起来，按原顺序点出词语。'],
};

const extraLabels = {
  '🍃': ['Leaves', '叶子'], '🪷': ['Lotus', '荷花'], '🌾': ['Grain', '谷穗'],
  '🍄': ['Mushroom', '蘑菇'], '🧺': ['Basket', '篮子'], '🐝': ['Bee', '蜜蜂'],
  '🪵': ['Log', '木头'], '⛵': ['Sailboat', '帆船'], '🪨': ['Rock', '石头'],
  '🪸': ['Coral', '珊瑚'], '🪁': ['Kite', '风筝'], '🐙': ['Octopus', '章鱼'], '⚓': ['Anchor', '船锚'],
  '🍒': ['Cherries', '樱桃'], '🍓': ['Strawberry', '草莓'], '🫖': ['Teapot', '茶壶'],
  '🍎': ['Apple', '苹果'], '🪴': ['Potted plant', '盆栽'],
};

export const paints = {
  红: ['#ce4739', 'Red', '红色'], 黄: ['#f4cc55', 'Yellow', '黄色'], 蓝: ['#4e76b2', 'Blue', '蓝色'],
  绿: ['#60914b', 'Green', '绿色'], 黑: ['#25252c', 'Black', '黑色'], 紫: ['#8158a7', 'Purple', '紫色'],
  橙: ['#ee8d35', 'Orange', '橙色'], 粉: ['#e791b3', 'Pink', '粉色'], 灰: ['#8d9195', 'Gray', '灰色'],
  墨: ['#20272d', 'Ink', '墨色'],
};

const paintExtras = ['红', '蓝', '黄', '绿'];
const feedbackText = {
  found: ['Found it!', '找到了！'], missing: ['That picture isn’t on the list. Keep looking!', '清单上没有这张图。再找找！'],
  sorted: ['It’s in the right place!', '放对啦！'], otherBin: ['Try putting it in the other place.', '试试把它放到另一边。'],
  paired: ['Those two go together!', '配成一对啦！'], otherPair: ['These two are different. Turn them back and try again.', '这两张配不上。翻回去，再找找。'],
  nextSign: ['Right way! Listen for the next sign.', '走对啦！听下一个路牌。'], otherSign: ['Listen again and try another sign.', '再听一遍，试试另一块牌子。'],
  onList: ['That’s the next one on the list.', '找对清单上的下一样啦！'], otherPick: ['Look at the next item on the list.', '看看清单上下一项写的是什么。'],
  inSentence: ['That word fits!', '这个词填对啦！'], otherWord: ['Read the whole sentence and try another word.', '再读一遍完整句子，试试另一个词。'],
  painted: ['That’s the right color!', '这个颜色对啦！'], otherPaint: ['Read the color again and try another paint.', '再读一遍颜色字，试试另一种颜料。'],
  recalled: ['You remembered the next word!', '记对下一个词啦！'], otherOrder: ['Try another word, or look at the pictures again.', '试试另一个词，也可以再看看图。'],
};

const range = (length) => Array.from({ length }, (_, i) => i);
const uniqueIndices = (value, size) => Array.isArray(value)
  ? [...new Set(value.filter((i) => Number.isInteger(i) && i >= 0 && i < size))] : [];
const paletteFor = (words) => {
  const choices = words.map(({ han }) => han);
  return [...new Set([...choices, ...paintExtras])].slice(0, 4);
};

export function createMission(lesson, saved, shuffle) {
  const plan = missions[lesson.cat];
  const { mode } = plan;
  const items = mode === 'trail' ? [...lesson.words, ...lesson.phrases]
    : mode === 'paint' ? lesson.words : lesson.phrases;
  const deckSize = items.length + (plan.extras?.length ?? 0);
  const deck = mode === 'memory' ? [...shuffle(range(4)), ...shuffle(range(4).map(i => i + 4))]
    : shuffle(range(mode === 'paint' ? 4 : deckSize));
  const savedDeck = uniqueIndices(saved?.deck, deck.length);
  const completed = uniqueIndices(saved?.completed, items.length);
  const sequential = plan.sequence ?? range(items.length);
  const isSequential = !['sort', 'search', 'memory'].includes(mode);
  return {
    ...plan, items, deck: savedDeck.length === deck.length ? savedDeck : deck,
    completed: isSequential ? sequential.slice(0, completed.length) : completed,
    misses: uniqueIndices(saved?.misses, items.length),
    selected: null, flipped: [], preview: mode === 'pattern', feedback: '',
  };
}

export function missionSnapshot({ completed, deck, misses }) {
  return { completed, deck, misses };
}

export function missionFinished(game) {
  return game.completed.length === game.items.length;
}

export function missionTarget(game) {
  return game.sequence?.[game.completed.length] ?? game.completed.length;
}

function success(game, index, feedback) {
  const firstTry = !game.misses.includes(index);
  game.completed.push(index);
  game.selected = null;
  game.flipped = [];
  game.feedback = feedback;
  return { answer: game.items[index], firstTry };
}

function miss(game, index, feedback) {
  if (!game.misses.includes(index)) game.misses.push(index);
  game.feedback = feedback;
  return {};
}

export function trailOptions(game) {
  const i = missionTarget(game);
  const item = game.items[i];
  const alternatives = item.near?.filter(han => han !== item.han)
    ?? game.items.slice(2).filter(word => word !== item).map(({ han }) => han);
  const options = [item.han, ...[...new Set(alternatives)].slice(0, 2)];
  const shift = game.deck[i] % options.length;
  return [...options.slice(shift), ...options.slice(0, shift)];
}

export function playMission(game, action, index) {
  if (missionFinished(game)) return {};
  const target = missionTarget(game);
  if (action === 'hint' && ['trail', 'cloze', 'paint'].includes(game.mode)) {
    game.hint = game.hint === target ? null : target;
    return {};
  }
  if (game.mode === 'pattern' && action === 'preview') {
    game.preview = !game.preview;
    game.feedback = '';
    return {};
  }
  if (game.mode === 'memory' && action === 'reset') {
    game.flipped = [];
    game.feedback = '';
    return {};
  }
  if (action === 'bin' && game.mode === 'sort' && game.selected !== null) {
    const card = game.selected;
    return index === Number(!game.left.includes(card))
      ? success(game, card, 'sorted') : miss(game, card, 'otherBin');
  }
  if (action !== 'pick' || !Number.isInteger(index) || index < 0) return {};
  switch (game.mode) {
    case 'trail':
      return trailOptions(game)[index] === game.items[target].han
        ? success(game, target, 'nextSign') : miss(game, target, 'otherSign');
    case 'search':
      if (index >= game.items.length) {
        game.feedback = 'missing';
        return {};
      }
      return game.completed.includes(index) ? {} : success(game, index, 'found');
    case 'sort':
      if (game.completed.includes(index) || index >= game.items.length) return {};
      game.selected = game.selected === index ? null : index;
      game.feedback = '';
      return {};
    case 'memory': {
      const pair = index % 4;
      if (index >= 8 || game.completed.includes(pair) || game.flipped.length === 2) return {};
      if (game.flipped.includes(index)) {
        game.flipped = [];
        return {};
      }
      const [first] = game.flipped;
      if (first !== undefined && Math.floor(first / 4) === Math.floor(index / 4)) {
        game.flipped = [index];
        return {};
      }
      game.flipped.push(index);
      if (first === undefined) return {};
      if (first % 4 === pair) return success(game, pair, 'paired');
      miss(game, first % 4, 'otherPair');
      return miss(game, pair, 'otherPair');
    }
    case 'order':
      if (game.completed.includes(index)) return {};
      return index === target ? success(game, target, 'onList') : miss(game, target, 'otherPick');
    case 'cloze':
      return index === target ? success(game, target, 'inSentence') : miss(game, target, 'otherWord');
    case 'paint':
      return paletteFor(game.items)[index] === game.items[target].han
        ? success(game, target, 'painted') : miss(game, target, 'otherPaint');
    case 'pattern':
      if (game.preview || game.completed.includes(index)) return {};
      return index === target ? success(game, target, 'recalled') : miss(game, target, 'otherOrder');
  }
  return {};
}

const hanzi = (value) => `<span lang="zh-Hans">${value}</span>`;
const option = (action, index, content, { css = '', label, pressed, disabled, style } = {}) =>
  `<button type="button" class="mission-option ${css}" data-mission="${action}" ${index === undefined ? '' : `data-mission-index="${index}"`}
    ${label ? `aria-label="${label}"` : ''} ${pressed === undefined ? '' : `aria-pressed="${pressed}"`}
    ${disabled ? 'disabled' : ''} ${style ? `style="${style}"` : ''}>${content}</button>`;

export function renderMission(game, { t, art, cat, landscape, icon, primary, secondary }) {
  const { mode, items, deck, completed } = game;
  const title = t(...missionLabels[mode]);
  const finished = missionFinished(game);
  const target = missionTarget(game);
  const listen = (index, content, css = '') => option('hear', index, content,
    { css, label: t(`Hear ${items[index].han}`, `听「${items[index].han}」`) });
  const clue = (index) => listen(index, `${icon('sound')} ${t('Hear the clue', '听线索')}`, 'mission-control');
  const hint = (label) => option('hint', undefined, label, { css: 'mission-control', pressed: game.hint === target });
  const picture = (index, css = '') => option('pick', index, art(items[index].art), {
    css: `mission-picture ${css}`, label: t(...items[index].label),
    disabled: completed.includes(index), pressed: mode === 'sort' ? game.selected === index : undefined,
  });
  const painting = () => `<div class="mission-painting" ${landscape}>${items.map(({ han }, i) => `
    <div class="paint-frame ${i === target ? 'is-current' : ''}" ${completed.includes(i) ? `style="--paint:${paints[han][0]}"` : ''}>
      <span aria-hidden="true"></span>${listen(i, `${icon(completed.includes(i) ? 'check' : 'sound')} ${hanzi(han)}`)}</div>`).join('')}</div>`;
  let board;
  if (finished) {
    board = `${mode === 'paint' ? painting() : `<div class="mission-finished" ${landscape}>${cat}<span>${icon('check')}</span></div>`}
      <p class="mission-result">${t('Mission complete!', '小任务完成啦！')}</p>
      ${mode === 'paint' ? '' : `<div class="mission-checklist">${(game.sequence ?? range(items.length))
        .map(i => listen(i, hanzi(items[i].han))).join('')}</div>`}
      ${primary(t('Finish this stop', '盖上过关印章'), 'complete', 'check')}`;
  } else {
    switch (mode) {
      case 'trail': {
        const word = items[target];
        board = `<div class="mission-trail" ${landscape}>
          <div class="trail-track" aria-hidden="true">${range(items.length + 1).map(i =>
            `<span class="${i < target ? 'passed' : ''}">${i === target ? cat : i === items.length ? '⚑' : '●'}</span>`).join('')}</div>
          <div class="trail-forks">${trailOptions(game).map((han, i) => option('pick', i, hanzi(han))).join('')}</div>
        </div>
        <div class="mission-controls">${clue(target)}${hint(t('Show written clue', '看文字线索'))}</div>
        ${game.hint === target ? `<p class="mission-hint">${hanzi(word.han)} <span lang="zh-Latn">${word.py}</span></p>` : ''}`;
        break;
      }
      case 'search':
        board = `<div class="mission-checklist">${items.map(({ han }, i) =>
          listen(i, `${completed.includes(i) ? icon('check') : ''}${hanzi(han)}`, completed.includes(i) ? 'is-done' : '')).join('')}</div>
          <div class="mission-search" ${landscape}>${deck.map((i) => i < items.length
            ? picture(i, completed.includes(i) ? 'is-done' : '')
            : option('pick', i, `<span aria-hidden="true">${game.extras[i - items.length]}</span>`, {
              css: 'mission-picture', label: t(...extraLabels[game.extras[i - items.length]]),
            })).join('')}</div>`;
        break;
      case 'sort':
        board = `<div class="mission-sort-tray">${deck.map(i => picture(i, completed.includes(i) ? 'is-filed' : '')).join('')}</div>
          <div class="mission-bins">${game.bins.map((label, i) => {
            const inBin = completed.filter(card => Number(!game.left.includes(card)) === i);
            return `<div class="mission-bin">${option('bin', i, t(...label), { disabled: game.selected === null })}
              <div class="mission-bin-items">${inBin.map(card => `<span lang="zh-Hans">${items[card].han}</span>`).join('')}</div></div>`;
          }).join('')}</div>
          ${game.selected === null ? '' : listen(game.selected, `${icon('sound')} ${t('Hear the selected word', '听选中的词')}`, 'mission-control')}`;
        break;
      case 'order':
        board = `<ol class="mission-ticket">${game.sequence.map((i) => `<li class="${i === target ? 'is-current' : ''}">
          ${listen(i, completed.includes(i) ? `${icon('check')} ${hanzi(items[i].han)}` : hanzi(items[i].han))}</li>`).join('')}</ol>
          <div class="mission-order-tray">${deck.map(i => picture(i, completed.includes(i) ? 'is-done' : '')).join('')}</div>`;
        break;
      case 'memory':
        board = `<div class="mission-deck">${deck.map((i, slot) => {
          const pair = i % 4;
          const matched = completed.includes(pair);
          const open = matched || game.flipped.includes(i);
          const face = i < 4 ? art(items[pair].art) : hanzi(items[pair].han);
          const label = i < 4 ? t(...items[pair].label) : items[pair].han;
          return option('pick', i, open ? face : `<span aria-hidden="true">${i < 4 ? '▧' : '字'}</span>`, {
            css: `mission-card ${i < 4 ? 'picture-card' : 'word-card'} ${open ? 'is-open' : ''} ${matched ? 'is-done' : ''}`,
            label: open ? label : i < 4 ? t(`Turn over picture card ${slot + 1}`, `翻开第 ${slot + 1} 张图卡`)
              : t(`Turn over word card ${slot - 3}`, `翻开第 ${slot - 3} 张词卡`),
            pressed: open, disabled: matched || (game.flipped.length === 2 && !open),
          });
        }).join('')}</div>
        ${game.flipped.length === 2 ? option('reset', undefined, t('Turn the cards back', '把两张牌翻回去'), { css: 'mission-control' }) : ''}`;
        break;
      case 'cloze': {
        const sentence = game.lines[target].replace('＿', '<span class="mission-blank">＿＿</span>');
        board = `<div class="mission-sentence" lang="zh-Hans">${sentence}</div>
          <div class="mission-words">${deck.map(i => option('pick', i, hanzi(items[i].han))).join('')}</div>
          <div class="mission-controls">${secondary(t('Hear the sentence', '听句子'), 'hear-mission-line', 'sound')}
            ${hint(t('Show a picture clue', '看图提示'))}</div>
          ${game.hint === target ? `<div class="mission-clue-art" role="img" aria-label="${t(...items[target].label)}">${art(items[target].art)}</div>` : ''}`;
        break;
      }
      case 'paint': {
        const palette = paletteFor(items);
        board = `${painting()}
          <div class="mission-palette">${deck.map(i => {
            const [color, en, zh] = paints[palette[i]];
            return option('pick', i, `<span aria-hidden="true"></span>${game.hint === target ? hanzi(palette[i]) : ''}`,
              { label: t(en, zh), style: `--paint:${color}` });
          }).join('')}</div>
          ${hint(t('Label the paints', '看颜料标签'))}`;
        break;
      }
      case 'pattern':
        board = `<div class="mission-pattern" ${landscape}>${game.sequence.map((i, step) => `<div class="pattern-step ${i === target ? 'is-current' : ''}">
          ${game.preview ? `${art(items[i].art)}${listen(i, hanzi(items[i].han))}` :
            `<span>${completed.includes(i) ? `${icon('check')} ${hanzi(items[i].han)}` : step + 1}</span>`}</div>`).join('')}</div>
          ${game.preview ? '' : `<div class="mission-words">${deck.map(i => option('pick', i, hanzi(items[i].han), {
            disabled: completed.includes(i), css: completed.includes(i) ? 'is-done' : '',
          })).join('')}</div>`}
          ${option('preview', undefined, game.preview ? t('Ready! Hide the pictures', '记好啦，藏起图') : t('Look again', '再看一遍'), { css: 'mission-control' })}`;
        break;
    }
  }
  const feedback = finished ? '' : feedbackText[game.feedback];
  return {
    title,
    tip: finished ? t('Ask your child to pick a word and read it once more.', '请孩子选一个字词，再读一遍。') : '',
    content: `<section class="mission" data-mission-mode="${mode}" aria-label="${title}">
      <p class="mission-prompt">${t(...game.prompt)}</p>
      <div class="mission-meter" role="progressbar" aria-label="${t('Mission progress', '小任务进度')}"
        aria-valuemin="0" aria-valuemax="${items.length}" aria-valuenow="${completed.length}">
        ${range(items.length).map(i => `<span class="${i < completed.length ? 'is-done' : ''}"></span>`).join('')}</div>
      ${finished ? '' : `<p class="mission-instructions">${t(...instructions[mode])}</p>`}
      ${board}
      <p id="mission-status" class="mission-feedback" role="status" tabindex="-1">${feedback ? t(...feedback) : ''}</p>
    </section>`,
  };
}
