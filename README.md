# 猫猫学中文 · Cats Learn Chinese

和猫猫逛两册绘本的九个站点，学十八个汉字。每站从猫猫的小故事开始，依次点图认字、按笔顺描红、听音选字、拼词跟读、看字选图和亲子共读。完成后，贴上猫猫和小车，开车选路牌，抵达终点盖章。

小镇篇之后接郊游篇，经过石头山、溪边窑房和稻田小屋，认识「山石、水火、田土」。原有站点的编号和本地进度继续有效。

每天默认开放一站。家长角可以提前开放下一站，也可以查看认读记录和复习日期。正在玩的站点会保存到当前步骤。贴纸和进度存在当前浏览器。

## 本地运行

需要 Node.js 18 或更新版本，无须安装依赖。

```sh
npm run dev
```

打开 <http://localhost:9018>。如需改用别的端口，可设置 `PORT`。修改页面后刷新浏览器。

`npm run check` 检查 JavaScript 语法。关卡文字和笔顺在 `dist/lessons.js`。发音使用设备可用的普通话语音，听音题也可打开拼音提示。

开场旁白、写字提示、词语和绘本整页用 [Kokoro 的普通话模型](https://huggingface.co/hexgrad/Kokoro-82M-v1.1-zh) 提前合成，成品位于 `dist/audio/`。浏览器直接播放音频，遇到读取错误时使用设备语音。单个汉字沿用设备语音。修改课程文字后，可用 Python 3.12 重新生成相关音频：

```sh
python -m pip install "kokoro==0.9.4" "misaki[zh]==0.9.4" "soundfile>=0.13,<1"
python scripts/generate-intros.py
```

只改了写字提示时，可加 `--trace-only`。

猫咪和小车插画由内置 ImageGen 生成，保存在 `dist/assets/kitten-stickers.png`。提示词为绘本水粉与彩铅风格、两张分离的透明贴纸，内容是戴薄荷绿领巾的橘猫和它开的薄荷绿玩具车，只画猫，不加文字或品牌。

郊游地图由内置 ImageGen 生成，保存在 `dist/assets/countryside.jpg`。提示词为横向水粉和彩铅绘本地图，三处停留点分别留给山石、溪水石桥与砖窑、金色稻田和农舍，路边有一只小猫，画面不含文字和编号。

选图题的插画用内置 ImageGen 制作，放在 `dist/assets/cards-town.jpg` 和 `dist/assets/cards-outdoors.jpg`。提示词要求同尺寸的水粉和彩铅绘本图、每格只画题目需要的一个对象或场景、不加文字。每道题的两个干扰选项在 `dist/lessons.js` 中单独列出，避免一张图也能解释成另一个答案。

## 部署与许可证

AWS 部署使用 `infra/cloudfront.yml`，由 CloudFront 经 HTTPS 提供私有 S3 中的 `dist/` 静态文件。用管理目标域名公开 Route 53 托管区的 AWS 身份运行：

```sh
bash scripts/deploy-cloudfront.sh cats-learn-chinese.theyucheng.com <hosted-zone-id>
```

脚本会在 `us-east-1` 创建或更新站点，上传静态文件，并刷新 CloudFront 缓存。首次部署需要等待 ACM 验证域名和 CloudFront 生效。学习进度和贴纸保存在使用者的浏览器里，每个网址各自保存。

本项目采用 [MIT 许可证](LICENSE)。
