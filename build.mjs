import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile(new URL('./bookmarklet.js', import.meta.url), 'utf8');
const loader = await readFile(new URL('./loader-bookmarklet.js', import.meta.url), 'utf8');
const version = source.match(/const version = '([^']+)';/)?.[1];
if (!version) throw new Error('Sidebar version not found');
const url = 'javascript:' + encodeURIComponent(loader);
const staticUrl = 'javascript:' + encodeURIComponent(source);
const localTest = `<!doctype html>
<html lang="zh-CN"><meta charset="utf-8"><title>X 侧栏 · 本地测试</title>
<style>body{max-width:640px;margin:80px auto;padding:24px;font:16px/1.8 system-ui;color:#263238}a{display:inline-block;padding:10px 24px;background:#17202a;color:white;border-radius:8px;text-decoration:none}small{color:#667}</style>
<h1>本地测试 v${version}</h1>
<p>把下面的按钮拖到浏览器收藏栏，然后在刷新后的 X 页面点击它。</p>
<a href="${staticUrl}">测试本地 X 侧栏</a>
<p>这是本地代码的快照，不会从 GitHub 下载版本，也不需要推送。</p>
<small>代码更新后，重新打开本页，把按钮重新拖到收藏栏并替换旧测试书签。正式版书签可继续保留。</small>
</html>`;
await writeFile(new URL('./local-test.html', import.meta.url), localTest);
const diagnostic = 'javascript:' + encodeURIComponent(await readFile(new URL('./diagnose.js', import.meta.url), 'utf8'));
const icon = 'data:image/png;base64,' + (await readFile(new URL('./favicon.png', import.meta.url))).toString('base64');
const bookmarks = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><A HREF="${url}" ICON="${icon}">开启x侧栏</A>
    <DT><A HREF="${diagnostic}">读取双栏错误</A>
</DL><p>
`;
await writeFile(new URL('./x-quick-comment-bookmarks.html', import.meta.url), bookmarks);


const template = await readFile(new URL('./home.template.html', import.meta.url), 'utf8');
await writeFile(new URL('./index.html', import.meta.url), template.replaceAll('__BOOKMARK_URL__',url).replaceAll('__BOOKMARK_JSON__',JSON.stringify(url).replaceAll('<','\\u003c')).replaceAll('__STATIC_BOOKMARK_JSON__',JSON.stringify(staticUrl).replaceAll('<','\\u003c')).replaceAll('__VERSION__',version));
