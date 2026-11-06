# 𝕏侧栏

在 X 主页、通知页、用户主页或帖子页点击头像，右侧查看用户主页。回复、转发、引用沿用 X 原生操作。

## 安装

打开本仓库的 `index.html`，把「开启x侧栏」拖到浏览器收藏栏。也可以下载带图标的收藏夹文件并导入；运行 `node build.mjs` 可重新生成安装页和收藏夹文件。

打开已登录的 `https://x.com/home`、`https://x.com/notifications`、用户主页（如 `https://x.com/MengShi63540`）或帖子页（如 `https://x.com/MengShi63540/status/2118335318088876326`），点击收藏栏里的「开启x侧栏」，再点击页面中的用户头像。刷新网页后需要重新点击书签。

动态书签会短暂打开 `x.usdts.de`，由安装页读取 GitHub 仓库 `main` 分支上的最新版脚本，再交给 X 页面执行。如果 GitHub 暂时不可用，则使用官网安装页内置的版本。用户只需将旧书签替换为动态书签一次；以后仓库更新不需要重新安装。此功能需要允许弹窗，并信任本仓库与官网发布的代码在已登录的 X 页面运行。

帖子 3 秒内没有出现时，侧栏会自动重建并重试。重建后再等 4 秒仍未加载时，可点击「重试侧栏」或「在 X 中打开」。
侧栏顶部的「重新加载侧栏」按钮可重新加载当前用户主页。

## 源码

- `bookmarklet.js`：侧栏脚本。
- `loader-bookmarklet.js`：安装后保存在浏览器里的动态启动书签。
- `home.template.html`：安装页模板；`build.mjs` 生成 `index.html` 和 `x-quick-comment-bookmarks.html`。
- `favicon.svg` / `favicon.png`：侧栏图标。
- `x-split-link.user.js`：早期油猴分屏方案，当前安装页不使用。

运行 `node test-dynamic-loader.cjs` 可测试动态加载与 X 的内容安全策略；运行 `node test-native-adapter.cjs` 可测试原生路由适配。测试需要本地 Chromium 与 X bundle 测试资源（默认 `%TEMP%/xqc-local-test`）。由于 X 的内部页面结构可能变化，真实页面仍需安装后验证。

导航配置隔离测试还使用该目录中的 `x-app-modules.js`，来自当前登录页面的 `loader.AppModules.76aa056a34182eb8a.js`，以 X 的真实配置队列验证侧栏预填文字不会进入主页面发帖入口。

## 许可

本项目采用 [MIT 许可证](LICENSE)。
