import { expandedVolumes } from './expanded-lessons.js';
import { moreVolumes } from './more-lessons.js';

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
  白: ['M110 38 Q99 57 80 70', 'M72 70 L74 191', 'M73 70 L176 68 L173 191', 'M76 128 L172 126', 'M75 187 L173 187'],
  云: ['M77 55 L164 53', 'M49 99 L194 96', 'M116 99 Q96 138 65 173 L168 163', 'M150 136 Q175 156 190 184'],
  风: ['M76 51 L75 119 Q75 166 46 199', 'M76 51 L169 49 Q164 118 176 178 Q184 210 201 179', 'M149 82 Q117 135 81 166', 'M92 93 Q122 119 151 160'],
  雨: ['M50 49 L192 47', 'M59 88 L61 195', 'M60 88 L182 85 L182 188 Q181 202 165 191', 'M120 49 L120 195', 'M78 110 L98 127', 'M78 152 L99 169', 'M139 109 L160 126', 'M139 152 L161 169'],
  花: ['M49 65 L194 63', 'M91 43 L91 84', 'M151 43 L150 83', 'M94 101 Q76 127 47 146', 'M77 125 L77 200', 'M186 110 Q159 141 122 152', 'M132 100 L132 184 Q131 195 151 195 L184 195 Q198 195 198 179'],
  草: ['M49 57 L193 55', 'M90 39 L90 76', 'M151 39 L150 75', 'M76 91 L77 155', 'M76 91 L169 89 L168 155', 'M79 122 L166 121', 'M78 153 L168 153', 'M48 178 L195 176', 'M122 155 L122 212'],
  车: ['M51 76 L189 74', 'M112 43 Q94 86 67 117 L178 115', 'M45 153 L194 149', 'M125 98 L125 204'],
  马: ['M66 55 L174 53 L163 118', 'M81 70 L73 118 L187 116 Q184 180 173 200 Q164 208 150 193', 'M49 160 L154 158'],
  米: ['M67 55 Q82 66 89 85', 'M171 54 Q158 74 145 86', 'M48 105 L194 102', 'M122 44 L122 203', 'M116 106 Q90 155 44 183', 'M126 109 Q151 153 201 181'],
  瓜: ['M164 46 Q143 64 82 72', 'M82 72 Q83 148 44 192', 'M112 69 L107 174 L140 160', 'M126 128 Q140 143 148 164', 'M159 59 Q158 150 202 193'],
  书: ['M68 70 L166 68 L160 113', 'M51 118 L185 115 L177 167 Q174 182 154 169', 'M115 40 L115 203', 'M166 43 Q182 50 192 64'],
  笔: ['M74 40 Q65 66 47 85', 'M69 57 L112 56', 'M82 59 L92 76', 'M142 39 Q133 64 118 78', 'M137 55 L191 53', 'M155 56 L166 74', 'M161 91 Q126 104 70 106', 'M66 127 L172 124', 'M53 152 L186 148', 'M115 105 L114 184 Q114 199 143 199 L176 199 Q195 199 195 178'],
  信: ['M78 47 Q67 86 39 112', 'M62 92 L62 201', 'M122 40 Q142 50 151 68', 'M90 78 L200 75', 'M103 105 L185 103', 'M101 130 L183 129', 'M105 153 L107 199', 'M105 153 L186 151 L182 197', 'M108 195 L183 194'],
  包: ['M93 41 Q79 73 48 98', 'M83 60 L183 59 Q180 108 170 124 Q166 130 151 121', 'M74 91 L140 89 L138 131', 'M76 130 L140 129', 'M74 130 L74 183 Q74 197 98 198 L172 196 Q191 196 192 175'],
};

const word = (han, py, meaning, art, action, hint, near) =>
  ({ han, py, meaning, art, action, hint, near, strokes: strokes[han] });
// Each picture question has two reviewed alternatives. A picture that could
// also answer the question (for example, a group containing an adult) is excluded.
const phrasePinyin = {
  大人: 'dà ren', 门口: 'mén kǒu', 张口: 'zhāng kǒu', 小孩: 'xiǎo hái',
  大鱼: 'dà yú', 小鱼: 'xiǎo yú', 大门: 'dà mén', 小猫: 'xiǎo māo',
  晴天: 'qíng tiān', 雨天: 'yǔ tiān', 太热: 'tài rè', 天黑: 'tiān hēi',
  木门: 'mù mén', 木桌: 'mù zhuō', 本子: 'běn zi', 一本书: 'yì běn shū',
  上面: 'shàng mian', 下面: 'xià mian', 上楼: 'shàng lóu', 下楼: 'xià lóu',
  日出: 'rì chū', 日落: 'rì luò', 月亮: 'yuè liang', 日记: 'rì jì',
  高山: 'gāo shān', 石头: 'shí tou', 石桥: 'shí qiáo', 小路: 'xiǎo lù',
  河水: 'hé shuǐ', 水杯: 'shuǐ bēi', 火苗: 'huǒ miáo', 火车: 'huǒ chē',
  稻田: 'dào tián', 泥土: 'ní tǔ', 土豆: 'tǔ dòu', 土墙: 'tǔ qiáng',
  白云: 'bái yún', 白兔: 'bái tù', 白纸: 'bái zhǐ', 乌云: 'wū yún',
  大风: 'dà fēng', 雨伞: 'yǔ sǎn', 雨衣: 'yǔ yī', 风筝: 'fēng zheng',
  红花: 'hóng huā', 小草: 'xiǎo cǎo', 花盆: 'huā pén', 草帽: 'cǎo mào',
  汽车: 'qì chē', 马车: 'mǎ chē', 自行车: 'zì xíng chē', 车站: 'chē zhàn',
  大米: 'dà mǐ', 玉米: 'yù mǐ', 西瓜: 'xī guā', 黄瓜: 'huáng gua',
  书包: 'shū bāo', 书架: 'shū jià', 铅笔: 'qiān bǐ', 毛笔: 'máo bǐ',
  信封: 'xìn fēng', 邮票: 'yóu piào', 明信片: 'míng xìn piàn', 邮包: 'yóu bāo',
};
const phrase = (han, art, label, extra, alternatives) =>
  ({ han, py: phrasePinyin[han], art, label, extra, alternatives });

