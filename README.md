# Colored Player

使用原生`ES5 JavaScript`及`Canvas`开发的音乐播放器。大一时试探着写出的幼稚代码，仅供娱乐。但是有一说一，现在还是可以丝滑运行🚀的。

[![colored-player.png](https://i.postimg.cc/LsCS0TGx/colored-player.png)](https://postimg.cc/cKnPvQx3)

## 功能

1. 加载本地音乐到播放列表、清空播放列表
2. 单曲/顺序播放、上一曲/下一曲、播放/暂停、自由选择播放列表中的音乐、显示播放进度
3. 打开/关闭频谱及动态背景

## 运行

有两种选择：

1. 使用`nw.js`运行（脱离浏览器运行）

   下载`nw.js sdk`，解压后将其路径添加到环境变量。之后切换到此代码文件夹，运行`nw .`后将弹出播放器窗口。

2. 浏览器中运行

   直接点击此代码文件夹下的`index.html`即可。

## 配置

主要参数设置（如初始背景颜色，背景颜色变换速度，频谱条宽度、数量、间隔、位置、颜色等）可在`draw.js`中进行配置。