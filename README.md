<p align="center">
  <img src="docs/readme-mark.svg" width="72" height="72" alt="X 侧栏图标">
</p>
<h1 align="center">𝕏 侧栏</h1>
<p align="center">左侧看时间线，右侧看用户主页。</p>
<p align="center">
  <a href="https://x.usdts.de/"><img alt="安装 X 侧栏" src="https://img.shields.io/badge/INSTALL-X_SIDEBAR-0969DA?style=for-the-badge"></a>
  <a href="#安装与使用"><img alt="浏览器书签" src="https://img.shields.io/badge/BOOKMARKLET-X-171515?style=for-the-badge&amp;logo=x"></a>
  <a href="LICENSE"><img alt="MIT 许可证" src="https://img.shields.io/badge/LICENSE-MIT-57606A?style=for-the-badge"></a>
</p>

## 功能

| 功能 | 说明 |
| --- | --- |
| **头像侧栏** | 点头像查看用户主页，支持 X 原生回复、转发和引用。 |
| **评论通知** | 原帖已加载时，在评论下方显示摘要。 |
| **原生搜索** | 搜索建议浮在侧栏上方，侧栏保持原位。 |

## 安装与使用

1. 在电脑浏览器打开安装页，把 **开启x侧栏** 拖到收藏栏。[打开安装页](https://x.usdts.de/)
2. 登录 X 后点击书签。[X 首页](https://x.com/home) · [通知页](https://x.com/notifications)
3. 点用户头像打开侧栏。支持首页、通知页、用户主页和帖子页。

刷新页面后需重新点书签。也可通过书签管理器导入。[下载书签文件](https://x.usdts.de/x-quick-comment-bookmarks.html)

<details>
<summary><strong>常见问题</strong></summary>

- **如何更新？** 动态书签会短暂打开安装页，从 `main` 加载脚本，失败时使用内置版本。
- **书签点了没反应？** 在 X 页面允许弹窗后重试。
- **侧栏没加载或空间不足？** 加载卡住时点 **↻** 重试，空间不足时拉宽窗口。

</details>

## 开发与测试

```sh
node build.mjs
node test-dynamic-loader.cjs
node test-native-adapter.cjs
```

测试需要 Chromium 和 X bundle，默认从 `%TEMP%/xqc-local-test` 读取，可用 `XQC_TEST_ASSETS` 指定目录。

---

[反馈问题](https://github.com/ToTXoX/x-quick-comment/issues)
