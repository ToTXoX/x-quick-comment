# 𝕏侧栏

在 X 主页或通知页点击头像，右侧查看用户主页。回复、转发、引用沿用 X 原生操作。

## 安装

打开 [安装页](https://x-sidebar-install.sassyscone.chatgpt.site)，把「开启x侧栏」拖到浏览器收藏栏。也可以下载带图标的收藏夹文件并导入。安装页当前仅站点所有者可访问；其他人可在本仓库打开 `index.html`，或运行 `node build.mjs` 重新生成安装页和收藏夹文件。

打开已登录的 `https://x.com/home` 或 `https://x.com/notifications`，点击收藏栏里的「开启x侧栏」，再点击页面中的用户头像。刷新网页后需要重新点击书签。书签包含安装时的脚本代码，更新后需要重新拖入。

如果用户资料已出现而帖子列表持续加载，侧栏会自动重试一次；仍未完成时可点击「重试侧栏」或「在 X 中打开」。

## 源码

- `bookmarklet.js`：侧栏脚本。
- `home.template.html`：安装页模板；`build.mjs` 生成 `index.html` 和 `x-quick-comment-bookmarks.html`。
- `favicon.svg` / `favicon.png`：侧栏图标。
- `x-split-link.user.js`：早期油猴分屏方案，当前安装页不使用。

运行 `node test-native-adapter.cjs` 可测试原生路由适配；测试需要本地 X bundle 测试资源（默认 `%TEMP%/xqc-local-test`）。由于 X 的内部页面结构可能变化，真实页面仍需安装后验证。