const town = [
  {
    name: '猫猫家', nameEn: 'Cat House', cat: 'tangerine', sticker: '橘子猫', stickerEn: 'Tangerine', at: [12.8, 47.5],
    title: '橘子猫的第一封信', scene: '🏠✉️',
    intro: '叮咚！橘子猫收到一封信。信上画着一个站着的人，还有一张圆圆的嘴巴。它们能变成什么字呢？',
    words: [
      word('人', 'rén', 'person', 'person',
        ['Have your child stand with their feet apart. Does their shape look like 人?', '请孩子站起来，把两只脚分开。看看身体像不像「人」。'],
        ['Think of two legs pointing away from each other.', '想想两只脚向两边分开的样子。'], ['入', '八', '大']),
      word('口', 'kǒu', 'mouth', 'mouth',
        ['Open your mouth and say ‘ah’. Then trace a square 口 in the air with your finger.', '张开嘴说「啊」，再用手指在空中画一个方方的「口」。'],
        ['Think of the outline of an open mouth.', '想想嘴巴张开，四周围起来的样子。'], ['日', '中', '回']),
    ],
    phrases: [
      phrase('大人', 'adult', ['An adult holding a handbag', '一位提着手提包的成年女子'], '小', ['child', 'doorway']),
      phrase('门口', 'doorway', ['An open door with a mat at the threshold', '打开的门和门槛前的地垫'], '人', ['adult', 'yawn']),
      phrase('张口', 'yawn', ['A kitten opening its mouth wide', '小猫把嘴巴张得很大'], '人', ['adult', 'doorway']),
      phrase('小孩', 'child', ['A child holding a teddy bear', '抱着玩具熊的小女孩'], '大', ['adult', 'doorway']),
    ],
    story: '橘子猫在门口捡到一封信。一个大人带着小孩来找信。橘子猫一张口，就喵了一声。小孩听见了，跑过来捡起信，说：“谢谢你，小猫！”',
  },
  {
    name: '小鱼池', nameEn: 'Fishpond', cat: 'mint', sticker: '薄荷猫', stickerEn: 'Mint', at: [28.6, 70.5],
    title: '大鱼和小鱼', scene: '🐟🫧',
    intro: '薄荷猫来到小鱼池。一条大鱼游在前面，一条小鱼跟在后面。你能认出哪条鱼大，哪条鱼小吗？',
    words: [
      word('大', 'dà', 'big', 'big',
        ['Spread your arms and stand with your feet apart to make the shape of 大.', '和孩子一起张开手臂，双脚分开，做出一个「大」。'],
        ['Think of a person with both arms stretched out.', '想想张开双臂的大字。'], ['人', '太', '天']),
      word('小', 'xiǎo', 'small', 'small',
        ['Trace the long middle stroke, then add a short mark on each side.', '用手指先在中间划一下，再向两边各点一下，看看「小」中间长、两边短。'],
        ['Look for a long center stroke with a short stroke on each side.', '找中间长、两边各有一笔的字。'], ['少', '水', '大']),
    ],
    phrases: [
      phrase('大鱼', 'big-fish', ['An orange fish that nearly fills the card', '一条快占满图卡的橙色鱼'], '小', ['small-fish', 'kitten']),
      phrase('小鱼', 'small-fish', ['An orange fish that takes up a small part of the card', '一条只占图卡一小块的橙色鱼'], '大', ['big-fish', 'kitten']),
      phrase('大门', 'gate', ['A tall double gate at a garden entrance', '花园入口的高大双扇门'], '小', ['big-fish', 'kitten']),
      phrase('小猫', 'kitten', ['A seated cream-colored kitten', '一只坐着的奶油色幼猫'], '大', ['small-fish', 'gate']),
    ],
    story: '薄荷猫从花园的大门走进来。这只小猫最喜欢看鱼吐泡泡。大鱼吐了一个大泡泡，小鱼吐了一个小泡泡。两个泡泡飘到水面，一下子就破了。',
  },
  {
    name: '风车田', nameEn: 'Windmill Field', cat: 'butter', sticker: '奶油猫', stickerEn: 'Butter', at: [43.8, 45.3],
    title: '晴天太热啦', scene: '☀️🌻',
    intro: '奶油猫想去风车田。外面有大太阳，太热啦！它带上一把伞，好在路上遮太阳。',
    words: [
      word('天', 'tiān', 'sky / day', 'sky',
        ['Make the shape of 大, then imagine a line above your head. That makes 天.', '先摆出刚学的「大」，再请孩子想象头顶有一条线，那是天。'],
        ['Look for 大 with an extra line at the top.', '找「大」的头顶多一横的字。'], ['大', '太', '夫']),
      word('太', 'tài', 'too / very', 'too',
        ['Show how a dot under 大 makes 太. Say 太热啦 together.', '指给孩子看，大字下面多了一点。一起说「太热啦」。'],
        ['Look for 大 with a dot underneath.', '找「大」的下面多一点的字。'], ['大', '天', '犬']),
    ],
    phrases: [
      phrase('晴天', 'sunny-field', ['Sunshine over blue sky and grass', '阳光照着蓝天和草地'], '雨', ['rainy-field', 'night-field']),
      phrase('雨天', 'rainy-field', ['Raindrops and puddles under clouds', '乌云下有雨滴和水洼'], '晴', ['sunny-field', 'night-field']),
      phrase('太热', 'sweaty-cat', ['A sweaty kitten fanning itself', '小猫满头大汗，正用爪子扇风'], '天', ['rainy-field', 'night-field']),
      phrase('天黑', 'night-field', ['Stars in a dark blue sky', '深蓝色天空下亮着星星'], '太', ['sunny-field', 'rainy-field']),
    ],
    story: '今天是晴天，风车田里太热了。奶油猫撑起伞，去大树下喝水。它想起雨天凉凉的风，真盼着再凉快一点。等到天黑，风也凉了，它才慢慢走回家。',
  },
  {
    name: '森林站', nameEn: 'Forest Stop', cat: 'cocoa', sticker: '可可猫', stickerEn: 'Cocoa', at: [59.9, 68],
    title: '树下的一本书', scene: '🌳📚',
    intro: '可可猫在树下发现一本书。树有树干和树根。把它们画下来，就可以认识两个新字。',
    words: [
      word('木', 'mù', 'tree / wood', 'tree',
        ['Find the trunk, branches, and roots. Look for those shapes in 木.', '找一找树干、树枝和向两边伸开的树根，再看它们在「木」里是什么样。'],
        ['Look for a trunk in the middle and roots branching out.', '中间像树干，两边像伸开的树根。'], ['本', '末', '未']),
      word('本', 'běn', 'root / measure for books', 'root',
        ['Add a small line near the bottom of 木 to make 本, as in 一本书.', '在「木」的底下加一小横，就成了「一本书」的「本」。'],
        ['Look for an extra short line near the bottom.', '找靠近底下多了一小横的字。'], ['木', '末', '体']),
    ],
    phrases: [
      phrase('木门', 'wood-door', ['A wooden door with a round handle', '竖着的木板门，有一个圆把手'], '本', ['wood-table', 'notebook']),
      phrase('木桌', 'wood-table', ['A wooden table with four legs', '有四条腿的木纹桌子'], '门', ['wood-door', 'picture-book']),
      phrase('本子', 'notebook', ['Blank lined pages and a pencil', '有横线的空白纸页和一支铅笔'], '木', ['wood-door', 'wood-table']),
      phrase('一本书', 'picture-book', ['An open picture book with colorful illustrations', '一本摊开的彩色图画故事书'], '木', ['wood-door', 'wood-table']),
    ],
    story: '可可猫推开木门，走到木桌旁。桌上有一本书和一个小本子。它翻开本子，画下一棵大树。树有树干，也有深深的根。',
  },
  {
    name: '彩虹店', nameEn: 'Rainbow Shop', cat: 'berry', sticker: '莓莓猫', stickerEn: 'Berry', at: [74.9, 44.5],
    title: '盒子里的彩带', scene: '🎀📦',
    intro: '莓莓猫要在彩虹店布置生日会。它请你看看，彩带在盒子的上面还是下面？',
    words: [
      word('上', 'shàng', 'up / on', 'above',
        ['Hold one hand flat like the ground and put the other hand above it. Where is the short line?', '把一只手当成地面，另一只手放在它上面。看看短横在哪儿。'],
        ['Look for the short stroke above the long horizontal line.', '小横在长横的上面。'], ['下', '止', '土']),
      word('下', 'xià', 'down / under', 'below',
        ['Move one hand below the other. Where is the dot in 下?', '把另一只手移到地面下面。看看「下」的那一点在哪里。'],
        ['Look for the mark below the long horizontal line.', '那一点在长横的下面。'], ['上', '不', '卜']),
    ],
    phrases: [
      phrase('上面', 'above', ['A ball above a box', '小球在盒子上方'], '下', ['below', 'inside']),
      phrase('下面', 'below', ['A ball below a box', '小球在盒子下方'], '上', ['above', 'inside']),
      phrase('上楼', 'stairs-up', ['An arrow pointing up the stairs', '箭头从楼梯低处指向高处'], '下', ['stairs-down', 'inside']),
      phrase('下楼', 'stairs-down', ['An arrow pointing down the stairs', '箭头从楼梯高处指向低处'], '上', ['stairs-up', 'inside']),
    ],
    story: '莓莓猫把彩带放在盒子上面，把纸星星藏在盒子下面。小猫们上楼来帮忙。它们挂好彩带，又一起下楼。生日会要开始啦！',
  },
  {
    name: '星星屋', nameEn: 'Star House', cat: 'lilac', sticker: '芋圆猫', stickerEn: 'Taro', at: [89.1, 63.1],
    title: '从日出看到月亮', scene: '🌙⭐',
    intro: '芋圆猫到星星屋来看天空。白天有太阳，晚上有月亮。看清它们的样子，再出发。',
    words: [
      word('日', 'rì', 'sun / day', 'sun',
        ['Make a rectangle with your hands, then draw a line through the middle. Say 日 together.', '用手围一个方框，用一根手指在中间比一横，一起读「日」。'],
        ['Look for a rectangle with just one line through the middle.', '找像长方框，中间只有一横的字。'], ['口', '目', '白']),
      word('月', 'yuè', 'moon / month', 'moon',
        ['Look at the crescent moon, then find the long curved stroke and two lines inside 月.', '指着弯月看一看，再看看「月」字左边的长撇和里面的两横。'],
        ['Look for two short lines inside and a curve on the left.', '找里面有两条短横，左边往外弯的字。'], ['日', '目', '用']),
    ],
    phrases: [
      phrase('日出', 'sunrise', ['The sun by a mountain with an upward arrow', '山边的太阳，旁边的箭头朝上'], '月', ['sunset', 'diary']),
      phrase('日落', 'sunset', ['The sun by a mountain with a downward arrow', '山边的太阳，旁边的箭头朝下'], '月', ['sunrise', 'diary']),
      phrase('月亮', '🌙', ['A crescent moon', '一轮弯月'], '日', ['sunrise', 'diary']),
      phrase('日记', 'diary', ['A small pink book with a lock and a pencil', '带锁的粉色小册子和铅笔'], '月', ['sunrise', '🌙']),
    ],
    story: '芋圆猫早早起床看日出。太阳从山边慢慢升起来，把小镇照得暖暖的。到了傍晚，太阳落下去，月亮升起来。芋圆猫把今天看到的日出和日落画进了日记。',
  },
];

