import { strokePaths } from './stroke-paths.js';

export function character(han, py, meaning, art, near, english, chinese) {
  const hint = [english, chinese];
  return { han, py, meaning, art, near: [...near], action: hint, hint, strokes: strokePaths[han] };
}

export function card(han, py, art, english, chinese, avoid) {
  return { han, py, art, label: [english, chinese], avoid };
}

export function stop(cat, name, nameEn, sticker, stickerEn, title, words, cards, intro, story) {
  const phrases = cards.map(({ avoid, ...picture }, index) => ({
    ...picture,
    extra: [...words.map(({ han }) => han), '日', '木', '田'].find(han => !picture.han.includes(han)),
    alternatives: [...cards.slice(index + 1), ...cards.slice(0, index)]
      .filter(({ art }) => art !== avoid).slice(0, 2).map(({ art }) => art),
  }));
  return { cat, name, nameEn, sticker, stickerEn, title, words, phrases, intro, story, scene: words[0].art };
}

export function book(id, title, titleEn, stops) {
  const positions = stops.length === 6 ? [10, 26, 43, 59, 76, 90] : [12, 31, 50, 69, 88];
  return {
    title, titleEn, image: '/assets/oil-' + id + '.jpg',
    lessons: stops.map((lesson, index) => ({ ...lesson, at: [positions[index], index % 2 ? 74 : 61] })),
  };
}

