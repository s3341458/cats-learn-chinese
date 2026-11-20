# 猫猫学中文 · Cats Learn Chinese

和猫猫逛二十册绘本的一百个站点，学二百个汉字。每站从猫猫的小故事开始，依次点图认字、按笔顺描红、听音选字、拼词跟读、看字选图和亲子共读。首次贴好猫猫和小车时，猫咪贴纸会立即收进贴纸册，并出现奖励动画，开启声音时还会播放一小段音乐。接着开车选路牌，抵达终点盖章。

小镇篇之后接郊游篇，经过石头山、溪边窑房和稻田小屋，认识「山石、水火、田土」。原有站点的编号和本地进度继续有效。

第三册花园篇有白云坡、风雨亭、花草园三个站点，认识「白云、风雨、花草」，练习十二个新词语。每站包含两字描红、四道选图题、六块路牌和一页故事。白云与乌云、雨伞与雨衣、红花与空花盆使用区别清楚的独立矢量图卡。

第四册市集篇从马车站到市集菜摊、绘本屋和市集邮局，认识「车、马、米、瓜、书、笔、信、包」。猫猫们坐马车去买野餐食材，把见到的东西画进绘本，再把绘本寄给朋友。读完花园篇即可开始市集篇。

市集篇后接居家、餐桌、动物、学校、山海和街道六册，共三十四站。从「手、脚」学到「琴、鼓」，每站再用词语和故事带回前几册的字，例如「石桥」「月亮」「课本」。

后 100 字接在街道篇之后，从调色、果园、海岸和林间，一路学到早餐、整理、运动、同学、四季和庆典。原有 50 站沿用原编号，读完街道篇就能从第 51 站「红黄调色盘」开始。

非教学界面默认显示英文。绘本封面和地图都可以切换简体中文，课程内容和发音使用普通话。游戏不限时，完成一站就会开放下一站。家长角可查看认读记录和复习日期。贴纸、进度及界面语言保存在当前浏览器。

每站两个新字各听认四次，四个词都拼一遍、看字选图两遍。第二轮选图默认收起拼音和读音，需要时可以点开。第二站起，听音题还会穿插上一站的一个字和另一个已学字，优先选到期或久未复习的字。退出再回来时会接着做同一组题。

## 本地运行

需要 Node.js 18 或更新版本，无须安装依赖。

```sh
npm run dev
```

打开 <http://localhost:9018>。如需改用别的端口，可设置 `PORT`。修改页面后刷新浏览器。

`npm run check` 检查 JavaScript 语法、课程完整性和复习进度。前十六站在 `dist/lessons.js`，后续关卡在 `dist/expanded-lessons.js`，它们的描红路径在 `dist/stroke-paths.js`。听音题也可打开拼音提示。

单字和练习词优先采用 Yue Tan 的普通话真人录音，保留原语速。其余字词使用普通话合成录音。开场、整页故事和题目说明用 Zhiyu 配音。整页朗读会按词标注容易混淆的读音，并保留上下文与标点停顿。在故事里点「数」可以听到 shǔ，点「数字」可以听到 shù zì。「扫帚」「葡萄干」等词也可整词点读，听到词里的变读和轻声。录音加载失败会显示带声调的拼音，快速连点同一段录音时，当前一遍会继续播完。可在家长角查看[录音署名与许可](dist/audio/credits.txt)。

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

地图和章节背景共用 `dist/assets/oil-*.jpg`。内置 ImageGen 以小镇篇为画风参考，沿用原有地图的地标和小路布局，绘制成 1140 × 460 的横幅油画。后 100 字各册沿用相应主题的插画背景，地图上的站点由游戏绘制。

选图题的插画用内置 ImageGen 制作，放在 `dist/assets/cards-town.jpg` 和 `dist/assets/cards-outdoors.jpg`。提示词要求同尺寸的水粉和彩铅绘本图、每格只画题目需要的一个对象或场景、不加文字。每道题的两个干扰选项在 `dist/lessons.js` 中单独列出，避免一张图也能解释成另一个答案。

市集图卡 `dist/assets/cards-market.jpg` 和补充图卡 `dist/assets/home-detail.jpg`、`dist/assets/story-detail.jpg` 每张四列三行，每格画一个物件、场景或动作。邮局图卡 `dist/assets/cards-post.jpg` 按两列两行排列信封、邮票、明信片和邮包。郊游篇的溪水题继续使用 `dist/assets/countryside.jpg` 中的溪流画面。

## 部署与许可证

合并到 `main` 后，GitHub Actions 会先运行 `npm run check`，再上传到现有 S3 桶，等待 CloudFront 刷新并比对线上文件。PR 会运行课程检查。

生产流水线使用 AWS OIDC 短期凭证。已有 GitHub OIDC 提供商时，在生产账户中部署 `infra/github-actions-deploy.yml`，传入现有站点栈的 `ContentBucket` 和 `DistributionId` 输出，并启用 CloudFormation 的 `CAPABILITY_NAMED_IAM`。在 GitHub 仓库变量中设置 `CATS_DEPLOY_ROLE_ARN`（角色栈输出 `RoleArn`）、`CATS_CONTENT_BUCKET` 和 `CATS_DISTRIBUTION_ID`。该角色只接受本仓库 `main` 的身份，可上传这个站点的文件并刷新它的 CloudFront 分配。

AWS 部署使用 `infra/cloudfront.yml`，由 CloudFront 经 HTTPS 提供私有 S3 中的 `dist/` 静态文件。用管理目标域名公开 Route 53 托管区的 AWS 身份运行：

```sh
bash scripts/deploy-cloudfront.sh cats-learn-chinese.theyucheng.com <hosted-zone-id>
```

脚本会在 `us-east-1` 创建或更新站点，上传静态文件，并刷新 CloudFront 缓存。首次部署需要等待 ACM 验证域名和 CloudFront 生效。学习进度和贴纸保存在使用者的浏览器里，每个网址各自保存。

项目代码采用 [MIT 许可证](LICENSE)。真人录音采用 [CC BY-SA 3.0 US](https://creativecommons.org/licenses/by-sa/3.0/us/)。第 5 至第 20 册的描红路径取自 Hanzi Writer Data 2.0.1 所分发的 Make Me a Hanzi 笔顺数据，已对中线坐标缩放，按 [Arphic Public License](dist/assets/ARPHICPL.TXT) 分发。