const countryside = [
  {
    name: '石头山', nameEn: 'Rocky Hill', cat: 'smoky', sticker: '灰灰猫', stickerEn: 'Smoky', at: [16.7, 62],
    title: '山路上的圆石头', scene: '⛰️🪨',
    intro: '灰灰猫带着地图去郊游。抬头能看到高山，脚边有块圆石头。你知道「山」和「石」长什么样吗？',
    words: [
      word('山', 'shān', 'mountain', '⛰️',
        ['Hold up three fingers with the middle one tallest. Do they look like mountain peaks?', '伸出三根手指，让中间的手指最高。请孩子看看，像不像山的三个山峰。'],
        ['Look for three upright strokes joined at the bottom, with the tallest in the middle.', '找中间最高、下面把三竖连在一起的字。'], ['出', '凹', '巾']),
      word('石', 'shí', 'stone', '🪨',
        ['Find the line and slant at the top, and the square 口 below. Try touching a small stone.', '先看上面的横和撇，再找下面方方的「口」。可以用手摸一摸身边的小石头。'],
        ['Look for a horizontal and slanted stroke above a square.', '找上面一横一撇、下面有个方框的字。'], ['右', '古', '百']),
    ],
    phrases: [
      phrase('高山', 'mountain', ['A tall mountain with a snowy peak', '山顶有白雪的高山峰'], '石', ['round-stone', 'trail']),
      phrase('石头', 'round-stone', ['A single round gray stone', '单独一块圆圆的灰色石头'], '山', ['mountain', 'trail']),
      phrase('石桥', 'stone-bridge', ['A stone arch bridge over water', '跨过水面的灰色石拱'], '山', ['mountain', 'round-stone']),
      phrase('小路', 'trail', ['A winding path through grass', '草地间弯来弯去的一条小路'], '石', ['round-stone', 'stone-bridge']),
    ],
    story: '灰灰猫抬头看见一座高山。它沿着弯弯的小路走，看到一块圆石头。石头上画着一个箭头，指向河上的石桥。灰灰猫走到桥边，向对岸的海盐猫挥挥手。',
  },
  {
    name: '溪边窑房', nameEn: 'Riverside Kiln', cat: 'salt', sticker: '海盐猫', stickerEn: 'Sea Salt', at: [50, 64],
    title: '小河边看火车', scene: '💧🚂',
    intro: '海盐猫在桥边等朋友。桥下的河水在流。窑房里，火苗在炉子里跳。远处还有一列火车要开过来。',
    words: [
      word('水', 'shuǐ', 'water', '💧',
        ['Draw the center hook and the strokes on both sides like running water. Say 水 together.', '用手指在空中画中间弯钩，再顺着两边比一比流动的水。最后一起读「水」。'],
        ['Look for a hook in the middle and strokes spreading out on both sides.', '找有中间竖钩、两边像水流分开的字。'], ['小', '永', '木']),
      word('火', 'huǒ', 'fire', '🔥',
        ['Find the pointed flames, including the two smaller tips. Draw them on paper together.', '看图找一找，火苗尖尖的，两侧各有一个小尖。请孩子在纸上画画火苗。'],
        ['Look for a shape like 人 with two small strokes above it.', '找中间像「人」、上面有两笔小火苗的字。'], ['人', '大', '灭']),
    ],
    phrases: [
      phrase('河水', 'map-stream', ['Blue water flowing in a stream', '小河里弯弯流动的蓝色水面'], '火', ['🔥', '🚂']),
      phrase('水杯', 'water-glass', ['A clear glass filled with water', '装着水的透明杯子'], '火', ['🔥', '🚂']),
      phrase('火苗', '🔥', ['A group of orange flames', '一簇橙色的火苗'], '水', ['water-glass', 'map-stream']),
      phrase('火车', '🚂', ['A train engine with wheels and a chimney', '有烟囱和车轮的车头'], '水', ['water-glass', '🔥']),
    ],
    story: '清清的河水从石桥下流过。海盐猫带着水杯，和灰灰猫站在桥上。窑房里，火苗在炉子里跳。呜呜！一列火车开了过来。两只小猫一起向火车挥手。',
  },
  {
    name: '稻田小屋', nameEn: 'Rice Farm', cat: 'peach', sticker: '桃桃猫', stickerEn: 'Peach', at: [82, 64],
    title: '泥土里的小惊喜', scene: '🌾🥔',
    intro: '桃桃猫请朋友来稻田小屋。窗外一块块田像格子，松松的土里还藏着小惊喜。',
    words: [
      word('田', 'tián', 'field', 'field-grid',
        ['Point to four fields in the picture. Trace the square and the cross inside it.', '指着图里的四块田，再比划外面一个框、里面一个十字。让孩子找找字里的四个小格。'],
        ['Look for a square with a cross inside.', '找外面一个方框、里面一个十字的字。'], ['日', '甲', '由']),
      word('土', 'tǔ', 'soil', 'soil',
        ['Think of the long bottom line as the ground. Point out the shorter line above it.', '把长横当作地面，看看「土」的底横更长。可以和孩子一起指一指花盆里的泥土。'],
        ['Look for a short top line and a longer bottom line crossed by an upright stroke.', '找上横短、下横长，中间一竖的字。'], ['士', '上', '工']),
    ],
    phrases: [
      phrase('稻田', 'paddy', ['A field full of golden rice plants', '一大片金黄的稻穗'], '土', ['potato', 'mud-wall']),
      phrase('泥土', 'earth', ['A loose pile of brown soil', '松松的一堆棕色土块'], '田', ['paddy', 'potato']),
      phrase('土豆', 'potato', ['An oblong brown potato', '一颗长圆形的棕黄色土豆'], '田', ['paddy', 'mud-wall']),
      phrase('土墙', 'mud-wall', ['A mud wall with a small window', '开着小窗的泥墙'], '田', ['paddy', 'potato']),
    ],
    story: '桃桃猫绕过稻田，来到小屋旁。小屋的土墙晒得暖暖的。它扒开松松的泥土，挖出三个圆圆的土豆。灰灰猫和海盐猫来帮忙。三只猫各拿一个土豆，笑着往回走。',
  },
];

