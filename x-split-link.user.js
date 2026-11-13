// ==UserScript==
// @name         Peekala 冒冒 · X 分屏联动
// @namespace    local.x-split-link
// @version      1.0.0
// @description  手动分屏后，点击通知头像让指定的右侧 X 页面打开主页；保留原生页面交互。
// @match        https://x.com/*
// @run-at       document-idle
// @noframes
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// ==/UserScript==

(async () => {
  'use strict';
  const OWNER = 'xsplit.receiver.v1', REQUEST = 'xsplit.request.v1', ACK = 'xsplit.ack.v1';
  const tab = await new Promise(resolve => GM_getTab(resolve));
  tab.xsplitId ||= crypto.randomUUID();
  tab.xsplitEnabled ??= true;
  const save = () => new Promise(resolve => GM_saveTab(tab, resolve));
  await save();
  const id = tab.xsplitId;
  const owner = () => GM_getValue(OWNER, null);
  const receiving = () => owner()?.id === id;
  const notifications = () => /^\/notifications(?:\/|$)/.test(location.pathname);
  let pending, timer, sequence = 0, lastSent, feedbackTimer;

  const widget = document.createElement('div');
  widget.id = 'x-split-link-widget';
  widget.style.cssText = 'position:fixed;bottom:12px;left:12px;z-index:2147483646;max-width:calc(100vw - 24px)';
  const ui = widget.attachShadow({mode:'open'});
  ui.innerHTML = `<style>
    :host{font:13px/1.5 system-ui;color-scheme:light dark;color:CanvasText}
    details{background:Canvas;border:1px solid #8886;border-radius:12px;box-shadow:0 2px 12px #0002;max-width:310px}
    summary{cursor:pointer;padding:8px 12px;user-select:none}
    section{padding:0 12px 12px}p{margin:6px 0;overflow-wrap:anywhere}
    button{font:inherit;cursor:pointer;border:1px solid #8886;border-radius:6px;background:ButtonFace;color:ButtonText;padding:5px 8px;margin:4px 4px 0 0}
    [hidden]{display:none!important}.tip{color:GrayText;font-size:12px}
  </style><details><summary>Peekala 分屏联动 · <span id="role"></span></summary><section>
    <p id="status" role="status"></p>
    <button id="receive">设为右侧接收页</button><button id="stop">停止接收</button>
    <button id="toggle">暂停头像联动</button>
    <div id="draft" hidden><p>检测到未发送内容，已暂缓切换。</p><button id="continue">确认离开并切换</button><button id="cancel">取消切换</button></div>
    <p class="tip">先手动分屏；左侧打开通知，右侧点击“设为右侧接收页”。每个浏览器配置仅指定一个接收页。</p>
  </section></details>`;
  document.body.append(widget);
  const $ = selector => ui.querySelector(selector);
  function say(message, expand = false) {
    $('#status').textContent = message;
    if(expand) $('details').open = true;
  }
  function render() {
    const right = receiving();
    $('#role').textContent = right ? '右侧接收' : tab.xsplitEnabled ? '头像联动开启' : '已暂停';
    $('#receive').hidden = right;
    $('#stop').hidden = !right;
    $('#toggle').hidden = right;
    $('#toggle').textContent = tab.xsplitEnabled ? '暂停头像联动' : '恢复头像联动';
  }
  function ack(request, state) {
    GM_setValue(ACK, {requestId:request.id, source:request.source, state, at:Date.now()});
  }
  function valid(request) {
    if(!request || request.target !== id || !receiving() || request.id === tab.xsplitLastRequest ||
       typeof request.id !== 'string' || typeof request.source !== 'string' ||
       !Number.isFinite(request.at) || Date.now()-request.at > 120000 || request.at > Date.now()+5000) return false;
    try {
      const url = new URL(request.url);
      return url.origin === 'https://x.com' && !url.username && !url.password && !url.search && !url.hash &&
        /^\/[a-zA-Z0-9_]{1,15}$/.test(url.pathname);
    } catch {return false;}
  }
  function hasDraft() {
    // Protect visible editors, including native reply and compose dialogs.
    // Do not treat the search box as a draft.
    return [...document.querySelectorAll('textarea,[contenteditable="true"],[data-testid="attachments"]')].some(el => {
      if(!el.getClientRects().length) return false;
      if(el.matches('[data-testid="attachments"]')) return el.childElementCount > 0;
      return Boolean((el.value ?? el.textContent ?? '').trim());
    });
  }
  async function navigate(request, confirmed = false) {
    if(!valid(request)) return;
    if(!confirmed && hasDraft()) {
      pending = request; $('#draft').hidden = false;
      say('待打开：'+new URL(request.url).pathname, true); ack(request,'draft'); return;
    }
    const token = ++sequence;
    tab.xsplitLastRequest = request.id;
    await save();
    if(token !== sequence || !receiving()) return;
    $('#draft').hidden = true; pending = null;
    ack(request,'opened');
    if(location.href !== request.url) location.assign(request.url);
    else say('已经在目标主页。');
  }
  function receive(request) {
    if(!valid(request)) return;
    ++sequence; clearTimeout(timer);
    timer = setTimeout(() => void navigate(request), 120);
  }
  function setReceiver() {
    ++sequence; pending = null; $('#draft').hidden = true;
    // A new receiver does not replay an old command.
    tab.xsplitLastRequest = GM_getValue(REQUEST, null)?.id;
    void save();
    GM_setValue(OWNER, {id, at:Date.now()});
    render(); say('接收已开启。现在点击左侧通知里的头像。', true);
  }
  function stopReceiver() {
    if(receiving()) GM_setValue(OWNER, null);
    ++sequence; clearTimeout(timer); pending = null; $('#draft').hidden = true;
    render(); say('当前页面已停止接收。');
  }
  function toggle() {tab.xsplitEnabled = !tab.xsplitEnabled; void save(); render();say(tab.xsplitEnabled?'通知头像联动已恢复。':'头像按 X 原来的方式打开。');}
  $('#receive').onclick = setReceiver; $('#stop').onclick = stopReceiver; $('#toggle').onclick = toggle;
  $('#continue').onclick = () => {if(pending) void navigate(pending,true);};
  $('#cancel').onclick = () => {
    ++sequence;
    if(pending){tab.xsplitLastRequest=pending.id;void save();}
    pending = null; $('#draft').hidden = true;say('已取消切换，当前页面保持不变。');
  };
  GM_registerMenuCommand('将当前页面设为右侧接收页', setReceiver);
  GM_registerMenuCommand('停止当前页面接收', stopReceiver);
  GM_registerMenuCommand('暂停 / 恢复通知头像联动', toggle);
  GM_addValueChangeListener(OWNER, () => {
    if(!receiving()){++sequence;clearTimeout(timer);pending=null;$('#draft').hidden=true;}
    render();say(receiving()?'此页面接收左侧头像点击。':owner()?'接收页已指定，通知头像可联动。':'请先在右侧指定接收页。');
  });
  GM_addValueChangeListener(REQUEST, (_key,_old,value) => receive(value));
  GM_addValueChangeListener(ACK, (_key,_old,value) => {
    if(value?.source !== id || value.requestId !== lastSent) return;
    clearTimeout(feedbackTimer);
    say(value.state === 'draft' ? '右侧有未发送内容，已暂缓切换。请在右侧确认。' : '已交给右侧页面打开。',value.state === 'draft');
  });

  function avatarHandle(target) {
    const primary = document.querySelector('[data-testid="primaryColumn"]') || document.querySelector('main');
    if(!primary?.contains(target)) return null;
    const link = target.closest('a[href]');
    const avatar = '[data-testid^="UserAvatar-Container"],[data-testid="Tweet-User-Avatar"],img[src*="/profile_images/"],img[src*="/default_profile"]';
    if(!link || (!target.closest(avatar) && !link.querySelector(avatar))) return null;
    const url = new URL(link.href,location.origin);
    const handle = url.pathname.match(/^\/([a-zA-Z0-9_]{1,15})(?:\/(?:photo|header_photo))?\/?$/)?.[1];
    if(url.origin !== location.origin || !handle || /^(home|explore|notifications|settings|messages|compose|search|i)$/i.test(handle))return null;
    return handle;
  }
  document.addEventListener('click', event => {
    if(!tab.xsplitEnabled || receiving() || !notifications() || !(event.target instanceof Element) ||
       event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const handle = avatarHandle(event.target);
    if(!handle) return;
    const receiver = owner();
    // Without an explicitly selected receiver, native navigation stays intact.
    if(!receiver?.id) {say('尚未指定右侧接收页，头像将按原方式打开。',true);return;}
    event.preventDefault();event.stopImmediatePropagation();
    const requestId = crypto.randomUUID(); lastSent = requestId;
    GM_getTabs(tabs => {
      if(lastSent !== requestId || !tab.xsplitEnabled) return;
      if(owner()?.id !== receiver.id || !Object.values(tabs).some(t=>t.xsplitId===receiver.id)) {
        say('接收页已关闭或切换，请在右侧重新指定接收页。',true);return;
      }
      say('正在交给右侧打开 @'+handle+'…');
      GM_setValue(REQUEST, {id:requestId,source:id,target:receiver.id,url:'https://x.com/'+handle,at:Date.now()});
      clearTimeout(feedbackTimer);
      feedbackTimer=setTimeout(()=>say('右侧尚未响应。请确认右侧仍在 x.com，且油猴脚本已启用。',true),10000);
    });
  },true);
  render();say(receiving()?'此页面接收左侧头像点击。':'先在右侧展开此面板，指定接收页。');
  // Consume the newest request after a full navigation/reload, only once.
  if(receiving()) receive(GM_getValue(REQUEST,null));
})();
