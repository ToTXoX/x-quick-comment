const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dir=process.env.XQC_TEST_ASSETS||path.join(process.env.TEMP,'xqc-local-test');
const {chromium}=require(path.join(dir,'node_modules/playwright-core'));
const source=fs.readFileSync(path.join(__dirname,'x-split-link.user.js'),'utf8');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.XQC_BROWSER_PATH||path.join(dir,'chrome-testing-157.0.8103.38/chrome-win64/chrome.exe')});
 try{
  const context=await browser.newContext(),values={},tabs=new Map(),pages=new Set();let serial=0;
  await context.exposeBinding('__gm',async({page},op,key,value)=>{
   if(!tabs.has(page))tabs.set(page,{key:String(++serial),data:{}});
   const item=tabs.get(page);
   if(op==='getTab')return {tab:item.data,values};
   if(op==='saveTab'){item.data=key;return;}
   if(op==='getTabs')return Object.fromEntries([...tabs].filter(([p])=>!p.isClosed()).map(([,t])=>[t.key,t.data]));
   if(op==='set'){
    const old=values[key];values[key]=value;
    await Promise.all([...pages].filter(p=>!p.isClosed()).map(p=>p.evaluate(({key,old,value,remote})=>window.__deliver?.(key,old,value,remote),{key,old,value,remote:p!==page}).catch(()=>{})));
   }
  });
  await context.addInitScript(()=>{
   const store={},listeners=[];
   window.__deliver=(k,o,v,r)=>{store[k]=v;listeners.filter(l=>l.key===k).forEach(l=>l.fn(k,o,v,r));};
   window.GM_getTab=cb=>window.__gm('getTab').then(r=>{Object.assign(store,r.values);cb(r.tab);});
   window.GM_saveTab=(tab,cb)=>window.__gm('saveTab',tab).then(()=>cb?.());
   window.GM_getTabs=cb=>window.__gm('getTabs').then(cb);
   window.GM_getValue=(k,d)=>store[k]===undefined?d:store[k];
   window.GM_setValue=(k,v)=>{store[k]=v;void window.__gm('set',k,v);};
   window.GM_addValueChangeListener=(key,fn)=>listeners.push({key,fn});
   window.GM_registerMenuCommand=()=>{};
  });
  await context.addInitScript(code=>document.addEventListener('DOMContentLoaded',()=>{(0,eval)(code);}),source);
  await context.route('https://x.com/**',r=>r.fulfill({contentType:'text/html',body:'<main><div data-testid="primaryColumn"><button id="counter" onclick="this.textContent=Number(this.textContent)+1">0</button><a href="/alice"><span data-testid="UserAvatar-Container-alice">alice</span></a><a href="/bob"><span data-testid="UserAvatar-Container-bob">bob</span></a><a href="/normal" id="normal">ordinary link</a></div></main><textarea aria-label="Reply"></textarea>'}));
  const make=async url=>{const p=await context.newPage();pages.add(p);await p.goto(url);await p.locator('#x-split-link-widget').waitFor();return p;};
  const left=await make('https://x.com/notifications'),right=await make('https://x.com/home'),other=await make('https://x.com/explore');
  await right.locator('#x-split-link-widget summary').click();
  await right.getByRole('button',{name:'设为右侧接收页'}).click();
  await left.locator('[data-testid="UserAvatar-Container-alice"]').click();
  await right.waitForURL('https://x.com/alice');await right.locator('#x-split-link-widget').waitFor();
  assert.equal(left.url(),'https://x.com/notifications');assert.equal(other.url(),'https://x.com/explore');
  await left.locator('#counter').click();assert.equal(await left.locator('#counter').innerText(),'1');
  await left.locator('[data-testid="UserAvatar-Container-bob"]').click();
  await right.waitForURL('https://x.com/bob');await right.locator('#x-split-link-widget').waitFor();
  await right.getByRole('textbox',{name:'Reply',exact:true}).fill('keep this unsent draft');
  await left.locator('[data-testid="UserAvatar-Container-alice"]').click();
  await right.getByText('检测到未发送内容，已暂缓切换。').waitFor();
  assert.equal(right.url(),'https://x.com/bob');
  await right.getByRole('button',{name:'取消切换'}).click();
  assert.equal(await right.getByRole('textbox',{name:'Reply',exact:true}).inputValue(),'keep this unsent draft');
  await left.locator('[data-testid="UserAvatar-Container-alice"]').click();
  await right.getByRole('button',{name:'确认离开并切换'}).click();
  await right.waitForURL('https://x.com/alice');await right.locator('#x-split-link-widget').waitFor();
  await other.locator('#x-split-link-widget summary').click();await other.getByRole('button',{name:'设为右侧接收页'}).click();
  await left.locator('[data-testid="UserAvatar-Container-bob"]').click();await other.waitForURL('https://x.com/bob');
  assert.equal(right.url(),'https://x.com/alice');
  await other.close();await left.locator('[data-testid="UserAvatar-Container-alice"]').click();
  await left.getByText('接收页已关闭或切换，请在右侧重新指定接收页。').waitFor();
  assert.equal(left.url(),'https://x.com/notifications');
  await left.getByRole('button',{name:'暂停头像联动'}).click();
  await left.locator('[data-testid="UserAvatar-Container-alice"]').click();await left.waitForURL('https://x.com/alice');
  console.log('PASS: cross-tab routing, receiver survives navigation, untouched notification state, draft protection/cancel/confirm, exclusive receiver, closed receiver detection, pause restores native navigation. GM APIs simulated; real browser split/Tampermonkey needs manual validation.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