const garden = [
  {
    name: '白云坡', nameEn: 'Cloud Hill', cat: 'cotton', sticker: '棉花猫', stickerEn: 'Cotton', at: [19, 61],
    title: '白云像什么', scene: '☁️🐇',
    intro: '棉花猫来到山坡上。天上有一朵白云，草地上坐着一只白兔。棉花猫拿出白纸，准备画画。',
    words: [
      word('白', 'bái', 'white', 'white-paper',
        ['Compare 白 with 日. Find the extra slanting stroke above the box.', '和学过的「日」比一比。「白」的上面多了一小撇。指一指白纸，再读一读「白」。'],
        ['Look for 日 with a short slanting stroke on top.', '找「日」的上面多了一小撇的字。'], ['日', '百', '自']),
      word('云', 'yún', 'cloud', 'white-cloud',
        ['Point to a cloud. Find two horizontal lines at the top of 云 and a dot at the bottom right.', '指一指天上的云，再看看「云」上面的两横和右下角的一点。'],
        ['Look for two horizontal lines above a bent stroke and a dot.', '找上面有两横，下面有撇折和一点的字。'], ['去', '元', '天']),
    ],
    phrases: [
      phrase('白云', 'white-cloud', ['One white cloud in a blue sky', '蓝天里的一朵白云'], '乌', ['dark-cloud', 'white-rabbit']),
      phrase('白兔', 'white-rabbit', ['A white rabbit with two long ears', '一只长耳朵的白兔'], '云', ['white-paper', 'dark-cloud']),
      phrase('白纸', 'white-paper', ['A blank white sheet of paper', '一张没有图画和文字的白纸'], '云', ['white-rabbit', 'white-cloud']),
      phrase('乌云', 'dark-cloud', ['One dark gray cloud in the sky', '天空里的一朵深灰色乌云'], '白', ['white-cloud', 'white-paper']),
    ],
    story: '棉花猫坐在山坡上，看见一朵白云。那朵白云看起来像一只白兔。棉花猫拿出白纸，把白云和白兔都画了下来。过了一会儿，天上飘来一朵乌云。棉花猫把画放进包里，跑到亭子下面躲雨。',
  },
  {
    name: '风雨亭', nameEn: 'Rain Pavilion', cat: 'breeze', sticker: '清风猫', stickerEn: 'Breeze', at: [51, 59],
    title: '下雨了，收好风筝', scene: '🪁☂️',
    intro: '清风猫正在草地上放风筝。突然刮起了大风。清风猫赶紧收起风筝，穿上雨衣。',
    words: [
      word('风', 'fēng', 'wind', 'strong-wind',
        ['Blow gently on your palm. Look at the outside of 风, then find the two crossing strokes inside.', '轻轻向手心吹一口气，感受风。再看「风」的外框，找找里面交叉的两笔。'],
        ['Look for two crossing strokes inside a frame with a hooked right side.', '找外面有弯钩，里面有两笔交叉的字。'], ['凤', '凡', '几']),
      word('雨', 'yǔ', 'rain', 'rain-drops',
        ['Tap four raindrops with your finger. Find the four dots inside 雨, two on each side.', '用手指轻轻点出雨滴。再找「雨」里面的四点，左边两点，右边两点。'],
        ['Look for a top line and four dots inside the frame.', '找上面一横，框里有四点的字。'], ['两', '田', '而']),
    ],
    phrases: [
      phrase('大风', 'strong-wind', ['A tree bending and leaves blowing sideways', '大树被吹弯了，叶子被吹得满天飞'], '雨', ['umbrella', 'raincoat']),
      phrase('雨伞', 'umbrella', ['An open yellow umbrella with a curved handle', '一把撑开的黄色弯柄雨伞'], '风', ['raincoat', 'kite']),
      phrase('雨衣', 'raincoat', ['A blue hooded raincoat with sleeves and buttons', '一件有袖子、纽扣和帽子的蓝色雨衣'], '风', ['umbrella', 'kite']),
      phrase('风筝', 'kite', ['A diamond-shaped kite with a long string and ribbon tail', '一只菱形风筝，连着长线和彩带尾巴'], '雨', ['raincoat', 'umbrella']),
    ],
    story: '大风把风筝吹得摇来摇去。清风猫收起风筝，穿上蓝色雨衣。棉花猫撑着雨伞，朝清风猫挥手。两只小猫跑到亭子里，坐下来听雨。雨点落在屋顶上，滴答滴答。',
  },
  {
    name: '花草园', nameEn: 'Flower Garden', cat: 'blossom', sticker: '朵朵猫', stickerEn: 'Blossom', at: [82, 64],
    title: '雨后的花草园', scene: '🌺🌿',
    intro: '雨停了。朵朵猫戴着一顶草帽，来到花园。红花开了，小草也长高了。朵朵猫还想在花盆里种一株新花。',
    words: [
      word('花', 'huā', 'flower', 'red-flower',
        ['Point to a flower. Find the grass top of 花, then look at the two parts below it.', '指一指花，再看看「花」上面的草字头。草字头的下面，左右各有一部分。'],
        ['Look for a grass top and 化 underneath it.', '找上面是草字头，下面是「化」的字。'], ['草', '芽', '叶']),
      word('草', 'cǎo', 'grass', 'green-grass',
        ['Point to the grass. Find the grass top of 草, the 日 in the middle, and the 十 below.', '指一指小草。再找「草」上面的草字头，中间的「日」，还有下面的「十」。'],
        ['Look for a grass top with 日 and 十 below it.', '找草字头下面有「日」和「十」的字。'], ['花', '早', '苗']),
    ],
    phrases: [
      phrase('红花', 'red-flower', ['One red flower with a green stem and two leaves', '一朵红花，有绿色的花茎和两片叶子'], '草', ['green-grass', 'straw-hat']),
      phrase('小草', 'green-grass', ['A clump of green grass with no flowers', '一丛绿色的小草，没有花朵'], '花', ['red-flower', 'empty-pot']),
      phrase('花盆', 'empty-pot', ['An empty terracotta flowerpot', '一个没有植物的空陶土花盆'], '草', ['straw-hat', 'green-grass']),
      phrase('草帽', 'straw-hat', ['A woven straw hat with a wide brim and a ribbon', '一顶有宽帽檐和彩带的编织草帽'], '花', ['empty-pot', 'red-flower']),
    ],
    story: '雨停了，红花的花瓣上还挂着几滴水。朵朵猫戴着草帽，拿来一个空花盆。先放一点土，再把花苗种进去。棉花猫和清风猫坐在小草旁，等着新花开放。',
  },
];

