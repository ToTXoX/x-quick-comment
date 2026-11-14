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
    const version = source.match(/const version = '([^']+)'/)[1];
    const installPage = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
    const bookmarkUrl = 'javascript:' + encodeURIComponent(loader);
    assert.ok(bookmarkUrl.length < 8000);
    assert.ok(installPage.includes(`id="install-bookmark" href="${bookmarkUrl}"`));
    assert.ok(installPage.includes('title="拖动冒冒"><span class="bookmark-name">点我冒冒</span></a>'));
    const bookmarks = fs.readFileSync(path.join(__dirname,'x-quick-comment-bookmarks.html'),'utf8');
    assert.ok(bookmarks.includes(bookmarkUrl));
    assert.match(bookmarks, /ICON="[^"]+">点我冒冒<\/A>/);
    const csp = "default-src 'self'; script-src 'self' 'nonce-fixture'; connect-src 'self'; frame-src 'self'; img-src 'self' data: blob:";
    const xPage = `<meta property="csp-nonce" content="fixture"><button id="launch">Launch</button>
      <script nonce="fixture">document.getElementById('launch').onclick=()=>{${loader}};</script>`;
    for (const githubAvailable of [true,false]) {
      const context = await browser.newContext();
      const alerts=[];
      await context.route('https://x.com/**',route=>route.fulfill({
        contentType:'text/html',headers:{'content-security-policy':csp,'cross-origin-opener-policy':'same-origin-allow-popups'},body:xPage
      }));
      const requestedStickers = new Set();
      await context.route('https://x.usdts.de/**',route=>{
        const requestPath=new URL(route.request().url()).pathname;
        const asset=requestPath.match(/^\/docs\/like-gifs\/([a-z-]+)\.gif$/)?.[1];
        if (!asset) return route.fulfill({contentType:'text/html',body:installPage});
        requestedStickers.add(asset);
        return route.fulfill({contentType:'image/gif',path:path.join(__dirname,'docs','like-gifs',asset+'.gif')});
      });
      await context.route('https://raw.githubusercontent.com/**',route=>route.fulfill({
        status:githubAvailable?200:503,
        contentType:'text/plain',
        headers:{'access-control-allow-origin':'*'},
        body:githubAvailable
          ? 'window.__xqcRemoteLoaded=true;\n'+source
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
      await page.locator(`#xqc-native-panel[data-version="${version}"]`).waitFor({timeout:10000});
      assert.equal(await page.evaluate(()=>window.__xqcRemoteLoaded===true),githubAvailable);
      assert.deepEqual([...requestedStickers].sort(),['big-fish','jensenhuang','musk','nailoong','peekala-peek','small-fish','wasabi']);
      await page.getByRole('button',{name:'管理点赞特效动画'}).click();
      await page.waitForFunction(()=>[...document.querySelectorAll('.xqc-sticker-tile img')]
        .filter(img=>img.naturalWidth>0).length===7,undefined,{timeout:5000});
      await page.getByRole('button',{name:'芥末辣',exact:true}).click();
      await page.waitForFunction(()=>document.querySelector('#xqc-sticker-manager .xqc-like-effect img')?.naturalWidth===64);
      await page.keyboard.press('Escape');
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
