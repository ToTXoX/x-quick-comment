(() => {
  'use strict';
  const key = '__xQuickComment';
  if (window[key]) { window[key](); return; }
  const reservedPaths = new Set(['explore','search','messages','settings','compose','i','grok','premium','jobs','communities','connect','bookmarks','lists','login','signup']);
  function supportedPage() {
    if (/^\/(?:notifications|home)(?:\/|$)/.test(location.pathname)) return true;
    const match=location.pathname.match(/^\/([a-z0-9_]{1,15})(?:\/(?:with_replies|media|highlights|articles|likes|status\/\d+))?\/?$/i);
    return !!match && !reservedPaths.has(match[1].toLowerCase());
  }
  if (location.origin !== 'https://x.com' || !supportedPage()) {
    alert('请打开 X 页面后，再点击书签开启侧边栏'); return;
  }
  const host = document.createElement('section');
  host.id = 'xqc-native-panel';
  host.setAttribute('aria-label','𝕏侧栏 · 用户主页');
  const version = '3.11';
  host.dataset.version=version;
  host.innerHTML = `<header><div class="xqc-brand"><span class="xqc-mark" aria-hidden="true"><svg viewBox="0 0 64 64" width="25" height="25" fill="none"><rect x="6" y="9" width="52" height="46" rx="8" stroke="currentColor" stroke-width="5"/><path d="M23 11v42" stroke="currentColor" stroke-width="5"/><path d="M33 23h15M33 33h15M33 43h10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg></span><div><strong>𝕏侧栏</strong><span class="xqc-caption">整页刷新需要重新点击书签，开启侧边栏</span></div></div><div class="xqc-actions"><button type="button" aria-label="重新加载侧栏" title="重新加载侧栏">↻</button><button type="button" aria-label="关闭𝕏侧栏" title="关闭𝕏侧栏">×</button></div></header><p role="status" aria-live="polite"></p><div class="xqc-root"></div><footer class="xqc-footer" aria-label="相关链接"><div class="xqc-footer-note"><span class="xqc-version">v${version}</span><span>· 动态书签自动获取更新</span></div><div class="xqc-footer-links"><a class="xqc-update" href="https://x.usdts.de/" target="_blank" rel="noopener noreferrer" aria-label="更新主页" title="更新主页"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M13 3h8v8M21 3l-10 10"/></svg></a><a class="xqc-repo" href="https://github.com/ToTXoX/x-quick-comment" target="_blank" rel="noopener noreferrer" aria-label="GitHub 仓库" title="GitHub 仓库"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3"/><path d="M15 22v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 4.77 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-7 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 18.13V22"/></svg></a><a href="https://x.com/yygqdkqk" target="_blank" rel="noopener noreferrer" aria-label="dk021 的 X 主页" title="dk021 的 X 主页"><span aria-hidden="true">𝕏</span></a></div></footer>`;
  const style = document.createElement('style');
  // X portals live outside this panel; keep native menus/dialogs above it.
  // Removing this style on cleanup restores the original layering.
  style.textContent = `#layers{z-index:101!important}#xqc-native-panel{position:fixed;top:0;bottom:0;right:0;width:var(--xqc-width,380px);z-index:100;background:Canvas;color:CanvasText;border-left:1px solid color-mix(in srgb,CanvasText 12%,transparent);box-shadow:-12px 0 48px #00000007;scrollbar-width:thin;scrollbar-color:#88888866 transparent;overflow:auto;overscroll-behavior:contain;color-scheme:light dark;padding-bottom:48px}#xqc-native-panel>header{display:flex;justify-content:space-between;align-items:center;padding:24px 20px 12px;min-height:38px;gap:12px;position:sticky;top:0;background:Canvas;z-index:5;font:14px system-ui;border-bottom:1px solid color-mix(in srgb,CanvasText 9%,transparent)}#xqc-native-panel>p{margin:20px;padding:18px 20px;border:1px solid color-mix(in srgb,CanvasText 10%,transparent);border-radius:14px;background:color-mix(in srgb,CanvasText 3%,Canvas);white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.8 system-ui}#xqc-native-panel>p button{margin-top:10px;padding:4px 10px;border:1px solid currentColor;border-radius:8px;background:transparent;color:inherit;cursor:pointer}#xqc-native-panel>p a{color:inherit}#xqc-native-panel .xqc-brand{display:flex;align-items:center;gap:11px}#xqc-native-panel .xqc-mark{width:26px;height:26px;display:grid;place-items:center;color:CanvasText}#xqc-native-panel .xqc-brand strong{display:block;font-size:15px;letter-spacing:1px}#xqc-native-panel .xqc-actions{display:flex;flex-shrink:0;gap:6px}#xqc-native-panel .xqc-caption{display:block;margin-top:3px;font-size:11px;letter-spacing:.3px;opacity:.55}#xqc-native-panel .xqc-actions button{display:grid;place-items:center;flex-shrink:0;width:32px;height:32px;padding:0;border:1px solid color-mix(in srgb,CanvasText 12%,transparent);border-radius:50%;background:transparent;color:inherit;font:23px/1 system-ui;cursor:pointer}#xqc-native-panel .xqc-actions button:hover{background:color-mix(in srgb,CanvasText 7%,Canvas)}#xqc-native-panel .xqc-actions button:focus-visible{outline:2px solid CanvasText;outline-offset:3px}#xqc-native-panel .xqc-footer{position:fixed;right:0;bottom:0;width:inherit;height:48px;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;border-top:1px solid color-mix(in srgb,CanvasText 10%,transparent);background:Canvas;color:CanvasText;font:10px system-ui}#xqc-native-panel .xqc-footer-note{display:flex;align-items:center;gap:3px;height:18px;white-space:nowrap;opacity:.72}#xqc-native-panel .xqc-footer-note .xqc-version{font-weight:600}#xqc-native-panel .xqc-footer-links{display:flex;align-items:center;justify-content:center;gap:10px;height:24px}#xqc-native-panel .xqc-footer a{display:grid;place-items:center;width:22px;height:22px;color:inherit;text-decoration:none;opacity:.65}#xqc-native-panel .xqc-footer-note a{display:inline;width:auto;height:auto;color:inherit;text-decoration:underline;opacity:1}#xqc-native-panel .xqc-footer a:hover{opacity:1}#xqc-native-panel .xqc-footer a:focus-visible{outline:2px solid CanvasText;outline-offset:1px}#xqc-native-panel .xqc-footer svg{width:14px;height:14px}#xqc-native-panel .xqc-footer a span{font:16px/1 system-ui}#xqc-native-panel [data-testid="like"].xqc-liked-from-store,#xqc-native-panel [data-testid="like"].xqc-liked-from-store svg{color:rgb(249,24,128)!important}#xqc-native-panel.xqc-stalled .xqc-root [role=progressbar]{display:none!important}#xqc-native-panel .xqc-root main{width:100%;max-width:100%;min-width:0}#xqc-native-panel .xqc-root aside,#xqc-native-panel [data-testid="sidebarColumn"]{display:none!important}#xqc-native-panel [data-testid="primaryColumn"]{width:100%!important;min-width:0!important;max-width:100%!important}#xqc-native-panel .xqc-root:has(>div){min-height:50px}`;
  document.head.append(style); document.body.append(host);
  // #layers itself can have z-index 101 while its ancestors remain in a
  // z-index:0 stacking context. A body-level panel still covers that entire
  // context. Put the panel beside #layers instead of competing with ancestors.
  let trackedLayerParent;
  function alignWithNativeLayers() {
    const layers=document.getElementById('layers');
    const parent=layers?.parentElement;
    if(parent && parent!==host && !host.contains(parent)) {
      if(host.parentElement!==parent) parent.append(host);
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
  let disposed = false, root, secondary, memory, ready, timeout, observer, desiredHandle, nativeError;
  let loadedHandle, pendingHandle, failedHandle, baselineTweet, baselineText;
  let tweetStore, unlistenTweets, likeFrame = 0;
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
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('click', onPanelLink);
    window.removeEventListener('resize', position);
    layerObserver.disconnect(); observer?.disconnect(); unlistenTweets?.();
    if (likeFrame) cancelAnimationFrame(likeFrame);
    root?.unmount(); memory?.destroy?.(); host.remove(); style.remove(); delete window[key];
  };
  window[key] = clean;
  host.querySelector('[aria-label="关闭𝕏侧栏"]').onclick = clean;
  host.querySelector('[aria-label="重新加载侧栏"]').onclick = () => {
    if (desiredHandle) void restart(desiredHandle);
    else report('请先点击左侧头像。');
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
  window.addEventListener('resize', position); position();
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
      location:['safeParseQuery','URIError','URLSearchParams'],
      nativeHistory:['RichHistory','goBackThroughModals','initialRwebLocationKey']
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
    return {React, DOM, Router, History, NativeLocation, NativeHistory};
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
    const {React, DOM, Router, History, NativeLocation, NativeHistory}=runtime();
    const {children,providers}=findRoutes(React,Router);
    if(disposed)return;
    tweetStore=providers.map(([,value])=>value?.store || value).find(store=>{
      try {return typeof store?.getState==='function' && typeof store?.subscribe==='function' && !!store.getState()?.entities?.tweets?.entities;}
      catch {return false;}
    });
    unlistenTweets=tweetStore?.subscribe(scheduleLikeSync);
    memory=createNativeMemoryHistory(History,NativeLocation,'/'+handle);
    // Compose must be owned by AppShell: its header, dismiss flow, and submit
    // controls depend on the primary route/modal providers. Never mount a second
    // composer in the copied route tree or copy/call a submit handler ourselves.
    const isCompose=path=>/^\/(?:compose(?:\/|$)|intent\/(?:post|tweet)(?:\/|$))/.test(path);
    for(const method of ['push','replace']) {
      const navigate=memory[method];
      memory[method]=(path,state)=>{
        const next=NativeLocation.createLocation(path,state);
        if(!isCompose(next.pathname)) return navigate(path,state);
        // Always push in the main router so native dismissal has a return entry.
        NativeHistory.push(next);
        // Keep the profile mounted and visible beneath X's modal backdrop.
        // display:none causes native timeline measurement/virtualization churn.
        if(!isCompose(NativeHistory.location.pathname)) report('X 尚未打开回复窗口，请处理页面上的提示后重试。');
      };
    }
    secondary={navigate:({to})=>memory.push(to)};
    let element=React.createElement(Router.Router,{history:memory},
      React.createElement(Router.Switch,null,children));
    for(const [type,value] of providers) {
      // X's app context also carries the main page history. The copied profile
      // must see the same sidebar history as React Router.
      const scopedValue=value?.history===NativeHistory?{...value,history:memory}:value;
      element=React.createElement(type,{value:scopedValue},element);
    }
    class Boundary extends React.Component {
      state={failed:false};
      static getDerivedStateFromError(){return {failed:true};}
      componentDidCatch(error,info){captureError(error,info);}
      render(){return this.state.failed?null:this.props.children;}
    }
    observer=new MutationObserver(()=>{
      scheduleLikeSync();
      if(!status.hidden && !nativeError && hasPosts()) finishLoading(desiredHandle,loadSerial);
    });
    observer.observe(mount,{subtree:true,childList:true,characterData:true});
    // React 19 reports errors caught by nested X boundaries here, even if X
    // discards the Error object and only renders its generic fallback screen.
    root=DOM.createRoot(mount,{onCaughtError:captureError,onUncaughtError:captureError});
    root.render(React.createElement(Boundary,null,element));
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
    const avatar='[data-testid^="UserAvatar-Container"],[data-testid="Tweet-User-Avatar"],img[src*="/profile_images/"],img[src*="/default_profile"]';
    if (!target.closest(avatar) && !link.querySelector(avatar)) return;
    const url=new URL(link.href), handle=url.pathname.match(/^\/([a-z0-9_]{1,15})(?:\/photo)?\/?$/i)?.[1];
    if (url.origin!==location.origin || !handle) return;
    event.preventDefault();event.stopImmediatePropagation(); void open(handle);
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
  if (!widthWarning) report('点击左侧头像，查看用户主页。');
})();