export const expandedVolumes = [
  book('home', '居家篇', 'At Home', [
    stop('hands-feet', '手脚操', 'Hands and Feet', '杏杏猫', 'Apricot', '给小手穿衣服', [
      character('手', 'shǒu', 'hand', '✋', '毛斤于', 'Find the hook under the three strokes across the top.', '看上面的笔画和下面的竖钩。伸出一只手，再读「手」。'),
      character('脚', 'jiǎo', 'foot', '🦶', '腿却肚', 'Look for 月 on the left and 卩 on the right.', '找左边的月字旁和右边的单耳旁。指一指自己的脚。'),
    ], [
      card('手套', 'shǒu tào', '🧤', 'A pair of gloves', '一双有五根手指的手套'),
      card('手表', 'shǒu biǎo', '⌚', 'A watch with a wrist strap', '一块有腕带的表'),
      card('脚步', 'jiǎo bù', '👣', 'Two bare footprints in a row', '一前一后两个光脚留下的印子'),
      card('袜子', 'wà zi', '🧦', 'A pair of socks', '一双套在脚上的袜子'),
    ], '天气有点凉。小猫拍拍手，跺跺脚。它准备好出门了吗？',
    '小猫先套上袜子，再戴好手套。它看看手表，发现还早。它踏着轻轻的脚步去开门，怕吵醒还在睡觉的朋友。'),
    stop('eye-tooth', '洗漱台', 'Getting Ready', '泡泡猫', 'Bubbles', '刷一下，笑一下', [
      character('眼', 'yǎn', 'eye', '👁️', '目根很', 'Find 目 on the left. Point to one eye.', '找左边的目字旁。指一只眼睛，再读「眼」。'),
      character('牙', 'yá', 'tooth', '🦷', '才寸五', 'Look for the long slant and the hook near the bottom.', '看看穿过字中央的撇和底下的钩。'),
    ], [
      card('眼睛', 'yǎn jing', '👀', 'Two open eyes', '两只睁开的眼睛'),
      card('眼镜', 'yǎn jìng', '👓', 'A pair of glasses', '一副有镜片和镜腿的眼镜'),
      card('牙刷', 'yá shuā', '🪥', 'A toothbrush with a handle', '一把有细柄和刷毛的牙刷'),
      card('牙齿', 'yá chǐ', '🦷', 'A single white tooth', '一颗白白的牙'),
    ], '小猫对着镜子笑，露出了白白的牙。你能找到它的眼睛吗？',
    '小猫拿起牙刷，把牙齿刷干净。妈妈戴上眼镜，看了看小猫的牙。小猫眨眨眼睛，对妈妈又笑了一下。'),
    stop('door-window', '开窗看雨', 'Door and Window', '檐檐猫', 'Eaves', '窗外的雨停了', [
      character('门', 'mén', 'door', '🚪', '问间闭', 'Find the dot and the doorway shape.', '先找到上面的一点，再找像门框的两笔。'),
      character('窗', 'chuāng', 'window', 'house-window', '空穴实', 'Notice the small roof and the enclosed shape under it.', '找上面的穴字头，再看看下面围起来的形状。'),
    ], [
      card('窗户', 'chuāng hu', 'house-window', 'A four-pane window in a frame', '一扇有四块玻璃的窗', 'windowsill'),
      card('窗帘', 'chuāng lián', 'curtains', 'Cloth curtains hanging from a rod', '挂在横杆上的两片布帘'),
      card('门口', 'mén kǒu', 'doorway', 'A door with a mat at the threshold', '门槛前放着一块地垫'),
      card('窗台', 'chuāng tái', 'windowsill', 'A plant on the ledge under a window', '窗下的窄台上放着一盆植物', 'house-window'),
    ], '雨停了。小猫拉开窗帘，想看看外面的天。',
    '小猫从窗户往外看。窗台上的小花还带着水珠。朋友站在门口，问它要不要一起去看雨后的花园。小猫放下窗帘，跑去开门。'),
    stop('bed-light', '晚安小屋', 'Bedtime', '暖灯猫', 'Glow', '睡前的一盏灯', [
      character('床', 'chuáng', 'bed', '🛏️', '木房店', 'Find 木 under the shelter-shaped top.', '找广字头，再看看底下的「木」。'),
      character('灯', 'dēng', 'light / lamp', '💡', '火丁打', 'Look for the fire component on the left.', '把左边的火字旁和学过的「火」比一比。'),
    ], [
      card('床单', 'chuáng dān', 'bed-sheet', 'A folded blue bedsheet', '一张叠好的蓝色布单'),
      card('枕头', 'zhěn tou', 'pillow', 'A soft yellow pillow', '一个鼓鼓的黄色软枕'),
      card('电灯', 'diàn dēng', '🔌💡', 'A glowing electric light with a plug', '有插头、正在发亮的灯'),
      card('灯笼', 'dēng long', '🏮', 'A red paper lantern', '一盏红色纸灯笼'),
    ], '天黑了，屋里亮起一盏灯。小猫要给自己铺床了。',
    '小猫把床单铺平，拍拍软软的枕头。窗外的红灯笼还亮着。妈妈关掉电灯，小猫钻进被子，轻轻说了一声晚安。'),
    stop('shoes-cloth', '收拾衣柜', 'The Closet', '棉线猫', 'Cotton Thread', '出门前找鞋', [
      character('鞋', 'xié', 'shoe', '👟', '靴挂娃', 'Find the leather component on the left and the stacked 土 shapes on the right.', '找左边的革字旁，再看右边上下两个「土」。'),
      character('布', 'bù', 'cloth', '🧣', '巾市右', 'Find 巾 under the first two strokes.', '找上面的一横一撇和下面的「巾」。'),
    ], [
      card('皮鞋', 'pí xié', '👞', 'A brown leather shoe with laces', '一只系着鞋带的棕色皮鞋'),
      card('布袋', 'bù dài', 'cloth-bag', 'A soft cloth tote with handles', '一个提手连着软布的袋子'),
      card('毛巾', 'máo jīn', 'wash-towel', 'A folded blue terry towel', '一条叠好的蓝色毛巾'),
      card('上衣', 'shàng yī', '👕', 'A short-sleeved shirt', '一件短袖上衣'),
    ], '小猫要去看朋友。它打开衣柜，找一找今天要穿什么。',
    '小猫把上衣穿好，从柜子下面找出皮鞋。它把毛巾放进布袋，就可以出门了。鞋带松了，它坐下来重新系好。'),
    stop('face-hair', '镜子前', 'By the Mirror', '月桃猫', 'Moon Peach', '梳好头发再出门', [
      character('脸', 'liǎn', 'face', '😊', '月检捡', 'Look for 月 on the left and three short marks above the bottom line.', '看左边的月字旁，再看右边最后一横上方的三笔。'),
      character('头', 'tóu', 'head', '🧒', '大买斗', 'Find two dots above the strokes below.', '找左上方的两点。摸摸自己的头，再读「头」。'),
    ], [
      card('头发', 'tóu fa', '👩‍🦱', 'Dark curls on top of a person’s head', '长在头顶上的一头卷发'),
      card('脸盆', 'liǎn pén', '🫧🪣', 'A wash basin holding water and bubbles', '一个装着水和泡泡的洗脸盆'),
      card('镜子', 'jìng zi', '🪞', 'A mirror in a frame', '一面有边框、能照出影子的镜子'),
      card('梳子', 'shū zi', 'hair-comb', 'A comb with a row of long teeth', '一把有一排长齿的梳子'),
    ], '小猫早上爬起来，头顶翘起了一撮毛。镜子里的它看起来真好笑。',
    '小猫先用脸盆里的水洗脸，再拿梳子梳头发。它对着镜子看了看，发现头顶还有一撮毛翘着。小猫想，就让这一撮毛和我一起去玩吧。'),
  ]),
  book('kitchen', '餐桌篇', 'At the Table', [
    stop('greens-onion', '菜篮子', 'Vegetable Basket', '青苗猫', 'Sprout', '帮忙选青菜', [
      character('菜', 'cài', 'vegetables', '🥬', '采草花', 'Find the grass top and 采 below it.', '把「菜」的草字头和学过的「花」比一比，再找下面的「采」。'),
      character('葱', 'cōng', 'scallion', 'scallions', '忽苞苗', 'Find the grass top and 心 at the bottom.', '找草字头和最下面的「心」。'),
    ], [
      card('白菜', 'bái cài', '🥬', 'A pale leafy cabbage with a thick white base', '一棵叶子浅绿、菜帮粗白的白菜'),
      card('西红柿', 'xī hóng shì', '🍅', 'One round red tomato', '一颗圆圆的红色番茄'),
      card('大葱', 'dà cōng', 'scallions', 'Long narrow green stalks with white bases', '几根白底、长绿叶的大葱'),
      card('洋葱', 'yáng cōng', '🧅', 'A round onion bulb with papery skin', '一颗有干干外皮的圆洋葱'),
    ], '小猫带着菜篮出门。今天，它要做一顿有白色、绿色和红色的饭。',
    '小猫往篮子里放了白菜和西红柿，又挑了两根大葱。店主问它要不要洋葱。小猫闻了闻，说这两种菜名字都带「葱」，样子却不一样。'),
    stop('noodles-meat', '热面摊', 'Noodle Stall', '麦苗猫', 'Wheat', '把热面端稳', [
      character('面', 'miàn', 'noodles / face', '🍜', '回西而', 'Look for two short lines inside the wide shape.', '看看方框里有哪两条短横。'),
      character('肉', 'ròu', 'meat', '🥩', '内两冈', 'Find the two person-shaped parts inside.', '找框里上下两个像「人」的部分。'),
    ], [
      card('面条', 'miàn tiáo', '🍜', 'A bowl with long noodles', '一碗长长的面条'),
      card('面包', 'miàn bāo', '🍞', 'A loaf of bread', '一条切开后能看见松软内里的面包'),
      card('香肠', 'xiāng cháng', '🌭', 'A sausage served in a split bun', '夹在长面包里的香肠'),
      card('牛肉', 'niú ròu', '🥩', 'A cut of beef', '一片生牛排'),
    ], '小猫闻到了香味。锅里的面条软了，快要出锅了。',
    '小猫买了一碗面条，还选了牛肉作配菜。朋友从袋子里拿出面包和香肠。它们坐下来分着吃，吃完一起把桌子擦干净。'),
    stop('soup-bowl', '一碗热汤', 'A Bowl of Soup', '小勺猫', 'Spoon', '汤太热，吹一吹', [
      character('汤', 'tāng', 'soup', 'fish-soup', '水场扬', 'Look for the three water dots to the left.', '先找左边的三点水，再找到右边的两撇。'),
      character('碗', 'wǎn', 'bowl', 'empty-bowl', '石腕盘', 'Find the stone component from the character you learned earlier.', '找左边的石字旁，和学过的「石」比一比。'),
    ], [
      card('米饭', 'mǐ fàn', '🍚', 'Cooked white rice in a bowl', '一碗白白的熟米饭'),
      card('饭碗', 'fàn wǎn', 'empty-bowl', 'An empty bowl for a meal', '一个空碗，里面没有食物'),
      card('鱼汤', 'yú tāng', 'fish-soup', 'Pieces of fish in broth', '一碗汤里有鱼肉'),
      card('汤匙', 'tāng chí', '🥄', 'A spoon with a round bowl', '一把前端圆圆的勺子'),
    ], '桌上有一碗汤。汤太热，小猫先等一等。',
    '小猫用汤匙舀起一口鱼汤，先吹了吹。朋友往自己的饭碗里盛米饭。小猫说，慢慢吃，热汤就不会烫嘴了。'),
    stop('sweets', '点心盘', 'Snack Plate', '饼饼猫', 'Biscuit', '给朋友留一块', [
      character('糖', 'táng', 'sugar / candy', '🍬', '米糕糠', 'Find 米 on the left and the small 口 on the right.', '找左边的米字旁，再找右边下面的「口」。'),
      character('饼', 'bǐng', 'biscuit / flatbread', '🍪', '并饭饱', 'Find the food component on the left.', '找左边的食字旁，再找右边的「并」。'),
    ], [
      card('糖果', 'táng guǒ', '🍬', 'Candy wrapped with twisted ends', '一颗两头拧着糖纸的糖'),
      card('饼干', 'bǐng gān', '🍪', 'A round biscuit with chocolate chips', '一块有巧克力粒的圆饼干'),
      card('烧饼', 'shāo bing', '🫓', 'A flat baked bread', '一张扁扁的、烤得金黄的面饼'),
      card('蛋糕', 'dàn gāo', '🍰', 'A slice of layered cake with cream', '一块夹着奶油的蛋糕'),
    ], '小猫把点心放到盘子里。朋友还没来，它想留一块给朋友。',
    '盘子里有烧饼和饼干。小猫把蛋糕切成两块，把糖果放在盘子旁。朋友来了，两只小猫一边吃点心，一边说今天做了什么。'),
    stop('tea-cup', '倒杯茶', 'Tea Table', '薄荷叶猫', 'Mint Leaf', '等茶凉一点', [
      character('杯', 'bēi', 'cup', '🥛', '木不坏', 'Find the wood component and 不.', '找左边的木字旁和右边的「不」。'),
      character('茶', 'chá', 'tea', '🍵', '苔余芽', 'Look for the grass top and the two small strokes near the base.', '找上面的草字头，再找下面分开的两小笔。'),
    ], [
      card('杯子', 'bēi zi', '🥛', 'A clear drinking glass', '一个透明的饮水杯'),
      card('茶叶', 'chá yè', '🍃', 'A small handful of loose leaves', '一小把散开的叶子'),
      card('红茶', 'hóng chá', 'red-tea', 'A glass teacup with red-amber tea', '玻璃杯里有红褐色的茶'),
      card('茶壶', 'chá hú', '🫖', 'A teapot with a handle and a spout', '一把有提手和壶嘴的茶壶'),
    ], '桌上摆着茶具。小猫把杯子放稳，等大人来倒茶。',
    '大人把茶叶放进茶壶，加水泡茶。热热的红茶倒进杯子。小猫等茶凉一点，把杯子慢慢推到朋友面前。'),
    stop('peach-pear', '水果拼盘', 'Fruit Plate', '梨花猫', 'Pear Blossom', '四种水果摆一摆', [
      character('桃', 'táo', 'peach', '🍑', '木跳树', 'Find the wood component on the left and 兆 on the right.', '找左边的木字旁，再看看右边的「兆」。'),
      character('梨', 'lí', 'pear', '🍐', '利木李', 'Find 木 under 利.', '找下面的「木」，再看上面的「利」。'),
    ], [
      card('桃子', 'táo zi', '🍑', 'A rosy peach with a crease', '一颗红粉色、中间有一条浅沟的桃'),
      card('梨子', 'lí zi', '🍐', 'A green pear with a narrow top', '一颗上面窄、下面圆的绿梨'),
      card('苹果', 'píng guǒ', '🍎', 'A round red apple with a stem', '一颗带果柄的红苹果'),
      card('香蕉', 'xiāng jiāo', '🍌', 'A bunch of curved yellow bananas', '一串弯弯的黄香蕉'),
    ], '水果洗好了。小猫把它们摆在盘子里，想按形状排一排。',
    '苹果圆圆的，香蕉弯弯的。小猫把桃子放在苹果旁，把梨子放在香蕉旁。它请朋友闭上眼睛摸一摸，看能不能摸出是哪一种水果。'),
  ]),
  book('animals', '动物篇', 'Animals', [
    stop('cat-dog', '院子里的朋友', 'Yard Friends', '斑点猫', 'Speckles', '谁在门边摇尾巴', [
      character('猫', 'māo', 'cat', '🐱', '狗苗描', 'Look for the animal component and 苗.', '找左边的反犬旁，再看右边的「苗」。'),
      character('狗', 'gǒu', 'dog', 'puppy', '猫句狼', 'Look for the animal component and 句.', '找反犬旁和右边的「句」。'),
    ], [
      card('小猫', 'xiǎo māo', 'kitten', 'A small cream-colored kitten', '一只坐着的奶油色小猫'),
      card('小狗', 'xiǎo gǒu', 'puppy', 'A small puppy with floppy ears', '一只垂着耳朵的小狗', 'shepherd-dog'),
      card('熊猫', 'xióng māo', '🐼', 'A panda with black patches around its eyes', '一只眼睛旁有黑斑的大熊猫'),
      card('狼狗', 'láng gǒu', 'shepherd-dog', 'A large German shepherd with pointed ears', '一只耳朵尖、背上有黑毛的大狼狗', 'puppy'),
    ], '小猫听见门边有声音。它跑去看，是哪位朋友来了？',
    '一只小狗来到门口，一见小猫就摇尾巴。院里还有一只竖着耳朵的狼狗。小猫把画着熊猫的小球滚过去，请两只狗一起玩。'),
    stop('cow-sheep', '牧场早餐', 'Pasture Breakfast', '奶沫猫', 'Milk Foam', '从牧场到早餐桌', [
      character('牛', 'niú', 'cow / cattle', '🐄', '午生件', 'Find the long vertical stroke crossing the lowest horizontal.', '找穿过最下面一横的长竖。'),
      character('羊', 'yáng', 'sheep / goat', '🐑', '半美草', 'Look for three horizontal lines and a vertical stroke through them.', '找三横和穿过它们的那一竖。'),
    ], [
      card('奶牛', 'nǎi niú', '🐄', 'A black-and-white dairy cow', '一头身上有黑白花纹的奶牛'),
      card('牛奶', 'niú nǎi', '🥛', 'A glass filled with milk', '一个装满白色牛奶的玻璃杯'),
      card('绵羊', 'mián yáng', '🐑', 'A sheep with a thick fluffy coat', '一只身上有厚厚卷毛的绵羊'),
      card('羊毛', 'yáng máo', '🧶', 'A ball of wool yarn', '一团用羊毛纺成的线'),
    ], '小猫站在牧场门口。远处有奶牛，近处有一只毛茸茸的绵羊。',
    '绵羊走过来，围栏上挂着一小撮羊毛。奶牛正在吃草。小猫想起早上喝的牛奶，原来它是从奶牛身上来的。'),
    stop('hens-eggs', '鸡窝旁', 'By the Henhouse', '羽毛猫', 'Feather', '窝里有个鸡蛋', [
      character('鸡', 'jī', 'chicken', '🐔', '鸟又鸭', 'Find 又 next to 鸟.', '找左边的「又」和右边的「鸟」。'),
      character('蛋', 'dàn', 'egg', '🥚', '定是虫', 'Find 虫 at the bottom of the character.', '找下面的「虫」，再看上面那一捺。'),
    ], [
      card('公鸡', 'gōng jī', '🐓', 'A rooster with a comb and colorful tail', '一只红冠、彩色长尾的大公鸡'),
      card('母鸡', 'mǔ jī', '🐔', 'A hen without long curved tail feathers', '一只尾羽短短的母鸡'),
      card('鸡蛋', 'jī dàn', '🥚', 'An unbroken egg', '一枚没有剥壳的蛋'),
      card('蛋糕', 'dàn gāo', '🍰', 'A slice of cake with cream', '一块夹着奶油的蛋糕'),
    ], '小猫听到鸡叫。它走到鸡窝旁，看看窝里有什么。',
    '公鸡站在低墙上叫。母鸡从窝里慢慢走出来。小猫看见一个圆圆的鸡蛋，想起上次和大人一起用鸡蛋做蛋糕。'),
    stop('birds-flight', '抬头看天空', 'Things That Fly', '翎翎猫', 'Plume', '树梢上的小鸟', [
      character('鸟', 'niǎo', 'bird', '🐦', '乌马岛', 'Find the small dot inside the top fold.', '找上面折里的一点，像鸟的眼睛。'),
      character('飞', 'fēi', 'to fly', '🕊️', '乙九风', 'Find the long bent hook and the two small strokes at its side.', '先找长长的弯钩，再找右边的两小笔。'),
    ], [
      card('小鸟', 'xiǎo niǎo', '🐦', 'A small bird with a beak', '一只有尖嘴的小鸟'),
      card('鸟巢', 'niǎo cháo', '🪺', 'A nest of twigs holding eggs', '树枝搭的小窝，里面有鸟蛋'),
      card('飞机', 'fēi jī', '✈️', 'An airplane with wings and a tail', '一架有机翼和机尾的飞机'),
      card('风筝', 'fēng zheng', '🪁', 'A kite with a long tail and a string', '有尾带和细线的风筝'),
    ], '小猫在树下抬起头。小鸟飞过来了，天上还有什么在飞？',
    '小鸟叼着一根草，飞回树上的鸟巢。远处有一架飞机。朋友把风筝拉回来，让它离鸟巢远一点。'),
    stop('pig-deer', '林边小路', 'Forest Path', '橡果猫', 'Acorn', '看一看谁路过', [
      character('猪', 'zhū', 'pig', '🐖', '猎者猫', 'Find the animal component on the left and 者 on the right.', '找左边的反犬旁和右边的「者」。'),
      character('鹿', 'lù', 'deer', '🦌', '广麝屋', 'Find the wide shelter at the top and 比 at the bottom.', '找上面的广字头，再找下面的「比」。'),
    ], [
      card('小猪', 'xiǎo zhū', '🐖', 'One pink piglet with a short curled tail', '一只有小卷尾巴的粉色小猪'),
      card('梅花鹿', 'méi huā lù', '🦌', 'A deer with pale spots and antlers', '一只身上有浅色斑点、头上有角的鹿'),
      card('长颈鹿', 'cháng jǐng lù', '🦒', 'A giraffe with a very long neck', '一只脖子很长的长颈鹿'),
      card('小路', 'xiǎo lù', 'trail', 'A winding path between patches of grass', '草地之间弯弯的一条小路'),
    ], '今天小猫沿着林边走。它听见树叶沙沙响，停下来看看。',
    '一只小猪跑过小路，钻进矮矮的草丛。梅花鹿走得很轻，身上的斑点像小花。小猫想起绘本里的长颈鹿，它的脖子可比梅花鹿长多了。'),
    stop('bear-elephant', '动物画展', 'Animal Pictures', '墨点猫', 'Ink Spot', '四幅动物画', [
      character('熊', 'xióng', 'bear', 'black-bear', '能鱼熟', 'Find the four dots under 能.', '找「能」下面的四点。'),
      character('象', 'xiàng', 'elephant', '🐘', '兔家豕', 'Find the top fold and the long sweeping strokes below.', '看上面转弯的笔画，再找下面舒展开的几笔。'),
    ], [
      card('熊猫', 'xióng māo', '🐼', 'A black-and-white panda', '一只黑白相间的大熊猫'),
      card('大象', 'dà xiàng', '🐘', 'A large gray elephant with a trunk', '一只有长鼻子的大象'),
      card('黑熊', 'hēi xióng', 'black-bear', 'A dark bear with round ears', '一只耳朵圆圆、毛色深的熊'),
      card('金鱼', 'jīn yú', '🐠', 'A small fish with a fan-shaped tail', '一条尾巴像扇子的小金鱼'),
    ], '小猫在画展上看见四幅画。你能找到长鼻子和圆耳朵吗？',
    '第一幅画里，熊猫抱着竹子。第二幅的大象用长鼻子把水喷起来。第三幅的黑熊背靠着一棵树。小猫指着最后一幅说，金鱼的尾巴像一把小扇子。'),
  ]),
  book('school', '学校篇', 'At School', [
    stop('picture-paper', '画画桌', 'Art Table', '彩笔猫', 'Crayon', '把看到的画下来', [
      character('画', 'huà', 'picture / draw', '🖼️', '田凶函', 'Find 田 under the first line and between the outer sides.', '找第一横下面的「田」，再看看围住它的两笔。'),
      character('纸', 'zhǐ', 'paper', '📄', '纱低氏', 'Find the thread component to the left of 氏.', '找左边的绞丝旁和右边的「氏」。'),
    ], [
      card('图画', 'tú huà', '🖼️', 'A framed landscape illustration', '一幅有画框的风景画'),
      card('白纸', 'bái zhǐ', 'white-paper', 'A blank white sheet', '一张没有字也没有图的白纸'),
      card('铅笔', 'qiān bǐ', 'pencil', 'A sharpened yellow pencil', '一支削尖的黄色铅笔'),
      card('报纸', 'bào zhǐ', '📰', 'A folded newspaper with printed columns', '一份叠起来、有许多列文字的报纸'),
    ], '小猫在桌上铺开一张白纸。它想画下刚才在窗外看到的东西。',
    '小猫从书包拿出铅笔，在白纸上画下树和小鸟。老师把画夹在墙上，旁边还放了一份报纸。朋友走过来，一眼就认出图画里的那棵树。'),
    stop('text-lesson', '读课文', 'Reading Class', '问问猫', 'Curious', '指着字慢慢读', [
      character('课', 'kè', 'lesson', '📚', '果棵话', 'Find the speech component and 果.', '找左边的言字旁和右边的「果」。'),
      character('文', 'wén', 'writing / language', '📃', '交丈六', 'Look for a dot and line above two crossing strokes.', '找上面的一点一横，再看下面交叉的两笔。'),
    ], [
      card('课本', 'kè běn', '📘', 'A blue textbook with a plain cover', '一本蓝色封面的课本'),
      card('课文', 'kè wén', '📖', 'An open page with several lines of text', '摊开的书页，上面有几行课文'),
      card('字典', 'zì diǎn', '📕', 'A thick red dictionary', '一本厚厚的红色工具书'),
      card('黑板', 'hēi bǎn', 'chalkboard', 'A dark classroom board with a chalk tray', '一块下面能放粉笔的深色黑板'),
    ], '老师翻开课本，请小猫用手指指着一行字读。小猫准备好了。',
    '课文在课本的第一页。小猫慢慢读，遇到一个没见过的字。老师让它从字典里找，后来又把这个字写到黑板上。'),
    stop('read-teach', '讲故事时间', 'Story Time', '纸页猫', 'Page', '轮到谁来讲', [
      character('读', 'dú', 'to read', '📖', '续卖话', 'Find the speech component beside 卖.', '找左边的言字旁和右边的「卖」。'),
      character('讲', 'jiǎng', 'to explain / tell', '🗣️', '井说读', 'Find the speech component beside 井.', '找左边的言字旁和右边的「井」。'),
    ], [
      card('读书', 'dú shū', '🧒📖', 'A child looking at an open book', '一个孩子正低头看着摊开的书'),
      card('讲课', 'jiǎng kè', '🧑‍🏫', 'A teacher speaking by a board', '一位老师站在板前讲解'),
      card('日记', 'rì jì', 'diary', 'A pink diary with a lock and pencil', '带锁的粉色小册子和铅笔'),
      card('书架', 'shū jià', 'bookshelf', 'A wooden shelf holding rows of books', '一排排书放在木头架子上'),
    ], '今天老师请小猫挑一个好故事，再讲给朋友听。',
    '老师讲课时，从书架上拿下一本故事书。小猫先和朋友一起读书，再把最喜欢的一段说给大家听。放学后，它把这件事写进日记。'),
    stop('pat-ball', '球场边', 'Ball Court', '蹦蹦猫', 'Bounce', '来回拍球', [
      character('拍', 'pāi', 'to pat / bounce', '👏', '白打怕', 'Find the hand component beside 白.', '找左边的提手旁和右边学过的「白」。'),
      character('球', 'qiú', 'ball', '🏀', '救玩环', 'Find the three horizontal strokes on the left and 求 on the right.', '看左边的王字旁，再找右边的「求」。'),
    ], [
      card('拍手', 'pāi shǒu', '👏', 'Two hands clapping', '两只手正在拍到一起'),
      card('篮球', 'lán qiú', '🏀', 'An orange ball with dark curved seams', '一个有弧形黑线的橙色篮球'),
      card('足球', 'zú qiú', '⚽', 'A black-and-white soccer ball', '一个有黑白花纹的足球'),
      card('排球', 'pái qiú', '🏐', 'A pale ball with curved panels', '一个浅色、表面分成几块的排球'),
    ], '小猫一拍，球就弹起来。朋友也想试一试，它们轮流玩。',
    '小猫先拍了几下篮球，又把足球踢到草地上。朋友用两只手把排球托起来。球没有掉下来，小猫高兴地拍手。'),
    stop('run-jump', '跑跳角', 'Run and Jump', '跃跃猫', 'Hop', '轮流跑，轮流跳', [
      character('跑', 'pǎo', 'to run', '🏃', '抱跳足', 'Find the foot component beside 包.', '找左边的足字旁和右边学过的「包」。'),
      character('跳', 'tiào', 'to jump', '🦘', '路桃跑', 'Find the foot component and 兆.', '找足字旁。右边和「桃」的右边一样。'),
    ], [
      card('跑步', 'pǎo bù', '🏃', 'A person running with one foot forward', '一个迈开步子向前跑的人'),
      card('跳远', 'tiào yuǎn', 'long-jump', 'A child leaping from a line towards a sandpit', '一名孩子从起跳线跳向沙坑'),
      card('跳绳', 'tiào shéng', 'jump-rope', 'A curved skipping rope with handles', '一根两头有手柄的跳绳'),
      card('乒乓球', 'pīng pāng qiú', '🏓', 'A short paddle and a small white ball', '一个短柄球拍和一颗白色小球'),
    ], '小猫来到操场。它想先跑一圈，再找朋友一起跳。',
    '跑步要看前面，跳远要等起跳线前没有人。小猫把跳绳递给等在旁边的朋友。玩了一会儿，它们还打了几下乒乓球。'),
    stop('stage-dance', '学校小舞台', 'School Stage', '铃兰猫', 'Bluebell', '跟着音乐转个圈', [
      character('台', 'tái', 'stage / platform', 'stage', '去吉合', 'Find the small box at the bottom and the bent stroke above it.', '找下面的「口」，再看上面的撇折。'),
      character('舞', 'wǔ', 'to dance', '💃', '无牛开', 'Look for the long horizontal under the upright strokes.', '找中间几竖下面长长的一横。'),
    ], [
      card('舞台', 'wǔ tái', 'stage', 'A low stage framed by red curtains', '红色帘子之间的小舞台'),
      card('跳舞', 'tiào wǔ', '💃', 'A dancer moving with one arm raised', '一位抬着手跳舞的人'),
      card('歌曲', 'gē qǔ', '🎵', 'Musical notes from a song', '飘起来的几个音符'),
      card('笛子', 'dí zi', 'flute', 'A long flute with a row of finger holes', '一支细长、排着几个圆孔的笛子'),
    ], '放学前有一场表演。小猫在舞台下面等着，听到音乐就上台。',
    '歌曲响起来了，有位朋友吹着笛子，小猫跟着音乐跳舞。它在舞台上转了一个圈。表演结束，大家一起拍手。'),
  ]),
  book('nature', '山海篇', 'Rivers and Sea', [
    stop('river-sea', '河口沙滩', 'River Mouth', '贝壳猫', 'Seashell', '河水流到哪里', [
      character('河', 'hé', 'river', 'map-stream', '水可池', 'Find the three water dots and 可.', '找左边的三点水，再找右边的「可」。'),
      character('海', 'hǎi', 'sea', '🌊', '每悔梅', 'Find the three water dots beside 每.', '看左边的三点水和右边的「每」。'),
    ], [
      card('河流', 'hé liú', 'map-stream', 'A strip of blue water winding inland', '在陆地上弯弯流过的一条河'),
      card('沙滩', 'shā tān', '🏖️', 'A broad sandy beach with a small umbrella', '撑着一把伞的一大片沙滩'),
      card('贝壳', 'bèi ké', '🐚', 'One empty ridged shell', '一个有条纹的空贝壳'),
      card('海浪', 'hǎi làng', '🌊', 'A tall blue wave curling at the top', '一道卷起白色浪花的蓝色波浪'),
    ], '小猫顺着河流走到了海边。它停下来，听海浪一下一下地拍着沙滩。',
    '河流在前面汇进大海。小猫坐在干干的沙滩上，捡到一个空贝壳。海浪推来一小片泡沫，又把泡沫带回了海里。'),
    stop('boat-bridge', '过桥看船', 'Boats and Bridge', '小帆猫', 'Sail', '两条船从桥边过', [
      character('船', 'chuán', 'boat / ship', '⛵', '舟沿般', 'Find 舟 on the left and 口 at the lower right.', '找左边的舟字旁，再找右下角的「口」。'),
      character('桥', 'qiáo', 'bridge', 'stone-bridge', '木娇轿', 'Find the wood component on the left and 乔 on the right.', '找木字旁和右边的「乔」。'),
    ], [
      card('帆船', 'fān chuán', '⛵', 'A boat with a tall triangular sail', '一艘有高高三角帆的船'),
      card('轮船', 'lún chuán', '🚢', 'A large ship with decks and a funnel', '一艘有几层甲板和一根烟囱的大船'),
      card('石桥', 'shí qiáo', 'stone-bridge', 'A bridge shaped like a stone arch', '一座用石头砌起来的拱桥', '🌉'),
      card('桥梁', 'qiáo liáng', '🌉', 'An elevated suspension bridge with cables', '一座用粗索吊起来的高桥', 'stone-bridge'),
    ], '小猫走上石桥，低头看了看。水面上有两条船。哪一条船挂着帆呢？',
    '小小的帆船先从石桥旁驶过。远处的轮船也来了，慢慢开过另一座大桥。小猫想，桥梁让我们从这一边走到那一边，船就在水上走。'),
    stop('tree-pine', '树下找叶', 'Trees and Leaves', '松针猫', 'Pine Needle', '两种树的叶子', [
      character('树', 'shù', 'tree', '🌳', '林对村', 'Find 木, 又, and 寸 from left to right.', '从左到右找「木」「又」「寸」。'),
      character('松', 'sōng', 'pine', '🌲', '木公林', 'Find the wood component and 公.', '找左边的木字旁和右边的「公」。'),
    ], [
      card('松树', 'sōng shù', '🌲', 'A green pine with pointed tiers of branches', '一棵树冠尖尖、树枝分层的松树'),
      card('柳树', 'liǔ shù', 'willow', 'A willow with long hanging branches', '一棵枝条长长、向下垂的柳树'),
      card('竹子', 'zhú zi', 'bamboo', 'Two tall green stalks divided into sections', '两根绿色、有一节一节竹节的竹子'),
      card('叶子', 'yè zi', '🍃', 'Two loose green leaves', '两片离开枝条的绿叶'),
    ], '小猫在树下发现两片叶子。哪一棵树上的枝条垂得更低呢？',
    '松树长得高高的，柳树垂下来许多长枝。小猫捡起地上的叶子，又走去看看旁边的竹子。竹子的竿上有一个节，两个节，还有更多节。'),
    stop('snow-ice', '初雪坡', 'First Snow', '霜霜猫', 'Frost', '雪是软的，冰是硬的', [
      character('雪', 'xuě', 'snow', '❄️', '雨雷扫', 'Find the rain component above the three horizontal parts below.', '找上面的雨字头，再看下面短短的三层横。'),
      character('冰', 'bīng', 'ice', '🧊', '水冷永', 'Find two ice dots next to 水.', '找两点水和右边学过的「水」。'),
    ], [
      card('雪花', 'xuě huā', '❄️', 'A six-pointed snowflake', '一瓣有六个尖的小雪花'),
      card('雪人', 'xuě rén', '⛄', 'A snow figure wearing a hat', '一个戴帽子的雪人'),
      card('冰块', 'bīng kuài', '🧊', 'One clear cube of ice', '一块透明的方冰'),
      card('冰淇淋', 'bīng qi lín', '🍦', 'A swirl of ice cream in a cone', '一支装在脆筒里的冰淇淋'),
    ], '窗外飘下第一片雪花。小猫戴好手套，想去堆雪人。',
    '小猫用雪堆了一个雪人。它在屋檐下找到一块冰，摸起来像硬硬的冰块。小猫想，冰淇淋也是冰的，样子却和雪花、冰块都不一样。'),
    stop('star-night', '星空小坡', 'Under the Stars', '星砂猫', 'Stardust', '从夜晚等到早晨', [
      character('星', 'xīng', 'star', '⭐', '日生早', 'Find 日 sitting above 生.', '找上面的「日」和下面的「生」。'),
      character('夜', 'yè', 'night', '🌌', '衣亦文', 'Look for the top dot and the final long sweeping stroke.', '找顶上的一点和右下角长长的一捺。'),
    ], [
      card('星星', 'xīng xing', '✨', 'Several stars sparkling together', '几颗亮闪闪的星星', 'night-field'),
      card('夜晚', 'yè wǎn', 'night-field', 'A dark landscape under the night sky', '夜幕下的一大片暗色大地', '✨'),
      card('月亮', 'yuè liang', '🌙', 'One crescent moon', '一轮弯弯的月亮'),
      card('早晨', 'zǎo chen', 'sunrise', 'A rising sun beside brightening hills', '太阳正从发亮的山边升起来'),
    ], '天黑了，小猫穿好大衣，到小坡上看月亮和星星。',
    '夜晚，月亮像一条弯弯的小船，旁边的星星轻轻闪着光。小猫回家睡了一觉。第二天早晨，太阳升起来，星星全都藏到了亮亮的天里。'),
  ]),
  book('city', '街道篇', 'Around Town', [
    stop('work-shop', '街角商店', 'Corner Shop', '瓦片猫', 'Terracotta', '谁把书送来了', [
      character('工', 'gōng', 'work', '🛠️', '土王干', 'Find the upright stroke between two horizontal lines.', '找两横之间的那一竖。'),
      character('店', 'diàn', 'shop', '🏪', '床广占', 'Find 占 inside the shelter-shaped top.', '找广字头下面的「占」。'),
    ], [
      card('工人', 'gōng rén', '👷', 'A worker wearing a hard hat', '一名戴着安全帽的工人'),
      card('工厂', 'gōng chǎng', '🏭', 'A building with tall chimneys and a zigzag roof', '一幢有高烟囱、锯齿形屋顶的工厂'),
      card('商店', 'shāng diàn', '🏪', 'A small shop at the street corner', '一间开在街角的小商店', 'bookshop'),
      card('书店', 'shū diàn', 'bookshop', 'A shop window displaying only books', '一间橱窗里只摆着图书的书店', '🏪'),
    ], '今天小猫要去书店。路过街角的商店时，它看到有人在搬箱子。',
    '工人把书从工厂送来。他把车停在街角的商店旁，再把几箱书抬进书店。小猫等他搬完箱子，才走过去看书架上的新书。'),
    stop('rail-station', '站台等车', 'Railway Station', '银铃猫', 'Silver Bell', '车快到站了', [
      character('铁', 'tiě', 'iron / railway', '🛤️', '失钱铜', 'Find the metal component beside 失.', '找金字旁和右边的「失」。'),
      character('站', 'zhàn', 'station / stand', '🚉', '立店点', 'Find 立 on the left and 占 on the right.', '找左边的「立」和右边的「占」。'),
    ], [
      card('铁路', 'tiě lù', '🛤️', 'Two parallel rails with sleepers and no train', '两根平行铁轨和一排枕木，画面里没有车'),
      card('地铁', 'dì tiě', '🚇', 'A subway train at a dark tunnel entrance', '停在地下隧道口的列车'),
      card('车站', 'chē zhàn', 'bus-stop', 'A shelter and a sign where people wait', '可以候车的雨棚、长椅和站牌'),
      card('火车', 'huǒ chē', '🚂', 'A steam engine with a chimney', '一个带烟囱的老式火车头'),
    ], '车站里响起了铃声。小猫停在安全线后，等火车进站。',
    '火车沿着铁路慢慢停下。小猫坐车到城里，又换了一趟地铁。出了车站，它回头看了看，地铁的入口在地面上，车却在地下走。'),
    stop('doctor-medicine', '照顾小猫', 'Visiting the Doctor', '小伞猫', 'Parasol', '去看医生', [
      character('医', 'yī', 'medicine / doctor', '🧑‍⚕️', '区匠巨', 'Find 矢 inside the open-sided frame.', '找三面围住的框，再看看里面的「矢」。'),
      character('药', 'yào', 'medicine', '💊', '约花草', 'Find the grass component above 约.', '找草字头下面的「约」。'),
    ], [
      card('医生', 'yī shēng', '🧑‍⚕️', 'A clinician wearing a white coat and stethoscope', '一位穿白衣、戴听诊器的人'),
      card('医院', 'yī yuàn', '🏥', 'A large healthcare building', '一幢看病用的大楼'),
      card('药片', 'yào piàn', 'tablet', 'One round tablet with a line across the top', '一片圆圆、表面有一道线的药'),
      card('救护车', 'jiù hù chē', '🚑', 'An ambulance with an emergency light', '一辆车顶有急救灯的救护车'),
    ], '小猫觉得不舒服，爸爸陪它去医院。医生准备先给它量体温。',
    '医院外停着一辆救护车。医生问小猫哪里不舒服，又告诉爸爸该怎么照顾它。爸爸把药片放到小猫够不到的地方，等到了规定的时间再陪它吃药。'),
    stop('electric-clock', '钟表铺', 'Clock Shop', '滴答猫', 'Tick Tock', '指针走到哪儿了', [
      character('电', 'diàn', 'electricity', '🔌', '田申由', 'Find the last stroke that bends out under the box.', '找最后从方框下面弯出去的一笔。'),
      character('钟', 'zhōng', 'clock', '🕰️', '冲铁针', 'Find the metal component next to 中.', '找金字旁和右边的「中」。'),
    ], [
      card('钟表', 'zhōng biǎo', '🕰️', 'A tabletop clock with hands and a round face', '一面有圆形钟面和指针的座钟'),
      card('电话', 'diàn huà', '☎️', 'A desk phone with a handset', '一部有听筒的座机电话'),
      card('电视', 'diàn shì', '📺', 'A rectangular television screen', '一台方方的电视机'),
      card('电灯', 'diàn dēng', '🔌💡', 'An electric light with a plug', '一盏连着插头的电灯'),
    ], '一进钟表铺，小猫就听见了滴答声。墙上有一排不同样子的钟。',
    '电灯亮着，钟表铺的电话响了。店主接完电话，把一面修好的钟摆到电视旁。小猫看看长针和短针，发现再过一会儿就该回家了。'),
    stop('piano-drum', '音乐会', 'Concert', '响响猫', 'Rhythm', '留一首歌给朋友', [
      character('琴', 'qín', 'stringed instrument', '🎹', '今王禁', 'Find the two 王 shapes above 今.', '找上面的两个「王」和下面的「今」。'),
      character('鼓', 'gǔ', 'drum', '🥁', '支吉喜', 'Find the tall part on the left and 支 on the right.', '找左边高高的部分，再看右边的「支」。'),
    ], [
      card('钢琴', 'gāng qín', '🎹', 'A row of black and white piano keys', '一排黑白相间的钢琴键'),
      card('小提琴', 'xiǎo tí qín', '🎻', 'A wooden violin and a separate bow', '一把木头小提琴，旁边放着琴弓'),
      card('大鼓', 'dà gǔ', '🥁', 'A wide drum with two sticks', '一面宽宽的鼓，旁边有两根鼓槌'),
      card('笛子', 'dí zi', 'flute', 'A long flute with a row of finger holes', '一支细长、排着几个圆孔的笛子'),
    ], '今天是小猫们的音乐会。你听见了弦的声音、鼓声，还是吹出来的声音？',
    '第一只小猫弹钢琴，第二只拉小提琴，第三只吹笛子。轮到小猫敲大鼓，它等着朋友们点头才敲下去。音乐会结束，它和朋友翻开旧绘本，一起读回最早学过的字。'),
  ]),
];
