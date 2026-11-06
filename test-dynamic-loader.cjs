const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const dir = process.env.XQC_TEST_ASSETS || path.join(process.env.TEMP, 'xqc-local-test');
const {chromium} = require(path.join(dir, 'node_modules/playwright-core'));

(async () => {
  const browser = await chromium.launch({
    headless:true,
    executablePath:path.join(dir,'chrome-testing-157.0.8103.38/chrome-win64/chrome.exe')
  });
  try {
    const loader = fs.readFileSync(path.join(__dirname,'loader-bookmarklet.js'),'utf8');
    const installPage = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
    const bookmarkUrl = 'javascript:' + encodeURIComponent(loader);
    assert.ok(bookmarkUrl.length < 8000);
    assert.ok(installPage.includes(`id="install-bookmark" href="${bookmarkUrl}"`));
    assert.ok(fs.readFileSync(path.join(__dirname,'x-quick-comment-bookmarks.html'),'utf8').includes(bookmarkUrl));
    const csp = "default-src 'self'; script-src 'self' 'nonce-fixture'; connect-src 'self'; frame-src 'self'";
    const xPage = `<meta property="csp-nonce" content="fixture"><button id="launch">Launch</button>
      <script nonce="fixture">document.getElementById('launch').onclick=()=>{${loader}};</script>`;
    for (const githubAvailable of [true,false]) {
      const context = await browser.newContext();
      const alerts=[];
      await context.route('https://x.com/**',route=>route.fulfill({
        contentType:'text/html',headers:{'content-security-policy':csp,'cross-origin-opener-policy':'same-origin-allow-popups'},body:xPage
      }));
      await context.route('https://x.usdts.de/**',route=>route.fulfill({contentType:'text/html',body:installPage}));
      await context.route('https://raw.githubusercontent.com/**',route=>route.fulfill({
        status:githubAvailable?200:503,
        contentType:'text/plain',
        headers:{'access-control-allow-origin':'*'},
        body:githubAvailable
          ? 'window.__xQuickComment=()=>{};window.__xqcRemoteLoaded=true;/*'+'x'.repeat(1000)+'*/'
          : 'Unavailable'
      }));
      const page = await context.newPage();
      page.on('dialog',dialog=>{alerts.push(dialog.message());void dialog.dismiss();});
      await page.goto('https://x.com/notifications');
      await page.locator('#launch').click();
      await page.waitForFunction(available=>available
        ? window.__xqcRemoteLoaded === true
        : !!document.querySelector('#xqc-native-panel'),githubAvailable);
      assert.deepEqual(alerts,[]);
      assert.equal(await page.evaluate(()=>!!window.__xQuickComment),true);
      await context.close();
    }
    console.log('PASS: dynamic bookmark loads GitHub script through the site under X CSP, with site fallback.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
