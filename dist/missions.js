const trail = (en, zh) => ({ mode: 'trail', prompt: [en, zh] });
const search = (en, zh, extras) => ({ mode: 'search', prompt: [en, zh], extras });
const sort = (en, zh, bins, left) => ({ mode: 'sort', prompt: [en, zh], bins, left });
const order = (en, zh, sequence) => ({ mode: 'order', prompt: [en, zh], sequence });
const memory = (en, zh) => ({ mode: 'memory', prompt: [en, zh] });
const cloze = (en, zh, lines) => ({ mode: 'cloze', prompt: [en, zh], lines });
const paint = (en, zh) => ({ mode: 'paint', prompt: [en, zh] });
const pattern = (en, zh, sequence) => ({ mode: 'pattern', prompt: [en, zh], sequence });

// Each mission belongs to its story's cat. Numbers refer to the four word cards in that stop.
export const missions = {
  // 小镇篇
  tangerine: trail('The kittens are visiting Tangerine. Follow the signposts to find the way to the front door.', '小猫们要去橘子猫家做客。听沿途的路牌，找到进门的路。'),
  mint: search('Mint drew four things at the pond. Find them before the page gets wet.', '薄荷猫在池塘边画了四样东西。赶在画本弄湿前，把它们找出来。', ['🍃', '🪷']),
  butter: sort('Butter is sorting notes about the weather and the time of day.', '奶油猫在整理风车田的观察笔记。把写天气和冷热的卡片跟写天黑的卡片分开。', [['Weather and heat', '天气和冷热'], ['Nightfall', '天黑了']], [0, 1, 2]),
  cocoa: sort('Cocoa is tidying the forest stop. Put the wooden furniture and the things you can open to read or write in separate places.', '可可猫要收拾森林站。把木头做的东西和能翻开读写的东西分开。', [['Made of wood', '木头做的'], ['Read or write', '翻开读写']], [0, 1]),
  berry: trail('Berry needs to move between floors in the Rainbow Shop. Listen at each landing and follow the matching sign.', '莓莓猫要去彩虹店的不同楼层。听每层的指路词，再点相应的路牌。'),
  lilac: order('Put Taro’s sky diary together, from sunrise through moonrise to the last page.', '帮芋圆猫把一天的所见排进日记，从日出排到夜里写日记。', [0, 1, 2, 3]),

  // 郊游篇
  smoky: search('Smoky is drawing a hiking map. Spot the four landmarks on the list.', '灰灰猫在画登山地图。看看清单，找出四个路标。', ['🌾', '🍄']),
  salt: sort('Sea Salt is making two displays at the kiln. Sort the things with water and the words with 火.', '海盐猫要在窑房做两组展品。分出与水有关的东西和带「火」的词。', [['Water', '水'], ['Words with 火', '带「火」的词']], [0, 1]),
  peach: search('Peach has four pictures to collect for the farm scrapbook. Find them around the rice farm.', '桃桃猫想做一页田野剪贴簿。去稻田小屋附近找齐清单上的四幅图。', ['🧺', '🐝']),

  // 花园篇
  cotton: sort('Cotton is making a sky page and a page for things on the ground.', '棉花猫要做一本图册。天上的东西贴一页，地上的东西贴另一页。', [['In the sky', '在天上'], ['On the ground', '在地上']], [0, 3]),
  breeze: sort('The rain is coming. Put on the things that can keep you dry and leave the wind cards for later.', '快下雨了。把能挡雨的东西收进亭子，把跟风有关的卡片留在另一边。', [['Keeps you dry', '能挡雨'], ['Wind', '跟风有关']], [1, 2]),
  blossom: order('Set out the pot, add the flower, then find the grass and the hat for Blossom’s garden photo.', '先摆花盆，再种红花。给朵朵猫拍花园照片，最后找齐小草和草帽。', [2, 0, 1, 3]),

  // 市集篇
  chestnut: trail('Chestnut is directing traffic at the market entrance. Follow the radio calls to the matching signs.', '栗子猫在市集入口指挥交通。听对讲机里说的字词，找到该去的路牌。'),
  millet: sort('Millet needs one crate for grains and one for melons and cucumbers.', '小米猫要收摊了。谷物放一筐，瓜类放另一筐。', [['Grains', '谷物'], ['Melons and cucumbers', '瓜类']], [0, 1]),
  ink: order('Help Inky set up the book nook. Start at the bookshelf, set out both writing tools, then pack the schoolbag.', '帮墨墨猫布置绘本屋。先整理书架，再摆出两种笔，最后收好书包。', [1, 2, 3, 0]),
  pomelo: sort('Pomelo needs to sort the counter. Put the mail in one tray and the stamps used to send it in the other.', '柚子猫要整理邮局柜台。要寄的东西放一格，贴在邮件上的邮票放另一格。', [['Outgoing mail', '要寄出去的'], ['Postage', '贴在邮件上的']], [0, 2, 3]),

  // 居家篇
  'hands-feet': sort('Get the kittens ready to go out. Sort what goes with hands and what goes with feet.', '小猫们要出门了。把和手有关的卡片放一边，和脚有关的放另一边。', [['Hands', '手'], ['Feet', '脚']], [0, 1]),
  'eye-tooth': sort('Organize the washstand pictures into an eye tray and a tooth tray.', '洗漱台上摆着四张图。把跟眼睛有关的和跟牙齿有关的分开。', [['Eyes', '眼睛'], ['Teeth', '牙齿']], [0, 1]),
  'door-window': sort('The kitten is making a little house plan. Group the pictures by the window and the door.', '小猫在画小屋平面图。把窗边的东西和门边的东西分开。', [['Window', '窗边'], ['Door', '门边']], [0, 1, 3]),
  'bed-light': sort('Get the bedroom ready for the night. Sort the bedding and the lights.', '睡前帮小猫整理房间。床上的东西放一边，会发亮的东西放另一边。', [['Bedding', '床上用的'], ['Lights', '会发亮的']], [0, 1]),
  'shoes-cloth': sort('Sort what the kitten wears and the things it carries or uses around the house.', '把可以穿在身上的和用来装东西、擦手的物品分开放。', [['Wear it', '穿身上'], ['Carry or wipe', '装东西或擦手']], [0, 3]),
  'face-hair': order('Follow the mirror routine. Set out the basin, get the mirror and comb ready, then check the hair.', '跟着清单收拾镜子前的小桌。先放脸盆，再摆镜子和梳子，最后看看头发。', [1, 2, 3, 0]),

  // 餐桌篇
  'greens-onion': order('Fill the kitchen basket in the order written on the shopping list.', '照购物单的顺序，把四种蔬菜放进猫猫的菜篮子。', [0, 2, 1, 3]),
  'noodles-meat': order('The first customer ordered a bowl of noodles with beef. Then pack the bread and sausage to take away.', '第一位客人要牛肉面。先备面和牛肉，再按单子打包面包和香肠。', [0, 3, 1, 2]),
  'soup-bowl': order('Set out the bowl and spoon before bringing the rice and fish soup to the table.', '给猫猫开饭。先摆饭碗和汤匙，再端来米饭和鱼汤。', [1, 3, 0, 2]),
  sweets: order('Fill four spaces on the snack tray, following the order slip from left to right.', '照点心单从左到右摆盘，给四样点心各留一个位置。', [2, 1, 0, 3]),
  'tea-cup': cloze('Help write the tea stall’s instructions for the next visitor.', '给茶摊的下一位客人留几条提示。读一读，把词填进去。', ['倒一点茶到这个小＿里。', '把干干的＿放进壶里，加热水泡开。', '今天泡的不是绿茶，是＿。', '这个装茶、有壶嘴的器具叫＿。']),
  'peach-pear': search('The guests asked for four fruits. Find them at the fruit stall and leave the extras for another plate.', '客人点了四样水果。到果摊找齐清单上的，其他的留给下一盘。', ['🍒', '🍓']),

  // 动物篇
  'cat-dog': memory('The yard photo album has lost its captions. Find the matching name for every animal picture.', '院子相册的照片和名字弄乱了。帮小猫把每张照片和对应的名字配成对。'),
  'cow-sheep': sort('Make two farm displays. Put the animals in one and the things they give us in the other.', '牧场要做两块展板。两种动物贴一边，它们带来的东西贴另一边。', [['Farm animals', '牧场动物'], ['From the animals', '动物带来的东西']], [0, 2]),
  'hens-eggs': memory('Match captions to the coop photos and the pictures of things made with eggs.', '鸡窝相册里有鸡，也有和鸡蛋有关的东西。翻牌给照片配上名字。'),
  'birds-flight': memory('Pair the captions in the sky-watching notebook with the pictures.', '小猫抬头看到了好多东西。翻牌补上天空观察本里的图签。'),
  'pig-deer': search('Find four pictures for the ranger’s trail guide.', '林边巡护员在做小路指南。沿途找齐清单上的四张图。', ['🍄', '🍃']),
  'bear-elephant': memory('Get the animal exhibition ready by pairing the pictures and their signs.', '动物画展要开门了。把每幅画和它的展签配成对。'),

  // 学校篇
  'picture-paper': order('Set up the art table. Cover it with newspaper, set out the paper and pencil, then hang up the finished picture.', '布置美术桌。先铺报纸，再摆白纸和铅笔，最后挂上画好的图画。', [3, 1, 2, 0]),
  'text-lesson': cloze('Help the kittens finish the instructions at the start of class.', '上课啦。帮小猫补全老师留下的提示。', ['请把语文＿翻到第十页。', '这篇＿讲的是小猫去上学。', '碰到不认识的字，可以查＿。', '老师用粉笔在＿上写字。']),
  'read-teach': cloze('Finish the labels for story time and the reading corner.', '故事时间快到了。帮小猫补好阅读角的便签。', ['小猫坐下来打开书，开始＿。', '上课时，老师站在讲台前＿。', '每天睡前，我把当天的事情写进＿。', '读完以后，把书放回＿上。']),
  'pat-ball': pattern('Remember the captain’s order for warming up and bringing out the three kinds of balls.', '队长要先带大家拍手热身，再拿三种球。记住图卡上给出的顺序。', [0, 1, 3, 2]),
  'run-jump': cloze('Add the missing activity names to the playground signs.', '运动角的牌子没写完。给每块牌子补上活动名字。', ['沿着跑道＿，一圈又一圈。', '从起跳线起跳，比谁跳得远，这是＿。', '把绳子甩过头顶，再跳过去，这叫＿。', '用球拍把小白球打过桌上的网，那是＿。']),
  'stage-dance': cloze('Complete the program before the school show begins.', '学校演出快开始了。帮猫猫补齐节目单。', ['幕布拉开，演员走上了＿。', '音乐响起来，猫猫开始＿。', '请大家跟着歌单唱这首＿。', '把嘴靠近吹口，吹响手里的＿。']),

  // 山海篇
  'river-sea': search('Find four things to mark on the map where the river meets the sea.', '河流在这里汇入大海。帮小猫找齐地图上要标的四样景物。', ['🪵', '⛵']),
  'boat-bridge': trail('Help the kittens cross the water. Listen for the next sign at every crossing.', '帮猫猫走过水边的渡口和桥。每到一处，先听清要找哪块牌子。'),
  'tree-pine': search('The woodland guide needs four pictures from under the trees.', '林间指南缺了四幅图。去树下找齐它们。', ['🍄', '🪨']),
  'snow-ice': sort('Make a winter display. Sort the snowy pictures and the icy things.', '做一页冬日展板。用雪和冰把四张图分成两组。', [['Snow', '雪'], ['Ice', '冰']], [0, 1]),
  'star-night': sort('Create a sky journal. Put what belongs to the night on one page and the start of the day on the other.', '在天空日记里分一分：哪些放在夜晚那页，哪一个放在新的一天那页？', [['Night', '夜里'], ['Start of the day', '新的一天']], [0, 1, 2]),

  // 街道篇
  'work-shop': trail('Follow the delivery calls past the factory, shops and bookshop.', '帮送货猫认沿途路牌，找到工厂、商店和书店附近的目的地。'),
  'rail-station': trail('Listen to the station announcements and guide the kitten through the railway signs.', '带猫猫进站。听广播里说了什么，再沿着正确的牌子走。'),
  'doctor-medicine': cloze('Help write signs so the kitten knows where to go for care.', '小猫不舒服。帮它填好路上的提示牌，看看该找谁、去哪儿。', ['给小猫看病的人是＿。', '要看病，可以去＿。', '这种小小的、压成片的药叫＿。', '车顶有警灯、能送急病病人去医院的车是＿。']),
  'electric-clock': sort('Put the clock on the repair bench. Sort the other objects onto the shelf for things with 电 in their names.', '钟表铺要分架摆放。钟表放维修台，名字里带「电」的物品放到另一个架子。', [['Clock repair', '修钟表'], ['Words with 电', '名字里有「电」']], [0]),
  'piano-drum': memory('The concert hall needs its instrument cards paired before the musicians arrive.', '音乐会开始前，给每件乐器配上正确的名字。'),

  // 调色篇
  'red-yellow': paint('Paint the two panels for the flower and the leaf. Read each color request before dipping the brush.', '给花和叶子的画框上色。先读调色单，再把画笔蘸进对应的颜色。'),
  'blue-green': paint('Choose the paints for the sky and the grass.', '给天空和草地选颜料。照着调色单给两块画面上色。'),
  'black-purple': paint('Paint one swatch for the blackboard and one for the purple flowers.', '给黑板和紫花各留一块色样，按调色单涂色。'),
  'orange-pink': paint('Make the sign for the juice stall with an orange panel and a pink panel.', '给果汁摊做招牌，照调色单涂出橙色和粉色。'),
  'gray-ink': paint('Paint a gray swatch for the rabbit and an ink swatch for the fish picture.', '给灰兔留一块灰色色样，再用墨水给小鱼画留一块墨色色样。'),

  // 果园篇
  'fruit-apple': sort('At the orchard, separate fresh fruit from the tree and the pressed juice.', '果园要整理两张展台。一张放鲜果，另一张放果树和榨好的果汁。', [['Fresh fruit', '鲜果'], ['Tree and juice', '果树和果汁']], [0, 1]),
  'scent-banana': cloze('Complete the notes from the banana grove and the picnic.', '香蕉林的观察本少了几个词。看看小猫闻到了什么、找到了什么。', ['剥开皮，露出弯弯的＿。', '刚剥开水果，就闻到一股＿。', '野餐篮里有一根切成片的＿。', '香蕉树上又宽又长的是＿。']),
  grapes: sort('Keep the fresh grapes and the vine display separate from the foods made from grapes.', '把新鲜葡萄和葡萄架摆在一边，把用葡萄做出来的食品摆在另一边。', [['Fruit and vine', '果实和葡萄架'], ['Made from grapes', '用葡萄做的']], [0, 2]),
  'pomelo-mandarin': sort('The fruit seller is labeling two displays. Send the fruit, peel and juice to the right side.', '果摊要分成柚子台和橘子台。把果实、果皮和果汁放到对应的摊位。', [['Pomelo', '柚子'], ['Mandarin', '橘子']], [0, 2]),
  lemon: sort('Put the lemon and the things made from it in the tasting basket. Leave what grows on the ground outside.', '把柠檬和柠檬带来的东西收进试吃篮，长在地上的小草留在外面。', [['Lemon tasting', '柠檬试吃篮'], ['Grows on the ground', '长在地上']], [0, 1, 2]),

  // 海岸篇
  'sand-shellfish': search('The tide is out. Find the four pictures on the beach explorer’s list.', '退潮了。沿沙滩走一走，找齐寻宝名单上的四幅图。', ['🪸', '🪁']),
  'shell-crab': sort('Sort the beach museum cards into shells and things that belong to crabs.', '给海岸博物馆布置展柜。把两种壳和两张螃蟹图分开。', [['Other shells', '其他动物的壳'], ['Crab', '螃蟹和它的蟹钳']], [0, 1]),
  'shrimp-waves': search('Find the shrimp and waves listed in the tidepool notebook.', '海水刚退下去。照着观察本，找齐水里的虾和海面的浪。', ['🐙', '⚓']),
  'coast-island': trail('You can see a lighthouse across the water. Follow the spoken landmarks along the coast.', '对岸亮着灯。听船长念沿途路标，带猫猫认清海岸和小岛。'),
  'sail-reef': trail('The wind is strong near the reef. Listen to the lookout and steer by the name on each marker.', '礁石附近风大。听瞭望猫报地标，带帆船沿着正确的牌子走。'),

  // 林间篇
  'bamboo-leaf': memory('Pair the pictures and labels for a bamboo scrapbook.', '小猫做了一本竹林剪贴簿。翻牌给每张图配上名字。'),
  'branch-root': sort('Sort what you see above ground and what grows below the soil.', '看看树上下。把地面上看到的和泥土下面长的分开。', [['Above ground', '地面上'], ['Below ground', '泥土下']], [0, 1]),
  'grove-woods': memory('Three woodland pictures and a treehouse picture need labels before the map goes up.', '林中地图缺了图签。帮小猫给三种林子和树屋找回名字。'),
  'rabbit-butterfly': memory('Finish the woodland trail notebook by finding its picture-and-word pairs.', '白兔追着蝴蝶跑进了草地。给这页林间观察本配好图和词。'),
  fox: memory('Pair the track photos and their labels to see who passed the den.', '狐狸洞口有一串脚印。把观察照片和词语配成对。'),

  // 早餐篇
  'milk-wheat': sort('Separate the milk and cheese from the two grain pictures.', '备早餐时，把奶和奶酪放一边，小麦和麦片放另一边。', [['Milk and cheese', '奶和奶酪'], ['Grains', '谷物']], [0, 1]),
  'oil-salt': order('Follow the cook’s prep list. Set out the greens, oil and salt, then finish with a drop of oil.', '照猫厨师的清单备菜。先摆青菜，再备香油和盐罐，最后取一滴油。', [3, 0, 2, 1]),
  'date-honey': sort('The breakfast shop is making two displays. Show where the dates and the honey each come from.', '早餐铺要摆两组展品。一组讲红枣从哪儿来，另一组讲蜂蜜从哪儿来。', [['Dates', '红枣'], ['Honey', '蜂蜜']], [0, 1]),
  'bee-porridge': search('The porridge shop needs four pictures for its booklet. Find the bee pictures and the two bowls on the list.', '粥铺的小册子缺四幅图。找齐清单上的蜜蜂、蜂巢和两碗粥。', ['🫖', '🍎']),
  'morning-meal': order('Get ready for breakfast. Find the morning scene, set the table and napkin, then serve the meal.', '天亮了。先找出早晨那张图，再摆餐桌和餐巾，最后端上早餐。', [0, 2, 3, 1]),

  // 整理篇
  'wash-brush': sort('Put pictures of washing on the sink mat and pictures of tools on the rack.', '水池旁要分两格。洗的动作归水池，能拿起来的刷洗工具归架子。', [['Washing', '洗的动作'], ['Tools', '工具']], [0, 1]),
  'sweep-wipe': sort('Sort the cleaning actions and the tools you can hold in your hand.', '收拾清洁角。把正在做的动作和拿在手里的工具分开放。', [['Cleaning actions', '清洁的动作'], ['Tools', '用的工具']], [0, 2]),
  'table-chair': search('The kittens are arranging furniture. Find the four pieces on the floor plan.', '小猫在布置房间。按房间布置单，找齐四样家具和用品。', ['🧺', '🪴']),
  'cabinet-basin': sort('Make two labels for the storage corner. Group the cabinets and the basin-shaped objects.', '给收纳角贴标签。柜子放在一边，花盆和脸盆放在另一边。', [['Cabinets', '柜子'], ['Pots and basins', '盆']], [0, 1]),
  'umbrella-box': order('Follow the putting-away list. Store the umbrellas first, then the boxes.', '雨停了。照收纳清单，先放好两种伞，再收好两种盒子。', [0, 1, 3, 2]),

  // 运动篇
  'basketball-football': pattern('Remember the coach’s pictures for a drill with the two balls.', '教练亮出两种球的训练图。先记住顺序，再按顺序点出图上的词。', [2, 0, 1, 3]),
  'volleyball-badminton': pattern('The coach shows what comes next at the net. Remember the order, then call it back.', '球网旁的教练给大家看了四张图。记住顺序，再把图上的词按原顺序点出来。', [0, 3, 2, 1]),
  swim: order('Follow the pool checklist. Get the swim cap and swim ring ready, then swim and dry off.', '照泳池清单。先准备泳帽和泳圈，再下水游泳，最后擦干。', [1, 2, 0, 3]),
  'slide-wheel': pattern('Remember the pictures from the playground relay before your turn.', '接力快轮到你了。先看滑梯和轮子这一组图，记住教练给你的顺序。', [0, 2, 1, 3]),
  'race-win': cloze('Write the race-day report, from the start to the medal.', '写一篇运动会小报道，从跑上赛道一直写到领奖。', ['今天的比赛项目是＿，看谁跑得快。', '唱歌、踢球和跑步都能办成＿，让大家争第一。', '最先冲过终点线的队伍＿了。', '裁判把金色的＿挂到小猫脖子上。']),

  // 同学篇
  school: trail('Listen to the buddy cat’s clues as you guide a new pupil into school.', '带刚来的新同学进学校。听值日猫给的线索，一步步认路。'),
  teacher: memory('The reading corner needs captions for the people and books in its pictures.', '阅读角的图画少了图签。翻牌给图上的人和书找回名字。'),
  classmates: cloze('Finish the classroom signs and help the kittens find their class.', '教室的标签还缺了几个词。帮小猫找到自己的班。', ['和我一起上课的小朋友是我的＿。', '这两张卡片的图案完全＿。', '我们在同一个＿里上课。', '看看教室门上写着「一班」的＿。']),
  'write-character': cloze('Add the missing words to the writing-desk instructions.', '写字桌上有几条小提示还没写完。读一读，把词补进去。', ['握好笔，我们开始＿。', '我想告诉远方的朋友一件事，就给他＿。', '「猫」和「山」都是＿。', '不知道这个字的意思，可以翻开＿查一查。']),
  'count-calculate': cloze('Help the class finish its counting worksheet.', '班里在做数果子的活动。帮小猫补完练习单。', ['加法和减法是＿练习。', '老师拨动＿上的小珠子。', '我们来＿桌上一共有几个苹果。', '写在纸上的 1、2、3 都是＿。']),

  // 四季篇
  'sun-cloud': sort('Prepare the weather board. Separate the bright-sky pictures from the overcast and shady ones.', '给天气板分两栏。一边是晴朗的天，另一边是阴天和树下的阴凉。', [['Bright sky', '晴朗'], ['Overcast or shade', '阴天或阴凉']], [0, 1]),
  'fog-sunset': sort('The kitten took pictures in the morning fog and at sunset. Put each picture in its time slot.', '小猫拍了清早和傍晚两组照片。把雾里拍的和太阳快落山时拍的分开。', [['Foggy morning', '清早有雾'], ['Sunset', '傍晚日落']], [0, 1]),
  'thunder-lightning': cloze('Write the storm report, including the light the kitten uses indoors.', '打雷了。帮小猫写完天气记录，也记下它在屋里用的灯。', ['外面又打雷又下雨，这场雨叫＿。', '轰隆隆响起来的是＿。', '天空突然亮起一道弯弯的＿。', '屋里太暗，就打开手里的＿。']),
  'winter-spring': sort('Hang each picture on its season’s page, winter or spring.', '四季挂历翻到了冬天和春天。把每幅图放到它那一页。', [['Winter', '冬天'], ['Spring', '春天']], [0, 1]),
  'summer-autumn': sort('Make a two-page journal for summer clothes and the autumn harvest.', '四季日记还有两页。把夏日的图和秋收的图分开贴。', [['Summer', '夏天'], ['Autumn', '秋天']], [0, 1]),

  // 庆典篇
  'festival-gift': sort('Set up the celebration table. Keep the gifts and party hats together and display the festival and bamboo pictures separately.', '布置庆典桌。礼物和礼帽摆在桌上，节日和竹节的图贴在展板上。', [['On the party table', '庆典桌上的东西'], ['On the display board', '展板上的图画']], [2, 3]),
  'joy-smile': memory('Restore the captions on the welcome party photos.', '迎新会拍了四张照片。给每张照片找回它的图签。'),
  greetings: cloze('Help the kitten finish what to write and say when delivering a card and flowers.', '小猫要送卡片和鲜花。帮它把庆典上的话补完整。', ['把想说的话写在＿里，再送给朋友。', '你赢了比赛，大家都来＿你。', '这句话是我送给你的新年＿。', '几枝花扎在一起送人，这叫＿。']),
  'sing-song': order('Get the group performance ready. Find the sheet music, pick the song, then sing alone and join the chorus.', '一起准备节目。先找歌谱、选歌曲，再轮流唱，最后合唱。', [3, 2, 0, 1]),
  'circle-reunion': cloze('Fill in the last page of the reunion scrapbook.', '最后一页是团圆剪贴簿。读完句子，贴上剩下的四个词。', ['猫猫手拉手，围成了一个＿。', '饭菜摆在没有桌角的＿上。', '把米饭捏成一个小球，就是＿。', '一家人从各地回来相聚，这就叫＿。']),
};
