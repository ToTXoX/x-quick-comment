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
  if (window.__xQuickComment) { window.__xQuickComment(); return; }
  if (window.__xQuickCommentLoading) return;

  const origin = 'https://x.usdts.de';
  const token = crypto.randomUUID();
  const popup = window.open(origin + '/#xqc-load=' + token, '_blank', 'width=420,height=210');
  if (!popup) {
    alert('浏览器拦截了更新窗口。请允许本站打开弹窗后重试。');
    return;
  }
  window.__xQuickCommentLoading = true;
  const cleanup = () => {
    clearTimeout(timeout);
    window.removeEventListener('message', receive);
    delete window.__xQuickCommentLoading;
    try { popup.close(); } catch {}
  };
  const timeout = setTimeout(() => {
    cleanup();
    alert('获取最新版脚本超时。请检查网络连接后重试。');
  }, 20000);
  function receive(event) {
    const data = event.data;
    if (event.origin !== origin || event.source !== popup ||
        data?.kind !== 'xqc-source' || data.token !== token) return;
    cleanup();
    if (typeof data.source !== 'string' || data.source.length < 1000 || data.source.length > 250000) {
      alert('官网没有返回有效的 Peekala 脚本。请稍后重试。');
      return;
    }
    const ack = '__xqcLoaderAck_' + token.replaceAll('-', '');
    const script = document.createElement('script');
    const nonce = document.querySelector('meta[property="csp-nonce"]')?.content ||
      document.querySelector('script[nonce]')?.nonce;
    if (nonce) script.nonce = nonce;
    script.textContent = `window.${ack}=true;\n` + data.source;
    document.documentElement.append(script);
    script.remove();
    const executed = window[ack] === true;
    delete window[ack];
    if (!executed) alert('X 阻止了脚本执行。请把这条提示发给作者。');
  }
  window.addEventListener('message', receive);
})();
