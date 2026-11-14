const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const dir = process.env.XQC_TEST_ASSETS || path.join(process.env.TEMP, 'xqc-local-test');
const {chromium} = require(path.join(dir, 'node_modules/playwright-core'));

(async () => {
  const browser = await chromium.launch({
    headless:true,
    executablePath:process.env.XQC_TEST_BROWSER || path.join(dir,'chrome-testing-157.0.8103.38/chrome-win64/chrome.exe')
  });
  try {
    const loader = fs.readFileSync(path.join(__dirname,'loader-bookmarklet.js'),'utf8');
    const source = fs.readFileSync(path.join(__dirname,'bookmarklet.js'),'utf8');
    const version = source.match(/const version = '([^']+)'/)[1];
    const installPage = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
    const stickerPack = JSON.parse(installPage.match(/const stickerPack = (.*);/)[1]);
    const pack = fs.readFileSync(path.join(__dirname,stickerPack.path));
    const hash = createHash('sha256').update(pack).digest();
    assert.equal(stickerPack.integrity,'sha256-'+hash.toString('base64'));
    assert.equal(path.basename(stickerPack.path),'stickers.'+hash.toString('hex')+'.bin');
    let offset = 4+pack.readUInt32LE(0);
    assert.deepEqual(JSON.parse(pack.subarray(4,offset)),stickerPack.catalog);
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname,'docs/like-gifs/manifest.json'),'utf8'));
    for (const [index, {id,size}] of stickerPack.catalog.stickers.entries()) {
      const {file}=manifest.stickers[index];
      assert.equal(id,manifest.stickers[index].id || path.basename(file,'.gif'));
      assert.deepEqual(pack.subarray(offset,offset+size),fs.readFileSync(path.join(__dirname,'docs/like-gifs',file)));
      offset+=size;
    }
    assert.equal(offset,pack.length);
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
    for (const scenario of ['remote','fallback','timeout','corrupt']) {
      const githubAvailable=scenario!=='fallback';
      const gifsAvailable=scenario==='remote' || scenario==='fallback';
      const context = await browser.newContext();
      const alerts=[];
      await context.route('https://x.com/**',route=>route.fulfill({
        contentType:'text/html',headers:{'content-security-policy':csp,'cross-origin-opener-policy':'same-origin-allow-popups'},body:xPage
      }));
      const requestedStickers = [];
      await context.route('https://x.usdts.de/**',route=>{
        const requestPath=new URL(route.request().url()).pathname;
        if (!requestPath.startsWith('/docs/like-gifs/')) return route.fulfill({contentType:'text/html',body:installPage});
        requestedStickers.push(requestPath);
        if (scenario==='timeout') return;
        return route.fulfill({contentType:'application/octet-stream',body:scenario==='corrupt'?Buffer.from('bad pack'):pack});
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
      await page.addInitScript(()=>{
        window.fixtureMessages=[];
        window.addEventListener('message',event=>{
          if (event.origin!=='https://x.usdts.de') return;
          const {kind,token,source,pack}=event.data;
          window.fixtureMessages.push({kind,token,source,bytes:pack?.byteLength});
        });
      });
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
      assert.deepEqual(requestedStickers,['/'+stickerPack.path]);
      await page.waitForFunction(()=>window.fixtureMessages.length===2);
      const [scriptMessage,assetsMessage]=await page.evaluate(()=>window.fixtureMessages);
      assert.equal(scriptMessage.kind,'xqc-source');
      const bootstrap=JSON.stringify({token:scriptMessage.token,catalog:stickerPack.catalog}).replaceAll('<','\\u003c');
      const remoteMarker=githubAvailable ? 'window.__xqcRemoteLoaded=true;\n' : '';
      assert.equal(scriptMessage.source,'window.__xqcStickerPack='+bootstrap+';\n'+remoteMarker+source);
      assert.ok(scriptMessage.source.length<=250000);
      assert.equal(assetsMessage.kind,'xqc-assets');
      assert.equal(assetsMessage.token,scriptMessage.token);
      assert.equal(assetsMessage.bytes,gifsAvailable ? pack.length : undefined);
      await page.getByRole('button',{name:'换表情',exact:true}).click();
      const wasabi=page.getByRole('button',{name:'芥末辣',exact:true});
      if (gifsAvailable) {
        await page.waitForFunction(count=>[...document.querySelectorAll('.xqc-sticker-tile img')]
          .filter(img=>img.naturalWidth>0).length===count,stickerPack.catalog.stickers.length,{timeout:5000});
        await wasabi.click();
        await page.waitForFunction(()=>document.querySelector('#xqc-sticker-manager .xqc-like-effect img')?.naturalWidth===64);
      } else {
        await wasabi.click();
        await page.getByText('这张 GIF 暂未加载，请刷新 X 页面后再点击书签。',{exact:true}).waitFor();
      }
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
    console.log('PASS: legacy bookmark receives the script and one separate binary pack; side panel opens on timeout and integrity failure.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
