(() => {
  'use strict';
  const key = '__xQuickComment';
  if (window[key]) { window[key](); return; }
  const reservedPaths = new Set(['explore','search','messages','settings','compose','i','grok','premium','jobs','communities','connect','bookmarks','lists','login','signup']);
  const isCompose=path=>/^\/(?:compose(?:\/|$)|intent\/(?:post|tweet)(?:\/|$))/.test(path);
  const isPhotoViewer=path=>/^\/(?:[a-z0-9_]{1,15}|i\/web)\/status\/\d+\/photo\/\d+\/?$/i.test(path);
  const isOverlay=path=>isCompose(path) || isPhotoViewer(path);
  const isNotifications=path=>/^\/notifications(?:\/|$)/.test(path);
  function supportedPage() {
    if (isNotifications(location.pathname) || /^\/home(?:\/|$)/.test(location.pathname)) return true;
    const match=location.pathname.match(/^\/([a-z0-9_]{1,15})(?:\/(?:with_replies|media|highlights|articles|likes|status\/\d+))?\/?$/i);
    return !!match && !reservedPaths.has(match[1].toLowerCase());
  }
  if (location.origin !== 'https://x.com' || !supportedPage()) {
    alert('请打开 X 页面后，再点击书签开启侧边栏'); return;
  }
  const host = document.createElement('section');
  host.id = 'xqc-native-panel';
  host.setAttribute('aria-label','𝕏侧栏 · 用户主页');
  const version = '3.31';
  host.dataset.version=version;
  host.innerHTML = `<header><div class="xqc-brand"><span class="xqc-mark" aria-hidden="true"><svg viewBox="0 0 64 64" width="25" height="25" fill="none"><rect x="6" y="9" width="52" height="46" rx="8" stroke="currentColor" stroke-width="5"/><path d="M23 11v42" stroke="currentColor" stroke-width="5"/><path d="M33 23h15M33 33h15M33 43h10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></span><div><strong>𝕏侧栏</strong><span class="xqc-caption">整页刷新需要重新点击书签，开启侧边栏</span></div></div><div class="xqc-actions"><button type="button" aria-label="重新加载侧栏" title="重新加载侧栏">↻</button><button type="button" aria-label="关闭𝕏侧栏" title="关闭𝕏侧栏">×</button></div></header><p role="status" aria-live="polite"></p><div class="xqc-root"></div><footer class="xqc-footer" aria-label="相关链接"><div class="xqc-footer-note"><span class="xqc-version">v${version}</span><span>· 动态书签自动获取更新</span></div><div class="xqc-footer-links"><a class="xqc-update" href="https://x.usdts.de/" target="_blank" rel="noopener noreferrer" aria-label="更新主页" title="更新主页"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M13 3h8v8M21 3l-10 10"/></svg></a><a class="xqc-repo" href="https://github.com/ToTXoX/x-quick-comment" target="_blank" rel="noopener noreferrer" aria-label="GitHub 仓库" title="GitHub 仓库"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3"/><path d="M15 22v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 4.77 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-7 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 18.13V22"/></svg></a><a href="https://x.com/yygqdkqk" target="_blank" rel="noopener noreferrer" aria-label="dk021 的 X 主页" title="dk021 的 X 主页"><span aria-hidden="true">𝕏</span></a></div></footer>`;
  const style = document.createElement('style');
  // X portals live outside this panel; keep native menus/dialogs above it.
  // Removing this style on cleanup restores the original layering.
  style.textContent = `#layers{z-index:101!important}#xqc-native-panel{position:fixed;top:0;bottom:0;right:0;width:var(--xqc-width,380px);z-index:100;background:Canvas;color:CanvasText;border-left:1px solid color-mix(in srgb,CanvasText 12%,transparent);box-shadow:-12px 0 48px #00000007;scrollbar-width:thin;scrollbar-color:#88888866 transparent;overflow:auto;overscroll-behavior:contain;color-scheme:light dark;padding-bottom:48px}#xqc-native-panel>header{display:flex;justify-content:space-between;align-items:center;padding:24px 20px 12px;min-height:38px;gap:12px;position:sticky;top:0;background:Canvas;z-index:5;font:14px system-ui;border-bottom:1px solid color-mix(in srgb,CanvasText 9%,transparent)}#xqc-native-panel>p{margin:20px;padding:18px 20px;border:1px solid color-mix(in srgb,CanvasText 10%,transparent);border-radius:14px;background:color-mix(in srgb,CanvasText 3%,Canvas);white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.8 system-ui}#xqc-native-panel>p button{margin-top:10px;padding:4px 10px;border:1px solid currentColor;border-radius:8px;background:transparent;color:inherit;cursor:pointer}#xqc-native-panel>p a{color:inherit}#xqc-native-panel .xqc-brand{display:flex;align-items:center;gap:11px}#xqc-native-panel .xqc-mark{width:26px;height:26px;display:grid;place-items:center;color:CanvasText}#xqc-native-panel .xqc-brand strong{display:block;font-size:15px;letter-spacing:1px}#xqc-native-panel .xqc-actions{display:flex;flex-shrink:0;gap:6px}#xqc-native-panel .xqc-caption{display:block;margin-top:3px;font-size:11px;letter-spacing:.3px;opacity:.55}#xqc-native-panel .xqc-actions button{display:grid;place-items:center;flex-shrink:0;width:32px;height:32px;padding:0;border:1px solid color-mix(in srgb,CanvasText 12%,transparent);border-radius:50%;background:transparent;color:inherit;font:23px/1 system-ui;cursor:pointer}#xqc-native-panel .xqc-actions button:hover{background:color-mix(in srgb,CanvasText 7%,Canvas)}#xqc-native-panel .xqc-actions button:focus-visible{outline:2px solid CanvasText;outline-offset:3px}#xqc-native-panel .xqc-footer{position:fixed;right:0;bottom:0;width:inherit;height:48px;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;border-top:1px solid color-mix(in srgb,CanvasText 10%,transparent);background:Canvas;color:CanvasText;font:10px system-ui}#xqc-native-panel .xqc-footer-note{display:flex;align-items:center;gap:3px;height:18px;white-space:nowrap;opacity:.72}#xqc-native-panel .xqc-footer-note .xqc-version{font-weight:600}#xqc-native-panel .xqc-footer-links{display:flex;align-items:center;justify-content:center;gap:10px;height:24px}#xqc-native-panel .xqc-footer a{display:grid;place-items:center;width:22px;height:22px;color:inherit;text-decoration:none;opacity:.65}#xqc-native-panel .xqc-footer-note a{display:inline;width:auto;height:auto;color:inherit;text-decoration:underline;opacity:1}#xqc-native-panel .xqc-footer a:hover{opacity:1}#xqc-native-panel .xqc-footer a:focus-visible{outline:2px solid CanvasText;outline-offset:1px}#xqc-native-panel .xqc-footer svg{width:14px;height:14px}#xqc-native-panel .xqc-footer a span{font:16px/1 system-ui}#xqc-native-panel [data-testid="like"].xqc-liked-from-store,#xqc-native-panel [data-testid="like"].xqc-liked-from-store svg{color:rgb(249,24,128)!important}#xqc-native-panel.xqc-stalled .xqc-root [role=progressbar]{display:none!important}#xqc-native-panel .xqc-root main{width:100%;max-width:100%;min-width:0}#xqc-native-panel .xqc-root aside,#xqc-native-panel [data-testid="sidebarColumn"]{display:none!important}#xqc-native-panel [data-testid="primaryColumn"]{width:100%!important;min-width:0!important;max-width:100%!important}#xqc-native-panel .xqc-root:has(>div){min-height:50px}`;
  document.head.append(style); document.body.append(host);
  const workspace = document.createElement('div');
  workspace.id = 'xqc-workspace';
  const icon = paths => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const homeIcon=icon('<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z"/>');
  const bellIcon=icon('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0"/>');
  const folderIcon=icon('<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>');
  const editIcon=icon('<path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7m-8 3 2.5-.5L21 7l-3-3-7.5 7.5z"/>');
  const panelIcon=icon('<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M15 4v16"/>');
  const postIcon=icon('<path d="M7 5h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-5l-4 3v-3H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM9 10h6m-6 3h4"/>');
  const replyIcon=icon('<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-3.5-.7L4 21l1.7-4.7A8.5 8.5 0 1 1 21 11.5z"/>');
  const repostIcon=icon('<path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3"/>');
  const likeIcon=icon('<path d="M7 10h-3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3zm0 0 4-7a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.4l-1.4 7a2 2 0 0 1-2 1.6H7"/>');
  const followIcon=icon('<circle cx="10" cy="7" r="3"/><path d="M3 20v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2m2-13v6m-3-3h6"/>');
  const accountIcon=icon('<circle cx="12" cy="8" r="3.5"/><path d="M5 20v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/>');
  const notificationKinds=[
    [/\b(?:heart|like|liked|likes|favorited)\b|喜欢了|喜歡了|赞了|讚了|点赞|點讚/i,likeIcon],
    [/\b(?:follow|followed)\b|关注了你|關注了你|追蹤了你/i,followIcon],
    [/\b(?:retweet|retweeted|repost|reposted)\b|转发了|轉發了|轉貼了/i,repostIcon],
    [/\b(?:reply|replied|mentioned)\b|回复了你|回覆了你|提及了你/i,replyIcon]
  ];
  const moreIcon=icon('<path d="M5 12h.1m6.9 0h.1m6.9 0h.1" stroke-width="2.9"/>');
  const actionIcons={reply:replyIcon,retweet:repostIcon,unretweet:repostIcon,like:likeIcon,unlike:likeIcon};
  const primaryActions=Object.keys(actionIcons).map(id=>`[data-testid="${id}"]`).join(',');
  const secondaryActions='[data-testid="analytics"],[data-testid="views"],[data-testid="bookmark"],[data-testid="removeBookmark"],[data-testid="share"],a[href$="/analytics"]';
  workspace.innerHTML = `<div class="xqc-workspace-nav" hidden>
    <nav class="xqc-icon-rail" aria-label="工作区导航">
      <a href="/home" aria-label="首页" title="首页">${homeIcon}</a>
      <a href="/notifications" aria-label="通知" title="通知">${bellIcon}</a>
      <a href="/compose/post" aria-label="新聊天" title="新聊天">${editIcon}</a>
      <div class="xqc-account">
        <button type="button" class="xqc-account-toggle" aria-label="账户和外观" title="账户和外观" aria-expanded="false" aria-controls="xqc-account-menu">${accountIcon}<img alt="" hidden></button>
        <div id="xqc-account-menu" hidden><a class="xqc-account-profile" hidden>${accountIcon}个人主页</a></div>
      </div>
    </nav>
    <aside class="xqc-sidebar">
      <div class="xqc-sidebar-title"><strong>Codex</strong><span aria-hidden="true">⌄</span></div>
      <a class="xqc-new-thread" href="/compose/post">${editIcon}新聊天</a>
      <nav class="xqc-projects" aria-label="会话">
        <span class="xqc-projects-label">项目</span>
        <a class="xqc-project" href="/home">${folderIcon}阅读工作区</a>
        <div class="xqc-timeline-tabs"></div>
        <a class="xqc-notifications" href="/notifications">${bellIcon}通知</a>
      </nav>
    </aside>
    <header class="xqc-thread-header">
      <div>${folderIcon}<strong class="xqc-thread-title">阅读工作区</strong></div>
      <button type="button" aria-label="切换上下文" title="上下文" aria-controls="xqc-native-panel" aria-expanded="false">${panelIcon}</button>
    </header>
    <aside class="xqc-context-card" aria-label="当前工作区">
      <span>阅读工作区</span>
      <button type="button" aria-controls="xqc-native-panel" aria-expanded="false">${panelIcon}上下文</button>
    </aside>
    <nav class="xqc-reading-jumps" aria-label="帖子快速跳转" hidden></nav>
    <div class="xqc-composer-dock">
      <a class="xqc-composer" href="/compose/post" aria-label="撰写帖子"><span>写条消息…</span><span aria-hidden="true"><b>＋</b><i>↑</i></span></a>
    </div>
  </div><label class="xqc-theme-picker">外观<select aria-label="外观"><option value="native">X 原生</option><option value="codex">Codex</option></select></label>`;
  document.body.append(workspace);
  const themeSelect=workspace.querySelector('select');
  const themePicker=themeSelect.parentElement;
  const workspaceNav=workspace.querySelector('.xqc-workspace-nav');
  const account=workspace.querySelector('.xqc-account');
  const accountToggle=account.querySelector('button');
  const accountAvatar=accountToggle.querySelector('img');
  const accountMenu=account.querySelector('#xqc-account-menu');
  const accountProfile=account.querySelector('.xqc-account-profile');
  const readingJumps=workspace.querySelector('.xqc-reading-jumps');
  const contextButtons=[...workspace.querySelectorAll('[aria-controls="xqc-native-panel"]')];
  const notificationLinks=[...workspace.querySelectorAll('a[href="/notifications"]')];
  const timelineTabs=workspace.querySelector('.xqc-timeline-tabs');
  const threadTitle=workspace.querySelector('.xqc-thread-title');
  const themeKey='xqc.appearance';
  const pageRoot=document.documentElement;
  const mainFeed='[data-testid="primaryColumn"]';
  const avatarSelector='[data-testid^="UserAvatar-Container"],[data-testid="Tweet-User-Avatar"],img[src*="/profile_images/"],img[src*="/default_profile"]';
  const photoSelector='[data-testid="tweetPhoto"]';
  const mediaSelector='[data-testid="videoPlayer"],[data-testid="videoComponent"],[data-testid="card.wrapper"]';
  const dockLabels=['grok','open grok','expand grok','messages','chat','xchat','open chat','expand chat','聊天','私信','打开聊天','打开私信'];
  const dockSelector=[...dockLabels.map(label=>`:is([role="button"],button)[aria-label="${label}" i]`),
    'a[href="/messages"]','a[href="/i/grok"]','[data-testid="GrokDrawer"]','[data-testid="DMDrawer"]'].join(',');
  const tweetTools=new Map();
  const notificationRows=new Map();
  let timelineFlow=new Set();
  const chrome=new Map();
  const tabButtons=new Map();
  const jumpButtons=new Map();
  let theme='native', contextOpen=false, inlineComposer, themeScrollFrame=0, jumpFrame=0, nativeProfile;
  try {if(localStorage.getItem(themeKey)==='codex') theme='codex';} catch {}
  themeSelect.value=theme;

  const codex='html[data-xqc-theme="codex"]';
  const workspaceFeed=`${codex} :is(${mainFeed},#xqc-native-panel .xqc-root)`;
  const notificationsFeed=`${codex}[data-xqc-notifications] ${mainFeed}:not(#xqc-native-panel *)`;
  const nativeBanner='header[role="banner"]:has(:is([data-testid="AppTabBar_Home_Link"],a[href="/home"]))';
  const nativeNotificationLink='[data-testid="AppTabBar_Notifications_Link"]';
  const nativeMain=`${codex} main:has(${mainFeed}):not(#xqc-native-panel *)`;
  style.textContent+=`
    #xqc-workspace {position:fixed;inset:auto auto 12px 12px;z-index:100;font:13px/1.5 system-ui;color:CanvasText}
    #xqc-workspace,#xqc-workspace * {box-sizing:border-box}
    #xqc-workspace [hidden] {display:none!important}
    :where(#xqc-workspace) :is(button,select),.xqc-tweet-tools button {font:inherit;color:inherit}
    :where(#xqc-workspace) a {color:inherit;text-decoration:none}
    :where(#xqc-workspace) button,.xqc-tweet-tools button {background:transparent;border:0;text-align:start;cursor:pointer}
    #xqc-workspace :is(a,button,select):focus-visible,.xqc-tweet-tools button:focus-visible {outline:2px solid currentColor;outline-offset:2px}
    .xqc-theme-picker {display:flex;align-items:center;gap:8px;padding:4px 7px;border:1px solid color-mix(in srgb,CanvasText 16%,transparent);border-radius:7px;background:Canvas}
    .xqc-theme-picker select {padding:3px;border:0;background:transparent;cursor:pointer}
    .xqc-theme-picker option {background:Canvas;color:CanvasText}
    ${codex} {
      color-scheme:light dark;
      --xqc-page:light-dark(#fff,#1d1d1f);
      --xqc-rail:light-dark(#f7f7f7,#252527);
      --xqc-sidebar:light-dark(#fafafa,#222224);
      --xqc-text:light-dark(#26282a,#ececef);
      --xqc-muted:light-dark(#66696c,#acacb5);
      --xqc-line:light-dark(#e9e9ea,#3c3c41);
      --xqc-hover:light-dark(#eeeeef,#343439);
      --xqc-rail-width:0px;
      --xqc-sidebar-width:0px;
      --xqc-nav-width:calc(var(--xqc-rail-width) + var(--xqc-sidebar-width));
      --xqc-gutter:0px;
      --xqc-jump-space:0px;
      --xqc-thread-width:880px;
      --xqc-header-height:54px;
      --xqc-context-width:min(390px,calc(100vw - 24px));
    }
    ${codex}[data-xqc-reading-jumps] {--xqc-jump-space:24px}
    ${codex} body {background:var(--xqc-page)!important;color:var(--xqc-text)}
    ${codex} #xqc-workspace {inset:0;pointer-events:none;color:var(--xqc-text);font-size:14px}
    ${codex} #xqc-workspace :is(.xqc-icon-rail,.xqc-sidebar,.xqc-thread-header,.xqc-context-card,.xqc-composer,.xqc-theme-picker,.xqc-reading-jumps) {pointer-events:auto}
    ${codex} .xqc-workspace-nav :is(a,button):not(:where(.xqc-composer)) {display:flex;align-items:center;gap:8px;border-radius:8px;padding:6px 8px;white-space:nowrap}
    ${codex} .xqc-workspace-nav svg {flex:none}
    ${codex} .xqc-workspace-nav :is(a,button):not(:where(.xqc-composer)):is(:hover,[aria-current="page"],[aria-expanded="true"]),${codex} .xqc-tweet-tools button:hover {background:var(--xqc-hover)}
    ${codex} .xqc-icon-rail a[href="/notifications"] {position:relative}
    ${codex} #xqc-workspace a[data-xqc-unread]::after {content:"";display:block;flex:none;width:7px;height:7px;border-radius:50%;background:light-dark(#357df4,#6aa2ff)}
    ${codex} .xqc-icon-rail a[data-xqc-unread]::after {position:absolute;inset:5px 4px auto auto;box-shadow:0 0 0 2px var(--xqc-rail)}
    ${codex} .xqc-notifications[data-xqc-unread]::after {margin-inline-start:auto}
    ${codex} .xqc-icon-rail,${codex} .xqc-sidebar,${codex} .xqc-context-card {display:none}
    ${codex} .xqc-thread-header {position:absolute;inset:0 0 auto var(--xqc-nav-width);height:var(--xqc-header-height);display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 14px;background:var(--xqc-page);border-bottom:1px solid var(--xqc-line)}
    ${codex} .xqc-thread-header>div {display:flex;align-items:center;gap:12px;min-width:0}
    ${codex} .xqc-thread-title {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}
    ${codex} .xqc-account {position:relative}
    ${codex} .xqc-account .xqc-account-toggle {display:grid;place-items:center;width:29px;height:29px;padding:0;border:1px solid var(--xqc-line);border-radius:50%;overflow:hidden;background:var(--xqc-hover);color:var(--xqc-muted)}
    ${codex} .xqc-account-toggle img {width:100%;height:100%;object-fit:cover}
    ${codex} .xqc-account-toggle:has(img:not([hidden])) svg {display:none}
    ${codex} #xqc-account-menu {position:absolute;inset:auto auto 0 calc(100% + 10px);width:174px;display:grid;gap:3px;z-index:2;padding:5px;border:1px solid var(--xqc-line);border-radius:10px;background:var(--xqc-page);box-shadow:0 6px 20px #00000018}
    ${codex} #xqc-account-menu .xqc-account-profile {display:flex;place-items:initial;align-items:center;justify-content:flex-start;width:auto;height:auto;padding:6px 8px;color:var(--xqc-text)}
    ${codex} #xqc-account-menu .xqc-theme-picker {justify-content:space-between;border:0;background:transparent;font-size:13px;padding:4px 8px}
    ${codex} .xqc-reading-jumps {position:absolute;inset-block-start:50%;transform:translateY(-50%);display:grid;justify-items:center;width:var(--xqc-jump-space);z-index:1}
    ${codex} .xqc-reading-jumps button {display:grid;place-items:center;width:100%;height:15px;padding:0;border-radius:4px}
    ${codex} .xqc-reading-jumps button::after {content:"";width:8px;height:2px;border-radius:2px;background:color-mix(in srgb,var(--xqc-muted) 38%,transparent)}
    ${codex} .xqc-reading-jumps button:is([aria-current="true"],:hover,:focus-visible)::after {background:var(--xqc-muted)}
    ${codex} .xqc-reading-jumps button[aria-current="true"]::after {width:11px;background:var(--xqc-text)}
    ${codex} .xqc-composer-dock {position:absolute;inset:auto var(--xqc-gutter) 0 calc(var(--xqc-nav-width) + var(--xqc-jump-space));padding:20px 16px 15px;background:linear-gradient(transparent,var(--xqc-page) 33%);display:grid;justify-items:center}
    ${codex} .xqc-composer {width:min(100%,var(--xqc-thread-width));min-height:78px;display:flex;flex-direction:column;align-items:stretch;justify-content:space-between;gap:8px;padding:9px 13px;border:1px solid var(--xqc-line);border-radius:20px;background:var(--xqc-page);box-shadow:0 3px 18px #0000000d;color:var(--xqc-muted)}
    ${codex} .xqc-composer:hover {background:var(--xqc-sidebar)}
    ${codex} .xqc-composer span+span {display:flex;align-items:center;justify-content:space-between;color:var(--xqc-text)}
    ${codex} .xqc-composer b,${codex} .xqc-composer i {display:grid;place-items:center;width:27px;height:27px;font-style:normal;font-weight:500;font-size:18px}
    ${codex} .xqc-composer i {background:var(--xqc-hover);border-radius:50%;font-size:16px}
    ${codex} ${nativeBanner} {visibility:hidden;flex:0 0 0!important;width:0!important;min-width:0!important;overflow:hidden}
    ${codex} :is([data-testid="sidebarColumn"],[data-testid="BottomBar"],[data-testid="Dock"],[data-testid="chat-drawer"],[data-testid="TopNavBar"]:not(:has([role="tablist"])),[data-xqc-chrome]:not([data-xqc-chrome="tabs"])):not(#layers *):not([data-xqc-inline-open]) {display:none!important}
    ${codex} #layers [data-xqc-chrome="dock"] {display:none!important}
    ${codex} [data-xqc-chrome="tabs"] {position:relative!important;top:auto!important}
    ${nativeMain} {box-sizing:border-box;width:auto!important;min-width:0!important;background:var(--xqc-page);margin-inline-start:var(--xqc-nav-width)!important;padding:var(--xqc-header-height) var(--xqc-gutter) 128px var(--xqc-jump-space);flex:1 1 0!important}
    ${nativeMain}>div,${nativeMain}>div>div:has(${mainFeed}) {width:100%!important;max-width:100%!important;min-width:0!important}
    ${workspaceFeed} {color:var(--xqc-text);background:var(--xqc-page)!important;border-color:var(--xqc-line)!important}
    ${codex} ${mainFeed}:not(#xqc-native-panel *) {width:min(100%,var(--xqc-thread-width))!important;max-width:100%!important;min-width:0!important;margin-inline:auto;border-inline:0!important}
    ${notificationsFeed} {max-width:min(100%,var(--xqc-thread-width))!important;margin-inline:auto!important}
    ${workspaceFeed} [data-xqc-timeline-flow] {box-sizing:border-box;width:100%!important;max-width:100%!important;min-width:0!important}
    ${workspaceFeed} :is([role="tab"],[role="heading"],[data-testid="UserName"],[data-testid="UserDescription"]) :is(span,a) {color:var(--xqc-text)!important}
    ${workspaceFeed} :is([data-testid="tweet"],[data-testid="notification"]) {background:var(--xqc-page)!important;color:var(--xqc-text)!important;font:14px/1.55 system-ui!important}
    ${workspaceFeed} :is([data-testid="tweet"],[data-testid="notification"]) {scroll-margin-block-start:calc(var(--xqc-header-height) + 9px)}
    ${workspaceFeed} :is([data-testid="tweet"],[data-testid="notification"],[data-testid="cellInnerDiv"]) {border-color:transparent!important}
    ${workspaceFeed} [data-testid="tweet"] {position:relative;padding-inline-start:35px!important;border-block-end:1px solid color-mix(in srgb,var(--xqc-line) 77%,transparent)!important}
    ${workspaceFeed} .xqc-post-mark {position:absolute;inset:13px auto auto 11px;width:15px;height:15px;color:var(--xqc-muted);opacity:.72;pointer-events:none}
    ${notificationsFeed} [data-xqc-notification-row] {position:relative;box-sizing:border-box;min-block-size:44px;padding:10px 14px 10px 35px!important;border-block-end:1px solid color-mix(in srgb,var(--xqc-line) 77%,transparent)!important;font:14px/1.55 system-ui!important}
    ${notificationsFeed} [data-xqc-notification-glyph] {display:none!important}
    ${notificationsFeed} .xqc-notification-mark {position:absolute;inset:13px auto auto 11px;width:15px;height:15px;color:var(--xqc-muted)!important;pointer-events:none}
    ${workspaceFeed} [data-xqc-photo-preview] {--xqc-photo-width:96px;--xqc-photo-height:64px;padding-inline-end:calc(var(--xqc-photo-width) + 27px)!important;min-block-size:calc(var(--xqc-photo-height) + 24px)}
    ${workspaceFeed} [data-xqc-photo-region] {display:none!important}
    ${workspaceFeed} .xqc-photo-preview {position:absolute;inset-block-start:12px;inset-inline-end:12px;display:block;width:var(--xqc-photo-width);height:var(--xqc-photo-height);border:1px solid var(--xqc-line);border-radius:8px;overflow:hidden;background:var(--xqc-hover)}
    ${workspaceFeed} .xqc-photo-preview img {display:block;width:100%;height:100%;object-fit:cover}
    ${workspaceFeed} .xqc-photo-preview [hidden] {display:none!important}
    ${workspaceFeed} .xqc-photo-preview>span {position:absolute;inset:auto 3px 3px auto;padding:0 4px;border-radius:4px;background:#202124bc;color:#fff!important;font:11px/16px system-ui}
    ${workspaceFeed} .xqc-photo-preview:focus-visible {outline:2px solid var(--xqc-text);outline-offset:2px}
    ${codex} #xqc-native-panel [data-xqc-photo-preview] {--xqc-photo-width:64px;--xqc-photo-height:48px}
    ${workspaceFeed} :is([data-testid="tweet"],[data-testid="notification"]) :is(span,a,time,[data-testid="tweetText"]) {color:var(--xqc-text)!important}
    ${workspaceFeed} :is(time,a[href^="/hashtag/"],.xqc-reply-context) {color:var(--xqc-muted)!important}
    ${workspaceFeed} [data-testid="tweet"] :is(time,[data-testid="User-Name"] span:not(:has(a))) {color:var(--xqc-muted)!important}
    ${workspaceFeed} [data-testid="tweet"] :is([data-testid="User-Name"] a,a:has(>time)):not(:hover) {text-decoration:none!important}
    ${workspaceFeed} :is([data-testid="tweet"],[data-testid="notification"]) :is(${avatarSelector},[data-xqc-avatar-region]) {display:none!important}
    ${workspaceFeed} :is([data-testid="icon-verified"],[data-testid="verificationBadge"],[data-testid="User-Name"] svg[aria-label]) {display:none!important}
    ${workspaceFeed} [data-testid="tweet"] [data-testid="tweetText"] {font:14px/1.65 system-ui!important}
    ${workspaceFeed} [data-testid="tweet"] [data-testid="tweetText"] span {font:inherit!important}
    ${workspaceFeed} [data-testid="tweet"]:not([data-xqc-media-open]) [data-xqc-media-region],
    ${workspaceFeed} [data-testid="tweet"]:not([data-xqc-actions-open]) [data-xqc-action-row] > :not(:is(.xqc-tweet-tools,${primaryActions})):not(:has(:is(${primaryActions}))),
    ${workspaceFeed} [data-testid="tweet"]:not([data-xqc-actions-open]) [data-xqc-action-row] :is(${secondaryActions}),
    ${workspaceFeed} [data-testid="tweet"]:not([data-xqc-actions-open]):has([data-xqc-action-row]) :is([data-testid="caret"],[data-testid="GrokActions"]) {display:none!important}
    ${workspaceFeed} [data-xqc-action-row] {display:flex!important;align-items:center!important;justify-content:flex-start!important;flex-wrap:wrap;gap:2px;width:max-content!important;max-width:100%!important;margin-block:5px 1px}
    ${workspaceFeed} [data-xqc-action-row] > * {flex:0 0 auto!important;min-width:0!important}
    ${workspaceFeed} [data-xqc-action-row] :is(${primaryActions}) {display:inline-flex!important;align-items:center!important;column-gap:4px;min-width:27px!important;min-height:27px;padding:3px 4px!important;border:0!important;border-radius:6px;background:transparent!important;color:var(--xqc-muted)!important;font:12px/1.4 system-ui!important}
    ${workspaceFeed} [data-xqc-action-row] :is(${primaryActions}) span {color:inherit!important;font:inherit!important}
    ${workspaceFeed} [data-xqc-action-row] :is(${primaryActions}):is(:hover,:focus-visible,[data-testid="unlike"],[data-testid="unretweet"],.xqc-liked-from-store) {color:var(--xqc-text)!important;background:var(--xqc-hover)!important}
    ${workspaceFeed} [data-xqc-native-action-icon] {display:none!important}
    ${workspaceFeed} .xqc-action-icon {width:15px!important;height:15px!important;display:block;flex:none;color:inherit!important}
    ${workspaceFeed} :is([data-testid="unlike"],.xqc-liked-from-store) .xqc-action-icon {fill:currentColor}
    ${workspaceFeed} [data-testid="tweet"]:has(>.xqc-tweet-tools) {flex-wrap:wrap!important}
    ${codex} .xqc-tweet-tools {display:flex!important;flex:0 0 auto;align-items:center;align-self:flex-start;flex-wrap:wrap;gap:5px;max-width:100%;margin-top:5px;color:var(--xqc-muted);font:12px/1.5 system-ui}
    ${codex} [data-xqc-action-row] .xqc-tweet-tools {align-self:center;margin:0;gap:2px}
    ${codex} [data-testid="tweet"]>.xqc-tweet-tools {flex-basis:100%}
    ${codex} .xqc-tweet-tools button {flex:none;white-space:nowrap;padding:3px 7px;border:1px solid transparent;border-radius:6px}
    ${codex} .xqc-tweet-tools button:has(svg) {display:grid;place-items:center;width:27px;height:27px;padding:0}
    ${codex} .xqc-tweet-tools button svg {width:16px;height:16px}
    ${codex} .xqc-tweet-tools [hidden] {display:none!important}
    ${codex} .xqc-tweet-tools button:is(:hover,:focus-visible) {border-color:var(--xqc-line)}
    ${codex} #xqc-native-panel {inset:calc(var(--xqc-header-height) + 8px) 12px 12px auto;background:var(--xqc-page);color:var(--xqc-text);border:1px solid var(--xqc-line);border-radius:14px;box-shadow:0 6px 25px #00000012;padding-bottom:12px}
    ${codex} #xqc-native-panel:not(.xqc-context-open) {visibility:hidden;pointer-events:none}
    ${codex} #xqc-native-panel>header {background:var(--xqc-page);padding:8px 12px;border-color:var(--xqc-line)}
    ${codex} #xqc-native-panel :is(.xqc-mark,.xqc-caption,.xqc-footer,a[href$="/header_photo"],:has(>a[href$="/header_photo"]):not(:has([data-testid="UserName"],[data-testid="tweet"])),${avatarSelector}) {display:none!important}
    @media (max-width:839px) {
      ${codex}[data-xqc-reading-jumps] {--xqc-jump-space:20px}
      ${workspaceFeed} [data-xqc-photo-preview] {--xqc-photo-width:68px;--xqc-photo-height:50px}
      ${codex} .xqc-icon-rail {position:absolute;inset:9px auto auto 7px;z-index:1;display:flex;gap:1px}
      ${codex} .xqc-icon-rail a {padding:7px}
      ${codex} .xqc-icon-rail a[href="/compose/post"],${codex} .xqc-thread-header>div>svg {display:none}
      ${codex} .xqc-thread-header {padding-left:78px}
      ${codex} .xqc-thread-header>div {padding-right:42px}
      ${codex} .xqc-account {position:fixed;inset:12px 55px auto auto}
      ${codex} #xqc-account-menu {inset:calc(100% + 8px) 0 auto auto}
      ${codex} .xqc-reading-jumps button {height:20px}
    }
    @media (min-width:840px) {
      ${codex} {--xqc-rail-width:48px;--xqc-sidebar-width:clamp(218px,18vw,330px)}
      ${codex}[data-xqc-notifications] .xqc-composer-dock {display:none}
      ${codex}[data-xqc-notifications] main:has(${mainFeed}):not(#xqc-native-panel *) {padding-bottom:32px}
      ${codex} [data-xqc-chrome="tabs"] {display:none!important}
      ${codex} .xqc-icon-rail {position:absolute;inset:0 auto 0 0;z-index:2;width:var(--xqc-rail-width);display:flex;flex-direction:column;align-items:center;gap:8px;padding:9px 5px;background:var(--xqc-rail)}
      ${codex} .xqc-icon-rail a {display:grid;place-items:center;width:35px;height:35px;padding:0;color:var(--xqc-muted)}
      ${codex} .xqc-icon-rail a[aria-current] {color:var(--xqc-text)}
      ${codex} .xqc-sidebar {position:absolute;inset:0 auto 0 var(--xqc-rail-width);width:var(--xqc-sidebar-width);display:block;padding:13px 10px 54px;background:var(--xqc-sidebar);border-inline:1px solid var(--xqc-line);border-top-left-radius:12px;overflow:auto}
      ${codex} .xqc-sidebar-title {display:flex;align-items:center;gap:7px;padding:0 7px 14px;font-size:17px;line-height:24px}
      ${codex} .xqc-sidebar-title span {color:var(--xqc-muted);font-size:12px}
      ${codex} .xqc-projects {display:grid;gap:3px;margin-top:19px}
      ${codex} .xqc-projects-label {padding:0 8px 5px;color:var(--xqc-muted);font-size:13px}
      ${codex} .xqc-timeline-tabs {display:grid;gap:2px}
      ${codex} .xqc-timeline-tabs button {display:block;width:100%;text-align:start;padding-left:33px;overflow:hidden;text-overflow:ellipsis}
      ${codex} .xqc-account {margin-top:auto;margin-bottom:4px}
      ${codex} .xqc-thread-header {padding-inline:20px}
      ${codex} .xqc-thread-header>div {padding-right:0}
      ${codex} .xqc-composer {min-height:96px;padding:11px 14px}
      ${codex} .xqc-composer-dock {padding-bottom:19px}
    }
    @media (min-width:1400px) {
      ${codex} {--xqc-gutter:clamp(286px,20vw,394px);--xqc-context-width:calc(var(--xqc-gutter) - 24px)}
      ${codex} .xqc-context-card {position:absolute;top:calc(var(--xqc-header-height) + 10px);right:12px;width:var(--xqc-context-width);display:grid;gap:6px;padding:12px 14px;border:1px solid var(--xqc-line);border-radius:16px;background:var(--xqc-page);box-shadow:0 3px 13px #0000000d}
      ${codex} .xqc-context-card>span {color:var(--xqc-muted);font-size:13px;padding-inline:4px}
      ${codex} .xqc-context-card button {justify-self:start;padding:5px 4px}
      ${codex} #xqc-native-panel {top:calc(var(--xqc-header-height) + 104px)}
    }
  `;
  // #layers itself can have z-index 101 while its ancestors remain in a
  // z-index:0 stacking context. A body-level panel still covers that entire
  // context. Put the panel beside #layers instead of competing with ancestors.
  let trackedLayerParent;
  function alignWithNativeLayers() {
    const layers=document.getElementById('layers');
    const parent=layers?.parentElement;
    if(parent && parent!==host && !host.contains(parent)) {
      if(host.parentElement!==parent || workspace.parentElement!==parent) parent.append(workspace,host);
      if(trackedLayerParent===parent) return;
      trackedLayerParent=parent;
      layerObserver.disconnect();
      // Watch container replacement only, not every editor/timeline mutation.
      for(let node=parent;node;node=node.parentElement) layerObserver.observe(node,{childList:true});
    } else if(trackedLayerParent) {
      trackedLayerParent=null;
      layerObserver.disconnect();
      layerObserver.observe(document.body,{childList:true,subtree:true});
    }
  }
  const layerObserver=new MutationObserver(alignWithNativeLayers);
  layerObserver.observe(document.body,{childList:true,subtree:true});
  alignWithNativeLayers();
  const status = host.querySelector('[role=status]');
  const mount = host.querySelector('.xqc-root');
  const panelTitle=host.querySelector('.xqc-brand strong');
  const panelClose=host.querySelector('[aria-label="关闭𝕏侧栏"]');
  let disposed = false, root, secondary, memory, ready, timeout, observer, desiredHandle, nativeError;
  let loadedHandle, pendingHandle, failedHandle, baselineTweet, baselineText;
  let tweetStore, unlistenTweets, likeFrame = 0;
  let sidebarScope, restoreNavigationConfig;
  let previewStore, unlistenPreviews, previewFrame=0;
  const previewCards=new Map();
  const previewObserver=new MutationObserver(records=>{
    const owned=node=>node instanceof Element && (host.contains(node) || workspace.contains(node) || node.closest('.xqc-reply-context,.xqc-tweet-tools,.xqc-post-mark,.xqc-action-icon,.xqc-photo-preview,.xqc-notification-mark'));
    if(records.some(record=>!owned(record.target) &&
      (record.type!=='childList' || [...record.addedNodes,...record.removedNodes].some(node=>!owned(node))))) schedulePreviews();
  });
  style.textContent+=`
    .xqc-reply-context{display:block;box-sizing:border-box;max-width:100%;min-width:0;margin:3px 0 0;padding:0;border:0;background:none;color:inherit;opacity:.4;text-decoration:none;font:12px/18px system-ui;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  `;
  function schedulePreviews() {
    if(disposed || previewFrame) return;
    previewFrame=requestAnimationFrame(()=>{
      previewFrame=0;
      syncTheme();
      syncPreviews();
      if(codexActive()) {
        syncNotificationBadge();
        syncTweetTools();
        syncReadingJumps();
      }
    });
  }
  const codexActive=()=>pageRoot.dataset.xqcTheme==='codex';
  const panelHint=()=>codexActive()?'点击正文中的作者名，查看上下文。':'点击左侧头像，查看用户主页。';
  function setContextOpen(open) {
    contextOpen=open;
    host.classList.toggle('xqc-context-open',open);
    host.inert=codexActive() && (!open || isOverlay(location.pathname));
    for(const button of contextButtons) button.setAttribute('aria-expanded',String(open));
  }
  // Collapse the layout wrapper as well as its contents. Stop where the
  // branch would also absorb an editor, another timeline row, or post text.
  function isolatedBranch(node,boundary,keep,protectedNodes=[]) {
    for(let parent=node.parentElement;parent && parent!==boundary && !parent.matches(keep);parent=node.parentElement) {
      if(protectedNodes.some(other=>parent.contains(other)) ||
        [...parent.children].some(child=>child!==node && (child.matches(keep) || child.querySelector(keep)))) break;
      node=parent;
    }
    return node;
  }
  function syncChrome(next) {
    for(const node of chrome.keys()) if(!next.has(node)) {
      delete node.dataset.xqcChrome;
      delete node.dataset.xqcInlineOpen;
      chrome.delete(node);
    }
    for(const [node,kind] of next) if(chrome.get(node)!==kind) {
      node.dataset.xqcChrome=kind;
      chrome.set(node,kind);
    }
  }
  function nativeNotificationLinks() {
    return [...document.querySelectorAll(`${nativeNotificationLink},${nativeBanner} a[href^="/notifications"]`)]
      .filter(link=>!host.contains(link) && !workspace.contains(link));
  }
  function notificationUnread() {
    const links=nativeNotificationLinks();
    const positive=/[1-9１-９١-٩۱-۹]/;
    if(links.length) return links.some(link=>{
      if(positive.test(link.getAttribute('aria-label') || '')) return true;
      return [...link.querySelectorAll('[aria-live],[data-testid="notificationBadge"]')].some(badge=>
        !badge.closest('[hidden],[aria-hidden="true"]') && positive.test(`${badge.getAttribute('aria-label') || ''} ${badge.textContent}`));
    });
    let badge;
    try {badge=previewStore?.getState()?.badgeCount;} catch {}
    if(!badge) return false;
    const {remote,localNtab,ntabClearedAt}=badge;
    const latest=localNtab && localNtab.at>=(remote?.requestedAt ?? -1);
    const at=latest?localNtab.at:remote?.requestedAt ?? -1;
    const count=latest?localNtab.count:remote?.badgeCounts?.ntab_unread_count;
    return count>0 && (ntabClearedAt==null || ntabClearedAt<at);
  }
  function syncNotificationBadge() {
    const unread=notificationUnread();
    const label=unread?'通知，有未读':'通知';
    for(const link of notificationLinks) {
      link.toggleAttribute('data-xqc-unread',unread);
      if(link.getAttribute('aria-label')!==label) link.setAttribute('aria-label',label);
    }
  }
  function setAccountOpen(open) {
    accountMenu.hidden=!open;
    accountToggle.setAttribute('aria-expanded',String(open));
  }
  function closeAccountFromOutside(event) {
    if(!accountMenu.hidden && !account.contains(event.target)) setAccountOpen(false);
  }
  function closeAccountOnEscape(event) {
    if(event.key!=='Escape' || accountMenu.hidden) return;
    event.preventDefault();
    setAccountOpen(false);
    accountToggle.focus({preventScroll:true});
  }
  function syncAccount(regions) {
    const profile=document.querySelector('[data-testid="AppTabBar_Profile_Link"]');
    nativeProfile=profile?.closest('a[href]') || profile?.querySelector('a[href]');
    const hasProfile=nativeProfile?.origin===location.origin && /^\/[a-z0-9_]{1,15}\/?$/i.test(nativeProfile.pathname);
    accountProfile.hidden=!hasProfile;
    if(hasProfile && accountProfile.href!==nativeProfile.href) accountProfile.href=nativeProfile.href;
    const nativeAvatar=document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"] img[src],[data-testid="DashButton_ProfileIcon_Link"] img[src]');
    const source=nativeAvatar || [...regions].map(node=>node.querySelector('img[src*="/profile_images/"],img[src*="/default_profile"]')).find(Boolean);
    const url=source?.getAttribute('src') || source?.currentSrc;
    if(url && accountAvatar.getAttribute('src')!==url) {
      accountAvatar.src=url;
      accountAvatar.hidden=false;
    }
  }
  function resetReadingJumps() {
    if(jumpFrame) cancelAnimationFrame(jumpFrame);
    jumpFrame=0;
    readingJumps.hidden=true;
    readingJumps.replaceChildren();
    jumpButtons.clear();
    delete pageRoot.dataset.xqcReadingJumps;
  }
  function scheduleReadingJumps() {
    if(disposed || !codexActive() || jumpFrame) return;
    jumpFrame=requestAnimationFrame(()=>{jumpFrame=0;syncReadingJumps();});
  }
  function syncReadingJumps() {
    if(isOverlay(location.pathname)) return;
    const feed=pageElement(mainFeed);
    const selector='[data-testid="tweet"],[data-testid="notification"]';
    const rows=[...(feed?.querySelectorAll(selector) || [])].flatMap(row=>{
      if(row.parentElement.closest(`${selector},[data-testid="quoteTweet"]`)) return [];
      const rect=row.getBoundingClientRect();
      return rect.width && rect.height?[{row,top:rect.top,bottom:rect.bottom}]:[];
    }).sort((a,b)=>a.top-b.top);
    if(rows.length<2) return resetReadingJumps();
    pageRoot.setAttribute('data-xqc-reading-jumps','');
    readingJumps.hidden=false;
    const x=feed.getBoundingClientRect().left-readingJumps.offsetWidth;
    readingJumps.style.left=`${Math.max(0,Math.round(x))}px`;
    const readingTop=threadTitle.closest('header').getBoundingClientRect().bottom+10;
    const firstVisible=rows.findIndex(row=>row.bottom>readingTop);
    const active=firstVisible<0?rows.length-1:firstVisible;
    const start=Math.max(0,Math.min(active-4,rows.length-12));
    const shown=rows.slice(start,start+12);
    for(const [row,button] of jumpButtons) if(!shown.some(item=>item.row===row)) {
      button.remove();
      jumpButtons.delete(row);
    }
    for(const [index,{row}] of shown.entries()) {
      let button=jumpButtons.get(row);
      if(!button) {
        button=document.createElement('button');
        button.type='button';
        button.onclick=()=>{
          if(row.isConnected) row.scrollIntoView({block:'start',inline:'nearest',behavior:'instant'});
          scheduleReadingJumps();
        };
        jumpButtons.set(row,button);
      }
      const text=row.querySelector('[data-testid="tweetText"],[data-testid="notificationText"]')?.textContent || row.textContent;
      const excerpt=text.trim().replace(/\s+/g,' ').slice(0,72);
      const label=excerpt?`跳到 ${excerpt}`:`跳到第 ${start+index+1} 条`;
      if(button.getAttribute('aria-label')!==label) {
        button.setAttribute('aria-label',label);
        button.title=label;
      }
      if(start+index===active) button.setAttribute('aria-current','true');
      else button.removeAttribute('aria-current');
      if(readingJumps.children[index]!==button) readingJumps.insertBefore(button,readingJumps.children[index] || null);
    }
  }
  function syncWorkspace(path) {
    const feed=pageElement(mainFeed), main=feed?.closest('main') || feed;
    const home=/^\/home(?:\/|$)/.test(path);
    const notifications=isNotifications(path);
    const timeline='[data-testid="tweet"],[data-testid="notification"],[data-testid="cellInnerDiv"],[aria-label^="Timeline:"],[role="feed"],[role="tablist"]';
    const content=`${timeline},[role="region"]`;
    const nextChrome=new Map();
    const tablist=(home || notifications) && main?.querySelector('[role="tablist"]:has([role="tab"]),[data-testid="ScrollSnap-List"]:has([role="tab"])');
    const tabs=[...(tablist?.querySelectorAll?.('[role="tab"]') || [])].filter(tab=>tab.textContent.trim());
    if(tabs.length) nextChrome.set(isolatedBranch(tablist,main,`${content},[data-testid^="tweetTextarea_"],[data-testid="tweetButtonInline"]`),'tabs');
    const editorRoot=main?.querySelector('[data-testid="tweetTextarea_0"]');
    const submit=main?.querySelector('[data-testid="tweetButtonInline"]');
    const inPost='[data-testid="tweet"],[data-testid="sidebarColumn"],[role="dialog"],#layers';
    const editorNode=editorRoot && !editorRoot.closest(inPost)?editorRoot:null;
    const submitNode=submit && !submit.closest(inPost)?submit:null;
    const composerRegions=new Set();
    if(editorNode || submitNode) {
      let seed=editorNode || submitNode;
      if(editorNode && submitNode) {
        for(let parent=editorNode.parentElement;parent && parent!==main;parent=parent.parentElement) {
          if(!parent.contains(submitNode)) continue;
          if(!parent.querySelector(timeline)) seed=parent;
          break;
        }
      }
      const region=isolatedBranch(seed,main,content);
      composerRegions.add(region);
      if(submitNode && !region.contains(submitNode)) composerRegions.add(isolatedBranch(submitNode,main,content));
    }
    if(home && main) {
      const firstRow=main.querySelector('[data-testid="cellInnerDiv"],[data-testid="tweet"]');
      const beforePosts=node=>!node.closest(`${inPost},[role="tablist"]`) &&
        (!firstRow || !!(node.compareDocumentPosition(firstRow)&Node.DOCUMENT_POSITION_FOLLOWING));
      for(const tool of main.querySelectorAll('[data-testid="toolBar"],[data-testid="gifSearchButton"],[data-testid="pollButton"],[data-testid="scheduleOption"],[data-testid="geoButton"],[data-testid="fileInput"]')) {
        if(!beforePosts(tool) || [...composerRegions].some(region=>region.contains(tool))) continue;
        const group=tool.closest('[role="region"]');
        const seed=group && main.contains(group) && !group.querySelector(timeline)?group:tool;
        composerRegions.add(isolatedBranch(seed,main,content));
      }
      // X's lazy composer can render disabled toolbar buttons without editor IDs.
      if(!editorNode && !submitNode) {
        const disabled='button:disabled,button[aria-disabled="true"],[role="button"][aria-disabled="true"]';
        for(const button of main.querySelectorAll(disabled)) {
          if(!beforePosts(button) || !button.querySelector('svg')) continue;
          for(let parent=button.parentElement;parent && parent!==main && !parent.querySelector(timeline);parent=parent.parentElement) {
            if(parent.querySelector(avatarSelector) && parent.querySelectorAll(disabled).length>=4) {
              composerRegions.add(isolatedBranch(parent,main,content));
              break;
            }
          }
          if(composerRegions.size) break;
        }
      }
    }
    for(const region of composerRegions) nextChrome.set(region,'composer');
    const editor=editorNode?.querySelector('textarea,[contenteditable="true"]') || editorNode;
    inlineComposer=editor?{editor,regions:[...composerRegions]}:null;
    syncAccount(composerRegions);
    for(const button of document.querySelectorAll(dockSelector)) {
      if(button.closest('main,header,#xqc-workspace,#xqc-native-panel,[role="dialog"]')) continue;
      const layer=button.closest('#layers > div > div');
      if(layer) {
        if(!layer.querySelector('[role="dialog"],[role="alert"],[data-testid^="tweetTextarea_"]')) nextChrome.set(layer,'dock');
        continue;
      }
      for(let node=button;node && node!==document.body;node=node.parentElement) {
        if(getComputedStyle(node).position!=='fixed') continue;
        if(!node.querySelector('main,header,#layers')) nextChrome.set(node,'dock');
        break;
      }
    }
    syncChrome(nextChrome);
    for(const [tab,button] of tabButtons) if(!tabs.includes(tab)) {
      button.remove();
      tabButtons.delete(tab);
    }
    let selected;
    for(const [index,tab] of tabs.entries()) {
      let button=tabButtons.get(tab);
      if(!button) {
        button=document.createElement('button');
        button.type='button';
        button.onclick=()=>{tab.click();schedulePreviews();};
        tabButtons.set(tab,button);
      }
      const title=tab.textContent.trim();
      if(button.textContent!==title) button.textContent=title;
      if(tab.getAttribute('aria-selected')==='true' || tab.getAttribute('aria-current')==='page') {
        selected=title;
        button.setAttribute('aria-current','page');
      } else button.removeAttribute('aria-current');
      if(timelineTabs.children[index]!==button) timelineTabs.insertBefore(button,timelineTabs.children[index] || null);
    }
    for(const link of workspaceNav.querySelectorAll('a[href="/home"],a[href="/notifications"]')) {
      if((link.pathname==='/home' && home && (!selected || link.closest('.xqc-icon-rail'))) ||
         (link.pathname==='/notifications' && notifications && (!selected || link.closest('.xqc-icon-rail')))) link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    }
    const title=selected || (notifications?'通知':home?'阅读工作区':/\/status\/\d+/.test(path)?'会话详情':'用户资料');
    if(threadTitle.textContent!==title) threadTitle.textContent=title;
  }
  function syncTheme() {
    const path=location.pathname;
    const overlay=isOverlay(path);
    const active=theme==='codex' && (supportedPage() || overlay);
    if(!overlay || !active) pageRoot.toggleAttribute('data-xqc-notifications',active && isNotifications(path));
    if(active!==codexActive()) {
      setAccountOpen(false);
      if(active) {
        pageRoot.dataset.xqcTheme='codex';
        accountMenu.append(themePicker);
      }
      else {
        delete pageRoot.dataset.xqcTheme;
        workspace.append(themePicker);
        resetReadingJumps();
        clearTweetTools();
        syncChrome(new Map());
      }
      workspaceNav.hidden=!active;
      panelTitle.textContent=active?'上下文':'𝕏侧栏';
      host.setAttribute('aria-label',active?'上下文 · 用户主页':'𝕏侧栏 · 用户主页');
      panelClose.title=active?'关闭上下文':'关闭𝕏侧栏';
      panelClose.setAttribute('aria-label',panelClose.title);
      setContextOpen(contextOpen);
      if(position() && !desiredHandle) report(panelHint());
    }
    workspaceNav.inert=active && overlay;
    host.inert=active && (!contextOpen || overlay);
    if(overlay) setAccountOpen(false);
    if(active && !overlay) syncWorkspace(path);
  }
  function setTheme(next) {
    if(next===theme) return;
    let anchor,top;
    if(!isOverlay(location.pathname)) {
      for(const post of mainColumn()?.querySelectorAll('[data-testid="tweet"],[data-testid="notification"]') || []) {
        const rect=post.getBoundingClientRect();
        if(rect.top>=window.innerHeight) break;
        if(rect.bottom<=0) continue;
        if(!anchor || rect.top>=0) {anchor=post;top=rect.top;}
        if(rect.top>=0) break;
      }
    }
    theme=next;
    try {localStorage.setItem(themeKey,theme);} catch {}
    syncTheme();
    if(codexActive()) {
      syncNotificationBadge();
      syncTweetTools();
      syncReadingJumps();
    }
    schedulePreviews();
    if(themeScrollFrame) cancelAnimationFrame(themeScrollFrame);
    if(!anchor) return;
    const path=location.pathname;
    const restore=()=>{
      if(anchor.isConnected && path===location.pathname) window.scrollBy({top:anchor.getBoundingClientRect().top-top,behavior:'instant'});
    };
    restore();
    themeScrollFrame=requestAnimationFrame(()=>{themeScrollFrame=0;restore();});
  }
  function navigateWorkspace(event) {
    if(event.defaultPrevented || event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link=event.target instanceof Element && event.target.closest('a');
    if(!link) return;
    const href=link.getAttribute('href');
    const notificationLink=href==='/notifications' && nativeNotificationLinks()[0];
    const native=(link===accountProfile && nativeProfile) ||
      (notificationLink && (notificationLink.querySelector('a[href]') || notificationLink)) || document.querySelector(`${nativeBanner} a[href="${href}"]`) ||
      (href==='/compose/post' && document.querySelector('[data-testid="SideNav_NewTweet_Button"]'));
    if(link===accountProfile) setAccountOpen(false);
    if(href==='/compose/post' && inlineComposer?.editor?.isConnected) {
      const {regions,editor}=inlineComposer;
      if(!native || (editor.value || editor.textContent).trim() || regions.some(region=>region.querySelector('[data-testid="attachments"]>*'))) {
        event.preventDefault();
        for(const region of regions) region.setAttribute('data-xqc-inline-open','');
        editor.scrollIntoView({block:'center'});
        editor.focus({preventScroll:true});
        return;
      }
    }
    if(!native) return;
    event.preventDefault();
    native.click();
  }
  function clearTweetTools() {
    for(const [post,record] of tweetTools) removeTweetTools(post,record);
    tweetTools.clear();
    syncNotificationRows(new Set());
    syncTimelineFlow(new Set());
  }
  function removeTweetTools(post,record) {
    record.row.remove();
    record.marker.remove();
    record.thumbnail?.remove();
    syncActionIcons(record,null);
    record.group?.removeAttribute('data-xqc-action-row');
    record.avatar?.removeAttribute('data-xqc-avatar-region');
    for(const region of record.regions) delete region.dataset.xqcMediaRegion;
    for(const region of record.photoRegions) delete region.dataset.xqcPhotoRegion;
    delete post.dataset.xqcPhotoPreview;
    delete post.dataset.xqcMediaOpen;
    delete post.dataset.xqcActionsOpen;
  }
  function postPermalink(post) {
    return [...post.querySelectorAll('a[href]:has(time)')].find(link=>
      !link.closest('[data-testid="quoteTweet"]') && link.closest('[data-testid="tweet"]')===post &&
      link.origin===location.origin && /\/status\/\d+\/?$/.test(link.pathname));
  }
  function createIcon(markup,className) {
    const template=document.createElement('template');
    template.innerHTML=markup;
    const svg=template.content.firstElementChild;
    svg.classList.add(className);
    return svg;
  }
  function notificationIcon(row,glyph) {
    const description=[glyph?.getAttribute('aria-label'),glyph?.getAttribute('data-testid'),
      glyph?.querySelector('use')?.getAttribute('href'),glyph?.querySelector('title')?.textContent].join(' ');
    const recognized=notificationKinds.find(([pattern])=>pattern.test(description));
    if(recognized) return recognized[1];
    const text=(row.querySelector('[data-testid="notificationText"]')?.textContent || row.textContent).trim().slice(0,180);
    let first=Infinity,icon=bellIcon;
    for(const [pattern,markup] of notificationKinds) {
      const match=pattern.exec(text);
      if(match && match.index<first) {first=match.index;icon=markup;}
    }
    return icon;
  }
  function syncNotificationRows(seen) {
    for(const row of seen) {
      const glyph=row.querySelector('[data-testid="notificationIcon"] svg,svg[data-testid="notificationIcon"]') ||
        [...row.querySelectorAll('svg:not(.xqc-notification-mark)')].find(svg=>{
          const interactive=svg.closest('a,button,[role="link"],[role="button"]');
          return (!interactive || !row.contains(interactive) || interactive===row) &&
            !svg.closest('[data-testid="tweet"],[data-testid="tweetPhoto"],[data-testid^="UserAvatar-Container"],[data-testid="card.wrapper"]');
        });
      let region=glyph;
      if(glyph) for(let parent=glyph.parentElement;parent && parent!==row;parent=parent.parentElement) {
        if(parent.matches('a,button,[role="link"],[role="button"]') ||
          parent.querySelector('a,button,img,video,[role="link"],[role="button"]') ||
          parent.querySelectorAll('svg').length!==1 || parent.textContent.trim()!==glyph.textContent.trim()) break;
        region=parent;
      }
      const markup=notificationIcon(row,glyph);
      let record=notificationRows.get(row);
      if(!record) {
        record={};
        notificationRows.set(row,record);
        row.setAttribute('data-xqc-notification-row','');
      }
      if(record.region!==region) {
        record.region?.removeAttribute('data-xqc-notification-glyph');
        region?.setAttribute('data-xqc-notification-glyph','');
        record.region=region;
      }
      if(record.markup!==markup) {
        record.icon?.remove();
        record.icon=createIcon(markup,'xqc-notification-mark');
        record.markup=markup;
      }
      if(record.icon.parentElement!==row) row.append(record.icon);
    }
    for(const [row,record] of notificationRows) if(!seen.has(row)) {
      record.region?.removeAttribute('data-xqc-notification-glyph');
      record.icon.remove();
      delete row.dataset.xqcNotificationRow;
      notificationRows.delete(row);
    }
  }
  function syncTimelineFlow(next) {
    for(const node of timelineFlow) if(!next.has(node)) delete node.dataset.xqcTimelineFlow;
    for(const node of next) if(!timelineFlow.has(node)) node.setAttribute('data-xqc-timeline-flow','');
    timelineFlow=next;
  }
  function syncActionIcons(record,group) {
    const seen=new Set();
    for(const control of group?.querySelectorAll(primaryActions) || []) {
      const original=control.querySelector('svg:not(.xqc-action-icon)');
      if(!original) continue;
      seen.add(original);
      let replacement=record.icons.get(original);
      if(!replacement) {
        replacement=createIcon(actionIcons[control.dataset.testid],'xqc-action-icon');
        record.icons.set(original,replacement);
        original.setAttribute('data-xqc-native-action-icon','');
      }
      if(original.nextElementSibling!==replacement) original.after(replacement);
    }
    for(const [original,replacement] of record.icons) if(!seen.has(original)) {
      delete original.dataset.xqcNativeActionIcon;
      replacement.remove();
      record.icons.delete(original);
    }
  }
  function nativePhotos(post) {
    const photos=new Map();
    for(const link of post.querySelectorAll('a[href*="/photo/"]')) {
      if(link.origin!==location.origin || !isPhotoViewer(link.pathname) ||
        link.closest('[data-testid="tweet"]')!==post ||
        link.closest(`${mediaSelector},[data-testid="sensitiveMedia"],[data-testid="sensitiveMediaWarning"]`) ||
        !(link.closest(photoSelector) || link.querySelector(photoSelector))) continue;
      const image=link.querySelector('img');
      const src=image?.currentSrc || image?.getAttribute('src');
      if(!photos.has(link.pathname) || src) photos.set(link.pathname,{link,src,alt:image?.alt || ''});
    }
    return [...photos.values()];
  }
  function syncPhotoPreview(post,record,photos) {
    const first=photos.find(photo=>photo.src);
    if(!first) {
      record.thumbnail?.remove();
      delete post.dataset.xqcPhotoPreview;
      return [];
    }
    const galleryPath=first.link.pathname.replace(/\/photo\/\d+\/?$/,'');
    const gallery=photos.filter(photo=>photo.link.pathname.replace(/\/photo\/\d+\/?$/,'')===galleryPath);
    if(!record.thumbnail) {
      const link=document.createElement('a');
      link.className='xqc-photo-preview';
      link.innerHTML='<img loading="lazy" decoding="async" alt=""><span aria-hidden="true" hidden></span>';
      link.onclick=event=>{
        event.stopPropagation();
        if(event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !record.photoLink?.isConnected) return;
        event.preventDefault();
        record.photoLink.click();
      };
      record.thumbnail=link;
    }
    const link=record.thumbnail;
    const [image,badge]=link.children;
    record.photoLink=first.link;
    if(link.href!==first.link.href) link.href=first.link.href;
    if(image.getAttribute('src')!==first.src) image.src=first.src;
    image.alt=first.alt;
    link.setAttribute('aria-label',gallery.length>1?`查看图片（${gallery.length} 张）`:'查看图片');
    const extra=gallery.length>1?`+${gallery.length-1}`:'';
    if(badge.textContent!==extra) badge.textContent=extra;
    badge.hidden=!extra;
    if(link.parentElement!==post) post.append(link);
    post.setAttribute('data-xqc-photo-preview','');
    return gallery;
  }
  function mediaSpacer(node) {
    const content='a,button,img,picture,video,svg,canvas,iframe,input,textarea,[role="button"],[role="link"],[role="img"],[aria-label],[tabindex]';
    if(!node?.matches('div,span') || node.textContent.trim() || node.matches(content) || node.querySelector(content)) return false;
    let sized=false;
    for(const box of [node,...node.querySelectorAll('div,span')]) {
      const style=getComputedStyle(box);
      if(style.backgroundImage!=='none') return false;
      const proportionalPadding=[box.style.paddingTop,box.style.paddingBottom,box.style.paddingBlockStart,box.style.paddingBlockEnd]
        .some(value=>value.endsWith('%') && parseFloat(value)>0);
      const explicitHeight=[box.style.height,box.style.blockSize,style.minHeight,style.minBlockSize]
        .some(value=>parseFloat(value)>0);
      if(proportionalPadding || explicitHeight || style.aspectRatio!=='auto') sized=true;
    }
    return sized;
  }
  function collapsedMediaRegions(post,nodes,keep,keepOpen) {
    const regions=new Set();
    for(const node of nodes) {
      const quote=node.closest('[data-testid="quoteTweet"]');
      const boundary=quote && post.contains(quote)?quote:post;
      const region=isolatedBranch(node,boundary,keep,keepOpen);
      regions.add(region);
      // A spacer between two media branches can be shared. Leave it in
      // place while the branch on the other side is still visible.
      for(let branch=region;branch!==boundary;branch=branch.parentElement) {
        if(keepOpen.some(other=>branch.contains(other))) break;
        for(const direction of ['previousElementSibling','nextElementSibling']) {
          const sibling=branch[direction];
          if(mediaSpacer(sibling) && !keepOpen.some(other=>sibling.contains(other) || sibling[direction]?.contains(other))) {
            regions.add(sibling);
          }
        }
      }
    }
    return regions;
  }
  function syncTweetTools() {
    const seen=new Set();
    const notifications=new Set();
    const flow=new Set();
    const keep=`[data-testid="tweetText"],[data-testid="tweet-text-show-more-link"],[data-testid="User-Name"],[data-testid="quoteTweet"],[data-testid="caret"],time,.xqc-reply-context,.xqc-tweet-tools,.xqc-photo-preview,${primaryActions}`;
    for(const feed of [pageElement(mainFeed),mount]) {
      for(const post of feed?.querySelectorAll('[data-testid="tweet"],[data-testid="notification"]') || []) {
        if(post.closest('[data-testid="quoteTweet"]')) continue;
        for(let node=post;node!==feed && !flow.has(node);node=node.parentElement) flow.add(node);
        if(post.dataset.testid!=='tweet') {
          if(feed!==mount && pageRoot.hasAttribute('data-xqc-notifications') && !post.closest('[data-testid="tweet"]')) notifications.add(post);
          continue;
        }
        const photos=nativePhotos(post);
        const mediaNodes=[...post.querySelectorAll(mediaSelector)]
          .filter(media=>media.closest('[data-testid="tweet"]')===post && !media.parentElement.closest(mediaSelector));
        const control=[...post.querySelectorAll(primaryActions)].find(button=>button.closest('[data-testid="tweet"]')===post && !button.closest('[data-testid="quoteTweet"]'));
        const group=control?.closest('[role="group"]');
        const actions=group && post.contains(group)?group:null;
        seen.add(post);
        const identity=postPermalink(post)?.pathname || post.querySelector('[data-testid="tweetText"]')?.textContent;
        let record=tweetTools.get(post);
        if(record && record.identity!==identity) {
          removeTweetTools(post,record);
          record=null;
        }
        if(!record) {
          const row=document.createElement('div');
          row.className='xqc-tweet-tools';
          row.innerHTML=`<button type="button" aria-expanded="false">附件</button><button type="button" aria-label="更多" title="更多" aria-expanded="false">${moreIcon}</button>`;
          const [media,more]=row.children;
          for(const [button,attribute,closed,opened] of [[media,'data-xqc-media-open','附件','收起附件'],[more,'data-xqc-actions-open','更多','收起操作']]) {
            button.onclick=event=>{
              event.preventDefault();event.stopPropagation();
              const expanded=post.toggleAttribute(attribute);
              button.setAttribute('aria-expanded',String(expanded));
              const label=expanded?opened:closed;
              if(button===more) {
                button.title=label;
                button.setAttribute('aria-label',label);
              } else button.textContent=label;
              if(!expanded && attribute==='data-xqc-media-open') {
                for(const video of post.querySelectorAll('video')) if(video.closest(mediaSelector)) video.pause();
              }
            };
          }
          record={row,media,more,identity,group:null,regions:new Set(),photoRegions:new Set(),avatar:null,marker:createIcon(postIcon,'xqc-post-mark'),icons:new Map()};
          tweetTools.set(post,record);
        }
        if(record.marker.parentElement!==post) post.append(record.marker);
        const gallery=syncPhotoPreview(post,record,photos);
        const photoLinks=gallery.map(photo=>photo.link);
        const folded=[...mediaNodes,...photoLinks];
        const unproxied=[...photos.filter(photo=>!gallery.includes(photo)).map(photo=>photo.link),
          ...[...post.querySelectorAll(photoSelector)].filter(photo=>
            photo.closest('[data-testid="tweet"]')===post && !folded.some(node=>photo.contains(node) || node.contains(photo)))];
        const photoRegions=collapsedMediaRegions(post,photoLinks,keep,[...mediaNodes,...unproxied]);
        // When everything is folded, hide their shared sizing wrapper as
        // well. Expanding attachments restores it but keeps photos folded.
        const regions=mediaNodes.length?collapsedMediaRegions(post,folded,keep,unproxied):new Set();
        for(const region of record.photoRegions) if(!photoRegions.has(region)) delete region.dataset.xqcPhotoRegion;
        for(const region of photoRegions) if(!record.photoRegions.has(region)) region.setAttribute('data-xqc-photo-region','');
        record.photoRegions=photoRegions;
        if(record.group!==actions) {
          record.group?.removeAttribute('data-xqc-action-row');
          actions?.setAttribute('data-xqc-action-row','');
          record.group=actions;
        }
        syncActionIcons(record,actions);
        for(const region of record.regions) if(!regions.has(region)) delete region.dataset.xqcMediaRegion;
        for(const region of regions) if(!record.regions.has(region)) region.setAttribute('data-xqc-media-region','');
        record.regions=regions;
        const avatarNode=post.querySelector(avatarSelector);
        const avatar=avatarNode && !avatarNode.closest('[data-testid="User-Name"],[data-testid="quoteTweet"]')?
          isolatedBranch(avatarNode,post,`${keep},${mediaSelector},${photoSelector}`):null;
        if(record.avatar!==avatar) {
          record.avatar?.removeAttribute('data-xqc-avatar-region');
          if(avatar) avatar.setAttribute('data-xqc-avatar-region','');
          record.avatar=avatar;
        }
        record.media.hidden=!regions.size;
        record.more.hidden=!actions;
        if(regions.size && !post.hasAttribute('data-xqc-media-open')) {
          for(const video of post.querySelectorAll('video')) if(!video.paused && video.closest(mediaSelector)) video.pause();
        }
        if(actions) {
          if(record.row.parentElement!==actions) actions.append(record.row);
          continue;
        }
        if(!regions.size) {
          record.row.remove();
          continue;
        }
        const text=[...post.querySelectorAll('[data-testid="tweetText"]')].find(node=>
          node.closest('[data-testid="tweet"]')===post && !node.closest('[data-testid="quoteTweet"]'));
        const textEnd=text?.nextElementSibling?.matches('.xqc-reply-context')?text.nextElementSibling:text;
        let anchor=textEnd || regions.values().next().value;
        const interactive=anchor.parentElement.closest('a,button,[role="link"],[role="button"]');
        if(interactive && interactive!==post && post.contains(interactive)) anchor=interactive;
        if(record.row.parentElement!==anchor.parentElement) {
          if(textEnd) anchor.after(record.row);
          else anchor.before(record.row);
        }
      }
    }
    syncTimelineFlow(flow);
    syncNotificationRows(notifications);
    for(const [post,record] of tweetTools) if(!seen.has(post)) {
      removeTweetTools(post,record);
      tweetTools.delete(post);
    }
  }
  function pauseCollapsedVideo(event) {
    if(!codexActive() || !(event.target instanceof HTMLVideoElement)) return;
    const video=event.target;
    const post=video.closest('[data-testid="tweet"]');
    if(post?.closest(`${mainFeed},#xqc-native-panel .xqc-root`) && !post.hasAttribute('data-xqc-media-open') && video.closest(mediaSelector)) video.pause();
  }
  function clearPreviews() {
    for(const {card} of previewCards.values()) card.remove();
    previewCards.clear();
  }
  function syncPreviews() {
    if(disposed) return;
    // X keeps the notification timeline mounted behind overlays while
    // changing the URL. Preserve its row heights until the modal closes so
    // native scroll restoration uses the same layout it saved on entry.
    if(isOverlay(location.pathname) &&
      [...previewCards.keys()].some(article=>article.isConnected)) return;
    const notifications=isNotifications(location.pathname);
    const main=(notifications || (codexActive() && !nativeNotificationLinks().length))?mainColumn():null;
    let store;
    for(let fiber=main && fiberOf(main);fiber;fiber=fiber.return) {
      const value=fiber.memoizedProps?.value;
      const candidate=value?.store || value;
      if(!store && typeof candidate?.getState==='function' && typeof candidate?.subscribe==='function') {
        try {if(candidate.getState()?.entities?.tweets?.entities) store=candidate;} catch {}
      }
    }
    if(store!==previewStore) {
      unlistenPreviews?.();previewStore=store;
      unlistenPreviews=store?.subscribe(schedulePreviews);
    }
    if(!notifications) {
      clearPreviews();
      return;
    }
    let state;
    try {state=store?.getState();} catch {}
    const tweets=state?.entities?.tweets?.entities;
    const seen=new Set();
    for(const article of main?.querySelectorAll('[data-testid="tweet"]') || []) {
      if(host.contains(article)) continue;
      const timestamp=postPermalink(article);
      const id=timestamp?.pathname.match(/\/status\/(\d+)\/?$/)?.[1];
      const reply=id && tweets?.[id],parentId=reply?.in_reply_to_status_id_str;
      if(typeof parentId!=='string' || !/^\d+$/.test(parentId) || parentId===id) continue;

      const parent=tweets[parentId];
      const available=parent && !parent.isDeleted && !parent.tombstoneInfo;
      const label='原帖';
      const text=available && (parent.note_tweet?.text || parent.full_text || parent.text);
      const media=available && (parent.extended_entities?.media || parent.entities?.media) || [];
      let summary=typeof text==='string'?text:'';
      for(const item of media) if(item.url) summary=summary.replace(item.url,'');
      summary=summary.replace(/\s+/g,' ').trim();
      const photos=media.filter(item=>item.type==='photo').length;
      const mediaLabel=[photos?'图片 '+photos+' 张':'',media.some(item=>item.type==='video')?'视频':'',media.some(item=>item.type==='animated_gif')?'GIF':''].filter(Boolean).join(' · ');
      if(!summary && !mediaLabel) continue;
      seen.add(article);
      const excerpt=[summary.slice(0,600),mediaLabel].filter(Boolean).join(' · ');
      const signature=JSON.stringify([id,parentId,excerpt]);
      let record=previewCards.get(article);
      if(!record) {
        const card=document.createElement('div');card.className='xqc-reply-context';
        record={card};previewCards.set(article,record);
      }
      if(record.signature!==signature) {
        const labelNode=document.createElement('span');labelNode.className='xqc-reply-label';labelNode.textContent=label+'：';
        const body=document.createElement('span');body.className='xqc-reply-text';body.textContent=excerpt;
        record.card.replaceChildren(labelNode,body);
        record.signature=signature;
      }
      if(!article.contains(record.card)) {
        const textNode=[...article.querySelectorAll('[data-testid="tweetText"]')].find(node=>
          node.closest('[data-testid="tweet"]')===article && !node.closest('[data-testid="quoteTweet"]'));
        if(textNode && !textNode.closest('a')) textNode.after(record.card);
        else article.append(record.card);
      }
    }
    for(const [article,record] of previewCards) if(!seen.has(article)) {
      record.card.remove();previewCards.delete(article);
    }
  }
  let loadSerial = 0;
  const firstRetryMs = 3000, finalWaitMs = 4000;
  const report = message => { status.hidden = false; status.textContent = message; };
  const hasPosts = () => {
    const tweet=mount.querySelector('[data-testid="tweet"]');
    // Profile placeholders and error screens may contain an article. Only a
    // newly rendered tweet means the timeline has actually produced posts.
    return !!tweet && (!baselineTweet || tweet!==baselineTweet || tweet.textContent!==baselineText);
  };
  function finishLoading(handle, serial) {
    if (disposed || nativeError || serial!==loadSerial || handle!==desiredHandle) return;
    loadedHandle=handle;
    pendingHandle=failedHandle=undefined;
    status.hidden=true;
    host.classList.remove('xqc-stalled');
    clearTimeout(timeout);
  }
  function syncLikeState() {
    let tweets;
    try { tweets=tweetStore?.getState?.()?.entities?.tweets?.entities; }
    catch { return; }
    if (!tweets) return;
    // The cloned timeline can miss a redraw after X updates its shared store.
    for (const button of mount.querySelectorAll('[data-testid="like"],[data-testid="unlike"]')) {
      const tweet=button.closest('[data-testid="tweet"]');
      const href=tweet?.querySelector('a[href*="/status/"]')?.getAttribute('href');
      const id=href?.match(/\/status\/(\d+)/)?.[1];
      button.classList.toggle('xqc-liked-from-store', !!id && tweets[id]?.favorited===true && button.getAttribute('data-testid')==='like');
    }
  }
  function scheduleLikeSync() {
    if (disposed || likeFrame) return;
    likeFrame=requestAnimationFrame(()=>{likeFrame=0;syncLikeState();});
  }
  function showStalled(handle) {
    pendingHandle=undefined;
    host.classList.add('xqc-stalled');
    report('帖子暂未加载出来。');
    const retry = document.createElement('button');
    retry.type = 'button'; retry.textContent = '重试侧栏';
    retry.onclick = () => { if (!disposed) void restart(handle); };
    const native = document.createElement('a');
    native.href = '/' + handle; native.target = '_blank'; native.rel = 'noopener noreferrer';
    native.textContent = '在 X 中打开';
    status.append(document.createElement('br'), retry, document.createTextNode(' · '), native);
  }
  function watchPosts(handle, serial, retried) {
    clearTimeout(timeout);
    timeout=setTimeout(()=>{
      if (disposed || nativeError || serial !== loadSerial) return;
      if (hasPosts()) { finishLoading(handle,serial); return; }
      if (retried) showStalled(handle);
      else void restart(handle);
    },retried?finalWaitMs:firstRetryMs);
  }
  async function restart(handle) {
    if (disposed || handle !== desiredHandle) return;
    nativeError = undefined;
    clearTimeout(timeout); observer?.disconnect(); unlistenTweets?.();
    if (likeFrame) cancelAnimationFrame(likeFrame);
    likeFrame=0; tweetStore=unlistenTweets=undefined;
    root?.unmount(); memory?.destroy?.();
    root = secondary = memory = observer = ready = undefined;
    loadedHandle=pendingHandle=failedHandle=baselineTweet=baselineText=undefined;
    await open(handle, true);
  }
  function captureError(error, info) {
    if (disposed) return;
    clearTimeout(timeout);
    pendingHandle=undefined;
    nativeError = ['原生组件异常（v'+version+'）', String(error?.message || error).slice(0,1800),
      String(error?.stack || '').slice(0,2800), String(info?.componentStack || '').slice(0,2800)]
      .filter(Boolean).join('\n\n');
    report(nativeError);
  }
  const clean = () => {
    disposed = true; clearTimeout(timeout);
    previewObserver.disconnect();unlistenPreviews?.();
    if(previewFrame) cancelAnimationFrame(previewFrame);
    if(themeScrollFrame) cancelAnimationFrame(themeScrollFrame);
    window.removeEventListener('popstate',schedulePreviews);clearPreviews();
    window.navigation?.removeEventListener('currententrychange',schedulePreviews);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('click', onPanelLink);
    document.removeEventListener('click', closeAccountFromOutside);
    document.removeEventListener('keydown', closeAccountOnEscape);
    document.removeEventListener('scroll', scheduleReadingJumps,true);
    document.removeEventListener('play',pauseCollapsedVideo,true);
    window.removeEventListener('resize', position);
    window.removeEventListener('resize', scheduleReadingJumps);
    layerObserver.disconnect(); observer?.disconnect(); unlistenTweets?.();
    if (likeFrame) cancelAnimationFrame(likeFrame);
    root?.unmount(); memory?.destroy?.(); restoreNavigationConfig?.();
    clearTweetTools();resetReadingJumps();syncChrome(new Map());delete pageRoot.dataset.xqcTheme;delete pageRoot.dataset.xqcNotifications;
    host.remove();workspace.remove();style.remove();delete window[key];
  };
  window[key] = clean;
  panelClose.onclick = () => {
    if(!codexActive()) return clean();
    setContextOpen(false);
    contextButtons[0].focus({preventScroll:true});
  };
  themeSelect.onchange=()=>setTheme(themeSelect.value);
  accountToggle.onclick=()=>setAccountOpen(accountMenu.hidden);
  accountAvatar.onerror=()=>{accountAvatar.hidden=true;};
  workspaceNav.onclick=navigateWorkspace;
  for(const button of contextButtons) button.onclick=()=>setContextOpen(!contextOpen);
  host.querySelector('[aria-label="重新加载侧栏"]').onclick = () => {
    if (desiredHandle) void restart(desiredHandle);
    else report(panelHint());
  };
  function pageElement(selector) {
    return [...document.querySelectorAll(selector)].find(node =>
      !host.contains(node) && node.getBoundingClientRect().width > 0);
  }
  function mainColumn() {
    // A comma selector picks document order, not selector priority. On legacy X,
    // main contains BOTH primaryColumn and sidebarColumn.
    return pageElement('[data-testid="primaryColumn"]') || pageElement('main');
  }
  let widthWarning = false;
  function position() {
    if(codexActive()) {
      host.style.width='var(--xqc-context-width)';
      widthWarning=false;
      return true;
    }
    const primary = pageElement('[data-testid="primaryColumn"]');
    const sidebar = pageElement('[data-testid="sidebarColumn"]') || pageElement('main aside');
    const edge = primary?.getBoundingClientRect().right ??
      sidebar?.getBoundingClientRect().left ?? mainColumn()?.getBoundingClientRect().right;
    const available = edge == null ? 0 : document.documentElement.clientWidth - edge;
    if (available < 280) {
      host.style.width = 'min(380px, 95vw)';
      widthWarning = true;
      report('右侧空间不足。请缩小浏览器缩放比例，使主栏右侧至少留出 280px。');
      return false;
    }
    host.style.width = `${available}px`;
    if (widthWarning) { widthWarning = false; report('右侧空间已恢复。请点击用户头像。'); }
    return true;
  }
  window.addEventListener('resize', position);
  function fiberOf(node) {
    const name = Object.keys(node).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactContainer$'));
    return name && node[name];
  }
  function runtime() {
    const chunks = window.webpackChunk_twitter_responsive_web;
    if (!Array.isArray(chunks)) throw Error('没有找到 responsive-web 运行时。当前 X 页面可能切换了版本。');
    let req;
    const chunk = [['xqc-'+Date.now()+'-'+Math.random()],{},r=>{req=r;}];
    chunks.push(chunk);
    const index = chunks.indexOf(chunk);
    if (index >= 0) chunks.splice(index,1);
    if (!req?.m) throw Error('没有找到 X 模块表。');
    // Module numbers can change on X deployments. These signatures identify
    // the actual implementations without loading every module in the bundle.
    const signatures={
      react:['react.transitional.element','createContext','useState'],
      dom:['react.dev/errors/','createRoot','hydrateRoot'],
      router:['MemoryRouter','Switch','Router-History'],
      history:['createMemoryHistory','createBrowserHistory','createHashHistory'],
      redux:['react-redux-context','notifyNestedSubs','getServerState'],
      location:['safeParseQuery','URIError','URLSearchParams'],
      nativeHistory:['RichHistory','goBackThroughModals','initialRwebLocationKey'],
      modalContext:['createContext({isModal:!1})'],
      navigationConfig:['_renderSideNav','sideNavWrapper','configMounted','Configure']
    };
    const found=Object.fromEntries(Object.keys(signatures).map(name=>[name,[]]));
    for (const [id, factory] of Object.entries(req.m)) {
      if (typeof factory !== 'function') continue;
      const source=Function.prototype.toString.call(factory);
      for (const [name, markers] of Object.entries(signatures)) {
        if (markers.every(marker=>source.includes(marker))) found[name].push(id);
      }
    }
    for (const [name, ids] of Object.entries(found)) {
      if (ids.length !== 1) throw Error(`无法定位 X ${name} 模块（找到 ${ids.length} 个）。`);
    }
    const React=req(found.react[0]), DOM=req(found.dom[0]), Router=req(found.router[0]), History=req(found.history[0]), NativeLocation=req(found.location[0]).A, NativeHistory=req(found.nativeHistory[0]).Ay;
    if (!React.createElement || !DOM.createRoot || !Router.Switch || !Router.Router || !History.createMemoryHistory || !NativeLocation?.createLocation || !NativeLocation.safeParseQuery || !NativeHistory?.push || !NativeHistory?.listen) {
      throw Error('X 运行时模块形状不匹配，未挂载第二页面。');
    }
    const Navigation=req(found.navigationConfig[0]).default;
    const ModalContext=req(found.modalContext[0]).A;
    if(!ModalContext?.Provider) throw Error('无法隔离 X 弹窗配置上下文。');
    if(typeof Navigation?.Configure!=='function') throw Error('无法隔离 X 导航配置，未挂载侧栏。');
    // Resolve the real Provider by behavior, not its minified export name.
    const storeProviders=Object.values(req(found.redux[0])).filter(value=>{
      if(typeof value!=='function') return false;
      const source=Function.prototype.toString.call(value);
      return ['getServerState','notifyNestedSubs','tryUnsubscribe','children'].every(marker=>source.includes(marker));
    });
    if(storeProviders.length!==1) throw Error('无法定位 X 状态 Provider，未挂载侧栏。');
    return {React, DOM, Router, History, NativeLocation, NativeHistory, Navigation, ModalContext, StoreProvider:storeProviders[0]};
  }
  function isolateNavigationConfig(React, Navigation) {
    if (restoreNavigationConfig) return;
    sidebarScope=React.createContext(false);
    const original=Navigation.Configure;
    // X's Configure registers in a module-level queue, outside React context
    // and Redux. A second profile can become its first entry when the main
    // route remounts, supplying @profile to the native navigation's Post link.
    // Suppress registration only in our root; native pages keep their config.
    function ScopedConfigure(props) {
      const inSidebar=React.useContext(sidebarScope);
      return inSidebar ? props.children ?? null : React.createElement(original,props);
    }
    Navigation.Configure=ScopedConfigure;
    if(Navigation.Configure!==ScopedConfigure) throw Error('X 导航配置不可隔离，未挂载侧栏。');
    restoreNavigationConfig=()=>{
      if(Navigation.Configure===ScopedConfigure) Navigation.Configure=original;
      restoreNavigationConfig=undefined;
    };
  }
  function createNativeMemoryHistory(History, NativeLocation, initialPath) {
    const history=History.createMemoryHistory({initialEntries:[initialPath]});
    // Keep all modal metadata local: never borrow the main page's RichHistory.
    const modalEntries=new Map();
    let interceptors=[], revision=0;
    const enrich=()=>{
      history.location.query=NativeLocation.safeParseQuery(history.location.search);
      const keys=new Set(history.entries.map(entry=>entry.key));
      for(const key of modalEntries.keys()) if(!keys.has(key)) modalEntries.delete(key);
    };
    enrich();
    const unlisten=history.listen(enrich);
    const metadata=location=>{
      if(!modalEntries.has(location.key)) modalEntries.set(location.key,{});
      return modalEntries.get(location.key);
    };
    history.setModalRoute=(location,isModal)=>{metadata(location).isModal=!!isModal;};
    history.setModalRouteBreakpoint=location=>{metadata(location).breakpoint=true;};
    history.getIsModalRoute=()=>!!modalEntries.get(history.location.key)?.isModal;
    const lastNonModal=respectBreakpoint=>{
      for(let index=history.index;index>=0;index--) {
        const meta=modalEntries.get(history.entries[index].key);
        if((respectBreakpoint && meta?.breakpoint) || !meta?.isModal) return index;
      }
      return -1;
    };
    for(const [method,asPath] of [['getLastNonModalLocationPath',true],['getLastNonModalLocationPathname',false]]) {
      history[method]=fallback=>{
        const index=lastNonModal(false);
        if(history.index===0 || index<0 || index===history.index) return fallback;
        const entry=history.entries[index];
        return asPath?NativeLocation.createPath(entry):entry.pathname;
      };
    }
    history.addInterceptor=interceptor=>{
      interceptors.push(interceptor);
      return {remove:()=>{interceptors=interceptors.filter(item=>item!==interceptor);}};
    };
    history.getInterceptors=()=>interceptors;
    history.removeAllInterceptors=()=>{interceptors=[];};
    for(const method of ['push','replace']) {
      const original=history[method];
      history[method]=(path,state)=>{
        const previous=history.location;
        const next=NativeLocation.createLocation(path,state);
        const currentRevision=revision;
        if(!interceptors.every(item=>item.shouldProceed(next,method.toUpperCase())) || currentRevision!==revision) return;
        revision++;
        next.state={...next.state,fromApp:true,previousPath:NativeLocation.createPath(previous),
          ...(method==='replace'?{isReplace:true}:{})};
        return original(next);
      };
    }
    history.goBack=(options={})=>{
      const {backLocation=initialPath,onGoBack,shouldReplaceOnFallback}=options;
      const navigate=()=>history.index>0?history.go(-1):
        history[shouldReplaceOnFallback?'replace':'push']({pathname:backLocation,state:{usedFallback:true}});
      return onGoBack?onGoBack(navigate):navigate();
    };
    history.goBackThroughModals=({fallbackPath=initialPath}={})=>{
      const index=lastNonModal(true);
      if(history.index===0 || index===history.index) return history.goBack({backLocation:fallbackPath});
      return index<0?history.push(fallbackPath):history.go(index-history.index);
    };
    const originalHref=history.createHref;
    history.createHref=path=>originalHref(NativeLocation.createLocation(path));
    history.destroy=()=>{unlisten();modalEntries.clear();interceptors=[];};
    return history;
  }
  function findRoutes(React, Router) {
    const main=mainColumn();
    const leaf=main && fiberOf(main);
    if (!leaf) throw Error('未找到主栏的 React Fiber（responsive-web）。');
    const ancestry=[];for(let f=leaf;f;f=f.return) ancestry.push(f);
    const providers=[];
    for(const f of ancestry) {
      const type=f.type, context=type?._context || type;
      const isProvider=type?.$$typeof===Symbol.for('react.provider') ||
        (type?.$$typeof===Symbol.for('react.context') && Object.hasOwn(f.memoizedProps||{},'value'));
      if (isProvider && context!==Router.__RouterContext && context!==Router.__HistoryContext) {
        providers.push([type,f.memoizedProps.value]);
      }
    }
    const candidates=[], allPaths=new Set();
    const examine=f=>{
      if (f.type!==Router.Switch) return;
      const children=React.Children.toArray(f.memoizedProps?.children);
      const routes=children.filter(child=>React.isValidElement(child)&&child.props.path);
      for(const r of routes) for(const p of [].concat(r.props.path)) allPaths.add(String(p));
      const profile=routes.some(child=>{
        try {
          const match=Router.matchPath('/XqcProbeUser',{...child.props,exact:true});
          return match && Object.values(match.params).includes('XqcProbeUser');
        } catch {return false;}
      });
      if (profile) candidates.push({fiber:f,children,score:ancestry.includes(f)?100:0});
    };
    const top=ancestry[ancestry.length-1], current=top?.stateNode?.current || top;
    const stack=[current]; let count=0;
    while(stack.length && count++<40000) {
      const f=stack.pop(); if(!f)continue; examine(f);
      if(f.sibling)stack.push(f.sibling); if(f.child)stack.push(f.child);
    }
    const chosen=candidates.sort((a,b)=>b.score-a.score)[0];
    if(!chosen) {
      throw Error('未发现包含主页的原生 Switch。已扫描 '+count+' 个组件；路由：'+
        ([...allPaths].slice(0,18).join('、')||'无可识别路径'));
    }
    return {children:chosen.children,providers};
  }
  async function initialize(handle) {
    const {React, DOM, Router, History, NativeLocation, NativeHistory, Navigation, ModalContext, StoreProvider}=runtime();
    const {children,providers}=findRoutes(React,Router);
    if(disposed)return;
    isolateNavigationConfig(React,Navigation);
    tweetStore=providers.map(([,value])=>value?.store || value).find(store=>{
      try {return typeof store?.getState==='function' && typeof store?.subscribe==='function' && !!store.getState()?.entities?.tweets?.entities;}
      catch {return false;}
    });
    unlistenTweets=tweetStore?.subscribe(scheduleLikeSync);
    memory=createNativeMemoryHistory(History,NativeLocation,'/'+handle);
    // Compose must be owned by AppShell: its header, dismiss flow, and submit
    // controls depend on the primary route/modal providers. Never mount a second
    // composer in the copied route tree or copy/call a submit handler ourselves.
    for(const method of ['push','replace']) {
      const navigate=memory[method];
      memory[method]=(path,state)=>{
        const next=NativeLocation.createLocation(path,state);
        if(!isCompose(next.pathname) && !(codexActive() && isPhotoViewer(next.pathname))) return navigate(path,state);
        // Always push in the main router so native dismissal has a return entry.
        NativeHistory.push(next);
        // Keep the profile mounted and visible beneath X's modal backdrop.
        // display:none causes native timeline measurement/virtualization churn.
        if(isCompose(next.pathname) && !isCompose(NativeHistory.location.pathname)) report('X 尚未打开回复窗口，请处理页面上的提示后重试。');
      };
    }
    secondary={navigate:({to})=>memory.push(to)};
    let element=React.createElement(Router.Router,{history:memory},
      React.createElement(Router.Switch,null,children));
    const storeContexts=new Set();
    for(const [type,value] of providers) {
      if(type===ModalContext || type._context===ModalContext) continue;
      if(value?.store && typeof value.subscription?.addNestedSub==='function') {
        const context=type._context || type;
        if(storeContexts.has(context)) continue;
        storeContexts.add(context);
        // A copied connect() subscription stops notifying when its main-page
        // owner unmounts. Subscribe directly through X's own Redux Provider;
        // keep the same store, but own this root's subscription and cleanup.
        element=React.createElement(StoreProvider,{store:value.store,context,
          stabilityCheck:value.stabilityCheck,noopCheck:value.noopCheck},element);
        continue;
      }
      // X's app context also carries the main page history. The copied profile
      // must see the same sidebar history as React Router.
      const scopedValue=value?.history===NativeHistory?{...value,history:memory}:value;
      element=React.createElement(type,{value:scopedValue},element);
    }
    // Cached references to the original Configure bypass property replacement.
    // X's own modal guard also suppresses those global registrations.
    element=React.createElement(ModalContext.Provider,{value:{isModal:true}},element);
    class Boundary extends React.Component {
      state={failed:false};
      static getDerivedStateFromError(){return {failed:true};}
      componentDidCatch(error,info){captureError(error,info);}
      render(){return this.state.failed?null:this.props.children;}
    }
    observer=new MutationObserver(()=>{
      scheduleLikeSync();
      if(codexActive()) schedulePreviews();
      if(!status.hidden && !nativeError && hasPosts()) finishLoading(desiredHandle,loadSerial);
    });
    observer.observe(mount,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['href','src','srcset']});
    // React 19 reports errors caught by nested X boundaries here, even if X
    // discards the Error object and only renders its generic fallback screen.
    root=DOM.createRoot(mount,{onCaughtError:captureError,onUncaughtError:captureError});
    root.render(React.createElement(sidebarScope.Provider,{value:true},
      React.createElement(Boundary,null,element)));
  }

  async function open(handle, retried = false) {
    if(nativeError){report(nativeError);return;}
    if (!position()) return;
    if (!retried && pendingHandle===handle) return;
    if (!retried && desiredHandle===handle && (host.classList.contains('xqc-stalled') || failedHandle===handle)) {
      return restart(handle);
    }
    if (!retried && loadedHandle===handle && memory?.location.pathname==='/'+handle && mount.querySelector('[data-testid="tweet"]')) {
      status.hidden=true;
      return;
    }
    baselineTweet=mount.querySelector('[data-testid="tweet"]');
    baselineText=baselineTweet?.textContent;
    loadedHandle=undefined;
    pendingHandle=handle;
    failedHandle=undefined;
    host.classList.remove('xqc-stalled');
    desiredHandle = handle;
    const serial = ++loadSerial;
    report((retried?'正在重试 @':'正在加载 @')+handle+' 的原生主页…');
    watchPosts(handle, serial, retried);
    try {
      if (!ready) ready = initialize(handle);
      await ready; if (disposed || serial!==loadSerial) return;
      if(memory.location.pathname!=='/'+desiredHandle) secondary.navigate({to:'/'+desiredHandle});
      if(hasPosts()) finishLoading(handle,serial);
    } catch(error) {
      if (disposed || serial!==loadSerial) return;
      clearTimeout(timeout);
      pendingHandle=undefined; failedHandle=handle;
      report('实验未成功：'+error.message+'\n关闭即可恢复；请把这段提示发给我。');
    }
  }
  function onClick(event) {
    if (disposed || !supportedPage() ||
        !(event.target instanceof Element) || event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target=event.target, link=target.closest('a[href]');
    if(host.contains(target)) return;
    if (!target.closest('main, [data-testid="primaryColumn"]') || !link) return;
    const byName=codexActive() && target.closest('[data-testid="User-Name"]');
    if (!byName && !target.closest(avatarSelector) && !link.querySelector(avatarSelector)) return;
    const url=new URL(link.href), handle=url.pathname.match(/^\/([a-z0-9_]{1,15})(?:\/photo)?\/?$/i)?.[1];
    if (url.origin!==location.origin || !handle) return;
    event.preventDefault();event.stopImmediatePropagation();
    if(codexActive()) setContextOpen(true);
    void open(handle);
  }
  function onPanelLink(event) {
    // Bubble after React: Link handlers preserve location.state and cancel the
    // default. Only plain anchors still need a memory-history fallback.
    if(disposed || event.defaultPrevented || event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
    const link=event.target.closest('a[href]');
    if(!link || !host.contains(link) || !memory || link.hasAttribute('download') || (link.target && link.target!=='_self')) return;
    const url=new URL(link.href);
    if(url.origin!==location.origin) return;
    event.preventDefault();
    memory.push(url.pathname+url.search+url.hash);
  }
  document.addEventListener('click', onPanelLink);
  document.addEventListener('click', onClick, true);
  document.addEventListener('click', closeAccountFromOutside);
  document.addEventListener('keydown', closeAccountOnEscape);
  document.addEventListener('scroll', scheduleReadingJumps,{capture:true,passive:true});
  document.addEventListener('play',pauseCollapsedVideo,true);
  previewObserver.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['href','src','srcset','aria-selected','aria-label']});
  window.addEventListener('popstate',schedulePreviews);
  window.addEventListener('resize',scheduleReadingJumps);
  window.navigation?.addEventListener('currententrychange',schedulePreviews);
  syncTheme();
  schedulePreviews();
  if(position()) report(panelHint());
})();
