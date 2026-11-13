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
    const source = fs.readFileSync(path.join(__dirname,'bookmarklet.js'),'utf8');
    const installPage = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
    const bookmarkUrl = 'javascript:' + encodeURIComponent(loader);
    assert.ok(bookmarkUrl.length < 8000);
    assert.ok(installPage.includes(`id="install-bookmark" href="${bookmarkUrl}"`));
    assert.ok(installPage.includes('title="拖动冒冒"><span class="bookmark-name">点我冒冒</span></a>'));
    const bookmarks = fs.readFileSync(path.join(__dirname,'x-quick-comment-bookmarks.html'),'utf8');
    assert.ok(bookmarks.includes(bookmarkUrl));
    assert.match(bookmarks, /ICON="[^"]+">点我冒冒<\/A>/);
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
      if (!githubAvailable) {
        await context.route('https://example.org/**',route=>route.fulfill({contentType:'text/html',body:'<title>Another site</title>'}));
        for (const bookmark of [loader,source]) {
          await page.goto('https://example.org/');
          await page.evaluate(bookmark);
          await page.evaluate(bookmark);
          const prompt=page.getByRole('dialog',{name:'跳转到你的 X 主页后，再点击本书签使用侧栏'});
          await prompt.getByRole('button',{name:'取消',exact:true}).click();
          await page.locator('#peekala-redirect').waitFor({state:'detached'});
          assert.equal(page.url(),'https://example.org/');
          await page.evaluate(bookmark);
          await page.keyboard.press('Escape');
          await page.locator('#peekala-redirect').waitFor({state:'detached'});
          assert.equal(page.url(),'https://example.org/');
          await page.evaluate(bookmark);
          await Promise.all([page.waitForURL('https://x.com/home'),prompt.getByRole('button',{name:'跳转 x.com'}).click()]);
        }
      } else {
        await page.goto('https://x.com/notifications');
      }
      await page.locator('#launch').click();
      await page.waitForFunction(available=>available
        ? window.__xqcRemoteLoaded === true
        : !!document.querySelector('#xqc-native-panel'),githubAvailable);
      if (!githubAvailable) {
        const controls=page.getByRole('group',{name:'Peekala 功能开关'});
        await controls.waitFor();
        assert.equal(await controls.evaluate(el=>el.parentElement.matches('#xqc-native-panel > header > .xqc-actions')),true);
        await page.locator('#launch').click();
        assert.equal(await controls.getByRole('switch',{name:'点赞特效'}).evaluate(el=>el===document.activeElement),true);
      }
      assert.deepEqual(alerts,[]);
      assert.equal(await page.evaluate(()=>!!window.__xQuickComment),true);
      await context.close();
    }
    console.log('PASS: bookmarks confirm or cancel navigation to X; dynamic bookmark loads GitHub or site fallback under X CSP.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
