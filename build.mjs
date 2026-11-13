import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile(new URL('./bookmarklet.js', import.meta.url), 'utf8');
const loader = await readFile(new URL('./loader-bookmarklet.js', import.meta.url), 'utf8');
const version = source.match(/const version = '([^']+)';/)?.[1];
if (!version) throw new Error('Sidebar version not found');
const mark = source.match(/const peekalaMark = `([\s\S]*?)`;/)?.[1];
if (!mark) throw new Error('Peekala logo not found');
await writeFile(new URL('./favicon.svg', import.meta.url), mark+'\n');
await writeFile(new URL('./docs/readme-mark.svg', import.meta.url), mark+'\n');
const url = 'javascript:' + encodeURIComponent(loader);
const bookmarkName = '点我冒冒';
const staticUrl = 'javascript:' + encodeURIComponent(source);
const diagnostic = 'javascript:' + encodeURIComponent(await readFile(new URL('./diagnose.js', import.meta.url), 'utf8'));
const icon = 'data:image/png;base64,' + (await readFile(new URL('./favicon.png', import.meta.url))).toString('base64');
const bookmarks = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>${bookmarkName}</TITLE>
<H1>${bookmarkName}</H1>
<DL><p>
    <DT><A HREF="${url}" ICON="${icon}">${bookmarkName}</A>
    <DT><A HREF="${diagnostic}">Peekala 侧栏诊断</A>
</DL><p>
`;
await writeFile(new URL('./x-quick-comment-bookmarks.html', import.meta.url), bookmarks);


const template = await readFile(new URL('./home.template.html', import.meta.url), 'utf8');
await writeFile(new URL('./index.html', import.meta.url), template.replaceAll('__BOOKMARK_NAME__',bookmarkName).replaceAll('__BOOKMARK_URL__',url).replaceAll('__BOOKMARK_JSON__',JSON.stringify(url).replaceAll('<','\\u003c')).replaceAll('__STATIC_BOOKMARK_JSON__',JSON.stringify(staticUrl).replaceAll('<','\\u003c')).replaceAll('__VERSION__',version));
