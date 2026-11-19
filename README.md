# 猫猫学中文 · Cats Learn Chinese

和猫猫逛四册绘本的十五个站点，学三十个汉字。每站从猫猫的小故事开始，依次点图认字、按笔顺描红、听音选字、拼词跟读、看字选图和亲子共读。完成后，贴上猫猫和小车，开车选路牌，抵达终点盖章。

小镇篇之后接郊游篇，经过石头山、溪边窑房和稻田小屋，认识「山石、水火、田土」。原有站点的编号和本地进度继续有效。

第三册花园篇有白云坡、风雨亭、花草园三个站点，认识「白云、风雨、花草」，练习十二个新词语。每站包含两字描红、四道选图题、六块路牌和一页故事。白云与乌云、雨伞与雨衣、红花与空花盆使用区别清楚的独立矢量图卡。

第四册市集篇从马车站到市集菜摊，再到绘本屋，认识「车、马、米、瓜、书、笔」。三站用坐马车、买野餐食材和制作绘本的故事串起来。读完花园篇即可开始市集篇。

非教学界面默认显示英文。绘本封面和地图都可以切换简体中文，课程内容和发音使用普通话。游戏不限时，完成一站就会开放下一站。家长角可查看认读记录和复习日期。贴纸、进度及界面语言保存在当前浏览器。

## 本地运行

需要 Node.js 18 或更新版本，无须安装依赖。

```sh
npm run dev
```

打开 <http://localhost:9018>。如需改用别的端口，可设置 `PORT`。修改页面后刷新浏览器。

`npm run check` 检查 JavaScript 语法及课程完整性，包括拼音、选项、猫咪插画、笔画路径和全部录音文件。关卡文字、词语拼音和笔顺在 `dist/lessons.js`。听音题也可打开拼音提示。

全部 30 个单字和 28 个词语采用 Yue Tan 的普通话真人录音，包括市集篇的全部 12 个词语。点字、听音选字、拼词和路牌练习都优先播放课程自带的录音。其余词语、开场、题目说明和绘本旁白使用预先合成的 Tingting 普通话录音。播放出错时会尝试设备上的普通话语音。拼词和选图题在语音无法播放时会显示拼音。可在家长角查看[录音署名与许可](dist/audio/credits.txt)。

修改课程文字后，可在安装了 Tingting 语音的 macOS 上重新生成合成录音。生成器会跳过已有真人示范。

```sh
python -m pip install numpy "soundfile>=0.13,<1"
python scripts/generate-intros.py
```

只改了写字提示时，使用 `--trace-only`。只更新需要合成的单字时，使用 `--characters-only`。只更新合成词语和题目说明时，使用 `--practice-only`。只更新开场和绘本故事时，使用 `--narration-only`。

`scripts/native-recordings.json` 记录真人示范的原始文件名与拼音。从[卡昂大学录音合集镜像](https://www.yojik.eu/audiocollections/detailled/cmn-caen-tan/flac/)取得对应 FLAC 后，用 `python scripts/generate-intros.py --import-native <FLAC目录>` 可重新导入，也可用 `--lesson` 限定关卡。

新增章节可以只生成和检查对应关卡，避免重做已有录音。`--lesson` 使用从 1 开始的站点编号，可以重复：

```sh
python scripts/generate-intros.py --lesson 13 --lesson 14 --lesson 15
python scripts/check-audio.py --lesson 13 --lesson 14 --lesson 15 --transcribe
```

其他系统可安装 `kokoro==0.9.4` 和 `misaki[zh]==0.9.4`，使用 `--engine kokoro` 生成录音。

`python scripts/check-audio.py` 会根据课程内容检查全部录音能否解码、有无静音和削波。安装 `faster-whisper`、`praat-parselmouth` 和 `opencc-python-reimplemented` 后，可加 `--transcribe` 独立转写，并把 JSON 输出保存到临时文件。识别器不接收课程原文作为提示。转写差异须逐项复核，同音字、短词及专有名字可能被误识别；声调与主观自然度还需要进一步试听判断。

猫咪和小车插画由内置 ImageGen 生成，保存在 `dist/assets/kitten-stickers.png`。提示词为绘本水粉与彩铅风格、两张分离的透明贴纸，内容是戴薄荷绿领巾的橘猫和它开的薄荷绿玩具车，只画猫，不加文字或品牌。

郊游地图由内置 ImageGen 生成，保存在 `dist/assets/countryside.jpg`。提示词为横向水粉和彩铅绘本地图，三处停留点分别留给山石、溪水石桥与砖窑、金色稻田和农舍，路边有一只小猫，画面不含文字和编号。

选图题的插画用内置 ImageGen 制作，放在 `dist/assets/cards-town.jpg` 和 `dist/assets/cards-outdoors.jpg`。提示词要求同尺寸的水粉和彩铅绘本图、每格只画题目需要的一个对象或场景、不加文字。每道题的两个干扰选项在 `dist/lessons.js` 中单独列出，避免一张图也能解释成另一个答案。

市集篇的地图 `dist/assets/market.jpg` 和图卡 `dist/assets/cards-market.jpg` 也由内置 ImageGen 制作。地图提示词为水粉和彩铅风格的横向绘本地图，让蜿蜒的小路依次连接马车站、菜摊和绘本屋。图卡提示词为四列三行、每格只画一道题对应的物品或场景。两张图均不含文字。

## 部署与许可证

AWS 部署使用 `infra/cloudfront.yml`，由 CloudFront 经 HTTPS 提供私有 S3 中的 `dist/` 静态文件。用管理目标域名公开 Route 53 托管区的 AWS 身份运行：

```sh
bash scripts/deploy-cloudfront.sh cats-learn-chinese.theyucheng.com <hosted-zone-id>
```

脚本会在 `us-east-1` 创建或更新站点，上传静态文件，并刷新 CloudFront 缓存。首次部署需要等待 ACM 验证域名和 CloudFront 生效。学习进度和贴纸保存在使用者的浏览器里，每个网址各自保存。

项目代码采用 [MIT 许可证](LICENSE)。真人录音采用 [CC BY-SA 3.0 US](https://creativecommons.org/licenses/by-sa/3.0/us/)。
