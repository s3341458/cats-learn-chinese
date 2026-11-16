// Each path follows the writing direction of one stroke on a 240 × 240 grid.
const strokes = {
  人: ['M130 44 Q129 129 49 196', 'M126 95 Q154 157 202 194'],
  口: ['M64 65 L71 176', 'M65 66 L183 63 L174 174', 'M73 173 L176 172'],
  大: ['M52 98 Q122 93 192 90', 'M124 43 Q123 138 49 199', 'M122 109 Q150 163 202 198'],
  小: ['M121 44 L121 192 Q121 204 101 188', 'M80 102 Q68 140 43 162', 'M157 103 Q184 130 198 158'],
  天: ['M75 63 L171 60', 'M49 104 L196 100', 'M122 62 Q129 151 47 198', 'M124 107 Q148 167 205 198'],
  太: ['M53 92 L190 88', 'M126 44 Q121 140 48 195', 'M125 101 Q158 157 201 191', 'M111 159 Q125 172 136 191'],
  木: ['M54 96 L189 94', 'M122 50 L122 201', 'M121 98 Q90 150 46 173', 'M125 101 Q156 147 197 174'],
  本: ['M53 92 L190 90', 'M120 43 L120 205', 'M118 96 Q85 146 44 174', 'M123 96 Q155 146 199 174', 'M82 154 L157 153'],
  上: ['M116 49 L116 177', 'M117 105 L173 102', 'M51 178 L195 176'],
  下: ['M50 63 L196 60', 'M118 62 L119 198', 'M124 100 Q153 113 174 137'],
  日: ['M72 55 L74 191', 'M73 55 L174 53 L171 191', 'M76 118 L170 116', 'M75 187 L172 186'],
  月: ['M83 53 L83 116 Q83 170 51 201', 'M83 53 L171 50 L169 189 Q168 205 149 190', 'M85 99 L168 96', 'M85 140 L168 137'],
  山: ['M119 49 L119 175', 'M63 96 L63 178 L181 175', 'M181 91 L181 186'],
  石: ['M56 71 L188 67', 'M114 72 Q101 127 48 157', 'M88 128 L91 188', 'M90 129 L174 128 L171 188', 'M92 185 L172 185'],
  水: ['M120 46 L120 190 Q118 202 100 189', 'M48 105 L95 103 Q82 156 46 178', 'M176 79 Q157 104 130 118', 'M126 116 Q151 159 201 183'],
  火: ['M64 92 Q72 103 78 118', 'M173 90 Q163 105 145 117', 'M121 47 Q125 139 52 195', 'M121 126 Q145 175 197 197'],
  田: ['M61 66 L63 182', 'M61 66 L181 64 L179 184', 'M64 120 L178 118', 'M120 66 L120 180', 'M65 179 L178 179'],
  土: ['M75 107 L167 104', 'M119 58 L119 174', 'M51 175 L193 173'],
};

const word = (han, py, meaning, art, action, hint, near) =>
  ({ han, py, meaning, art, action, hint, near, strokes: strokes[han] });
// Each picture question has two reviewed alternatives. A picture that could
// also answer the question (for example, a group containing an adult) is excluded.
const phrase = (han, art, label, extra, alternatives) => ({ han, art, label, extra, alternatives });