const market = [
  {
    name: '马车站', nameEn: 'Carriage Stop', cat: 'chestnut', sticker: '栗子猫', stickerEn: 'Chestnut', at: [14, 68],
    title: '坐马车去市集', scene: '🐎🛞',
    intro: '栗子猫想去市集。它走到车站，看见一匹马拉着车。原来，今天可以坐马车去！',
    words: [
      word('车', 'chē', 'vehicle', 'passenger-car',
        ['Point to a vehicle. Then draw the long vertical stroke of 车 in the air.', '指一指你看见的车，再用手指在空中画出「车」最后那一竖。'],
        ['Look for a long vertical stroke crossing the bottom bar.', '找最后一竖穿过下面一横的字。'], ['东', '牛', '年']),
      word('马', 'mǎ', 'horse', '🐎',
        ['Tap your knees to sound like hooves. Then find the hook in 马.', '用手拍膝盖，学马蹄的声音。再找一找「马」右下角的钩。'],
        ['Look for a long hook on the right and a short horizontal line inside.', '找右边有长钩、里面有一短横的字。'], ['鸟', '乌', '与']),
    ],
    phrases: [
      phrase('汽车', 'passenger-car', ['A small blue car seen from the side', '从侧面看到的一辆蓝色小汽车'], '马', ['horse-carriage', 'bicycle']),
      phrase('马车', 'horse-carriage', ['A horse pulling a wooden carriage', '一匹马拉着木头车厢'], '汽', ['bicycle', 'passenger-car']),
      phrase('自行车', 'bicycle', ['A green bicycle with pedals and two wheels', '一辆有脚踏板和两个轮子的绿色自行车'], '马', ['passenger-car', 'horse-carriage']),
      phrase('车站', 'bus-stop', ['A roadside shelter with a bench and a bus sign', '路边有站牌、雨棚和长椅的候车站'], '行', ['bicycle', 'horse-carriage']),
    ],
    story: '栗子猫在车站等朋友。一辆汽车开了过去，一只小猫骑着自行车从旁边经过。这时，一匹马拉着车，慢慢停在栗子猫面前。栗子猫坐上马车。听，马蹄在路上嗒嗒响！没一会儿，它就到了市集。',
  },
  {
    name: '市集菜摊', nameEn: 'Market Stall', cat: 'millet', sticker: '小米猫', stickerEn: 'Millet', at: [37, 68],
    title: '给野餐准备吃的', scene: '🌽🍉',
    intro: '小米猫要准备午饭。它来到菜摊，看见一袋大米，还有圆圆的西瓜。你还认得摊上的哪些食物？',
    words: [
      word('米', 'mǐ', 'rice', 'raw-rice',
        ['Point to the rice grains. Draw a cross in the air, then find the strokes spreading away from it in 米.', '指一指米粒，再在空中画个十字。看看「米」的十字四周还有哪几笔。'],
        ['Look for a cross with four strokes spreading away from it.', '找中间像「十」、四周向外伸出四笔的字。'], ['木', '来', '未']),
      word('瓜', 'guā', 'melon / gourd', 'watermelon',
        ['Point to the watermelon rind. Then look for the two long outside strokes and the dot inside 瓜.', '指一指西瓜皮，再找「瓜」字外面的两笔长笔画和里面的一点。'],
        ['Look for a long stroke on each side and a dot inside.', '找两边各有一长笔、里面有一点的字。'], ['爪', '抓', '勺']),
    ],
    phrases: [
      phrase('大米', 'raw-rice', ['A bowl of uncooked white rice grains', '碗里装着白白的生米粒'], '瓜', ['corn-cob', 'watermelon']),
      phrase('玉米', 'corn-cob', ['A yellow ear of corn with a green husk', '一根带着绿叶的黄色玉米棒'], '大', ['raw-rice', 'cucumber']),
      phrase('西瓜', 'watermelon', ['A red wedge of watermelon with a green rind', '一块有绿皮、红瓤和黑籽的西瓜'], '黄', ['cucumber', 'corn-cob']),
      phrase('黄瓜', 'cucumber', ['A whole green cucumber and pale green slices', '一根深绿的黄瓜，旁边有几片浅绿色切片'], '西', ['watermelon', 'raw-rice']),
    ],
    story: '小米猫买了一袋大米，准备煮饭。它还挑了一根玉米、一根黄瓜和一个西瓜。栗子猫帮它把西瓜抬上小推车。午饭好了，它们在树下铺开野餐布。两只小猫吃完了饭，最后一起分西瓜。',
  },
  {
    name: '绘本屋', nameEn: 'Storybook Nook', cat: 'ink', sticker: '墨墨猫', stickerEn: 'Inky', at: [62, 68],
    title: '画一本市集小书', scene: '📚✏️',
    intro: '午饭后，墨墨猫请朋友们来绘本屋。它打开书包，拿出一支铅笔。今天看到了什么？我们来把它画进书里吧！',
    words: [
      word('书', 'shū', 'book', '📖',
        ['Open a book. Then find the two folded strokes and the little dot in 书.', '翻开一本书，再找「书」字里的两个转弯和右上角的一点。'],
        ['Look for two folded strokes, a tall vertical line, and a dot at the top right.', '找两笔有转弯、中间有一竖、右上有一点的字。'], ['习', '了', '事']),
      word('笔', 'bǐ', 'pen / writing tool', 'pencil',
        ['Hold a pencil. Find the two little groups of strokes at the top of 笔 and the part that looks like 毛 below.', '握一握手里的笔。看看「笔」的上面是不是左右各有三笔，下面是不是「毛」。'],
        ['Look for a bamboo top above 毛.', '找竹字头下面是「毛」的字。'], ['毛', '竹', '笑']),
    ],
    phrases: [
      phrase('书包', 'school-bag', ['A red school backpack with straps and a zipper', '一个有背带和拉链的红色书包'], '笔', ['bookshelf', 'pencil']),
      phrase('书架', 'bookshelf', ['A wooden shelf holding rows of books', '木头架子上摆着一排排书'], '包', ['school-bag', 'brush']),
      phrase('铅笔', 'pencil', ['A sharpened yellow pencil with a dark tip', '一支削尖了的黄色铅笔，笔尖是黑的'], '毛', ['brush', 'school-bag']),
      phrase('毛笔', 'brush', ['A bamboo-handled brush with a pointed tuft of black bristles', '一支竹杆毛笔，黑色的笔毛聚成笔尖'], '铅', ['pencil', 'bookshelf']),
    ],
    story: '墨墨猫从书架上取下一本书。书页还空着。栗子猫用铅笔画了一辆马车，小米猫画了切开的西瓜。墨墨猫用毛笔在封面上写下书名。它把书放进书包，打算带回家读给大家听。',
  },
  {
    name: '市集邮局', nameEn: 'Post Office', cat: 'pomelo', sticker: '柚子猫', stickerEn: 'Pomelo', at: [86, 68],
    title: '把故事寄给朋友', scene: '📮📦',
    intro: '柚子猫来到邮局门口。它带着朋友们做的小书，想把书寄出去。它还要写一张明信片。',
    words: [
      word('信', 'xìn', 'letter', 'mail-envelope',
        ['Point to the letter. Look for a thin person shape on the left of 信 and 言 on the right.', '指一指信。看看「信」的左边有没有单人旁，右边是不是一个「言」字。'],
        ['Look for the person on the left and 言 on the right.', '找左边是单人旁、右边是「言」的字。'], ['言', '住', '认']),
      word('包', 'bāo', 'to wrap / package', 'mail-parcel',
        ['Pretend to wrap a book with paper. Find the curved strokes that wrap around the inside of 包.', '假装用纸把书包起来。看看「包」的外面是哪两笔，里面最后一笔往哪边弯。'],
        ['Look for a bent hook outside and a curved hook at the bottom.', '找外面有横折钩、底下有竖弯钩的字。'], ['句', '勺', '勾']),
    ],
    phrases: [
      phrase('信封', 'mail-envelope', ['An open paper envelope with a blank sheet inside', '打开的纸信封，露出一角白纸'], '票', ['postage-stamp', 'mail-parcel']),
      phrase('邮票', 'postage-stamp', ['A small purple postage stamp with perforated white edges', '一枚边缘有白色齿孔的紫色邮票'], '信', ['mail-envelope', 'mail-parcel']),
      phrase('明信片', 'postcard', ['A rectangular card with a seaside picture on the front', '一张正面画着海边风景的长方形卡片'], '邮', ['mail-envelope', 'mail-parcel']),
      phrase('邮包', 'mail-parcel', ['A cardboard parcel wrapped with string', '一个用细绳扎好的纸盒包裹'], '片', ['postcard', 'postage-stamp']),
    ],
    story: '柚子猫拿来一张纸，把绘本包好，做成一个邮包。它在明信片上画了一辆小马车，又写了几句话。它把明信片放进信封，在右上角贴了一枚邮票。邮局的阿姨收好信封和邮包，说它们很快就能送到朋友手里。',
  },
];

