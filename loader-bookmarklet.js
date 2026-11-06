(() => {
  'use strict';
  if (location.origin !== 'https://x.com') {
    alert('请在已登录的 X 页面点击「开启x侧栏」。');
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
      alert('官网没有返回有效的侧栏脚本。请稍后重试。');
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