const town = [
  {
    name: '猫猫家', cat: 'tangerine', sticker: '橘子猫', at: [12.8, 47.5],
    title: '橘子猫的第一封信', scene: '🏠✉️',
    intro: '叮咚！橘子猫收到一封信。信上画着一个站着的人，还有一张圆圆的嘴巴。它们能变成什么字呢？',
    words: [
      word('人', 'rén', 'person', 'person', '请孩子站起来，把两只脚分开。看看身体像不像「人」。', '想想两只脚向两边分开的样子。', ['入', '八', '大']),
      word('口', 'kǒu', 'mouth', 'mouth', '张开嘴说「啊」，再用手指在空中画一个方方的「口」。', '想想嘴巴张开，四周围起来的样子。', ['日', '中', '回']),
    ],
    phrases: [
      phrase('大人', 'adult', '一位提着手提包的成年女子', '小', ['child', 'doorway']),
      phrase('门口', 'doorway', '打开的门和门槛前的地垫', '人', ['adult', 'yawn']),
      phrase('张口', 'yawn', '小猫把嘴巴张得很大', '人', ['adult', 'doorway']),
      phrase('小孩', 'child', '抱着玩具熊的小女孩', '大', ['adult', 'doorway']),
    ],
    story: '橘子猫在门口捡到一封信。一个大人带着小孩来找信。橘子猫一张口，就喵了一声。小孩听见了，跑过来捡起信，说：“谢谢你，小猫！”',
  },
  {
    name: '小鱼池', cat: 'mint', sticker: '薄荷猫', at: [28.6, 70.5],
    title: '大鱼和小鱼', scene: '🐟🫧',
    intro: '薄荷猫来到小鱼池。一条大鱼游在前面，一条小鱼跟在后面。你能认出哪条鱼大，哪条鱼小吗？',
    words: [
      word('大', 'dà', 'big', 'big', '和孩子一起张开手臂，双脚分开，做出一个「大」。', '想想张开双臂的大字。', ['人', '太', '天']),
      word('小', 'xiǎo', 'small', 'small', '用手指先在中间划一下，再向两边各点一下，看看「小」中间长、两边短。', '找中间长、两边各有一笔的字。', ['少', '水', '大']),
    ],
    phrases: [
      phrase('大鱼', 'big-fish', '一条快占满图卡的橙色鱼', '小', ['small-fish', 'kitten']),
      phrase('小鱼', 'small-fish', '一条只占图卡一小块的橙色鱼', '大', ['big-fish', 'kitten']),
      phrase('大门', 'gate', '花园入口的高大双扇门', '小', ['big-fish', 'kitten']),
      phrase('小猫', 'kitten', '一只坐着的奶油色幼猫', '大', ['small-fish', 'gate']),
    ],
    story: '薄荷猫从花园的大门走进来。这只小猫最喜欢看鱼吐泡泡。大鱼吐了一个大泡泡，小鱼吐了一个小泡泡。两个泡泡飘到水面，一下子就破了。',
  },
  {
    name: '风车田', cat: 'butter', sticker: '奶油猫', at: [43.8, 45.3],
    title: '晴天太热啦', scene: '☀️🌻',
    intro: '奶油猫想去风车田。外面有大太阳，太热啦！它带上一把伞，好在路上遮太阳。',
    words: [
      word('天', 'tiān', 'sky / day', 'sky', '先摆出刚学的「大」，再请孩子想象头顶有一条线，那是天。', '找「大」的头顶多一横的字。', ['大', '太', '夫']),
      word('太', 'tài', 'too / very', 'too', '指给孩子看，大字下面多了一点。一起说「太热啦」。', '找「大」的下面多一点的字。', ['大', '天', '犬']),
    ],
    phrases: [
      phrase('晴天', 'sunny-field', '阳光照着蓝天和草地', '雨', ['rainy-field', 'night-field']),
      phrase('雨天', 'rainy-field', '乌云下有雨滴和水洼', '晴', ['sunny-field', 'night-field']),
      phrase('太热', 'sweaty-cat', '小猫满头大汗，正用爪子扇风', '天', ['rainy-field', 'night-field']),
      phrase('天黑', 'night-field', '深蓝色天空下亮着星星', '太', ['sunny-field', 'rainy-field']),
    ],
    story: '今天是晴天，风车田里太热了。奶油猫撑起伞，去大树下喝水。它想起雨天凉凉的风，真盼着再凉快一点。等到天黑，风也凉了，它才慢慢走回家。',
  },
  {
    name: '森林站', cat: 'cocoa', sticker: '可可猫', at: [59.9, 68],
    title: '树下的一本书', scene: '🌳📚',
    intro: '可可猫在树下发现一本书。树有树干和树根。把它们画下来，就可以认识两个新字。',
    words: [
      word('木', 'mù', 'tree / wood', 'tree', '找一找树干、树枝和向两边伸开的树根，再看它们在「木」里是什么样。', '中间像树干，两边像伸开的树根。', ['本', '末', '未']),
      word('本', 'běn', 'root / measure for books', 'root', '在「木」的底下加一小横，就成了「一本书」的「本」。', '找靠近底下多了一小横的字。', ['木', '末', '体']),
    ],
    phrases: [
      phrase('木门', 'wood-door', '竖着的木板门，有一个圆把手', '本', ['wood-table', 'notebook']),
      phrase('木桌', 'wood-table', '有四条腿的木纹桌子', '门', ['wood-door', 'picture-book']),
      phrase('本子', 'notebook', '有横线的空白纸页和一支铅笔', '木', ['wood-door', 'wood-table']),
      phrase('一本书', 'picture-book', '一本摊开的彩色图画故事书', '木', ['wood-door', 'wood-table']),
    ],
    story: '可可猫推开木门，走到木桌旁。桌上有一本书和一个小本子。它翻开本子，画下一棵大树。树有树干，也有深深的根。',
  },
  {
    name: '彩虹店', cat: 'berry', sticker: '莓莓猫', at: [74.9, 44.5],
    title: '盒子里的彩带', scene: '🎀📦',
    intro: '莓莓猫要在彩虹店布置生日会。它请你看看，彩带在盒子的上面还是下面？',
    words: [
      word('上', 'shàng', 'up / on', 'above', '把一只手当成地面，另一只手放在它上面。看看短横在哪儿。', '小横在长横的上面。', ['下', '止', '土']),
      word('下', 'xià', 'down / under', 'below', '把另一只手移到地面下面。看看「下」的那一点在哪里。', '那一点在长横的下面。', ['上', '不', '卜']),
    ],
    phrases: [
      phrase('上面', 'above', '小球在盒子上方', '下', ['below', 'inside']),
      phrase('下面', 'below', '小球在盒子下方', '上', ['above', 'inside']),
      phrase('上楼', 'stairs-up', '箭头从楼梯低处指向高处', '下', ['stairs-down', 'inside']),
      phrase('下楼', 'stairs-down', '箭头从楼梯高处指向低处', '上', ['stairs-up', 'inside']),
    ],
    story: '莓莓猫把彩带放在盒子上面，把纸星星藏在盒子下面。小猫们上楼来帮忙，布置好以后又一起下楼。生日会要开始啦！',
  },
  {
    name: '星星屋', cat: 'lilac', sticker: '芋圆猫', at: [89.1, 63.1],
    title: '从日出看到月亮', scene: '🌙⭐',
    intro: '芋圆猫到星星屋来看天空。白天有太阳，晚上有月亮。看清它们的样子，再出发。',
    words: [
      word('日', 'rì', 'sun / day', 'sun', '用手围一个方框，用一根手指在中间比一横，一起读「日」。', '找像长方框，中间只有一横的字。', ['口', '目', '白']),
      word('月', 'yuè', 'moon / month', 'moon', '指着弯月看一看，再看看「月」字左边的长撇和里面的两横。', '找里面有两条短横，左边往外弯的字。', ['日', '目', '用']),
    ],
    phrases: [
      phrase('日出', 'sunrise', '山边的太阳，旁边的箭头朝上', '月', ['sunset', 'diary']),
      phrase('日落', 'sunset', '山边的太阳，旁边的箭头朝下', '月', ['sunrise', 'diary']),
      phrase('月亮', '🌙', '一轮弯月', '日', ['sunrise', 'diary']),
      phrase('日记', 'diary', '带锁的粉色小册子和铅笔', '月', ['sunrise', '🌙']),
    ],
    story: '芋圆猫早早起床看日出。太阳从山边慢慢升起来，把小镇照得暖暖的。到了傍晚，太阳落下去，月亮升起来。芋圆猫把今天看到的日出和日落画进了日记。',
  },
];

