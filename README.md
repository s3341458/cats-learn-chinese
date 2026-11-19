# 猫猫学中文 · Cats Learn Chinese

和猫猫逛十册绘本的五十个站点，学一百个汉字。每站从猫猫的小故事开始，依次点图认字、按笔顺描红、听音选字、拼词跟读、看字选图和亲子共读。完成后，贴上猫猫和小车，开车选路牌，抵达终点盖章。

小镇篇之后接郊游篇，经过石头山、溪边窑房和稻田小屋，认识「山石、水火、田土」。原有站点的编号和本地进度继续有效。

第三册花园篇有白云坡、风雨亭、花草园三个站点，认识「白云、风雨、花草」，练习十二个新词语。每站包含两字描红、四道选图题、六块路牌和一页故事。白云与乌云、雨伞与雨衣、红花与空花盆使用区别清楚的独立矢量图卡。

第四册市集篇从马车站到市集菜摊、绘本屋和市集邮局，认识「车、马、米、瓜、书、笔、信、包」。猫猫们坐马车去买野餐食材，把见到的东西画进绘本，再把绘本寄给朋友。读完花园篇即可开始市集篇。

市集篇后接居家、餐桌、动物、学校、山海和街道六册，共三十四站。从「手、脚」学到「琴、鼓」，每站再用词语和故事带回前几册的字，例如「石桥」「月亮」「课本」。

非教学界面默认显示英文。绘本封面和地图都可以切换简体中文，课程内容和发音使用普通话。游戏不限时，完成一站就会开放下一站。家长角可查看认读记录和复习日期。贴纸、进度及界面语言保存在当前浏览器。

从第二站开始，听音题会复习上一站的一个字，再从学过的字中挑一个，优先选到期或久未复习的字。同一天连续玩也会穿插复习。退出再回来时会接着做同一组题。

## 本地运行

需要 Node.js 18 或更新版本，无须安装依赖。

```sh
npm run dev
```

打开 <http://localhost:9018>。如需改用别的端口，可设置 `PORT`。修改页面后刷新浏览器。

`npm run check` 检查 JavaScript 语法、课程完整性和复习进度。前十六站在 `dist/lessons.js`，后续关卡在 `dist/expanded-lessons.js`，它们的描红路径在 `dist/stroke-paths.js`。听音题也可打开拼音提示。

全部 100 个单字和 119 个词语采用 Yue Tan 的普通话真人录音。其余练习词使用完整合成的普通话录音，根据转写和发音复核选用 Zhiyu 或 Tingting。开场、整页故事和题目说明用 Zhiyu 按整段合成，保留标点停顿。学习单字或词语时以课程自带的录音为准，加载失败会显示带声调的拼音。快速连点同一段录音时，当前一遍会继续播完。可在家长角查看[录音署名与许可](dist/audio/credits.txt)。

修改故事或题目说明后，使用已有 Polly 权限的 AWS CLI 重新生成下面的录音。生成器会跳过已有真人示范。

```sh
python -m pip install numpy "soundfile>=0.13,<1"
python scripts/generate-intros.py --engine polly --narration-only
python scripts/generate-intros.py --engine polly --instructions-only
```

生成器默认使用 macOS 的 Tingting 语音。只改了写字提示时，使用 `--trace-only`。只更新需要合成的单字时，使用 `--characters-only`。只更新合成词语和题目说明时，使用 `--practice-only`。

`scripts/native-recordings.json` 记录真人示范的原始文件名与拼音。从[卡昂大学录音合集镜像](https://www.yojik.eu/audiocollections/detailled/cmn-caen-tan/flac/)取得对应 FLAC 后，用 `python scripts/generate-intros.py --import-native <FLAC目录>` 可重新导入，也可用 `--lesson` 限定关卡。

新增章节可以只生成和检查对应关卡，避免重做已有录音。`--lesson` 使用从 1 开始的站点编号，可以重复：

```sh
python scripts/generate-intros.py --engine polly --narration-only --lesson 17
python scripts/check-audio.py --lesson 17 --transcribe
```

其他系统可安装 `kokoro==0.9.4` 和 `misaki[zh]==0.9.4`，使用 `--engine kokoro` 生成录音。

`python scripts/check-audio.py` 会根据课程内容检查全部录音能否解码、有无静音和削波。安装 `faster-whisper`、`praat-parselmouth` 和 `opencc-python-reimplemented` 后，可加 `--transcribe` 独立转写，并把 JSON 输出保存到临时文件。识别器不接收课程原文作为提示。转写差异须逐项复核，同音字、短词及专有名字可能被误识别；声调与主观自然度还需要进一步试听判断。

猫咪和小车插画由内置 ImageGen 生成，保存在 `dist/assets/kitten-stickers.png`。提示词为绘本水粉与彩铅风格、两张分离的透明贴纸，内容是戴薄荷绿领巾的橘猫和它开的薄荷绿玩具车，只画猫，不加文字或品牌。

郊游地图由内置 ImageGen 生成，保存在 `dist/assets/countryside.jpg`。提示词为横向水粉和彩铅绘本地图，三处停留点分别留给山石、溪水石桥与砖窑、金色稻田和农舍，路边有一只小猫，画面不含文字和编号。

选图题的插画用内置 ImageGen 制作，放在 `dist/assets/cards-town.jpg` 和 `dist/assets/cards-outdoors.jpg`。提示词要求同尺寸的水粉和彩铅绘本图、每格只画题目需要的一个对象或场景、不加文字。每道题的两个干扰选项在 `dist/lessons.js` 中单独列出，避免一张图也能解释成另一个答案。

市集篇的地图 `dist/assets/market.jpg` 和图卡 `dist/assets/cards-market.jpg` 也由内置 ImageGen 制作。地图提示词为水粉和彩铅风格的横向绘本地图，让蜿蜒的小路依次连接马车站、菜摊和绘本屋。图卡提示词为四列三行、每格只画一道题对应的物品或场景。两张图均不含文字。

内置 ImageGen 沿用原市集地图的绘本画风，加入有红色邮筒的邮局，保存在 `dist/assets/market-post.jpg`。邮局的图卡 `dist/assets/cards-post.jpg` 按两列两行排列信封、邮票、明信片和邮包。

后六册的地图由内置 ImageGen 制作，存放在 `dist/assets/reading-*.jpg`。画面以水彩和彩铅描绘房屋、餐食摊位、牧场、学校、河口和街道，保留连续的小路供站点按钮使用。两套补充图卡 `dist/assets/home-detail.jpg` 和 `dist/assets/story-detail.jpg` 采用四列三行，每格画一个物件或动作。

## 部署与许可证

AWS 部署使用 `infra/cloudfront.yml`，由 CloudFront 经 HTTPS 提供私有 S3 中的 `dist/` 静态文件。用管理目标域名公开 Route 53 托管区的 AWS 身份运行：

```sh
bash scripts/deploy-cloudfront.sh cats-learn-chinese.theyucheng.com <hosted-zone-id>
```

脚本会在 `us-east-1` 创建或更新站点，上传静态文件，并刷新 CloudFront 缓存。首次部署需要等待 ACM 验证域名和 CloudFront 生效。学习进度和贴纸保存在使用者的浏览器里，每个网址各自保存。

项目代码采用 [MIT 许可证](LICENSE)。真人录音采用 [CC BY-SA 3.0 US](https://creativecommons.org/licenses/by-sa/3.0/us/)。后六册的描红路径取自 Hanzi Writer Data 2.0.1 所分发的 Make Me a Hanzi 笔顺数据，已对中线坐标缩放，按 [Arphic Public License](dist/assets/ARPHICPL.TXT) 分发。
