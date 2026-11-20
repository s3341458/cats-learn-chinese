import { book, card, character, stop } from './expanded-lessons.js';

function lesson(key, name, nameEn, mascot, mascotEn, words, phrases, intro, story) {
  const characters = words.map(([han, py, meaning, art, near, hint]) =>
    character(han, py, meaning, art, near, 'Say the word for “' + meaning + '”, then look closely at the character.', hint));
  return stop(key, name, nameEn, mascot + '猫', mascotEn, name, characters,
    phrases.map(values => card(...values)), intro, story);
}

export const moreVolumes = [
  book('school', '调色篇', 'Paint Box', [
    lesson('red-yellow', '红黄调色盘', 'Red and Yellow', '映霞', 'Sunbeam', [
      ['红', 'hóng', 'red', '🔴', '江工绿', '找左边的绞丝旁。指一指红色。'],
      ['黄', 'huáng', 'yellow', '🟡', '共草由', '找最下面分开的两点。指一指黄色。'],
    ], [
      ['红花', 'hóng huā', 'red-flower', 'A red flower', '一朵红花'],
      ['红灯', 'hóng dēng', '🚦', 'A traffic light with the red light on', '亮着红灯的信号灯'],
      ['黄瓜', 'huáng gua', 'cucumber', 'A cucumber', '一根黄瓜和几片黄瓜片'],
      ['黄叶', 'huáng yè', '🟨🍂', 'Fallen yellow leaves', '落下来的黄叶'],
    ], '绘画桌上有两盒颜料。小猫想用红色和黄色画出今天看到的东西。',
    '小猫从窗边看见一朵红花。街角的红灯亮着，风把几片黄叶吹过路口。它在画纸的角落添了一根黄瓜。黄瓜虽然是绿色的，名字里却有个黄字。'),
    lesson('blue-green', '蓝天和草地', 'Blue Sky and Green Grass', '晴空', 'Blue Sky', [
      ['蓝', 'lán', 'blue', '🔵', '草监绿', '找草字头和最下面像盘子的「皿」。'],
      ['绿', 'lǜ', 'green', '🟢', '红录线', '找绞丝旁和右边的「录」。'],
    ], [
      ['蓝天', 'lán tiān', '🟦☀️', 'A sunny blue sky', '晴朗的蓝天'],
      ['蓝莓', 'lán méi', '🫐', 'A bunch of blueberries', '几颗蓝莓'],
      ['绿叶', 'lǜ yè', '🍃', 'A green leaf', '一片绿叶'],
      ['绿豆', 'lǜ dòu', '🟢🫘', 'Green mung beans', '几颗绿豆'],
    ], '蓝天底下，小猫带着画板去找绿色。它在路边蹲下来看了又看。',
    '一片绿叶落在画板上。小猫把叶子画下来，又画了一碗绿豆。朋友送来几颗蓝莓，小猫抬头看看蓝天，发现天和蓝莓的颜色并不一样。'),
    lesson('black-purple', '深色花篮', 'A Basket of Dark Colors', '葡紫', 'Viola', [
      ['黑', 'hēi', 'black', '⚫', '里墨点', '找下面排成一排的四点。'],
      ['紫', 'zǐ', 'purple', '🟣', '此柴素', '找上面的「此」和下面细细的丝。'],
    ], [
      ['黑板', 'hēi bǎn', 'chalkboard', 'A black classroom board', '一块教室里的黑板'],
      ['黑猫', 'hēi māo', '🐈‍⬛', 'A black cat', '一只黑猫'],
      ['紫花', 'zǐ huā', '🪻', 'Purple flowers', '几串紫花'],
      ['紫葡萄', 'zǐ pú tao', '🍇', 'Purple grapes', '一串紫葡萄'],
    ], '小猫把篮子放到桌上。它请朋友找一找，哪些东西是黑色的，哪些是紫色的？',
    '一只黑猫从黑板旁走过。窗边有紫花，桌上还有一串紫葡萄。小猫把紫花放到窗台上，阳光一照，花瓣的紫色更清楚了。'),
    lesson('orange-pink', '暖色果汁摊', 'Warm Colors at the Juice Stand', '橙露', 'Citrus', [
      ['橙', 'chéng', 'orange', '🟠', '登树桃', '左边是木字旁，右边是「登」。'],
      ['粉', 'fěn', 'powder / pink', '🩷', '米分粒', '把「米」和「分」并排读一读，再看合在一起的样子。'],
    ], [
      ['橙子', 'chéng zi', '🍊', 'A round orange', '一个圆橙子'],
      ['橙汁', 'chéng zhī', '🍊🥤', 'A glass of orange juice', '一杯橙汁'],
      ['粉色', 'fěn sè', '🩷', 'A pink color sample', '一块粉色样片'],
      ['面粉', 'miàn fěn', '🥣⚪', 'A bowl of white flour', '一碗白面粉'],
    ], '今天的果汁摊摆了两张新招牌。一张是橙色的，另一张是粉色的。',
    '小猫切开橙子，榨了一杯橙汁。隔壁的朋友用面粉做点心，还在盒上贴了一颗粉色的心。小猫这才发现，粉色的粉和面粉的粉是一个字。'),
    lesson('gray-ink', '墨水里的小鱼', 'Little Fish in Ink', '墨尾', 'Ink Tail', [
      ['灰', 'huī', 'gray', '🩶', '火灭布', '看看斜撇下面是不是学过的「火」。'],
      ['墨', 'mò', 'ink', '🖋️', '黑土点', '上面是「黑」，下面是「土」。'],
    ], [
      ['灰色', 'huī sè', '🩶', 'A gray color sample', '一块灰色样片'],
      ['灰兔', 'huī tù', '🩶🐇', 'A gray rabbit', '一只灰兔'],
      ['墨水', 'mò shuǐ', '🖋️💧', 'A drop of ink beside a pen', '笔尖旁的一滴墨水'],
      ['墨镜', 'mò jìng', '🕶️', 'Dark sunglasses', '一副墨镜'],
    ], '小猫把纸铺在桌上。往墨水里加一点水，会变成什么颜色呢？',
    '小猫把墨水调淡，画出一片灰色的石头。灰兔站在窗外看画，旁边的朋友戴着墨镜。小猫用浓墨点出小鱼的眼睛，又用淡墨画出了水纹。'),
  ]),
  book('garden', '果园篇', 'Orchard Trail', [
    lesson('fruit-apple', '摘苹果', 'Apple Picking', '苹苹', 'Pippin', [
      ['果', 'guǒ', 'fruit', '🍎', '田里木', '找方框下面向两边分开的笔画。'],
      ['苹', 'píng', 'apple', '🍏', '草乎花', '苹果的「苹」上面有草字头，下面是「平」。'],
    ], [
      ['苹果', 'píng guǒ', '🍎', 'A red apple', '一个红苹果'],
      ['水果', 'shuǐ guǒ', '🍎🍐🍇', 'An assortment of fresh fruit', '苹果、梨和葡萄组成的一盘水果'],
      ['苹果树', 'píng guǒ shù', '🌳🍏', 'An apple tree with green apples', '一棵结了青苹果的树'],
      ['果汁', 'guǒ zhī', '🧃', 'A carton of fruit juice', '一盒果汁'],
    ], '果园的门开了。小猫带着空篮子，想挑几个成熟的苹果。',
    '小路尽头有一棵苹果树。小猫伸手摘下三个苹果，把苹果、梨和葡萄一起放进水果篮。回家后，它用一个苹果做了一杯果汁。'),
    lesson('scent-banana', '香蕉熟了', 'Ripe Bananas', '蕉蕉', 'Banana', [
      ['香', 'xiāng', 'fragrant', '🌼', '禾日音', '「香」上面是「禾」，下面是「日」。'],
      ['蕉', 'jiāo', 'banana', '🍌', '草蒸黑', '找草字头和最下面的四点。'],
    ], [
      ['香蕉', 'xiāng jiāo', '🍌', 'A ripe yellow banana', '一根熟香蕉'],
      ['香气', 'xiāng qì', '👃🌸', 'A nose smelling a flower', '鼻子闻到花的香气'],
      ['香肠', 'xiāng cháng', '🌭', 'A sausage in a bun', '夹着长面包的香肠'],
      ['蕉叶', 'jiāo yè', '🍌🍃', 'A leaf from a banana plant', '香蕉树的大叶子'],
    ], '远远闻到一点甜甜的香气。小猫顺着味道走过去，看见一串熟透的香蕉。',
    '大大的蕉叶遮住了一半阳光。小猫剥开香蕉，闻到很淡的香气。树下的朋友在准备野餐，盘里还有香肠。它问大家，这两种食物的香味一样吗？'),
    lesson('grapes', '葡萄架下', 'Under the Grape Arbor', '藤藤', 'Vine', [
      ['葡', 'pú', 'grape, first character', '🍇', '草苞菊', '「葡」有草字头，里面能找到「甫」。'],
      ['萄', 'táo', 'grape, second character', '🍇', '葡包苗', '「萄」也有草字头，里面有个像「缶」的部分。'],
    ], [
      ['葡萄', 'pú tao', '🍇', 'A bunch of purple grapes', '一串葡萄'],
      ['葡萄干', 'pú tao gān', '🫙🍇', 'A small jar of raisins', '罐装的葡萄干'],
      ['葡萄架', 'pú tao jià', '🪜🍇', 'A trellis supporting grapevines', '托住葡萄藤的架子'],
      ['葡萄汁', 'pú tao zhī', '🍇🥤', 'A glass of grape juice', '一杯葡萄汁'],
    ], '葡萄架底下有凉快的影子。小猫仰起头，数一数架上挂着几串葡萄。',
    '朋友把熟葡萄放到篮子里。一部分榨成了葡萄汁，另一部分晾成葡萄干。小猫尝了一粒，发现葡萄干皱皱的，甜味还在。'),
    lesson('pomelo-mandarin', '剥柚子和橘子', 'Peeling Citrus', '橘瓣', 'Citrus Peel', [
      ['柚', 'yòu', 'pomelo', '🍈', '由抽桃', '左边是木字旁，右边是「由」。'],
      ['橘', 'jú', 'mandarin orange', '🍊', '树柚橙', '先找木字旁，再看右边里外套着的形状。'],
    ], [
      ['柚子', 'yòu zi', '🍈', 'A large pomelo', '一个圆圆的大柚子'],
      ['橘子', 'jú zi', '🍊', 'A small mandarin orange', '一个小橘子'],
      ['柚子皮', 'yòu zi pí', '🍈🔪', 'A thick slice of pomelo rind', '削下来的厚柚子皮'],
      ['橘子汁', 'jú zi zhī', '🍊🧃', 'Mandarin juice in a carton', '一盒橘子汁'],
    ], '篮子里有一个大柚子，还有三个小橘子。小猫猜哪一种果皮比较厚。',
    '剥柚子时，小猫掀起一片厚厚的柚子皮。剥橘子就容易多了。它把橘子分给朋友，留下一些果肉，做成一杯香香的橘子汁。'),
    lesson('lemon', '酸酸的柠檬', 'A Tart Lemon', '柠香', 'Lemon Drop', [
      ['柠', 'níng', 'lemon, first character', '🍋', '字树柚', '找木字旁和右边的「宁」。'],
      ['檬', 'méng', 'lemon, second character', '🍋', '雾菜柠', '两个字都有木字旁。「檬」的右边笔画更多。'],
    ], [
      ['柠檬', 'níng méng', '🍋', 'A whole yellow lemon', '一个完整的黄柠檬'],
      ['柠檬水', 'níng méng shuǐ', '🍋🥤', 'A glass of lemon water', '一杯柠檬水'],
      ['柠檬皮', 'níng méng pí', '🍋🔪', 'Thin curls of lemon peel', '削下来的柠檬皮'],
      ['小草', 'xiǎo cǎo', 'green-grass', 'A patch of grass', '一丛小草'],
    ], '小猫找来一个黄柠檬。它凑近闻一闻，果皮有一股淡淡的香味。',
    '小猫把柠檬切开，挤出几滴汁，滴进水里。柠檬皮弯弯的，像一轮小月亮。小猫端着柠檬水，坐在小草旁边。它先喝一小口，再请朋友尝一尝。'),
  ]),
  book('nature', '海岸篇', 'By the Sea', [
    lesson('sand-shellfish', '沙滩寻宝', 'Beach Treasures', '沙沙', 'Sandy', [
      ['沙', 'shā', 'sand', '🏖️', '少水河', '找三点水和右边的「少」。'],
      ['贝', 'bèi', 'shellfish', '🐚', '见页员', '看看框里面的两笔有没有伸出框底。'],
    ], [
      ['沙滩', 'shā tān', '🏖️', 'A sandy beach', '一片有阳伞的沙滩'],
      ['沙子', 'shā zi', '🪣🟨', 'A bucket of loose sand', '装在桶里的沙子'],
      ['贝壳', 'bèi ké', '🐚', 'A spiral seashell', '一个带花纹的贝壳'],
      ['扇贝', 'shàn bèi', '🪭🐚', 'A fan-shaped scallop shell', '一枚像扇子的扇贝壳'],
    ], '退潮以后，沙滩上露出一排小贝壳。小猫带着小桶走过去。',
    '小猫把沙子轻轻拨开，捡到一个卷卷的贝壳。朋友捡到一枚像小扇子的扇贝壳。它们把空壳放在一起，留着看看各有什么花纹。'),
    lesson('shell-crab', '螃蟹换衣服', 'The Crab’s New Shell', '钳钳', 'Pincers', [
      ['壳', 'ké', 'shell', '🥚', '亮吉秃', '找上面的「士」和下方像「几」的两笔。'],
      ['蟹', 'xiè', 'crab', '🦀', '虫角虾', '找上面的「解」和下面的「虫」。'],
    ], [
      ['蛋壳', 'dàn ké', '🥚💥', 'A broken eggshell', '裂开的鸡蛋壳'],
      ['龟壳', 'guī ké', '🐢', 'A turtle’s hard shell', '乌龟背上的硬壳'],
      ['螃蟹', 'páng xiè', '🦀', 'A whole red crab', '一只红螃蟹'],
      ['蟹钳', 'xiè qián', '🦀✂️', 'A crab’s two pincers', '螃蟹用来夹东西的蟹钳'],
    ], '岸边有只螃蟹横着走。小猫蹲下来，看看它怎样用两个大钳子夹东西。',
    '螃蟹钻到石头底下，只露出一只蟹钳。朋友说，螃蟹长大时会换壳。小猫想到鸡蛋的蛋壳和乌龟的龟壳，原来不同的壳都能保护里面的东西。'),
    lesson('shrimp-waves', '浪花退下去', 'After the Wave', '沫沫', 'Sea Foam', [
      ['虾', 'xiā', 'shrimp', '🦐', '虫下蚂', '找虫字旁和右边学过的「下」。'],
      ['浪', 'làng', 'wave', '🌊', '良河沙', '找三点水和右边的「良」。'],
    ], [
      ['小虾', 'xiǎo xiā', '🦐', 'One small shrimp', '一只小虾'],
      ['龙虾', 'lóng xiā', '🦞', 'A large lobster with claws', '一只有大钳子的龙虾'],
      ['海浪', 'hǎi làng', '🌊', 'A tall rolling sea wave', '从海面卷起来的大浪', '🌊💦'],
      ['浪花', 'làng huā', '🌊💦', 'White splashes made by a wave', '海浪打出来的一簇水花', '🌊'],
    ], '海浪打在石头上，溅起一片浪花。小猫退了两步，等水慢慢退下去。',
    '浪花落下去后，石头旁的一小片水安静了。小猫看见一只透明的小虾。朋友想起水族馆里的龙虾，原来龙虾的样子跟小虾不一样。'),
    lesson('coast-island', '看见海岛', 'An Island in Sight', '岛岛', 'Islet', [
      ['岸', 'àn', 'shore', '🪨🌊', '山岩石', '找上面的小山和最下面的「干」。'],
      ['岛', 'dǎo', 'island', '🏝️', '鸟山屿', '下面是「山」，上半部分的样子有点像「鸟」。'],
    ], [
      ['海岸', 'hǎi àn', '🪨🌊', 'A rocky coastline', '紧挨着海的一排岸石'],
      ['对岸', 'duì àn', '🌉', 'The far bank across a bridge', '桥对面的岸'],
      ['海岛', 'hǎi dǎo', '🏝️', 'A palm-covered island surrounded by sea', '四面都是海的小岛'],
      ['灯塔', 'dēng tǎ', '🗼💡', 'A tall coastal lighthouse', '海边照路的灯塔'],
    ], '海边的灯塔还没亮。小猫站在海岸上，看见远处有一座小岛。',
    '船从有灯塔的一侧出发。小猫回头看海岸，越看越小。快到海岛时，它指给朋友看：海岛四周是水，刚才过桥时看到的对岸却和陆地连在一起。'),
    lesson('sail-reef', '帆船绕过礁石', 'Sailing Past the Reef', '帆帆', 'Sail', [
      ['帆', 'fān', 'sail', '⛵', '凡巾布', '找巾字旁和右边的「凡」。'],
      ['礁', 'jiāo', 'reef', '🪨', '石沙岛', '石字旁在左边，右边最底下有四点。'],
    ], [
      ['帆船', 'fān chuán', '⛵', 'A whole sailboat', '一条有帆的小船'],
      ['船帆', 'chuán fān', '🔺💨', 'A triangular sail catching the wind', '被风吹起来的三角形船帆'],
      ['礁石', 'jiāo shí', '🌊🪨', 'A rock protruding from the sea', '露出水面的礁石'],
      ['珊瑚', 'shān hú', '🪸', 'Branching coral under water', '水底分叉的珊瑚'],
    ], '风把白色的船帆吹得鼓了起来。小猫坐在帆船上，望着前面的海。',
    '船长指着水上露出来的礁石，把帆船往开阔的地方转。小猫从画册上看到水底的珊瑚，想起今天的海里还有很多看不到的东西。'),
  ]),
  book('countryside', '林间篇', 'Woodland', [
    lesson('bamboo-leaf', '竹林里的叶子', 'Leaves in the Bamboo Grove', '竹铃', 'Bamboo Bell', [
      ['竹', 'zhú', 'bamboo', '🎍', '个竿笑', '看看左右两半哪里相像，哪里不一样。'],
      ['叶', 'yè', 'leaf', '🍃', '汁口古', '左边是口字旁，右边是「十」。'],
    ], [
      ['竹子', 'zhú zi', '🎍', 'Tall bamboo stems', '几根有竹节的竹子'],
      ['竹笋', 'zhú sǔn', '🎍🌱', 'A bamboo shoot just sprouting', '刚从地里长出来的竹笋'],
      ['叶子', 'yè zi', '🍃', 'A green leaf', '一片绿叶子'],
      ['书签', 'shū qiān', '📖🔖', 'A bookmark among book pages', '夹在书里的书签'],
    ], '竹林里有细细的风声。小猫低头看看地上的叶子，又看看高高的竹子。',
    '地上有一小棵刚冒出来的竹笋。小猫没去踩它，只捡起落下来的叶子。回家后，它把叶子夹进书里，做成一枚书签。'),
    lesson('branch-root', '树的上面和下面', 'Above and Below the Tree', '松芽', 'Twig', [
      ['枝', 'zhī', 'branch', '🌿', '树技村', '找木字旁，再看右边的「支」。'],
      ['根', 'gēn', 'root', '🌱', '很树眼', '左边是木字旁，和学过的「树」一样。'],
    ], [
      ['树枝', 'shù zhī', '🌿', 'A small tree branch', '一根分叉的树枝', '🐦🌿'],
      ['枝头', 'zhī tóu', '🐦🌿', 'A bird perching on a branch tip', '小鸟停着的枝梢', '🌿'],
      ['树根', 'shù gēn', '🌳🟫', 'A tree with its roots exposed', '从泥土里露出来的树根'],
      ['胡萝卜', 'hú luó bo', '🥕', 'An orange carrot with leaves', '一根带叶的胡萝卜'],
    ], '大雨过后，树旁的泥土冲走了一点。小猫看见树底下露出几条粗粗的根。',
    '一只小鸟从树枝飞到枝头。小猫指给朋友看露出来的树根，又拿出一根带叶的胡萝卜。它把叶子朝上摆好，说胡萝卜也是长在土里的根。'),
    lesson('grove-woods', '森林小路', 'A Path Through the Woods', '森森', 'Fern', [
      ['林', 'lín', 'grove', '🌳🌳', '木森休', '把两个「木」并排，就成了「林」。'],
      ['森', 'sēn', 'forest', '🌲🌳🌲', '林木品', '数一数，这里一共有几个「木」。'],
    ], [
      ['森林', 'sēn lín', '🌳🌲🌳', 'A dense forest of different trees', '由许多不同树木组成的森林'],
      ['竹林', 'zhú lín', '🎍🎍', 'A grove of bamboo', '一片竹林'],
      ['松林', 'sōng lín', '🌲🌲', 'A grove of pine trees', '一片松树林'],
      ['树屋', 'shù wū', '🌳🛖', 'A little house built in a tree', '搭在树上的小屋'],
    ], '小猫沿着森林里的小路散步。它看见一片松林，还听见远处的竹叶响。',
    '朋友在松林旁等它，一起走到竹林的另一头。森林里的树有高有矮。小猫仰头找到一间树屋，想着从那里能看见多少棵树。'),
    lesson('rabbit-butterfly', '白兔追蝴蝶', 'Rabbit and Butterfly', '蒲绒', 'Fluff', [
      ['兔', 'tù', 'rabbit', '🐇', '免象儿', '「兔」的最后一点，像小兔的短尾巴。'],
      ['蝶', 'dié', 'butterfly', '🦋', '虫叶树', '找左边的虫字旁和右下方的「木」。'],
    ], [
      ['白兔', 'bái tù', 'white-rabbit', 'A white rabbit', '一只白兔'],
      ['兔耳朵', 'tù ěr duo', '🐇👂', 'Two long rabbit ears', '一对长长的兔耳朵'],
      ['蝴蝶', 'hú dié', '🦋', 'A butterfly with its wings open', '一只展开翅膀的蝴蝶'],
      ['青草', 'qīng cǎo', 'green-grass', 'Green grass growing low to the ground', '一丛低低的青草'],
    ], '白兔竖起长耳朵。青草丛里有点动静。它停下来，仔细听。',
    '蝴蝶飞出青草丛，停在花上。白兔往前跳了一步，又停下来。它的兔耳朵动了动，最后只是安静地看着蝴蝶飞远了。'),
    lesson('fox', '狐狸的脚印', 'Fox Footprints', '溜溜', 'Russet', [
      ['狐', 'hú', 'fox, first character', '🦊', '瓜狗狸', '左边是反犬旁，右边是学过的「瓜」。'],
      ['狸', 'lí', 'fox, second character', '🦊', '里猫狐', '左边也是反犬旁，右边换成了「里」。'],
    ], [
      ['狐狸', 'hú li', '🦊', 'A red fox', '一只红狐狸'],
      ['狐狸洞', 'hú li dòng', '🦊🕳️', 'A fox beside its burrow', '狐狸旁边的洞口'],
      ['尾巴', 'wěi ba', '🐈〰️', 'An animal’s long curling tail', '一条弯起来的尾巴'],
      ['脚印', 'jiǎo yìn', '🐾', 'Paw prints along a path', '路上的几个脚印'],
    ], '泥地上有一串小脚印。小猫沿着脚印看过去，看见一条毛茸茸的尾巴。',
    '狐狸站在狐狸洞口，轻轻扫了一下尾巴。小猫停在远处，没有去打扰它。等狐狸回到洞里，小猫才低下头，记住那些脚印的样子。'),
  ]),
  book('kitchen', '早餐篇', 'Breakfast Table', [
    lesson('milk-wheat', '牛奶和麦片', 'Milk and Oats', '麦麦', 'Oats', [
      ['奶', 'nǎi', 'milk', '🥛', '妈好女', '左边是女字旁，右边是「乃」。'],
      ['麦', 'mài', 'wheat', '🌾', '青表素', '上半部分有三横，下半部分向两边伸开。'],
    ], [
      ['牛奶', 'niú nǎi', '🥛', 'A glass of milk', '一杯牛奶'],
      ['奶酪', 'nǎi lào', '🧀', 'A wedge of cheese', '一块有小洞的奶酪'],
      ['小麦', 'xiǎo mài', '🌾', 'A stalk of wheat', '一穗小麦'],
      ['麦片', 'mài piàn', '🥣🌾', 'A bowl of cereal flakes', '一碗麦片'],
    ], '锅里煮着热麦片。小猫把碗摆好，等朋友们来吃早餐。',
    '小猫给每个人倒了牛奶，在小碟子里放了奶酪。阳光照到墙上的画，画着田里一排高高的小麦。朋友搅了搅碗里的麦片，等它凉一点再吃。'),
    lesson('oil-salt', '厨房的两个罐子', 'Two Jars in the Kitchen', '芝芝', 'Sesame', [
      ['油', 'yóu', 'oil', '🫙🟡', '河田甲', '找三点水和右边的「由」。'],
      ['盐', 'yán', 'salt', '🧂', '盆土盖', '看下面像小碟子的「皿」。'],
    ], [
      ['香油', 'xiāng yóu', '🫙🟡', 'A jar of golden sesame oil', '一瓶金黄色的香油'],
      ['油滴', 'yóu dī', '🟡💧', 'A tiny drop of cooking oil', '一滴食用油'],
      ['盐罐', 'yán guàn', '🧂', 'A little salt shaker', '一个装盐的小罐'],
      ['青菜', 'qīng cài', '🥬', 'A bunch of leafy greens', '一把青菜'],
    ], '桌上有两个小罐子。一只里面是香油，另一只里面是盐。',
    '小猫洗好青菜，请爸爸倒几滴香油。碗里落下一小颗亮亮的油滴。它把盐罐递给爸爸，自己负责把小碟子摆整齐。'),
    lesson('date-honey', '枣和蜂蜜', 'Dates and Honey', '枣枣', 'Jujube', [
      ['枣', 'zǎo', 'jujube', '🔴🍇', '刺束朵', '看看中间像框的部分和下面分开的两点。'],
      ['蜜', 'mì', 'honey', '🍯', '虫心室', '找宝盖头和最下方的「虫」。'],
    ], [
      ['红枣', 'hóng zǎo', '🔴🍇', 'Several dried red dates', '几颗红枣'],
      ['枣树', 'zǎo shù', '🌳🔴', 'A jujube tree with red dates', '一棵结了红枣的枣树'],
      ['蜂蜜', 'fēng mì', '🍯', 'A jar of honey', '一罐蜂蜜'],
      ['蜜蜂', 'mì fēng', '🐝', 'A striped honeybee', '一只蜜蜂'],
    ], '院子里有一棵枣树。一只蜜蜂在旁边的小花上停了一下。',
    '小猫在枣树下捡到一颗红枣，又看见蜜蜂飞回花丛。家里桌上有一小罐蜂蜜。它端来红枣和温水，请朋友尝尝两种甜味有什么不同。'),
    lesson('bee-porridge', '花边的一碗粥', 'Porridge by the Flowers', '蜜泡', 'Honey Bear', [
      ['蜂', 'fēng', 'bee', '🐝', '虫虾蚂', '左边是虫字旁，右下角有一竖穿过几横。'],
      ['粥', 'zhōu', 'porridge', '🥣', '弓米弱', '找中间的「米」和两边的「弓」。'],
    ], [
      ['蜜蜂', 'mì fēng', '🐝', 'A honeybee on its own', '一只蜜蜂'],
      ['蜂巢', 'fēng cháo', '🐝🍯', 'A honeycomb built by bees', '蜜蜂做的蜂巢'],
      ['米粥', 'mǐ zhōu', '🥣🍚', 'A bowl of plain rice porridge', '一碗白米粥'],
      ['南瓜粥', 'nán guā zhōu', '🥣🎃', 'A bowl of orange pumpkin porridge', '一碗橙色的南瓜粥'],
    ], '小猫在窗边吃粥，听见花丛里有蜜蜂飞过的声音。',
    '桌上有米粥和南瓜粥。朋友挑了南瓜粥，小猫给自己盛了白米粥。窗外的蜜蜂飞过几朵花，又往远处的蜂巢飞去了。'),
    lesson('morning-meal', '早餐准备好了', 'Breakfast Is Ready', '晨光', 'Breakfast Bell', [
      ['早', 'zǎo', 'early', '🌅', '日十旱', '「日」在上，「十」在下。'],
      ['餐', 'cān', 'meal', '🍽️', '食饭修', '看看最下面有没有像「食」的部分。'],
    ], [
      ['早晨', 'zǎo chen', 'sunrise', 'Sunrise early in the morning', '早晨的太阳刚刚升起'],
      ['早餐', 'zǎo cān', '🥣🍞', 'A breakfast of porridge and toast', '一份麦片和吐司做的早餐'],
      ['餐桌', 'cān zhuō', '🍽️🪑', 'A dining table set for breakfast', '铺好餐盘的餐桌'],
      ['餐巾', 'cān jīn', '🍽️🟨', 'A folded napkin next to a plate', '盘子旁叠好的餐巾'],
    ], '太阳刚升起来，小猫已经把几块餐巾放到桌边了。今天大家一起吃早餐。',
    '早晨，窗外亮起来。朋友们来到餐桌边，给彼此说早上好。小猫把早餐分给大家，把一块忘了拿的餐巾递给最后来的朋友。'),
  ]),
  book('home', '整理篇', 'A Tidy Home', [
    lesson('wash-brush', '小东西洗干净', 'Wash and Brush', '水珠', 'Droplet', [
      ['洗', 'xǐ', 'wash', '🫧', '先河沙', '找三点水和右边的「先」。'],
      ['刷', 'shuā', 'brush', '🪥', '刮巾剧', '找右边竖起来的立刀旁。'],
    ], [
      ['洗手', 'xǐ shǒu', '🫧✋', 'Hands being washed in soap bubbles', '正在用泡泡洗手'],
      ['洗脸', 'xǐ liǎn', '🫧😊', 'A face being washed', '正在用水洗脸'],
      ['牙刷', 'yá shuā', '🪥', 'A toothbrush', '一把牙刷'],
      ['刷子', 'shuā zi', '🧽🖌️', 'A short brush used for scrubbing', '一把用来清洁的小刷子'],
    ], '小猫从外面回来，摸摸脸，又看看自己的手。它打算先洗一洗。',
    '小猫先洗手，再洗脸。牙刷放在自己的杯子里，用来刷牙。爸爸拿来另一把刷子，刷掉鞋底沾着的泥。'),
    lesson('sweep-wipe', '灰尘跑哪儿了', 'Where Did the Dust Go?', '拂拂', 'Dust Bunny', [
      ['扫', 'sǎo', 'sweep', '🧹', '找拍打', '找提手旁和右边排在一起的短横。'],
      ['擦', 'cā', 'wipe', '🧽', '察抹打', '左边是提手旁，右边能找到「察」。'],
    ], [
      ['扫地', 'sǎo dì', '🧹🍂', 'A broom sweeping leaves from the floor', '扫帚正在扫地上的叶子'],
      ['扫帚', 'sào zhou', '🧹', 'A broom standing upright', '一把立着的扫帚'],
      ['擦窗', 'cā chuāng', '🪟🧽', 'A cloth wiping a window', '正在擦窗玻璃的布'],
      ['橡皮擦', 'xiàng pí cā', '✏️🟪', 'A rectangular eraser and a pencil', '铅笔旁一块方方的橡皮擦'],
    ], '窗边有一点灰，地上有几片碎叶。小猫猜，扫和擦分别该用什么工具。',
    '小猫拿来一把扫帚。它从门口开始扫地，把碎叶扫成一小堆。朋友用湿布擦窗，窗玻璃很快变亮了。它们还找到一块橡皮擦，原来这也是拿来擦东西的。'),
    lesson('table-chair', '桌子旁留个位', 'A Seat by the Table', '栗椅', 'Little Seat', [
      ['桌', 'zhuō', 'table', '🖥️', '早木课', '看看最下面有没有学过的「木」。'],
      ['椅', 'yǐ', 'chair', '🪑', '树骑机', '左边是木字旁，右边是「奇」。'],
    ], [
      ['木桌', 'mù zhuō', 'wood-table', 'A little wooden table', '一张小木桌'],
      ['书桌', 'shū zhuō', '📚🖥️', 'A desk with books on it', '放着一摞书的书桌'],
      ['椅子', 'yǐ zi', '🪑', 'A chair with a back', '一把有靠背的椅子'],
      ['轮椅', 'lún yǐ', '🦽', 'A wheelchair with big wheels', '一辆有大轮子的轮椅'],
    ], '小猫把书放到书桌上，又请大家到另一张木桌旁坐下。',
    '小猫给朋友搬来一把椅子，还把桌边挪出一块空地方，让坐轮椅的朋友进出方便。大家坐下来，一起翻看刚借来的故事书。'),
    lesson('cabinet-basin', '柜子里的东西', 'Inside the Cabinet', '小橱', 'Cupboard', [
      ['柜', 'guì', 'cabinet', '🗄️', '巨树枕', '找木字旁和右边的「巨」。'],
      ['盆', 'pén', 'basin', '🪴', '分皿盐', '上半部分是「分」，下半部分是「皿」。'],
    ], [
      ['衣柜', 'yī guì', '👕🚪', 'A wardrobe holding clothes', '装衣服的衣柜'],
      ['书柜', 'shū guì', '📚🗄️', 'A cabinet holding books', '装书的书柜'],
      ['花盆', 'huā pén', '🪴', 'A pot with a plant growing in it', '装着植物的花盆'],
      ['脸盆', 'liǎn pén', '🫧🪣', 'A basin holding water and bubbles', '装着水和泡泡的脸盆'],
    ], '小猫想把东西放回原处。它先看一看，哪些东西该放进哪一个柜子。',
    '小猫把衣服挂进衣柜，把绘本收进书柜。它把用过的脸盆里的水倒干净，让盆晾一晾。它又把花盆搬到窗边，让小苗晒晒太阳。'),
    lesson('umbrella-box', '雨停后收起来', 'Putting Things Away After the Rain', '盒盒', 'Button Box', [
      ['伞', 'sǎn', 'umbrella', '☂️', '个全半', '上面像伞顶，下面长长的一竖像伞柄。'],
      ['盒', 'hé', 'box', '📦', '盆盖会', '上面是「合」，下面是像小碟子的「皿」。'],
    ], [
      ['雨伞', 'yǔ sǎn', 'umbrella', 'An open umbrella for rain', '一把撑开的雨伞'],
      ['遮阳伞', 'zhē yáng sǎn', '⛱️', 'A large beach umbrella for shade', '挡太阳用的大伞'],
      ['纸盒', 'zhǐ hé', '📦', 'A square cardboard box', '一个方方的纸盒'],
      ['饭盒', 'fàn hé', '🍱', 'An open lunch box with food', '打开后装着饭菜的饭盒'],
    ], '雨停了，小猫把雨伞放到屋外晾干。地上还有两个盒子要整理。',
    '小猫把空纸盒放到门边，又拿着饭盒去洗。朋友把院里的遮阳伞撑开，那里有一片凉快的影子。等雨伞晾干了，它们再把小伞收好。'),
  ]),
  book('school', '运动篇', 'Sports Day', [
    lesson('basketball-football', '操场上的两种球', 'Two Balls on the Court', '弹弹', 'Bounce', [
      ['篮', 'lán', 'basket', '🏀', '草监筐', '找竹字头和最下面像小盘子的「皿」。'],
      ['足', 'zú', 'foot', '🦶', '口走跑', '找上面的「口」，看看下面怎样一左一右伸开。'],
    ], [
      ['篮球', 'lán qiú', '🏀', 'An orange basketball', '一个橙色篮球'],
      ['篮筐', 'lán kuāng', '🏀🕸️', 'A basketball hoop with a net', '有球网的篮球筐'],
      ['足球', 'zú qiú', '⚽', 'A black-and-white football', '一个黑白相间的足球'],
      ['足印', 'zú yìn', '👣', 'Bare footprints in a row', '一前一后的两个足印'],
    ], '操场上滚来一个篮球，一个足球。小猫先看看它们的颜色，再想想怎么玩。',
    '朋友把篮球往篮筐上一投，球从网中掉下来。小猫用脚把足球踢回去。雨后的泥地上留着几个足印，它们看着脚印猜是谁刚走过。'),
    lesson('volleyball-badminton', '球网的另一边', 'Across the Net', '羽羽', 'Feather', [
      ['排', 'pái', 'row / arrange', '🧸🧸🧸', '拍非打', '找提手旁和右边的「非」。'],
      ['羽', 'yǔ', 'feather', '🪶', '习翠飞', '左右各有一组像小翅膀的笔画。'],
    ], [
      ['排队', 'pái duì', '🧍🧍🧍', 'Three people waiting in a line', '三个人排成一队'],
      ['排球', 'pái qiú', '🏐', 'A pale striped volleyball', '一个浅色排球'],
      ['羽毛', 'yǔ máo', '🪶', 'One loose feather', '一根羽毛'],
      ['羽毛球', 'yǔ máo qiú', '🏸', 'A shuttlecock with a badminton racket', '球拍旁的羽毛球'],
    ], '操场中间拉起一张网。小猫拎着球拍，看看旁边的朋友在玩什么。',
    '大家排队等着轮流玩。有的人把排球轻轻垫过网，有的人用球拍打羽毛球。小猫找到一根落下的羽毛，比一比它和球上的羽毛有什么不同。'),
    lesson('swim', '游泳池边', 'At the Swimming Pool', '浪点', 'Ripple', [
      ['游', 'yóu', 'swim / travel', '🏊', '方放湖', '左边是三点水，右下角有个「子」。'],
      ['泳', 'yǒng', 'swimming', '🏊‍♀️', '河水冰', '找三点水，右边的「永」上还有一点。'],
    ], [
      ['游泳', 'yóu yǒng', '🏊', 'A swimmer moving through water', '一个人正在水里游泳'],
      ['泳帽', 'yǒng mào', '🧢💧', 'A cap for swimming', '一顶下水时戴的泳帽'],
      ['泳圈', 'yǒng quān', '🛟', 'A floating swim ring', '一个漂在水上的泳圈'],
      ['毛巾', 'máo jīn', 'wash-towel', 'A folded towel', '一条叠好的毛巾'],
    ], '小猫来到游泳池，把泳帽戴在头上。它看见一个圆圆的泳圈浮在水面上。',
    '教练在浅水处等小猫。小猫戴上泳帽，跟着教练慢慢练游泳。上岸以后，它用毛巾擦干身体，把泳圈放回原来的地方。'),
    lesson('slide-wheel', '带轮子的小车', 'Wheels in the Park', '轮轮', 'Wheely', [
      ['滑', 'huá', 'slide', '🛝', '骨河油', '左边是三点水，右边是「骨」。'],
      ['轮', 'lún', 'wheel', '🛞', '车软转', '找车字旁和右边的「仑」。'],
    ], [
      ['滑梯', 'huá tī', '🛝', 'A playground slide', '一座游乐场滑梯'],
      ['滑板', 'huá bǎn', '🛹', 'A skateboard with four small wheels', '一块有四个小轮的滑板'],
      ['车轮', 'chē lún', '🛞', 'A single rubber wheel', '一个有橡胶轮胎的车轮'],
      ['轮滑鞋', 'lún huá xié', '🛼', 'A boot with roller-skate wheels', '鞋底装着轮子的轮滑鞋'],
    ], '小猫想看看操场上有多少样东西带轮子。它先从自己的滑板看起。',
    '朋友穿着轮滑鞋慢慢滑过来。小猫把滑板倒过来，转了转小轮。旁边的小车也有车轮。只有滑梯没有轮子，小猫也能从上面滑下来。'),
    lesson('race-win', '跑到终点线', 'Across the Finish Line', '奖章', 'Medal', [
      ['赛', 'sài', 'race / contest', '🏁', '寒贝宝', '看宝盖头下面，最底下有没有「贝」。'],
      ['胜', 'shèng', 'win', '🏆', '月生胖', '左边是月字旁，右边是「生」。'],
    ], [
      ['赛跑', 'sài pǎo', '🏃🏃', 'Two runners racing together', '两个人正在赛跑'],
      ['比赛', 'bǐ sài', '🏟️🏁', 'A sports contest on a marked field', '赛场上举行的比赛'],
      ['获胜', 'huò shèng', '🏆🙌', 'A trophy held up in victory', '获胜后举起的奖杯'],
      ['奖牌', 'jiǎng pái', '🏅', 'A medal attached to a ribbon', '一块挂在丝带上的奖牌'],
    ], '起点旁的小旗向下一挥，赛跑开始了。小猫跟着朋友们往前跑。',
    '比赛结束时，朋友先跑到了终点。小猫向获胜的朋友拍手，还帮忙把奖牌递过去。它记住了自己这次的成绩，准备下次再试。'),
  ]),
  book('school', '同学篇', 'Classroom Friends', [
    lesson('school', '第一次进学校', 'A First Day at School', '书芽', 'Book Bud', [
      ['学', 'xué', 'learn', '📖', '子字觉', '看看最下面是不是一个「子」。'],
      ['校', 'xiào', 'school', '🏫', '木树交', '左边是木字旁，右边是「交」。'],
    ], [
      ['学校', 'xué xiào', '🏫', 'A school building', '一幢学校的教学楼'],
      ['学生', 'xué sheng', '🎒🧒', 'A student carrying a school bag', '一个背书包的学生'],
      ['校门', 'xiào mén', '🏫🚪', 'The entrance gate to a school', '学校入口的大门'],
      ['校服', 'xiào fú', '👔🏫', 'A school uniform shirt', '一件学生穿的校服'],
    ], '今天小猫穿好校服，背上书包。它和妈妈走到了学校门口。',
    '校门打开了，小猫跟着其他学生走进去。它看到墙上挂着画，听见有人在教室里读书。到了学校，它先向身边的朋友说了一声你好。'),
    lesson('teacher', '老师来读故事', 'Story Time with a Teacher', '页页', 'Pages', [
      ['老', 'lǎo', 'old / honorific', '👵', '考毛者', '看「老」的上半部分，再找底下弯起来的笔画。'],
      ['师', 'shī', 'teacher', '🧑‍🏫', '帅巾归', '看看右边一横下面的「巾」。'],
    ], [
      ['老师', 'lǎo shī', '🧑‍🏫', 'A teacher holding a book', '拿着书的老师'],
      ['老人', 'lǎo rén', '👵', 'An older person with white hair', '一位头发花白的老人'],
      ['厨师', 'chú shī', '🧑‍🍳', 'A chef with a tall white hat', '戴白帽子的厨师'],
      ['故事书', 'gù shi shū', '📖🌟', 'A storybook open to an illustration', '翻开的图画故事书'],
    ], '老师从书架取下一本故事书。小猫和朋友们围成半圈，一起听故事。',
    '书里有一位老人，年轻时是一名厨师。老师读到他做的饭，大家想起了家里的味道。读完故事，小猫把书放回架上，让下一位朋友也能看。'),
    lesson('classmates', '我们在同一个班', 'In the Same Class', '并并', 'Side by Side', [
      ['同', 'tóng', 'same', '🟢🟢', '周向用', '看看外框里有没有一横和一个「口」。'],
      ['班', 'bān', 'class', '👫', '王现珠', '看看中间的笔画隔开了左右哪两部分。'],
    ], [
      ['同学', 'tóng xué', '🎒👫', 'Schoolmates standing together', '两个背书包的同学'],
      ['相同', 'xiāng tóng', '🟢🟢', 'Two identical green circles', '两个一模一样的绿圆圈'],
      ['班级', 'bān jí', '🏫👫', 'A group of children in their classroom', '同一个班的小朋友'],
      ['班牌', 'bān pái', '🏫🔖', 'A class sign beside a classroom door', '教室门边的班牌'],
    ], '两只小猫一起去上学。它们在门口看见了自己的班牌，原来它们在同一个班！',
    '同学们把画挂到墙上。小猫和朋友画了颜色相同的圆圈，却给圆圈添了不同的表情。这些画摆成一排，成了班级里的一面笑脸墙。'),
    lesson('write-character', '写下自己的名字', 'Writing My Name', '小楷', 'Brush Tip', [
      ['写', 'xiě', 'write', '✍️', '与字宝', '上面是没有点的盖子，下面是「与」。'],
      ['字', 'zì', 'written character', '🔤', '子学安', '「子」坐在宝盖头下面，就是「字」。'],
    ], [
      ['写字', 'xiě zì', '✍️', 'A hand writing characters', '正在写字的一只手'],
      ['写信', 'xiě xìn', '✍️✉️', 'A hand writing a letter', '正在写一封信'],
      ['汉字', 'hàn zì', '字', 'A Chinese character printed alone', '单独印着一个汉字'],
      ['字典', 'zì diǎn', '📘🔍', 'A dictionary used to look up words', '可以查字的一本字典'],
    ], '小猫画好了一张画，想在角落里写下自己的名字。它先拿来一张纸练一练。',
    '小猫写字时漏了一笔。它去字典里看了看，回来把那个汉字写完整。旁边的朋友在写信，也请小猫帮它看看有没有少写一笔。'),
    lesson('count-calculate', '数一数桌上的果子', 'Counting Fruit', '算盘', 'Abacus', [
      ['算', 'suàn', 'calculate', '🧮', '竹目管', '找竹字头，再找中间的「目」。'],
      ['数', 'shǔ', 'count', '🔢', '放米楼', '右边像「放」字的右半部分。这一课单读 shǔ，表示数一数。「数字」里的「数」读 shù。'],
    ], [
      ['算术', 'suàn shù', '➕➖', 'Addition and subtraction signs', '加号和减号'],
      ['算盘', 'suàn pán', '🧮', 'An abacus with several rows of beads', '一把有几排珠子的算盘'],
      ['数一数', 'shǔ yi shǔ', '☝️🔢', 'A finger counting a series of numbers', '边指边数一数'],
      ['数字', 'shù zì', '1️⃣2️⃣3️⃣', 'The numerals one, two, and three', '数字一、二、三'],
    ], '小猫从果篮拿出几个苹果。它想数一数，桌上总共有多少个。',
    '朋友数苹果，小猫在旁边把数字写下来。老师拿来一把算盘，拨几颗珠子给它看。它们用这个办法做了一道加法算术题。'),
  ]),
  book('nature', '四季篇', 'Weather and Seasons', [
    lesson('sun-cloud', '今天是晴天吗', 'Is It Sunny Today?', '晴晴', 'Sunshine', [
      ['晴', 'qíng', 'sunny', '☀️', '清睛日', '左边是日字旁，右边是「青」。'],
      ['阴', 'yīn', 'cloudy / shade', '☁️', '阳月明', '左边是双耳旁，右边是「月」。'],
    ], [
      ['晴天', 'qíng tiān', 'sunny-field', 'A sunny field under a clear sky', '太阳照着晴朗的草地', '🟦☀️'],
      ['晴空', 'qíng kōng', '🟦☀️', 'A clear blue sky with no clouds', '没有云的一片蓝天', 'sunny-field'],
      ['阴天', 'yīn tiān', '☁️☁️', 'A sky covered by gray clouds', '被灰云盖住的天空'],
      ['树阴', 'shù yīn', '🌳⬛', 'A patch of shade under a tree', '树底下一片凉快的阴影'],
    ], '早上天上有很多云。小猫等了一会儿，看看阳光会不会从云后出来。',
    '阴天过后，风把云吹散了。小猫看见一片晴空，想去草地上跑两圈。晴天跑热了，它就坐到树阴里歇一会儿。'),
    lesson('fog-sunset', '早雾和晚霞', 'Morning Fog and Evening Glow', '薄雾', 'Misty', [
      ['雾', 'wù', 'fog', '🌫️', '雪霞雷', '先找雨字头，再看下面的「务」。'],
      ['霞', 'xiá', 'rosy sky glow', '🌇', '雾雪雨', '上面也有雨字头，下面的形状和「雾」不一样。'],
    ], [
      ['大雾', 'dà wù', '🌫️', 'Thick fog covering a landscape', '盖住远处东西的一大片浓雾'],
      ['雾灯', 'wù dēng', '🚗🌫️💡', 'Car lights shining in fog', '雾里亮着的车灯'],
      ['晚霞', 'wǎn xiá', '🌇', 'A red glow in the evening sky', '傍晚天边的红霞', 'sunset'],
      ['日落', 'rì luò', 'sunset', 'The sun dropping below the horizon', '太阳往山下落', '🌇'],
    ], '早上起了大雾，远处的树只剩一个模糊的影子。小猫站在门里看了一会儿。',
    '有辆车亮着雾灯，慢慢从路上开过去。到了下午，雾散了。小猫和朋友一起看日落，太阳落下后，天边还留着一片红红的晚霞。'),
    lesson('thunder-lightning', '闪一下，响一下', 'Flash and Rumble', '闪闪', 'Flash', [
      ['雷', 'léi', 'thunder', '⛈️', '田雨雪', '上面是雨字头，下面是「田」。'],
      ['闪', 'shǎn', 'flash', '⚡', '门问闭', '学过的「门」里面，站着一个小小的「人」。'],
    ], [
      ['雷雨', 'léi yǔ', '⛈️', 'A thundercloud with rain', '又打雷又下雨的天空'],
      ['雷声', 'léi shēng', '⛈️🔊', 'The rumble of thunder', '雷雨云发出的响声'],
      ['闪电', 'shǎn diàn', '⚡', 'A bright bolt of lightning', '一道亮亮的闪电'],
      ['手电筒', 'shǒu diàn tǒng', '🔦', 'A flashlight', '一个能拿在手上的手电筒'],
    ], '天边闪了一下。小猫和姐姐已经回到屋里，隔着窗户看外面的雷雨。',
    '它们先看见一道闪电，过了一会儿才听见雷声。姐姐把手电筒放在桌边。等雨停下来，小猫打开窗帘，看看天空是不是又亮了。'),
    lesson('winter-spring', '春天来敲门', 'Spring Comes Knocking', '春芽', 'Thaw', [
      ['冬', 'dōng', 'winter', '❄️', '各多条', '找下面一上一下的两点。'],
      ['春', 'chūn', 'spring', '🌱', '日青看', '看看上半部分的几横下面，有没有一个「日」。'],
    ], [
      ['冬天', 'dōng tiān', '🌨️', 'Snow falling in winter', '下雪的冬天'],
      ['冬衣', 'dōng yī', '🧥', 'A thick winter coat', '一件厚厚的冬衣'],
      ['春天', 'chūn tiān', '🌷🌱', 'Flowers and sprouts coming up in spring', '春天刚长出来的花和小芽'],
      ['春雨', 'chūn yǔ', '🌱🌧️', 'Spring rain falling on young plants', '淋在新芽上的春雨'],
    ], '小猫昨天还穿着厚冬衣，今天却发现泥土里钻出了几颗小芽。',
    '冬天时，院子里下过几场雪。现在春天来了，一场春雨落在嫩芽上。小猫把冬衣晾好，想等太阳出来，再去看看那些小芽。'),
    lesson('summer-autumn', '从夏天走到秋天', 'From Summer to Autumn', '秋果', 'Harvest', [
      ['夏', 'xià', 'summer', '🏖️', '复页各', '找最上面的一横和底下向两边分开的两笔。'],
      ['秋', 'qiū', 'autumn', '🍁', '禾火和', '「禾」放在「火」的左边，就是「秋」。'],
    ], [
      ['夏天', 'xià tiān', '☀️🍉', 'Watermelon and bright summer sunshine', '夏天里的大太阳和西瓜'],
      ['夏装', 'xià zhuāng', '👕🩳', 'A summer T-shirt and shorts', '一套短袖和短裤'],
      ['秋天', 'qiū tiān', '🍁🍂', 'Trees shedding leaves in autumn', '秋天落下的枫叶'],
      ['秋收', 'qiū shōu', '🌾🧺', 'A basket of harvested autumn grain', '秋天收进篮子里的粮食'],
    ], '夏天里，小猫穿着短袖吃西瓜。现在风变凉了，树叶也慢慢变了颜色。',
    '小猫把夏装收进柜子，换上长袖。秋天到了，它跟朋友去看秋收。路上掉下来一片像小手掌的枫叶，它把叶子带回去夹进书里。'),
  ]),
  book('town', '庆典篇', 'Celebration', [
    lesson('festival-gift', '送一份小礼物', 'A Little Gift', '丝带', 'Ribbon', [
      ['节', 'jié', 'festival / joint', '🎋', '草花印', '上面是草字头，下面有单耳旁。'],
      ['礼', 'lǐ', 'gift / courtesy', '🎁', '视初社', '找左边的示字旁和右边弯起来的一笔。'],
    ], [
      ['节日', 'jié rì', '🎊📅', 'A calendar marked for a festival', '标着节日的日历'],
      ['竹节', 'zhú jié', '🎍', 'The joint on a bamboo stem', '一段竹子和中间的竹节'],
      ['礼物', 'lǐ wù', '🎁', 'A gift wrapped with a bow', '系着蝴蝶结的礼物'],
      ['礼帽', 'lǐ mào', '🎩', 'A tall formal hat', '一顶高高的礼帽'],
    ], '到了节日，小猫把礼物包好，还在纸上画了一段竹子。',
    '朋友戴着一顶礼帽，来敲小猫的门。小猫把礼物递给朋友。朋友看见包装纸上画着竹节，笑着说，这是我们散步时看到的竹子呀！'),
    lesson('joy-smile', '笑脸迎朋友', 'Welcome, Friends', '乐乐', 'Giggles', [
      ['欢', 'huān', 'glad', '🙌', '又吹次', '左边是「又」，右边是「欠」。'],
      ['笑', 'xiào', 'smile / laugh', '😄', '夭笔竹', '找上面的竹字头，再看下面向两边伸出去的笔画。'],
    ], [
      ['欢迎', 'huān yíng', '🙋🚪', 'Someone waving at the door to welcome a guest', '有人站在门口挥手欢迎客人'],
      ['欢呼', 'huān hū', '🙌🎉', 'People raising their arms to cheer', '大家举起双手欢呼'],
      ['笑脸', 'xiào liǎn', '😄', 'A face with a big smile', '一张笑眯眯的脸'],
      ['微笑', 'wēi xiào', '🙂', 'A small, gentle smile', '嘴角轻轻弯起的微笑'],
    ], '朋友们陆续来了。小猫站在门口挥挥手，一个个欢迎它们进来。',
    '小猫把画好的大笑脸挂起来。大家看见墙上的照片，一起欢呼。有位朋友有点害羞，只是轻轻微笑。小猫也对它笑了笑，给它留了一个座位。'),
    lesson('greetings', '写一张贺卡', 'Writing a Card', '祝祝', 'Well Wishes', [
      ['贺', 'hè', 'congratulate', '💌', '加架贝', '上面是「加」，下面是「贝」。'],
      ['祝', 'zhù', 'wish', '🙏', '礼兄视', '找示字旁和右边的「兄」。'],
    ], [
      ['贺卡', 'hè kǎ', '💌', 'A folded greeting card', '一张可以翻开的贺卡'],
      ['祝贺', 'zhù hè', '👏🏅', 'Clapping to congratulate a medal winner', '为拿到奖牌的人拍手祝贺'],
      ['祝福', 'zhù fú', '🙏💛', 'Hands together beside a golden heart', '合起来的双手和一颗心'],
      ['花束', 'huā shù', '💐', 'A tied bouquet of flowers', '几朵扎在一起的花'],
    ], '小猫为朋友做了一张贺卡。它想把自己最想说的一句祝福写下来。',
    '朋友打开贺卡，看见里面画着一束花。大家拍手祝贺它完成了第一本绘本。小猫把手里的花束送给朋友，也请它讲讲最喜欢的那页故事。'),
    lesson('sing-song', '一起唱首歌', 'Sing Together', '音音', 'Melody', [
      ['唱', 'chàng', 'sing', '🎤', '口晶喝', '左边有个「口」，右边像上下叠着两个「日」。'],
      ['歌', 'gē', 'song', '🎶', '何欢唱', '左边是「哥」，右边是「欠」。'],
    ], [
      ['唱歌', 'chàng gē', '🎤🎵', 'A microphone with a music note', '话筒旁有一个音符'],
      ['合唱', 'hé chàng', '🧑‍🤝‍🧑🎤', 'Two friends singing together', '两位朋友在一起唱歌'],
      ['歌曲', 'gē qǔ', '🎶', 'Music notes for a song', '写着一段旋律的音符'],
      ['歌谱', 'gē pǔ', '📄🎼', 'Sheet music on a page', '纸上印着一行行歌谱'],
    ], '小猫拿来歌谱，找了一首大家都会唱的歌。朋友先轻轻打了两下拍子。',
    '小猫和朋友一起唱歌。它们先合唱了一遍。前两句唱得很轻，后来大家都跟上了。歌曲唱完，有人还记得最后一句，就把它轻轻唱了一遍。'),
    lesson('circle-reunion', '围坐成一个圆', 'A Circle of Friends', '团团', 'Together', [
      ['圆', 'yuán', 'round', '⭕', '囚回团', '外面有个大方框，里面是「员」。'],
      ['团', 'tuán', 'group / ball', '🍙', '才圆困', '外面也有个大方框，里面换成了「才」。'],
    ], [
      ['圆圈', 'yuán quān', '⭕', 'A single round ring', '一个空心的圆圈'],
      ['圆桌', 'yuán zhuō', '⭕🍽️', 'A round table with plates around it', '摆着几套餐具的圆桌'],
      ['饭团', 'fàn tuán', '🍙', 'A rice ball wrapped with seaweed', '包着一点海苔的饭团'],
      ['团圆', 'tuán yuán', '👨‍👩‍👧‍👦💛', 'A family together for a reunion', '一家人聚在一起'],
    ], '朋友们把椅子围成一个圆圈。圆桌上还剩下一盘饭团，小猫把盘子传过去。',
    '大家围着圆桌分饭团。小猫翻开从第一站带来的绘本，看到每一页都留着一段回忆。今天是团圆的日子，它把最后一页留给大家，一起画一个大大的圆。'),
  ]),
];