const countryside = [
  {
    name: '石头山', cat: 'smoky', sticker: '灰灰猫', at: [16.7, 62],
    title: '山路上的圆石头', scene: '⛰️🪨',
    intro: '灰灰猫带着地图去郊游。抬头能看到高山，脚边有块圆石头。你知道「山」和「石」长什么样吗？',
    words: [
      word('山', 'shān', 'mountain', '⛰️', '伸出三根手指，让中间的手指最高。请孩子看看，像不像山的三个山峰。', '找中间最高、下面把三竖连在一起的字。', ['出', '凹', '巾']),
      word('石', 'shí', 'stone', '🪨', '先看上面的横和撇，再找下面方方的「口」。可以用手摸一摸身边的小石头。', '找上面一横一撇、下面有个方框的字。', ['右', '古', '百']),
    ],
    phrases: [
      phrase('高山', 'mountain', '山顶有白雪的高山峰', '石', ['round-stone', 'trail']),
      phrase('石头', 'round-stone', '单独一块圆圆的灰色石头', '山', ['mountain', 'trail']),
      phrase('石桥', 'stone-bridge', '跨过水面的灰色石拱', '山', ['mountain', 'round-stone']),
      phrase('小路', 'trail', '草地间弯来弯去的一条小路', '石', ['round-stone', 'stone-bridge']),
    ],
    story: '灰灰猫抬头看见一座高山。它沿着弯弯的小路走，看到一块圆石头。石头上画着一个箭头，指向河上的石桥。灰灰猫走到桥边，向对岸的海盐猫挥挥手。',
  },
  {
    name: '溪边窑房', cat: 'salt', sticker: '海盐猫', at: [50, 64],
    title: '小河边看火车', scene: '💧🚂',
    intro: '海盐猫在桥边等朋友。桥下的河水在流。窑房里，火苗在炉子里跳。远处还有一列火车要开过来。',
    words: [
      word('水', 'shuǐ', 'water', '💧', '用手指在空中画中间弯钩，再顺着两边比一比流动的水。最后一起读「水」。', '找有中间竖钩、两边像水流分开的字。', ['小', '永', '木']),
      word('火', 'huǒ', 'fire', '🔥', '看图找一找，火苗尖尖的，两侧各有一个小尖。请孩子在纸上画画火苗。', '找中间像「人」、上面有两笔小火苗的字。', ['人', '大', '灭']),
    ],
    phrases: [
      phrase('河水', 'map-stream', '小河里弯弯流动的蓝色水面', '火', ['🔥', '🚂']),
      phrase('水杯', 'water-glass', '装着水的透明杯子', '火', ['🔥', '🚂']),
      phrase('火苗', '🔥', '一簇橙色的火苗', '水', ['water-glass', 'map-stream']),
      phrase('火车', '🚂', '有烟囱和车轮的车头', '水', ['water-glass', '🔥']),
    ],
    story: '清清的河水从石桥下流过。海盐猫带着水杯，和灰灰猫站在桥上。窑房里，火苗在炉子里跳。呜呜！一列火车开了过来。两只小猫一起向火车挥手。',
  },
  {
    name: '稻田小屋', cat: 'peach', sticker: '桃桃猫', at: [82, 64],
    title: '泥土里的小惊喜', scene: '🌾🥔',
    intro: '桃桃猫请朋友来稻田小屋。窗外一块块田像格子，松松的土里还藏着小惊喜。',
    words: [
      word('田', 'tián', 'field', 'field-grid', '指着图里的四块田，再比划外面一个框、里面一个十字。让孩子找找字里的四个小格。', '找外面一个方框、里面一个十字的字。', ['日', '甲', '由']),
      word('土', 'tǔ', 'soil', 'soil', '把长横当作地面，看看「土」的底横更长。可以和孩子一起指一指花盆里的泥土。', '找上横短、下横长，中间一竖的字。', ['士', '上', '工']),
    ],
    phrases: [
      phrase('稻田', 'paddy', '一大片金黄的稻穗', '土', ['potato', 'mud-wall']),
      phrase('泥土', 'earth', '松松的一堆棕色土块', '田', ['paddy', 'potato']),
      phrase('土豆', 'potato', '一颗长圆形的棕黄色土豆', '田', ['paddy', 'mud-wall']),
      phrase('土墙', 'mud-wall', '开着小窗的泥墙', '田', ['paddy', 'potato']),
    ],
    story: '桃桃猫绕过稻田，来到小屋旁。小屋的土墙晒得暖暖的。它扒开松松的泥土，挖出三个圆圆的土豆。灰灰猫和海盐猫来帮忙。三只猫各拿一个土豆，笑着往回走。',
  },
];

export const volumes = [
  { title: '小镇篇', image: '/assets/town.svg', lessons: town },
  { title: '郊游篇', image: '/assets/countryside.jpg', lessons: countryside },
];
export const lessons = volumes.flatMap((volume, index) =>
  volume.lessons.map((lesson) => ({ ...lesson, volume: index })));

export const introTrack = ({ cat }) => `/audio/intro/${cat}.mp3`;
export const storyTrack = ({ cat }) => `/audio/story/${cat}.mp3`;
export const phraseTrack = ({ han }) =>
  `/audio/words/${[...han].map((char) => char.codePointAt(0).toString(16)).join('-')}.mp3`;

export const traceGuide = {
  text: '先把手指放在亮点上。再沿着灰线，慢慢写。',
  track: '/audio/instructions/trace.mp3',
};
