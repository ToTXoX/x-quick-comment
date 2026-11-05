import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile(new URL('./bookmarklet.js', import.meta.url), 'utf8');
const version = source.match(/const version = '([^']+)';/)?.[1];
if (!version) throw new Error('Sidebar version not found');
const url = 'javascript:' + encodeURIComponent(source);
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
await writeFile(new URL('./index.html', import.meta.url), template.replaceAll('__BOOKMARK_URL__',url).replaceAll('__BOOKMARK_JSON__',JSON.stringify(url).replaceAll('<','\\u003c')).replaceAll('__VERSION__',version));
