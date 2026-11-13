import {readFile,writeFile} from 'node:fs/promises';
const script=await readFile(new URL('./x-split-link.user.js',import.meta.url),'utf8');
const encoded=JSON.stringify(script).replaceAll('<','\\u003c');
await writeFile(new URL('./install-split-link.html',import.meta.url),`<!doctype html>
<html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Peekala 冒冒 · 分屏联动安装</title>
<link rel="icon" type="image/svg+xml" href="favicon.svg?v=3">
<style>body{font:16px/1.7 system-ui;max-width:820px;margin:40px auto;padding:0 20px;color:#182230;background:#f7f9fc}h1{font-size:28px}section{background:white;border:1px solid #d9e0e8;border-radius:16px;padding:24px;margin:20px 0}button,a.download{font:inherit;cursor:pointer;background:#126bd1;color:white;border:0;border-radius:8px;padding:10px 16px;text-decoration:none;display:inline-block}textarea{box-sizing:border-box;width:100%;height:280px;font:12px/1.5 monospace;padding:12px;margin-top:12px}li{margin:8px 0}.note{color:#566477}#result{min-height:28px}</style>
<h1>Peekala 冒冒 · X 分屏联动</h1>
<p>左边看通知，点头像让右边打开原生主页。帖子、滚动和回复均由 X 自己处理。</p>
<section><h2>1. 安装脚本</h2><ol>
<li>在 Chrome 或 Edge 中安装并启用 <a href="https://www.tampermonkey.net/">Tampermonkey（油猴）</a>。</li>
<li>点击下方“复制脚本”，再点油猴图标 → 添加新脚本。</li>
<li>删除编辑器里的默认内容，粘贴本脚本，按 Ctrl+S 保存。</li>
<li>刷新已经打开的两个 X 页面。不要再启用之前的实验版书签。</li></ol>
<button id="copy">复制脚本</button> <a class="download" href="x-split-link.user.js" download>下载 .user.js 文件</a>
<p id="result" role="status"></p><details><summary>查看完整脚本 / 手动复制</summary><textarea id="code" readonly aria-label="油猴脚本代码"></textarea></details></section>
<section><h2>2. 设置分屏</h2><ol><li>手动开启浏览器原生分屏；左侧打开 <a href="https://x.com/notifications">X 通知页</a>，右侧打开任意 X 主页。</li>
<li>右侧页面左下角展开“Peekala 分屏联动”，点“设为右侧接收页”。</li>
<li>点击左侧通知头像，右侧会跳转到对应用户主页。之后继续点击其他头像即可复用右侧。</li></ol>
<p class="note">两个页面需要在同一个浏览器配置中，并启用同一份脚本。脚本不会自动创建分屏，也不会自动发布回复。换到新接收页时重新指定即可。</p></section>
<section><h2>使用说明</h2><ul><li>右侧有可检测到的未发送文字或附件时，会暂缓跳转，由你确认或取消。</li><li>暂停左侧头像联动后，头像恢复 X 默认行为。Ctrl/Shift/中键等操作保持原样。</li><li>每个浏览器配置只指定一个接收页；Chrome 与 Edge 之间不会互相联动。</li><li>如果页面左下角没有面板，先检查油猴内本脚本是否启用，以及浏览器是否提示需要允许用户脚本运行。</li></ul>
<p class="note">已通过 Chrome、Edge 隔离页面的通信逻辑测试（模拟油猴接口）；实际油猴安装与浏览器原生分屏组合仍需你安装后验证。</p></section>
<script>const source=${encoded};document.getElementById('code').value=source;document.getElementById('copy').onclick=async()=>{try{await navigator.clipboard.writeText(source);document.getElementById('result').textContent='已复制。打开油猴“添加新脚本”，粘贴并保存。'}catch{document.querySelector('details').open=true;const box=document.getElementById('code');box.focus();box.select();document.getElementById('result').textContent='代码已选中，请按 Ctrl+C 复制。'}};</script></html>`);
