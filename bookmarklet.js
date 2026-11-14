(() => {
  'use strict';
  if (location.origin !== 'https://x.com') {
    if (document.getElementById('peekala-redirect')) return;
    const dialog=document.createElement('dialog');
    dialog.id='peekala-redirect';
    dialog.setAttribute('aria-labelledby','peekala-redirect-message');
    const form=document.createElement('form');
    form.method='dialog';
    const message=document.createElement('p');
    message.id='peekala-redirect-message';
    message.textContent='跳转到你的 X 主页后，再点击本书签使用侧栏';
    const actions=document.createElement('div');
    Object.assign(dialog.style,{
      boxSizing:'border-box',width:'min(380px, calc(100% - 32px))',maxWidth:'none',
      padding:'22px',border:'1px solid #d6d1cb',borderRadius:'14px',
      background:'Canvas',color:'CanvasText',font:'15px/1.6 system-ui',colorScheme:'light dark'
    });
    Object.assign(message.style,{margin:'0 0 18px'});
    Object.assign(actions.style,{display:'flex',justifyContent:'flex-end',gap:'8px'});
    for (const [label,value] of [['取消','cancel'],['跳转 x.com','go']]) {
      const button=document.createElement('button');
      button.type='submit';
      button.value=value;
      button.textContent=label;
      button.autofocus=value==='cancel';
      Object.assign(button.style,{
        padding:'6px 13px',border:'1px solid CanvasText',borderRadius:'8px',font:'inherit',cursor:'pointer',
        background:value==='go'?'CanvasText':'Canvas',color:value==='go'?'Canvas':'CanvasText'
      });
      actions.append(button);
    }
    form.append(message,actions);
    dialog.append(form);
    dialog.addEventListener('close',()=>{
      dialog.remove();
      if (dialog.returnValue==='go') location.assign('https://x.com/home');
    },{once:true});
    document.body.append(dialog);
    dialog.showModal();
    return;
  }
  const key = '__xQuickComment';
  const stickerPack=window.__xqcStickerPack;
  delete window.__xqcStickerPack;
  if (window[key]) { window[key](); return; }
  const reservedPaths = new Set(['explore','search','messages','settings','compose','i','grok','premium','jobs','communities','connect','bookmarks','lists','login','signup']);
  function supportedPage() {
    if (/^\/(?:notifications|home)(?:\/|$)/.test(location.pathname)) return true;
    const match=location.pathname.match(/^\/([a-z0-9_]{1,15})(?:\/(?:with_replies|media|highlights|articles|likes|status\/\d+))?\/?$/i);
    return !!match && !reservedPaths.has(match[1].toLowerCase());
  }
  if (!supportedPage()) {
    alert('请打开 X 首页、通知页、用户主页或帖子页，再点击 Peekala 书签'); return;
  }
  const version = '3.71';
  const stickerPackVersion = 1;
  const peekalaMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path fill="#b8b6b3" d="M41 46c-4 2-7 3-11 2-2 0-3 2-1 4 3 3 8 4 12 2l4-3zm5 7c-1 3 0 5-2 7-1 2 1 3 3 2 4-1 6-5 7-9z"/>
  <path fill="#d8d5d2" d="M40 38h15v18c-4 2-10 3-13-1-3-4-2-11-2-17z"/>
  <path fill="#b8b6b3" d="M14 17c-4-2-7 1-7 5-2 2-2 6 0 9 3 5 10 6 15 2 4-3 4-10 1-14-2-2-6-3-9-2zM55 5c-7-2-13 3-13 10 0 6 5 10 13 8z"/>
  <circle cx="15.5" cy="26" r="5.4" fill="#faf8f6"/>
  <path fill="#faf8f6" d="M55 11c-4-1-8 2-8 6s4 6 8 5z"/>
  <path fill="#d8d5d2" d="M55 18c-5-5-12-8-19-7-12 1-21 12-22 24-1 10 5 17 15 18 10 1 20-3 26-8z"/>
  <g fill="#fff">
    <circle cx="28" cy="33" r="5.8"/><circle cx="46" cy="27.5" r="5.8"/>
    <ellipse cx="39" cy="40.5" rx="9.2" ry="7.2" transform="rotate(-16 39 40.5)"/>
  </g>
  <g fill="#282522">
    <circle cx="26.8" cy="33.5" r="3.5"/><circle cx="44.6" cy="28.4" r="3.5"/>
    <ellipse cx="37.8" cy="37.8" rx="4.2" ry="5.3" transform="rotate(-17 37.8 37.8)"/>
  </g>
  <path d="m39 42 1.5 2m-2.7.6c2.2.4 4-.7 4.6-2.5" fill="none" stroke="#282522" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M55.5 4v56" stroke="#f8f6f2" stroke-width="5.6" stroke-linecap="round"/>
  <path d="M55.5 4v56" stroke="#282522" stroke-width="3.6" stroke-linecap="round"/>
</svg>`;
  const likeEffects=new Map();
  const preferencesKey='xqc-features';
  let likeEffectsEnabled=true;
  try {
    const saved=JSON.parse(localStorage.getItem(preferencesKey));
    if (typeof saved?.likeEffects==='boolean') likeEffectsEnabled=saved.likeEffects;
  } catch {}

  const controls=document.createElement('div');
  controls.id='xqc-feature-controls';
  controls.setAttribute('role','group');
  controls.setAttribute('aria-label','Peekala 功能开关');
  controls.innerHTML=`
    <div class="xqc-like-control">
      <div class="xqc-sticker-playback">
        <button type="button" class="xqc-sticker-play" aria-label="播放当前点赞特效" title="播放当前点赞特效">
          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.5 4.5 13a4.6 4.6 0 0 1 6.5-6.5l1 1 1-1a4.6 4.6 0 0 1 6.5 6.5Z"/></svg>
        </button>
      </div>
      <label>点赞特效<input type="checkbox" role="switch"></label>
      <button type="button" class="xqc-sticker-manage" aria-expanded="false" aria-controls="xqc-sticker-manager">换表情</button>
    </div>
  `;
  const manageButton=controls.querySelector('.xqc-sticker-manage');
  const playButton=controls.querySelector('.xqc-sticker-play');
  manageButton.setAttribute('popovertarget','xqc-sticker-manager');
  const likeSwitch=controls.querySelector('input');
  likeSwitch.checked=likeEffectsEnabled;
  likeSwitch.onchange=()=>{
    likeEffectsEnabled=likeSwitch.checked;
    try { localStorage.setItem(preferencesKey,JSON.stringify({likeEffects:likeEffectsEnabled})); } catch {}
    applyLikeEffects();
  };

  const buddy=document.createElement('div');
  buddy.id='xqc-sidebar-buddy';
  buddy.hidden=true;
  buddy.innerHTML=`
    <button type="button" class="xqc-buddy-open" aria-label="展开 Peekala 侧栏" title="展开侧栏">${peekalaMark}</button>
    <button type="button" class="xqc-buddy-exit" aria-label="退出 Peekala" title="退出 Peekala">
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="m2.5 2.5 7 7m0-7-7 7"/></svg>
    </button>
  `;
  const buddyOpen=buddy.querySelector('.xqc-buddy-open');
  buddyOpen.onclick=()=>{
    setSidebar(true);
    likeSwitch.focus({preventScroll:true});
  };
  buddy.querySelector('.xqc-buddy-exit').onclick=exitPeekala;
  buddy.addEventListener('pointerenter',event=>{
    if (event.pointerType==='mouse') buddy.classList.add('xqc-buddy-hovered');
  });
  buddy.addEventListener('pointerleave',()=>buddy.classList.remove('xqc-buddy-hovered'));

  let stopSidebar;
  function applyLikeEffects() {
    if (likeEffectsEnabled) document.addEventListener('click',onLikeClick,true);
    else stopLikeEffects();
  }
  function stopLikeEffects() {
    document.removeEventListener('click',onLikeClick,true);
    for (const stop of likeEffects.values()) stop();
  }
  function setSidebar(open) {
    if (open) buddy.classList.remove('xqc-buddy-hovered');
    buddy.hidden=open;
    if (open) stopSidebar ??= startSidebar();
    else {
      stopSidebar?.();
      stopSidebar=undefined;
      buddyOpen.focus({preventScroll:true});
    }
  }
  function exitPeekala() {
    stopSidebar?.();
    stopLikeEffects();
    stopStickerPack?.();
    closeStickerManager();
    buddy.remove();
    stickerManager.remove();
    featureStyle.remove();
    delete window[key];
    void stickerDatabase?.then(db=>db.close(),()=>{});
  }

  const featureStyle=document.createElement('style');
  featureStyle.textContent=`
    #xqc-native-panel{container-type:inline-size}
    #xqc-native-panel>header{flex-wrap:wrap}
    #xqc-native-panel .xqc-actions{margin-left:auto;align-items:center}
    #xqc-feature-controls{display:flex;align-items:center;gap:10px;color-scheme:light dark;color:CanvasText;font:12px/1 system-ui}
    #xqc-native-panel .xqc-actions>#xqc-feature-controls{margin-right:6px}
    #xqc-feature-controls label{display:flex;align-items:center;gap:6px;min-height:24px;white-space:nowrap;cursor:pointer}
    #xqc-feature-controls .xqc-like-control{display:flex;align-items:center;gap:6px}
    #xqc-feature-controls .xqc-sticker-playback{position:relative}
    #xqc-native-panel .xqc-actions .xqc-sticker-play{width:24px;height:24px;border:0;border-radius:6px;color:#f91880}
    #xqc-feature-controls .xqc-sticker-play:active svg{transform:scale(.86)}
    #xqc-feature-controls .xqc-sticker-playback .xqc-like-effect{position:absolute;top:50%;left:50%}
    #xqc-native-panel .xqc-actions .xqc-sticker-manage{display:block;width:auto;height:24px;padding:0 3px;border:0;border-radius:4px;font:inherit;text-decoration:underline;text-underline-offset:2px}
    #xqc-native-panel .xqc-actions .xqc-sidebar-collapse{display:inline-flex;align-items:center;gap:5px;width:auto;padding:0 9px;border-radius:8px;font:500 12px/1 system-ui;white-space:nowrap}
    #xqc-native-panel .xqc-sidebar-collapse svg{flex:none}
    #xqc-sidebar-buddy{--xqc-buddy-size:clamp(48px,4.7vw,88px);position:fixed;z-index:99;top:clamp(70px,22vh,170px);right:0;width:var(--xqc-buddy-size);height:var(--xqc-buddy-size);color-scheme:light dark}
    #xqc-sidebar-buddy[hidden]{display:none!important}
    #xqc-sidebar-buddy button{box-sizing:border-box;display:grid;place-items:center;padding:0;cursor:pointer}
    #xqc-sidebar-buddy .xqc-buddy-open{width:100%;height:100%;border:0;background:transparent;filter:drop-shadow(0 1px 2px #0003)}
    #xqc-sidebar-buddy .xqc-buddy-open svg{display:block;width:100%;height:100%;transform:translateX(7%)}
    #xqc-sidebar-buddy .xqc-buddy-exit{position:absolute;z-index:1;top:2px;right:3px;width:clamp(22px,1.6vw,26px);height:clamp(22px,1.6vw,26px);border:1px solid Canvas;border-radius:50%;background:CanvasText;color:Canvas;opacity:0;pointer-events:none}
    #xqc-sidebar-buddy .xqc-buddy-exit:focus-visible,#xqc-sidebar-buddy.xqc-buddy-hovered .xqc-buddy-exit{opacity:1;pointer-events:auto}
    #xqc-sidebar-buddy .xqc-buddy-exit:focus-visible{outline-color:Canvas}
    #xqc-sidebar-buddy button:focus-visible{outline:2px solid CanvasText;outline-offset:-2px}
    @container (max-width:340px){
      #xqc-native-panel>header:has(.xqc-actions){padding-inline:10px}
      #xqc-native-panel .xqc-actions>#xqc-feature-controls{margin-right:0}
      #xqc-feature-controls{gap:6px}
    }
    #xqc-feature-controls input[type=checkbox]{appearance:none;box-sizing:border-box;position:relative;flex:none;width:26px;height:15px;margin:0;padding:0;border:1px solid color-mix(in srgb,CanvasText 42%,Canvas);border-radius:99px;background:color-mix(in srgb,CanvasText 10%,Canvas);cursor:pointer}
    #xqc-feature-controls input[type=checkbox]::before{content:"";position:absolute;top:2px;left:2px;width:9px;height:9px;border-radius:50%;background:color-mix(in srgb,CanvasText 64%,Canvas)}
    #xqc-feature-controls input:checked{background:CanvasText;border-color:CanvasText}
    #xqc-feature-controls input:checked::before{left:13px;background:Canvas}
    #xqc-feature-controls input:focus-visible,#xqc-sticker-manager button:focus-visible{outline:2px solid CanvasText;outline-offset:2px}
    @media (forced-colors:active){
      #xqc-feature-controls input[type=checkbox]{appearance:auto}
      #xqc-feature-controls input[type=checkbox]::before{content:none}
    }
    #xqc-sticker-manager{--xqc-border:color-mix(in srgb,CanvasText 12%,transparent);--xqc-tile:color-mix(in srgb,CanvasText 4%,Canvas);position:fixed;inset:auto;margin:0;box-sizing:border-box;width:min(400px,calc(100vw - 20px));min-width:0;padding:12px;border:1px solid var(--xqc-border);border-radius:14px;background:Canvas;color:CanvasText;color-scheme:light dark;box-shadow:0 10px 30px #0002;font:12px/1.4 system-ui;overflow:auto;overscroll-behavior:contain;container-type:inline-size}
    #xqc-sticker-manager:popover-open{display:flex;flex-direction:column}
    #xqc-sticker-manager>:not([role=tabpanel]){flex:none}
    #xqc-sticker-manager [role=tabpanel]{min-height:0;display:flex;flex-direction:column}
    #xqc-sticker-manager[hidden],#xqc-sticker-manager [hidden],#xqc-sticker-manager p:empty{display:none!important}
    #xqc-sticker-manager h3,#xqc-sticker-manager p{margin:0}
    #xqc-sticker-manager h3{font-size:14px;font-weight:650}
    #xqc-sticker-manager :is(.xqc-sticker-heading,.xqc-sticker-confirm,.xqc-sticker-detail){display:flex;align-items:center;gap:6px}
    #xqc-sticker-manager .xqc-sticker-heading{gap:8px}
    #xqc-sticker-manager .xqc-sticker-heading h3{white-space:nowrap}
    #xqc-sticker-manager .xqc-sticker-current{min-width:0;margin-left:auto;display:flex;align-items:center;gap:5px;padding:3px 7px;border-radius:5px;background:var(--xqc-tile);white-space:nowrap}
    #xqc-sticker-manager .xqc-sticker-current span{flex:none;color:color-mix(in srgb,CanvasText 70%,Canvas)}
    #xqc-sticker-manager .xqc-sticker-current img{display:block;flex:none;width:22px;height:22px;object-fit:contain}
    #xqc-sticker-manager .xqc-sticker-current strong{min-width:0;overflow:hidden;text-overflow:ellipsis;font-weight:600}
    #xqc-sticker-manager button{flex:none;padding:4px 7px;border:1px solid var(--xqc-border);border-radius:6px;color:inherit;background:Canvas;font:inherit;white-space:nowrap;cursor:pointer}
    #xqc-sticker-manager svg{display:block;flex:none}
    #xqc-sticker-manager button:has(>svg):not(.xqc-sticker-tile){display:inline-flex;align-items:center;justify-content:center;gap:5px}
    #xqc-sticker-manager button:hover{background:color-mix(in srgb,CanvasText 8%,Canvas)}
    #xqc-sticker-manager button:disabled{opacity:.5;cursor:default}
    #xqc-sticker-manager [role=status]{margin-top:6px;overflow-wrap:anywhere}
    #xqc-sticker-manager [role=status][data-quiet]{position:absolute;width:1px;height:1px;padding:0;margin:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
    #xqc-sticker-manager .xqc-sticker-nav{display:flex;gap:3px;margin-top:6px;padding-top:6px;border-top:1px solid var(--xqc-border)}
    #xqc-sticker-manager [role=tab]{border:0;border-radius:6px;padding:5px 8px}
    #xqc-sticker-manager [role=tab][aria-selected=true]{background:color-mix(in srgb,CanvasText 10%,Canvas);font-weight:650}
    #xqc-sticker-manager [data-close-manager]{width:27px;height:27px;padding:0;border-color:transparent;border-radius:6px}
    #xqc-sticker-manager .xqc-sticker-confirm{position:absolute;z-index:4;box-sizing:border-box;width:min(232px,calc(100% - 16px));margin:0;padding:10px;border:1px solid var(--xqc-border);border-radius:9px;background:Canvas;box-shadow:0 5px 18px #0003;flex-wrap:wrap;justify-content:flex-end}
    #xqc-sticker-manager .xqc-sticker-confirm [data-delete-message]{flex-basis:100%;margin-bottom:4px;max-height:6em;overflow:auto;overflow-wrap:anywhere}
    #xqc-sticker-manager .xqc-sticker-confirm [type=submit]{background:CanvasText;color:Canvas;border-color:CanvasText}
    #xqc-sticker-manager .xqc-sticker-grid{box-sizing:border-box;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));align-content:start;gap:6px;min-height:0;max-height:222px;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-gutter:stable;list-style:none;padding:8px 3px;margin:0}
    @container (max-width:339px){#xqc-sticker-manager .xqc-sticker-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
    @container (max-width:259px){#xqc-sticker-manager .xqc-sticker-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    #xqc-sticker-manager .xqc-sticker-grid li{position:relative;min-width:0}
    #xqc-sticker-manager .xqc-sticker-remove{position:absolute;z-index:2;top:3px;left:3px;width:20px;height:20px;padding:0;border-color:transparent;background:Canvas;border-radius:50%}
    @media (hover:hover){
      #xqc-sticker-manager .xqc-sticker-remove{opacity:0}
      #xqc-sticker-manager li:is(:hover,:focus-within)>.xqc-sticker-remove{opacity:1}
    }
    #xqc-sticker-manager .xqc-sticker-remove:is(:hover,:focus-visible){opacity:1;border-color:var(--xqc-border)}
    #xqc-sticker-manager .xqc-sticker-tile{position:relative;display:grid;place-items:center;width:100%;height:64px;box-sizing:border-box;padding:4px;min-width:0;border-color:transparent;border-radius:8px;background:var(--xqc-tile)}
    #xqc-sticker-manager .xqc-sticker-tile[aria-pressed=true]{border-color:color-mix(in srgb,CanvasText 45%,Canvas);background:color-mix(in srgb,CanvasText 8%,Canvas)}
    #xqc-sticker-manager .xqc-sticker-tile>img{width:38px;height:38px;object-fit:contain}
    #xqc-sticker-manager .xqc-sticker-add{background:transparent;border:1px solid var(--xqc-border);color:color-mix(in srgb,CanvasText 72%,Canvas)}
    #xqc-sticker-manager .xqc-sticker-name{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    #xqc-sticker-manager .xqc-sticker-mark{position:absolute;right:3px;top:3px;display:grid;place-items:center;width:14px;height:14px;border-radius:50%;color:Canvas;background:CanvasText;font-size:10px}
    #xqc-sticker-manager .xqc-sticker-detail{min-height:36px;border-top:1px solid var(--xqc-border);padding:7px 0 0}
    #xqc-sticker-manager .xqc-sticker-detail strong{flex:1;min-width:0;font-weight:500}
    #xqc-sticker-manager .xqc-sticker-detail [data-used]{opacity:.7;white-space:nowrap}
    #xqc-sticker-manager [data-select-sticker]{min-height:32px;padding:5px 11px;background:CanvasText;color:Canvas;border-color:CanvasText;border-radius:7px;font-weight:650}
    #xqc-sticker-manager [data-select-sticker]:hover{background:color-mix(in srgb,CanvasText 86%,Canvas)}
    #xqc-sticker-manager .xqc-sticker-tile .xqc-like-effect{position:absolute;top:50%;left:50%;z-index:1}
    .xqc-like-effect{position:fixed;z-index:100;width:0;height:0;pointer-events:none}
    .xqc-like-effect img{position:absolute;top:-26px;left:-19px;width:38px;height:38px;max-width:none;object-fit:contain;animation:xqc-like-pop var(--xqc-like-duration) both}
    .xqc-like-effect span{position:absolute;top:0;left:0;width:7px;height:7px;background:#f91880;clip-path:path("M3.5 7 0.6 4.2C-1.3 2 1.7-.8 3.5 1.5 5.3-.8 8.3 2 6.4 4.2Z");animation:xqc-like-heart 640ms ease-out both}
    .xqc-like-icon-hidden{visibility:hidden!important}
    @keyframes xqc-like-pop{
      0%{opacity:0;transform:scale(.4) rotate(-12deg)}
      18%{opacity:1;transform:translateY(-3px) scale(1.1) rotate(-7deg)}
      35%,82%{opacity:1;transform:scale(1)}
      100%{opacity:0;transform:scale(.7)}
    }
    @keyframes xqc-like-heart{
      0%{opacity:0;transform:translate(-50%,-50%) scale(.4)}
      20%{opacity:1}
      100%{opacity:0;transform:translate(var(--xqc-heart-x),var(--xqc-heart-y)) rotate(var(--xqc-heart-rotation)) scale(.65)}
    }
  `;
  const likeButtonSelector='[data-testid="like"],[data-testid="unlike"]';
  const likedButtonSelector='[data-testid="unlike"],.xqc-liked-from-store';
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const defaultStickerId='peekala-peek';
  const catalog=stickerPack?.catalog?.version===stickerPackVersion ? stickerPack.catalog : undefined;
  const builtInStickers=catalog?.stickers.map(({id,name,duration})=>({id,name,duration})) ||
    [{id:defaultStickerId,name:'冒冒探头',duration:1440}];
  let stopStickerPack;
  if (catalog) {
    const header=new TextEncoder().encode(JSON.stringify(catalog));
    const expectedSize=4+header.length+catalog.stickers.reduce((sum,sticker)=>sum+sticker.size,0);
    const timeout=setTimeout(()=>stopStickerPack(),3000);
    stopStickerPack=()=>{
      clearTimeout(timeout);
      window.removeEventListener('message',receiveStickerPack);
    };
    function receiveStickerPack(event) {
      const data=event.data;
      if (event.origin!=='https://x.usdts.de' || data?.kind!=='xqc-assets' ||
          data.token!==stickerPack.token) return;
      stopStickerPack();
      const pack=data.pack;
      if (!(pack instanceof ArrayBuffer) || pack.byteLength!==expectedSize ||
          new DataView(pack).getUint32(0,true)!==header.length) return;
      const bytes=new Uint8Array(pack);
      if (!header.every((byte,index)=>byte===bytes[index+4])) return;
      let offset=4+header.length;
      for (const [index,sticker] of catalog.stickers.entries()) {
        const end=offset+sticker.size;
        builtInStickers[index].gif=new Blob([bytes.subarray(offset,end)],{type:'image/gif'});
        offset=end;
      }
      if (stickerManager.matches(':popover-open')) void loadStickerPosters();
    }
    window.addEventListener('message',receiveStickerPack);
  }

  const stickerIcons={
    close:'<path d="m4 4 8 8m0-8-8 8"/>',
    plus:'<path d="M8 3v10M3 8h10"/>',
    trash:'<path d="M2.5 4h11M6 4V2h4v2M4 4l.6 9.2a1 1 0 0 0 1 .8h4.8a1 1 0 0 0 1-.8L12 4M6.5 7v4m3-4v4"/>',
    check:'<path d="m3.5 8 3 3 6-6"/>'
  };
  function stickerIcon(name,size=14) {
    return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${stickerIcons[name]}</svg>`;
  }
  const stickerManager=document.createElement('section');
  stickerManager.id='xqc-sticker-manager';
  stickerManager.setAttribute('popover','auto');
  stickerManager.setAttribute('aria-labelledby','xqc-sticker-title');
  stickerManager.innerHTML=`
    <div class="xqc-sticker-heading">
      <h3 id="xqc-sticker-title">点赞特效</h3>
      <div class="xqc-sticker-current"><span>当前特效</span><img data-active-thumbnail alt="" width="22" height="22"><strong data-active-sticker></strong></div>
      <button type="button" aria-label="关闭表情包管理" title="关闭" data-close-manager>${stickerIcon('close')}</button>
    </div>
    <form class="xqc-sticker-confirm" role="dialog" aria-labelledby="xqc-delete-message" hidden>
      <span id="xqc-delete-message" data-delete-message></span>
      <button type="button" data-cancel-delete>取消</button>
      <button type="submit">${stickerIcon('trash')}删除</button>
    </form>
    <p role="status"></p>
    <div id="xqc-sticker-tabpanel" role="tabpanel">
      <ul class="xqc-sticker-grid" aria-label="表情">
        <li data-upload-cell hidden><button type="button" class="xqc-sticker-tile xqc-sticker-add" aria-label="上传 GIF" title="上传 GIF">${stickerIcon('plus',22)}</button></li>
      </ul>
      <input type="file" accept=".gif,image/gif" aria-label="上传 GIF 文件" hidden>
    </div>
    <div class="xqc-sticker-detail">
      <strong class="xqc-sticker-name"></strong>
      <button type="button" data-select-sticker>${stickerIcon('check')}使用此特效</button>
      <span data-used>使用中</span>
    </div>
    <div class="xqc-sticker-nav" role="tablist" aria-label="表情包">
      <button type="button" id="xqc-sticker-tab-system" role="tab" aria-controls="xqc-sticker-tabpanel">系统内置</button>
      <button type="button" id="xqc-sticker-tab-custom" role="tab" aria-controls="xqc-sticker-tabpanel">自定义</button>
    </div>
  `;
  const fileInput=stickerManager.querySelector('input[type=file]');
  const uploadCell=stickerManager.querySelector('[data-upload-cell]');
  const uploadButton=uploadCell.querySelector('button');
  uploadButton.onclick=()=>fileInput.click();
  stickerManager.querySelector('[data-close-manager]').onclick=()=>{
    closeStickerManager();
    manageButton.focus({preventScroll:true});
  };
  const tablist=stickerManager.querySelector('[role=tablist]');
  const tabs=[...tablist.querySelectorAll('[role=tab]')];
  const tabpanel=stickerManager.querySelector('[role=tabpanel]');
  const stickerGrid=stickerManager.querySelector('.xqc-sticker-grid');
  const stickerDetail=stickerManager.querySelector('.xqc-sticker-detail');
  const activeStickerName=stickerManager.querySelector('[data-active-sticker]');
  const activeStickerThumbnail=stickerManager.querySelector('[data-active-thumbnail]');
  const deleteForm=stickerManager.querySelector('.xqc-sticker-confirm');
  const stickerStatus=stickerManager.querySelector('[role=status]');
  const selectSticker=stickerManager.querySelector('[data-select-sticker]');
  const thumbnailUrls=[];
  let stickers={items:[],selected:defaultStickerId}, stickerDatabase, stickerBusy=false, stopPreview;
  let customTabActive=false, focusedStickerId, pendingDelete;

  function setStickerStatus(message,quiet=false) {
    stickerStatus.toggleAttribute('data-quiet',quiet);
    stickerStatus.textContent=message;
  }
  stickerManager.addEventListener('click',event=>{
    if (pendingDelete && !deleteForm.contains(event.target) && !pendingDelete.trigger.contains(event.target)) cancelDeletion();
  },true);
  stickerManager.addEventListener('keydown',event=>{
    if (event.key!=='Escape') return;
    if (!deleteForm.hidden) {
      event.preventDefault();
      cancelDelete.click();
    }
  });
  function currentSticker() {
    return stickers.items.find(item=>item.id===stickers.selected) ||
      builtInStickers.find(item=>item.id===stickers.selected) || builtInStickers[0];
  }
  function openStickerDatabase() {
    stickerDatabase ??= new Promise((resolve,reject)=>{
      const request=indexedDB.open('xqc-like-stickers',1);
      request.onupgradeneeded=()=>request.result.createObjectStore('library');
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
    return stickerDatabase;
  }
  async function readStickerLibrary(change) {
    const db=await openStickerDatabase();
    return new Promise((resolve,reject)=>{
      const tx=db.transaction('library',change?'readwrite':'readonly');
      const store=tx.objectStore('library');
      let library;
      const request=store.get('reactions');
      request.onsuccess=()=>{
        library=request.result || {items:[],selected:defaultStickerId};
        if (!builtInStickers.some(item=>item.id===library.selected) && !library.items.some(item=>item.id===library.selected)) {
          library.selected=defaultStickerId;
        }
        if (!change) return;
        try {
          change(library);
          store.put(library,'reactions');
        } catch (error) {
          reject(error);
          tx.abort();
        }
      };
      tx.oncomplete=()=>resolve(library);
      tx.onabort=()=>reject(tx.error || Error('无法更新表情包。'));
    });
  }

  async function importSticker(file) {
    if (file.size>10*1024*1024) throw Error('单张 GIF 最大 10 MB。');
    const bytes=new Uint8Array(await file.arrayBuffer());
    const view=new DataView(bytes.buffer);
    const invalid=()=>{throw Error('无法读取这张 GIF。');};
    const header=String.fromCharCode(...bytes.subarray(0,6));
    if (!/^GIF8[79]a$/.test(header) || bytes.length<14) invalid();
    if (view.getUint16(6,true)>2048 || view.getUint16(8,true)>2048) throw Error('GIF 的宽和高均不能超过 2048 像素。');
    const tableSize=flags=>flags&128 ? 3*(2**((flags&7)+1)) : 0;
    let offset=13+tableSize(bytes[10]), duration=0, frames=0, delay=100, firstFrameEnd, chunkStart=0;
    const chunks=[];
    function skipSubBlocks() {
      while (offset<bytes.length) {
        const length=bytes[offset++];
        if (!length) return;
        offset+=length;
      }
      invalid();
    }
    // Count a single cycle and omit the GIF loop extension for one-shot playback.
    while (offset<bytes.length && bytes[offset]!==0x3b) {
      const start=offset;
      const marker=bytes[offset++];
      if (marker===0x2c) {
        if (offset+10>=bytes.length) invalid();
        offset+=10+tableSize(bytes[offset+8]);
        skipSubBlocks();
        firstFrameEnd ??= offset;
        frames++;
        duration+=delay;
        delay=100;
      } else if (marker===0x21) {
        const type=bytes[offset++];
        const size=bytes[offset];
        if (type===0xf9) {
          if (size!==4 || offset+5>=bytes.length || bytes[offset+5]!==0) invalid();
          const centiseconds=view.getUint16(offset+2,true);
          delay=centiseconds<=1?100:centiseconds*10;
        }
        const app=type===0xff && size===11 && String.fromCharCode(...bytes.subarray(offset+1,offset+12));
        skipSubBlocks();
        if (type===0x01) delay=100;
        if (app==='NETSCAPE2.0' || app==='ANIMEXTS1.0') {
          chunks.push(bytes.subarray(chunkStart,start));
          chunkStart=offset;
        }
      } else invalid();
    }
    if (bytes[offset]!==0x3b) invalid();
    if (frames<2) throw Error('请选择一张有动画的 GIF。');
    chunks.push(bytes.subarray(chunkStart,offset+1));
    const trailer=new Uint8Array([0x3b]);
    const gif=new Blob(chunks,{type:'image/gif'});
    const firstFrame=new Blob([bytes.subarray(0,firstFrameEnd),trailer],{type:'image/gif'});
    let poster;
    try { poster=await stickerPoster(firstFrame); }
    catch { invalid(); }
    return {
      id:crypto.randomUUID(),name:file.name.replace(/\.gif$/i,'').trim() || '自定义 GIF',
      gif,poster,duration
    };
  }
  async function stickerPoster(gif) {
    const bitmap=await createImageBitmap(gif);
    try {
      const canvas=document.createElement('canvas');
      canvas.width=canvas.height=52;
      const scale=52/Math.max(bitmap.width,bitmap.height);
      const width=bitmap.width*scale, height=bitmap.height*scale;
      canvas.getContext('2d').drawImage(bitmap,(52-width)/2,(52-height)/2,width,height);
      return await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob ? resolve(blob) : reject(Error('缩略图生成失败'))));
    } finally { bitmap.close(); }
  }
  async function loadStickerPosters() {
    await Promise.all(builtInStickers.map(async sticker=>{
      if (sticker.gif && !sticker.poster) sticker.poster=await stickerPoster(sticker.gif).catch(()=>undefined);
    }));
    renderStickers();
  }
  function setThumbnail(img,sticker) {
    if (!sticker.poster) {
      img.removeAttribute('src');
      return;
    }
    img.src=URL.createObjectURL(sticker.poster);
    thumbnailUrls.push(img.src);
  }
  function clearThumbnails() {
    for (const url of thumbnailUrls.splice(0)) URL.revokeObjectURL(url);
  }
  function stickerTile(sticker) {
    const item=document.createElement('li');
    const tile=document.createElement('button');
    tile.type='button';
    tile.className='xqc-sticker-tile';
    tile.dataset.stickerId=sticker.id;
    tile.title=sticker.name;
    const img=new Image();
    img.alt='';
    setThumbnail(img,sticker);
    tile.setAttribute('aria-label',sticker.name);
    tile.append(img);
    if (sticker.id===stickers.selected) {
      const mark=document.createElement('span');
      mark.className='xqc-sticker-mark';
      mark.setAttribute('aria-hidden','true');
      mark.innerHTML=stickerIcon('check',10);
      tile.setAttribute('aria-label',sticker.name+'，使用中');
      tile.append(mark);
    }
    tile.onclick=()=>{
      focusedStickerId=sticker.id;
      renderStickerDetail();
      previewSticker(sticker,tile,img);
    };
    item.append(tile);
    if (customTabActive) {
      const remove=document.createElement('button');
      remove.type='button';
      remove.className='xqc-sticker-remove';
      remove.setAttribute('aria-label','删除 '+sticker.name);
      remove.title='删除这张 GIF';
      remove.innerHTML=stickerIcon('trash',12);
      remove.onclick=()=>confirmDeletion(sticker,remove);
      item.append(remove);
    }
    return item;
  }
  function activeStickers() {
    return customTabActive ? stickers.items : builtInStickers;
  }
  function focusedSticker() {
    const items=activeStickers();
    return items.find(item=>item.id===focusedStickerId) || items[0];
  }
  function renderStickerDetail() {
    const sticker=focusedSticker();
    const isCurrent=sticker?.id===stickers.selected;
    for (const tile of stickerGrid.querySelectorAll('[data-sticker-id]')) {
      tile.setAttribute('aria-pressed',String(tile.dataset.stickerId===sticker?.id));
    }
    const name=stickerDetail.querySelector('strong');
    name.textContent=name.title=sticker?.name || '';
    stickerDetail.hidden=!sticker;
    selectSticker.hidden=!sticker || isCurrent;
    stickerManager.querySelector('[data-used]').hidden=!isCurrent;
  }
  function switchStickerTab(custom) {
    if (customTabActive===custom) return;
    customTabActive=custom;
    focusedStickerId=undefined;
    setStickerStatus('');
    cancelDeletion();
    renderStickers();
    tabs[Number(custom)].focus({preventScroll:true});
    stickerGrid.scrollTop=0;
  }
  function renderStickers() {
    if (!stickerManager.matches(':popover-open')) return;
    const current=currentSticker();
    activeStickerName.textContent=activeStickerName.title=current.name;
    const active=document.activeElement;
    stopPreview?.();
    clearThumbnails();
    setThumbnail(activeStickerThumbnail,current);
    const selectedTab=tabs[Number(customTabActive)];
    for (const tab of tabs) {
      tab.setAttribute('aria-selected',String(tab===selectedTab));
      tab.tabIndex=tab===selectedTab?0:-1;
    }
    tabpanel.setAttribute('aria-labelledby',selectedTab.id);
    const tiles=activeStickers().map(stickerTile);
    uploadCell.hidden=!customTabActive;
    uploadButton.disabled=stickerBusy;
    stickerGrid.replaceChildren(uploadCell,...tiles);
    renderStickerDetail();
    if (!active.isConnected) selectedTab.focus({preventScroll:true});
  }
  tabs[0].onclick=()=>switchStickerTab(false);
  tabs[1].onclick=()=>switchStickerTab(true);
  tablist.addEventListener('keydown',event=>{
    const index=tabs.indexOf(event.target);
    if (index<0) return;
    const next={ArrowLeft:1-index,ArrowRight:1-index,Home:0,End:1}[event.key];
    if (next===undefined) return;
    event.preventDefault();
    switchStickerTab(next===1);
  });
  const deleteMessage=deleteForm.querySelector('[data-delete-message]');
  const cancelDelete=deleteForm.querySelector('[data-cancel-delete]');
  function cancelDeletion() {
    pendingDelete=undefined;
    deleteForm.hidden=true;
  }
  function positionDeletion() {
    if (!pendingDelete) return;
    const {trigger}=pendingDelete;
    if (!trigger.isConnected) {
      cancelDeletion();
      return;
    }
    const anchor=trigger.getBoundingClientRect();
    const panel=stickerManager.getBoundingClientRect();
    const clip=stickerGrid.getBoundingClientRect();
    if (anchor.bottom<=clip.top || anchor.top>=clip.bottom) {
      cancelDeletion();
      return;
    }
    const gutter=6;
    const minX=panel.left+stickerManager.clientLeft;
    const minY=panel.top+stickerManager.clientTop;
    const maxX=stickerManager.clientWidth-deleteForm.offsetWidth-gutter;
    const maxY=stickerManager.clientHeight-deleteForm.offsetHeight-gutter;
    const x=anchor.left-minX;
    const below=anchor.bottom-minY+gutter;
    const y=below<=maxY ? below : anchor.top-minY-deleteForm.offsetHeight-gutter;
    deleteForm.style.left=`${stickerManager.scrollLeft+Math.max(gutter,Math.min(x,maxX))}px`;
    deleteForm.style.top=`${stickerManager.scrollTop+Math.max(gutter,Math.min(y,maxY))}px`;
  }
  function confirmDeletion(item,trigger) {
    if (stickerBusy) return;
    setStickerStatus('');
    pendingDelete={id:item.id,trigger};
    deleteMessage.textContent='删除 GIF「'+item.name+'」？';
    deleteForm.hidden=false;
    positionDeletion();
    cancelDelete.focus({preventScroll:true});
  }
  cancelDelete.onclick=()=>{
    const trigger=pendingDelete?.trigger;
    cancelDeletion();
    if (trigger?.isConnected) trigger.focus({preventScroll:true});
    else tablist.querySelector('[aria-selected=true]')?.focus({preventScroll:true});
  };
  deleteForm.onsubmit=event=>{
    event.preventDefault();
    if (!pendingDelete || stickerBusy) return;
    const {id}=pendingDelete;
    void updateStickers(()=>readStickerLibrary(library=>{
      library.items=library.items.filter(item=>item.id!==id);
      if (library.selected===id) library.selected=defaultStickerId;
    }),'已删除 GIF。',()=>{
      cancelDeletion();
      tablist.querySelector('[aria-selected=true]')?.focus({preventScroll:true});
    });
  };
  async function updateStickers(operation,notice,onComplete) {
    if (stickerBusy) return;
    stickerBusy=true;
    uploadButton.disabled=true;
    setStickerStatus('');
    try {
      await loadStickers;
      stopPreview?.();
      stickers=await operation();
      onComplete?.();
      setStickerStatus(notice,true);
    } catch (error) {
      setStickerStatus(error?.name==='Error' ? error.message : '无法保存表情包，请检查浏览器的本地存储空间。');
    } finally {
      stickerBusy=false;
      renderStickers();
    }
  }
  fileInput.onchange=()=>{
    const [file]=fileInput.files;
    fileInput.value='';
    if (!file || !customTabActive) return;
    let sticker;
    void updateStickers(async()=>{
      sticker=await importSticker(file);
      return readStickerLibrary(library=>library.items.unshift(sticker));
    },'GIF 已添加。',()=>{
      if (customTabActive) {
        focusedStickerId=sticker.id;
        stickerGrid.scrollTop=0;
      }
    });
  };
  selectSticker.onclick=()=>{
    const {id}=focusedSticker();
    void updateStickers(()=>readStickerLibrary(library=>{
      if (!builtInStickers.some(item=>item.id===id) && !library.items.some(item=>item.id===id)) throw Error('这张 GIF 已被删除。');
      library.selected=id;
    }),'已更新当前特效。');
  };
  function positionStickerManager() {
    if (!stickerManager.matches(':popover-open')) return;
    const anchor=manageButton.getBoundingClientRect();
    const {clientWidth,clientHeight}=document.documentElement;
    const gutter=10;
    const below=Math.max(0,clientHeight-anchor.bottom-2*gutter);
    const above=Math.max(0,anchor.top-2*gutter);
    const opensAbove=below<220 && above>below;
    stickerManager.style.maxHeight=`${opensAbove?above:below}px`;
    const left=Math.min(anchor.right-stickerManager.offsetWidth,clientWidth-stickerManager.offsetWidth-gutter);
    stickerManager.style.left=`${Math.max(gutter,left)}px`;
    stickerManager.style.top=`${opensAbove?anchor.top-gutter-stickerManager.offsetHeight:anchor.bottom+gutter}px`;
    positionDeletion();
  }
  const stickerResizeObserver=new ResizeObserver(positionStickerManager);
  stickerManager.addEventListener('toggle',event=>{
    const open=event.newState==='open';
    manageButton.setAttribute('aria-expanded',String(open));
    if (open) {
      renderStickers();
      positionStickerManager();
      stickerResizeObserver.observe(stickerManager);
      window.addEventListener('resize',positionStickerManager);
      window.addEventListener('scroll',positionStickerManager,true);
      void loadStickerPosters();
    } else {
      stickerResizeObserver.disconnect();
      window.removeEventListener('resize',positionStickerManager);
      window.removeEventListener('scroll',positionStickerManager,true);
      stopPreview?.();
      cancelDeletion();
      clearThumbnails();
      setStickerStatus('');
    }
  });
  function closeStickerManager() {
    if (stickerManager.matches(':popover-open')) stickerManager.hidePopover();
  }
  function previewSticker(sticker,tile,thumbnail) {
    if (reducedMotion.matches) {
      setStickerStatus('系统已开启减少动态效果。');
      return;
    }
    stopPreview?.();
    if (!sticker.gif) {
      setStickerStatus('这张 GIF 暂未加载，请刷新 X 页面后再点击书签。');
      return;
    }
    setStickerStatus('');
    let timeout;
    const playback=createLikeEffect(sticker,()=>{
      stopPreview?.();
      setStickerStatus('这张 GIF 无法播放。');
    });
    stopPreview=()=>{
      clearTimeout(timeout);
      thumbnail.classList.remove('xqc-like-icon-hidden');
      playback.stop();
      stopPreview=undefined;
    };
    tile.append(playback.element);
    thumbnail.classList.add('xqc-like-icon-hidden');
    timeout=setTimeout(stopPreview,sticker.duration);
  }
  function createLikeEffect(sticker,onError) {
    const element=document.createElement('div');
    element.className='xqc-like-effect';
    element.setAttribute('aria-hidden','true');
    element.style.setProperty('--xqc-like-duration',`${sticker.duration}ms`);
    const img=new Image();
    img.alt='';
    img.addEventListener('error',onError,{once:true});
    element.append(img);
    for (const [x,y,angle] of [[-25,-13,-25],[-17,-31,17],[3,-34,-12],[20,-24,26],[23,-6,12],[-12,13,-17]]) {
      const heart=document.createElement('span');
      heart.style.setProperty('--xqc-heart-x',`${x}px`);
      heart.style.setProperty('--xqc-heart-y',`${y}px`);
      heart.style.setProperty('--xqc-heart-rotation',`${angle}deg`);
      element.append(heart);
    }
    // Each playback gets its own image URL so rapid likes start at frame one.
    const url=URL.createObjectURL(sticker.gif);
    img.src=url;
    return {element,stop(){
      img.removeEventListener('error',onError);
      element.remove();
      URL.revokeObjectURL(url);
    }};
  }

  function tweetId(tweet) {
    const links=[...tweet?.querySelectorAll('a[href*="/status/"]') || []].filter(link=>
      !link.closest('[data-testid="quoteTweet"],.xqc-reply-context') && link.closest('[data-testid="tweet"]')===tweet);
    const permalink=links.find(link=>link.querySelector('time')) || links[0];
    return permalink?.pathname.match(/\/status\/(\d+)/)?.[1];
  }

  function onLikeClick(event) {
    if (!(event.target instanceof Element) || event.button) return;
    const button=event.target.closest(likeButtonSelector);
    const tweet=button?.closest('[data-testid="tweet"]');
    if (!tweet) return;
    if (button.matches(likedButtonSelector)) {
      likeEffects.get(tweet)?.();
      return;
    }
    if (reducedMotion.matches || likeEffects.has(tweet)) return;

    // Wait for X's native state update. The clicked action may be replaced
    // when X switches its test ID from like to unlike.
    const id=tweetId(tweet);
    const clickedAt=performance.now();
    let frame, effect, icon, playback, playedAt, duration;
    function stop() {
      if (likeEffects.get(tweet)!==stop) return;
      likeEffects.delete(tweet);
      cancelAnimationFrame(frame);
      icon?.classList.remove('xqc-like-icon-hidden');
      playback?.stop();
    }
    function update(now) {
      if (!tweet.isConnected || tweetId(tweet)!==id || reducedMotion.matches ||
          (playedAt===undefined ? now-clickedAt>=2000 : now-playedAt>=duration)) {
        stop();
        return;
      }
      const current=tweet.contains(button) ? button : tweet.querySelector(likeButtonSelector);
      if (current?.matches(likedButtonSelector)) {
        const nextIcon=current.querySelector('svg');
        const {x,y,width,height}=(nextIcon || current).getBoundingClientRect();
        const centerX=x+width/2, centerY=y+height/2;
        if (!width || !height || !current.contains(document.elementFromPoint(centerX,centerY))) {
          stop();
          return;
        }
        if (!effect) {
          const sticker=currentSticker();
          if (!sticker.gif) { stop(); return; }
          playedAt=now;
          duration=sticker.duration;
          playback=createLikeEffect(sticker,stop);
          effect=playback.element;
          const layers=document.getElementById('layers');
          (layers?.parentElement || document.body).append(effect);
        }
        if (icon!==nextIcon) {
          icon?.classList.remove('xqc-like-icon-hidden');
          icon=nextIcon;
          icon?.classList.add('xqc-like-icon-hidden');
        }
        effect.style.left=`${centerX}px`;
        effect.style.top=`${centerY}px`;
      } else if (effect) {
        stop();
        return;
      }
      frame=requestAnimationFrame(update);
    }
    likeEffects.set(tweet,stop);
    frame=requestAnimationFrame(update);
  }

  function startSidebar() {
    const host = document.createElement('section');
    host.id = 'xqc-native-panel';
    host.setAttribute('aria-label','Peekala 冒冒 · 用户主页');
    host.dataset.version=version;
    host.innerHTML = `<header><div class="xqc-brand"><span class="xqc-mark" aria-hidden="true">${peekalaMark}</span><div><strong>Peekala <span class="xqc-brand-zh">冒冒</span></strong><span class="xqc-caption">刷新后点击书签恢复设置</span></div></div><div class="xqc-actions"><button type="button" aria-label="重新加载侧栏" title="重新加载侧栏">↻</button><button type="button" class="xqc-sidebar-collapse"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 4 4 4-4 4m7-9v10"/></svg>收起侧栏</button></div></header><p role="status" aria-live="polite"></p>
      <div class="xqc-profile-stage">
        <div class="xqc-root"></div>
        <div class="xqc-profile-skeleton" aria-hidden="true">
          <div class="xqc-skeleton-profile">
            <span class="xqc-skeleton-avatar"></span>
            <span class="xqc-skeleton-line"></span>
            <span class="xqc-skeleton-line"></span>
            <span class="xqc-skeleton-line"></span>
          </div>
          <div class="xqc-skeleton-post">
            <span class="xqc-skeleton-avatar"></span>
            <div><span class="xqc-skeleton-line"></span><span class="xqc-skeleton-line"></span><span class="xqc-skeleton-line"></span></div>
          </div>
          <div class="xqc-skeleton-post">
            <span class="xqc-skeleton-avatar"></span>
            <div><span class="xqc-skeleton-line"></span><span class="xqc-skeleton-line"></span><span class="xqc-skeleton-line"></span></div>
          </div>
        </div>
      </div><footer class="xqc-footer" aria-label="相关链接"><div class="xqc-footer-note"><span class="xqc-version">v${version}</span><span>· 动态书签自动获取更新</span></div><div class="xqc-footer-links"><a class="xqc-update" href="https://x.usdts.de/" target="_blank" rel="noopener noreferrer" aria-label="更新主页" title="更新主页"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M13 3h8v8M21 3l-10 10"/></svg></a><a class="xqc-repo" href="https://github.com/ToTXoX/x-quick-comment" target="_blank" rel="noopener noreferrer" aria-label="GitHub 仓库" title="GitHub 仓库"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3"/><path d="M15 22v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 4.77 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-7 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 18.13V22"/></svg></a><a href="https://x.com/yygqdkqk" target="_blank" rel="noopener noreferrer" aria-label="dk021 的 X 主页" title="dk021 的 X 主页"><span aria-hidden="true">𝕏</span></a></div></footer>`;
    const style = document.createElement('style');
    // X portals live outside this panel; keep native menus/dialogs above it.
    // Removing this style on cleanup restores the original layering.
    style.textContent = `#layers{z-index:101!important}#xqc-native-panel{position:fixed;top:0;bottom:0;right:0;width:var(--xqc-width,380px);z-index:100;background:Canvas;color:CanvasText;border-left:1px solid color-mix(in srgb,CanvasText 12%,transparent);box-shadow:-12px 0 48px #00000007;scrollbar-width:thin;scrollbar-color:#88888866 transparent;overflow:auto;overscroll-behavior:contain;color-scheme:light dark;padding-bottom:48px}#xqc-native-panel>header{display:flex;justify-content:space-between;align-items:center;padding:24px 20px 12px;min-height:38px;gap:12px;position:sticky;top:0;background:Canvas;z-index:5;font:14px system-ui;border-bottom:1px solid color-mix(in srgb,CanvasText 9%,transparent)}#xqc-native-panel>p{margin:20px;padding:18px 20px;border:1px solid color-mix(in srgb,CanvasText 10%,transparent);border-radius:14px;background:color-mix(in srgb,CanvasText 3%,Canvas);white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.8 system-ui}#xqc-native-panel>p button{margin-top:10px;padding:4px 10px;border:1px solid currentColor;border-radius:8px;background:transparent;color:inherit;cursor:pointer}#xqc-native-panel>p a{color:inherit}#xqc-native-panel .xqc-brand{display:flex;align-items:center;gap:11px}#xqc-native-panel .xqc-mark{width:26px;height:26px;display:grid;place-items:center;color:CanvasText}#xqc-native-panel .xqc-brand strong{display:block;font-size:15px;white-space:nowrap}#xqc-native-panel .xqc-brand-zh{margin-left:3px;font-size:11px;font-weight:500;opacity:.62}#xqc-native-panel .xqc-mark svg{display:block;width:26px;height:26px}#xqc-native-panel .xqc-actions{display:flex;flex-shrink:0;gap:6px}#xqc-native-panel .xqc-caption{display:block;margin-top:3px;font-size:11px;letter-spacing:.3px;opacity:.55}#xqc-native-panel .xqc-actions button{display:grid;place-items:center;flex-shrink:0;width:32px;height:32px;padding:0;border:1px solid color-mix(in srgb,CanvasText 12%,transparent);border-radius:50%;background:transparent;color:inherit;font:23px/1 system-ui;cursor:pointer}#xqc-native-panel .xqc-actions button:hover{background:color-mix(in srgb,CanvasText 7%,Canvas)}#xqc-native-panel .xqc-actions button:focus-visible{outline:2px solid CanvasText;outline-offset:3px}#xqc-native-panel .xqc-footer{position:fixed;right:0;bottom:0;width:inherit;height:48px;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;border-top:1px solid color-mix(in srgb,CanvasText 10%,transparent);background:Canvas;color:CanvasText;font:10px system-ui}#xqc-native-panel .xqc-footer-note{display:flex;align-items:center;gap:3px;height:18px;white-space:nowrap;opacity:.72}#xqc-native-panel .xqc-footer-note .xqc-version{font-weight:600}#xqc-native-panel .xqc-footer-links{display:flex;align-items:center;justify-content:center;gap:10px;height:24px}#xqc-native-panel .xqc-footer a{display:grid;place-items:center;width:22px;height:22px;color:inherit;text-decoration:none;opacity:.65}#xqc-native-panel .xqc-footer-note a{display:inline;width:auto;height:auto;color:inherit;text-decoration:underline;opacity:1}#xqc-native-panel .xqc-footer a:hover{opacity:1}#xqc-native-panel .xqc-footer a:focus-visible{outline:2px solid CanvasText;outline-offset:1px}#xqc-native-panel .xqc-footer svg{width:14px;height:14px}#xqc-native-panel .xqc-footer a span{font:16px/1 system-ui}#xqc-native-panel [data-testid="like"].xqc-liked-from-store,#xqc-native-panel [data-testid="like"].xqc-liked-from-store svg{color:rgb(249,24,128)!important}#xqc-native-panel.xqc-stalled .xqc-root [role=progressbar]{display:none!important}#xqc-native-panel .xqc-root main{width:100%;max-width:100%;min-width:0}#xqc-native-panel .xqc-root aside,#xqc-native-panel [data-testid="sidebarColumn"]{display:none!important}#xqc-native-panel [data-testid="primaryColumn"]{width:100%!important;min-width:0!important;max-width:100%!important}#xqc-native-panel .xqc-root:has(>div){min-height:50px}`;
    style.textContent += `
      #xqc-native-panel .xqc-profile-skeleton{display:none}
      #xqc-native-panel[data-loading]>.xqc-profile-stage{position:relative;min-height:260px}
      #xqc-native-panel[data-loading]>.xqc-profile-stage>.xqc-profile-skeleton{display:block}
      #xqc-native-panel[data-loading]>.xqc-profile-stage>.xqc-profile-skeleton{position:absolute;inset:0 0 auto}
      #xqc-native-panel[data-loading]>.xqc-profile-stage>.xqc-root{opacity:0;visibility:hidden;pointer-events:none}
      #xqc-native-panel[data-loading]>p{
        display:flex;align-items:center;gap:8px;margin:16px 20px 12px;padding:0;border:0;
        background:none;color:color-mix(in srgb,CanvasText 76%,Canvas);font:12px/1.5 system-ui;
      }
      #xqc-native-panel[data-loading]>p::before{
        content:"";box-sizing:border-box;flex:0 0 12px;height:12px;border:1.5px solid currentColor;
        border-right-color:transparent;border-radius:50%;animation:xqc-loader-spin .8s linear infinite;
      }
      #xqc-native-panel .xqc-profile-skeleton{
        --xqc-skeleton-base:color-mix(in srgb,CanvasText 9%,Canvas);
        --xqc-skeleton-highlight:color-mix(in srgb,CanvasText 3%,Canvas);
        padding:0 20px 16px;
      }
      #xqc-native-panel .xqc-skeleton-profile{padding:14px 0 20px}
      #xqc-native-panel .xqc-skeleton-post{
        display:grid;grid-template-columns:36px minmax(0,1fr);gap:12px;
        border-top:1px solid color-mix(in srgb,CanvasText 9%,transparent);padding:16px 0;
      }
      #xqc-native-panel .xqc-skeleton-avatar,#xqc-native-panel .xqc-skeleton-line{
        display:block;background:var(--xqc-skeleton-base);border-radius:999px;
      }
      #xqc-native-panel .xqc-skeleton-avatar{width:36px;height:36px}
      #xqc-native-panel .xqc-skeleton-profile .xqc-skeleton-avatar{width:52px;height:52px;margin-bottom:14px}
      #xqc-native-panel .xqc-skeleton-line{height:8px;margin:8px 0;width:85%}
      #xqc-native-panel .xqc-skeleton-line:nth-last-child(3){height:10px;width:34%}
      #xqc-native-panel .xqc-skeleton-line:last-child{width:59%}
      @media (prefers-reduced-motion:no-preference){
        #xqc-native-panel[data-loading] :is(.xqc-skeleton-avatar,.xqc-skeleton-line){
          background-image:linear-gradient(105deg,var(--xqc-skeleton-base) 38%,var(--xqc-skeleton-highlight) 50%,var(--xqc-skeleton-base) 62%);
          background-size:240% 100%;animation:xqc-loader-sweep 1.65s ease-in-out infinite;
        }
      }
      @media (prefers-reduced-motion:reduce){
        #xqc-native-panel[data-loading]>p::before{animation:none}
      }
      @keyframes xqc-loader-spin{to{transform:rotate(1turn)}}
      @keyframes xqc-loader-sweep{from{background-position:100% 0}to{background-position:0 0}}
    `;
    host.querySelector('.xqc-actions').prepend(controls);
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
    const status = host.querySelector(':scope > [role=status]');
    const mount = host.querySelector('.xqc-root');
    let disposed = false, root, secondary, memory, ready, timeout, observer, desiredHandle, nativeError;
    let stopHeaderPreview;
    playButton.onclick=async()=>{
      await loadStickers;
      if (disposed || reducedMotion.matches) return;
      stopHeaderPreview?.();
      const sticker=currentSticker();
      if (!sticker.gif) return;
      const playback=createLikeEffect(sticker,stop);
      const timer=setTimeout(stop,sticker.duration);
      function stop() {
        clearTimeout(timer);
        playback.stop();
        stopHeaderPreview=undefined;
      }
      stopHeaderPreview=stop;
      playButton.parentElement.append(playback.element);
    };
    let loadedHandle, pendingHandle, failedHandle, baselineTweet, baselineText;
    let tweetStore, unlistenTweets, likeFrame = 0;
    let sidebarScope, restoreNavigationConfig;
    let previewStore, unlistenPreviews, previewFrame=0;
    let homeReply, homeReplyFrame=0;
    const isCompose=path=>/^\/(?:compose(?:\/|$)|intent\/(?:post|tweet)(?:\/|$))/.test(path);
    const previewCards=new Map();
    const previewObserver=new MutationObserver(records=>{
      const owned=node=>node instanceof Element && (host.contains(node) || controls.contains(node) || node.closest('.xqc-reply-context,.xqc-like-effect'));
      const changes=records.filter(record=>!owned(record.target) &&
        (record.type!=='childList' || [...record.addedNodes,...record.removedNodes].some(node=>!owned(node))));
      if(changes.length) onPageUpdate();
      if(changes.some(record=>record.type==='childList')) scheduleSearchPosition();
    });
    style.textContent+=`
      .xqc-reply-context{display:block;box-sizing:border-box;max-width:100%;min-width:0;margin:3px 0 0;padding:0;border:0;background:none;color:inherit;opacity:.4;text-decoration:none;font:12px/18px system-ui;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    `;
    function schedulePreviews() {
      if(disposed || previewFrame) return;
      previewFrame=requestAnimationFrame(()=>{previewFrame=0;syncPreviews();});
    }
    function onPageUpdate() {
      schedulePreviews();
      if (!homeReply) return;
      if (!homeReply.opened && performance.now()>homeReply.deadline) {
        homeReply=undefined;
        return;
      }
      if (isCompose(location.pathname)) {
        homeReply.opened=true;
        return;
      }
      if (location.href!==homeReply.url) {
        homeReply=undefined;
        return;
      }
      if (!homeReply.opened || homeReplyFrame) return;
      // Give X's modal teardown and native scroll restoration time to finish.
      homeReplyFrame=requestAnimationFrame(()=>{
        homeReplyFrame=requestAnimationFrame(()=>{
          homeReplyFrame=0;
          const reply=homeReply;
          homeReply=undefined;
          if (disposed || !reply || location.href!==reply.url) return;
          const main=mainColumn();
          const article=main?.contains(reply.article) && tweetId(reply.article)===reply.id
            ? reply.article
            : [...main?.querySelectorAll('[data-testid="tweet"]') || []].find(node=>tweetId(node)===reply.id);
          if (!article) return;
          const offset=article.getBoundingClientRect().top-reply.top;
          if (Math.abs(offset)>=1 && Math.abs(offset)<=80) window.scrollBy({top:offset,behavior:'instant'});
        });
      });
    }
    function clearPreviews() {
      for(const {card} of previewCards.values()) card.remove();
      previewCards.clear();
    }
    function syncPreviews() {
      if(disposed) return;
      // X keeps the notification timeline mounted behind its composer while
      // changing the URL. Preserve its row heights until the modal closes so
      // native scroll restoration uses the same layout it saved on entry.
      if(isCompose(location.pathname) &&
        [...previewCards.keys()].some(article=>article.isConnected)) return;
      if(!/^\/notifications(?:\/|$)/.test(location.pathname)) {
        clearPreviews();unlistenPreviews?.();unlistenPreviews=previewStore=undefined;return;
      }
      const main=mainColumn();
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
      let state;
      try {state=store?.getState();} catch {}
      const tweets=state?.entities?.tweets?.entities;
      const seen=new Set();
      for(const article of main?.querySelectorAll('[data-testid="tweet"]') || []) {
        if(host.contains(article)) continue;
        const timestamp=[...article.querySelectorAll('a[href]')].find(link=>
          !link.closest('.xqc-reply-context,[data-testid="quoteTweet"]') &&
          link.closest('[data-testid="tweet"]')===article && link.querySelector('time') &&
          new URL(link.href).origin===location.origin && /\/status\/\d+\/?$/.test(new URL(link.href).pathname));
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
    const setLoading = loading => {
      host.toggleAttribute('data-loading',loading);
      if (loading) mount.setAttribute('aria-busy','true');
      else mount.removeAttribute('aria-busy');
    };
    const report = (message,loading=false) => {
      setLoading(loading);
      status.hidden = false;
      status.textContent = message;
    };
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
      setLoading(false);
      host.classList.remove('xqc-stalled');
      clearTimeout(timeout);
    }
    function syncLikeState() {
      let tweets;
      try { tweets=tweetStore?.getState?.()?.entities?.tweets?.entities; }
      catch { return; }
      if (!tweets) return;
      // The cloned timeline can miss a redraw after X updates its shared store.
      for (const button of mount.querySelectorAll(likeButtonSelector)) {
        const id=tweetId(button.closest('[data-testid="tweet"]'));
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
      for (const [tweet,stop] of likeEffects) if (mount.contains(tweet)) stop();
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
      window.removeEventListener('popstate',onPageUpdate);clearPreviews();
      cancelAnimationFrame(homeReplyFrame);
      document.removeEventListener('click', onClick, true);
      for (const [tweet,stop] of likeEffects) if (host.contains(tweet)) stop();
      document.removeEventListener('click', onPanelLink);
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', scheduleSearchPosition, true);
      searchResizeObserver.disconnect();
      if (searchFrame) cancelAnimationFrame(searchFrame);
      layerObserver.disconnect(); observer?.disconnect(); unlistenTweets?.();
      if (likeFrame) cancelAnimationFrame(likeFrame);
      root?.unmount(); memory?.destroy?.(); restoreNavigationConfig?.();
      closeStickerManager();
      stopHeaderPreview?.();
      playButton.onclick=null;
      host.remove(); style.remove();
    };
    host.querySelector('.xqc-sidebar-collapse').onclick = () => setSidebar(false);
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
    function sidebarColumn() {
      return pageElement('[data-testid="sidebarColumn"]') || pageElement('main aside');
    }
    let searchFrame = 0, observedSearch, observedSuggestions;
    const searchResizeObserver = new ResizeObserver(scheduleSearchPosition);
    function scheduleSearchPosition() {
      if (disposed || searchFrame) return;
      searchFrame = requestAnimationFrame(() => {
        searchFrame = 0;
        positionBelowSearch();
      });
    }
    function positionBelowSearch(sidebar = sidebarColumn()) {
      const search = sidebar?.querySelector('[role="search"]');
      const input = search?.querySelector('[role="combobox"]');
      const suggestionsId = input?.getAttribute('aria-owns') || input?.getAttribute('aria-controls');
      const dropdown = suggestionsId && document.getElementById(suggestionsId);
      // Desktop X renders suggestions inside the search form, below the input.
      // Native popups mounted in #layers already stack above the panel.
      const suggestions = search?.contains(dropdown || null) ? dropdown : undefined;
      if (search !== observedSearch || suggestions !== observedSuggestions) {
        searchResizeObserver.disconnect();
        if (search) searchResizeObserver.observe(search);
        if (suggestions) searchResizeObserver.observe(suggestions);
        observedSearch = search;
        observedSuggestions = suggestions;
      }
      const panel = host.getBoundingClientRect();
      const viewportHeight = document.documentElement.clientHeight;
      const box = search?.getBoundingClientRect();
      const overlaps = box?.width && box.height && box.right > panel.left && box.left < panel.right &&
        box.bottom > 0 && box.top < viewportHeight && getComputedStyle(search).visibility === 'visible';
      const top = overlaps ? Math.min(viewportHeight, Math.ceil(box.bottom) + 4) : 0;
      host.style.top = top ? `${top}px` : '';
      host.style.clipPath = searchSuggestionClip(suggestions, panel, top);
      positionStickerManager();
    }
    function searchSuggestionClip(suggestions, panel, panelTop) {
      if (!suggestions || getComputedStyle(suggestions).visibility !== 'visible') return '';
      const rect = suggestions.getBoundingClientRect();
      const left = Math.max(0, rect.left - panel.left);
      const right = Math.min(panel.width, rect.right - panel.left);
      const top = Math.max(0, rect.top - panelTop);
      const bottom = Math.min(panel.bottom, rect.bottom) - panelTop;
      if (right <= left || bottom <= top) return '';
      // The inline dropdown sits inside X's stacking contexts. A hole in the
      // panel reveals it and passes clicks through without moving the native DOM.
      // Extend the outer polygon past the panel so its shadow remains visible.
      const outer = '-64px -64px, calc(100% + 64px) -64px, calc(100% + 64px) calc(100% + 64px), -64px calc(100% + 64px), -64px -64px';
      return `polygon(evenodd, ${outer}, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px ${top}px)`;
    }
    let widthWarning = false;
    function position() {
      const primary = pageElement('[data-testid="primaryColumn"]');
      const sidebar = sidebarColumn();
      const edge = primary?.getBoundingClientRect().right ??
        sidebar?.getBoundingClientRect().left ?? mainColumn()?.getBoundingClientRect().right;
      const available = edge == null ? 0 : document.documentElement.clientWidth - edge;
      if (available < 280) {
        host.style.width = 'min(380px, 95vw)';
        positionBelowSearch(sidebar);
        widthWarning = true;
        report('右侧空间不足。请缩小浏览器缩放比例，使主栏右侧至少留出 280px。');
        return false;
      }
      host.style.width = `${available}px`;
      positionBelowSearch(sidebar);
      if (widthWarning) { widthWarning = false; report('右侧空间已恢复。请点击用户头像。'); }
      return true;
    }
    window.addEventListener('resize', position);
    window.addEventListener('scroll', scheduleSearchPosition, {capture:true,passive:true});
    position();
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
        if((pendingHandle || host.classList.contains('xqc-stalled')) && !nativeError && hasPosts()) {
          finishLoading(desiredHandle,loadSerial);
        }
      });
      observer.observe(mount,{subtree:true,childList:true,characterData:true});
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
      report((retried?'正在重试 @':'正在加载 @')+handle+' 的原生主页…',true);
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
      if (location.pathname==='/home' && target.closest('[data-testid="reply"]')) {
        const article=target.closest('[data-testid="tweet"]');
        const id=tweetId(article);
        if (id && mainColumn()?.contains(article)) {
          cancelAnimationFrame(homeReplyFrame);
          homeReplyFrame=0;
          homeReply={url:location.href,article,id,top:article.getBoundingClientRect().top,deadline:performance.now()+2000};
        }
      }
      if(host.contains(target) || target.closest('[role="search"]')) return;
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
    previewObserver.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['href']});
    window.addEventListener('popstate',onPageUpdate);
    schedulePreviews();
    if (!widthWarning) report('点击左侧头像，查看用户主页。');
    return clean;
  }
  document.head.append(featureStyle);
  document.body.append(buddy,stickerManager);
  window[key]=()=>{
    if (stopSidebar) likeSwitch.focus({preventScroll:true});
    else buddyOpen.click();
  };
  applyLikeEffects();
  setSidebar(true);
  const loadStickers=readStickerLibrary().then(library=>{
    stickers=library;
    const selected=library.items.find(item=>item.id===library.selected);
    if (selected && !stickerManager.matches(':popover-open')) {
      customTabActive=true;
      focusedStickerId=selected.id;
    }
    renderStickers();
  }).catch(()=>{
    setStickerStatus('无法读取本地表情包，当前使用冒冒探头。');
  });
})();