export const volumes = [
  { title: '小镇篇', titleEn: 'Town', image: '/assets/oil-town.jpg', lessons: town },
  { title: '郊游篇', titleEn: 'Countryside', image: '/assets/oil-countryside.jpg', lessons: countryside },
  { title: '花园篇', titleEn: 'Garden', image: '/assets/oil-garden.jpg', lessons: garden },
  { title: '市集篇', titleEn: 'Market', image: '/assets/oil-market.jpg', lessons: market },
  ...expandedVolumes,
  ...moreVolumes.map(volume => ({ ...volume, extension: true })),
];
export const lessons = volumes.flatMap((volume, index) =>
  volume.lessons.map((lesson) => ({ ...lesson, volume: index })));

export const introTrack = ({ cat }) => `/audio/intro/${cat}.mp3`;
export const storyTrack = ({ cat }) => `/audio/story/${cat}.mp3`;
export const wordTrack = ({ han }) =>
  `/audio/words/${[...han].map((char) => char.codePointAt(0).toString(16)).join('-')}.mp3`;

export function storyReadings(index) {
  const learned = new Map(lessons.slice(0, index + 1).flatMap(({ words }) => words.map(w => [w.han, w])));
  // A familiar character can have a different tone or reading inside a word.
  const phrases = lessons.flatMap(lesson => lesson.phrases).filter(({ han, py }) => {
    const syllables = py.split(' ');
    return [...han].some((char, i) => learned.has(char) && learned.get(char).py !== syllables[i]);
  }).sort((a, b) => b.han.length - a.han.length);

  const tokens = [];
  let remaining = lessons[index].story;
  while (remaining) {
    const phrase = phrases.find(({ han }) => remaining.startsWith(han));
    const text = phrase?.han ?? String.fromCodePoint(remaining.codePointAt(0));
    tokens.push(phrase ?? learned.get(text) ?? text);
    remaining = remaining.slice(text.length);
  }
  return tokens;
}

export const traceGuide = {
  text: '先把手指放在亮点上。再沿着灰线，慢慢写。',
  track: '/audio/instructions/trace.mp3',
};

export const activityPrompts = {
  picture: { text: '点一点图片，看看它会变成什么字。', track: '/audio/instructions/picture.mp3' },
  trace: traceGuide,
  listen: { text: '先听一听，再点出你听到的字。有时还会听到以前学过的字。', track: '/audio/instructions/listen.mp3' },
  build: { text: '先听完整个词，再按顺序点出词里的汉字。', track: '/audio/instructions/build.mp3' },
  match: { text: '读一读卡片上的词。想一想，这个词说的是哪张图？', track: '/audio/instructions/match.mp3' },
  story: { text: '我们一起读故事。点一点亮起来的字或词，听听它在故事里怎么读。', track: '/audio/instructions/story.mp3' },
  stickers: { text: '点一点贴纸，把猫猫和小车贴到轮廓上。', track: '/audio/instructions/stickers.mp3' },
  drive: { text: '先听一听。再点有这个字或词的车道。', track: '/audio/instructions/drive.mp3' },
};
