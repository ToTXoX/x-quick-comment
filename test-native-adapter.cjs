// Integration fixture uses the exact downloaded X React/Router bundles.
// This checks isolation and context reuse, not X's private profile component.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const dir = process.env.XQC_TEST_ASSETS || path.join(process.env.TEMP, 'xqc-local-test');
const bundle = process.env.XQC_TEST_BUNDLE === 'current' ? 'x-current' : 'x-live';
const {chromium} = require(path.join(dir,'node_modules/playwright-core'));
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:path.join(dir,'chrome-testing-157.0.8103.38/chrome-win64/chrome.exe')});
  try {
    const page=await browser.newPage({viewport:{width:1400,height:900}});
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.route('https://x.com/**',route=>route.fulfill({contentType:'text/html',body:'<style>body{margin:0}main{width:1400px}[data-testid=primaryColumn]{width:800px}</style><div id="app"></div>'}));
    const startPath=process.env.XQC_TEST_START_PATH || '/notifications';
    await page.goto('https://x.com'+startPath);
    await page.evaluate(()=>{
      const modules={},cache={};
      function req(id){if(cache[id])return cache[id].exports;if(!modules[id])throw Error('Missing module '+id);const m=cache[id]={exports:{}};modules[id](m,m.exports,req);return m.exports;}
      req.m=modules;req.o=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
      req.d=(o,defs)=>{
        if(Array.isArray(defs)){for(let i=0;i<defs.length;i+=3){const key=defs[i],value=defs[i+2];Object.defineProperty(o,key,{enumerable:true,get:()=>value});}}
        else for(const key in defs)if(!req.o(o,key))Object.defineProperty(o,key,{enumerable:true,get:defs[key]});
      };
      req.r=o=>{Object.defineProperty(o,'__esModule',{value:true});};
      req.n=o=>{const fn=o&&o.__esModule?()=>o.default:()=>o;req.d(fn,{a:fn});return fn;};
      req.cw=fn=>{const m={exports:{}};fn(m,m.exports);return m.exports;};
      req.dn=value=>value;
      window.fixtureRequire=req;
      window.__SCRIPTS_LOADED__={runtime:true,vendor:true};
      const chunks=[];chunks.push=chunk=>{
        Object.assign(modules,chunk[1]);
        if(String(chunk[0][0]).startsWith('xqc-'))chunk[2](req);
        return Array.prototype.push.call(chunks,chunk);
      };window.webpackChunk_twitter_responsive_web=chunks;
    });
    for(const file of [`${bundle}-vendor.js`,`${bundle}-main.js`])await page.addScriptTag({content:fs.readFileSync(path.join(dir,file),'utf8')});
    await page.evaluate(()=>{
      const R=fixtureRequire(174394),DOM=fixtureRequire(214659),RR=fixtureRequire(518756),H=fixtureRequire(533418);
      const C=R.createContext('missing'),StoreContext=R.createContext(null);let mounts=0;
      const storeState={entities:{tweets:{entities:{'123456789':{favorited:false}}}}},listeners=new Set();
      const fakeStore={getState:()=>storeState,subscribe:fn=>{listeners.add(fn);return ()=>listeners.delete(fn);},
        setFavorited:value=>{storeState.entities.tweets.entities['123456789'].favorited=value;for(const fn of listeners)fn();}};
      window.fixtureTweetStore=fakeStore;
      function Notifications(){const [count,set]=R.useState(0);R.useEffect(()=>{mounts++;window.notificationMounts=mounts;},[]);return R.createElement('main',null,R.createElement('section',{'data-testid':'primaryColumn'},
        R.createElement('button',{id:'increment',onClick:()=>set(count+1)},'count '+count),
        ...['alice','bob','broken','hanging'].map(name=>R.createElement('a',{href:'/'+name,key:name},R.createElement('span',{'data-testid':'UserAvatar-Container-'+name},name)))));}
      class SilentBoundary extends R.Component {
        state={failed:false};
        static getDerivedStateFromError(){return {failed:true};}
        componentDidCatch(){/* Mimic X: do not retain the exception. */}
        render(){return this.state.failed?R.createElement('article',null,'Generic X error'):this.props.children;}
      }
      function BrokenProfile(){throw Error('fixture: missing native profile context');}
      const layers=document.createElement('div');layers.id='layers';
      layers.style.cssText='position:absolute;top:0;left:0;width:100%;z-index:3';
      // Match the real X ancestry: increasing only #layers cannot escape these
      // two z-index:0 stacking contexts to cover a body-level z-index:100 panel.
      const appOuter=document.createElement('div'),appInner=document.createElement('div');
      appOuter.style.cssText=appInner.style.cssText='position:relative;z-index:0';
      document.body.append(appOuter);appOuter.append(appInner);appInner.append(layers);
      function NativeLink({to,onClick,children,...props}){
        const history=RR.useHistory();
        return R.createElement('a',{...props,href:to.pathname,onClick:event=>{
          onClick?.(event);event.preventDefault();history.push(to);
        }},children);
      }
      function RepostMenu(){
        const [opened,setOpened]=R.useState(false),history=RR.useHistory();
        return R.createElement(R.Fragment,null,
          R.createElement('button',{id:'repost-menu',onClick:()=>setOpened(true)},'Repost menu'),
          opened?fixtureRequire(183322).createPortal(R.createElement('div',{role:'menu',style:{position:'fixed',right:30,top:100,background:'white',padding:20}},
            R.createElement('button',{role:'menuitem',id:'repost-confirm',onClick:()=>{window.fixtureReposts=(window.fixtureReposts||0)+1;setOpened(false);}},'Repost'),
            R.createElement(NativeLink,{role:'menuitem',id:'quote-menu',to:{pathname:'/compose/post',state:{quotedStatus:{id_str:'987654321'}}},onClick:()=>setOpened(false)},'Quote'),
            R.createElement('button',{id:'dismiss-repost',onClick:()=>setOpened(false)},'Dismiss')),layers):null);
      }
      function Profile(){
        const params=RR.useParams(),value=R.useContext(C),location=RR.useLocation(),history=RR.useHistory();
        // Exact failure reported from the real X profile bundle.
        const {filter,sort}=location.query || {};
        if(params.screenName==='broken')return R.createElement(SilentBoundary,null,R.createElement(BrokenProfile));
        if(params.screenName==='hanging')return R.createElement(HangingProfile);
        return R.createElement('article',null,
          R.createElement('h2',null,params.screenName+' '+value),
          R.createElement('a',{href:'/bob/photo'},R.createElement('span',{'data-testid':'UserAvatar-Container-bob'},'bob avatar')),
          R.createElement('div',{'data-testid':'tweet'},
            R.createElement('a',{href:'/'+params.screenName+'/status/123456789'},'tweet time'),
            R.createElement('button',{'data-testid':'like',id:'fixture-like',onClick:()=>fakeStore.setFavorited(true)},
              R.createElement('svg',{width:16,height:16},R.createElement('path',{d:'M1 1h10v10H1z'})),'Like')),
          R.createElement(RepostMenu),
          R.createElement(NativeLink,{id:'quote-link',to:{pathname:'/compose/post',state:{quotedStatus:{id_str:'111222333'}}}},'Quote directly'),
          R.createElement('output',{id:'query'},JSON.stringify({filter,sort,search:location.search})),
          R.createElement('button',{id:'filter',onClick:()=>history.push({pathname:location.pathname,query:{filter:'photo',sort:'popular'}})},'filter'),
          R.createElement('button',{id:'clear-filter',onClick:()=>history.replace({pathname:location.pathname,query:{}})},'clear'),
          R.createElement('button',{id:'back',onClick:()=>history.goBack()},'back'),
          R.createElement('button',{id:'forward',onClick:()=>history.goForward()},'forward'),
          R.createElement('button',{id:'reply-state',onClick:()=>history.push({pathname:'/compose/post',state:{inReplyToStatusId:'123456789'}})},'Reply with state'),
          R.createElement('a',{href:'/compose/post'},'Reply'));
      }
      function ProfilePage(){return R.createElement('main',null,
        R.createElement('section',{'data-testid':'primaryColumn'},R.createElement(Profile)));}
      function StatusPage(){return R.createElement('main',null,
        R.createElement('section',{'data-testid':'primaryColumn'},
          R.createElement('h1',null,'Status page'),
          R.createElement('a',{href:'/bob'},R.createElement('span',{'data-testid':'UserAvatar-Container-bob'},'bob avatar'))));}
      function HangingProfile(){
        R.useEffect(()=>{window.hangingMounts=(window.hangingMounts||0)+1;},[]);
        return R.createElement('main',null,
          R.createElement('div',{'data-testid':'UserName'},'@hanging'),
          R.createElement('div',{role:'progressbar','aria-label':'正在加载 @hanging 的帖子'}));
      }
      class ComposeScreen extends R.Component {
        componentDidMount(){
          const h=this.props.history;
          h.setModalRoute(h.location,true);
          h.setModalRouteBreakpoint(h.location);
          window.fixtureModalHistory=h;
        }
        componentWillUnmount(){this.props.history.setModalRouteBreakpoint(this.props.history.location);}
        render(){return R.createElement('div',null,
          R.createElement('label',null,'Reply text',R.createElement('textarea',{id:'reply'})),
          R.createElement('button',{id:'close-compose',onClick:()=>this.props.history.goBackThroughModals()},'Close reply'));}
      }
      const Compose=RR.withRouter(ComposeScreen);
      // Stand-in for the already-running AppShell router. The native composer
      // renders outside the copied panel, with its own header and close action.
      const nativeHistory=H.createMemoryHistory({initialEntries:[location.pathname]});
      nativeHistory.setModalRoute=()=>{};
      nativeHistory.setModalRouteBreakpoint=()=>{};
      nativeHistory.goBackThroughModals=()=>nativeHistory.goBack();
      const richHistoryId=Object.keys(fixtureRequire.m).find(id=>{
        const source=String(fixtureRequire.m[id]);
        return ['RichHistory','goBackThroughModals','initialRwebLocationKey'].every(marker=>source.includes(marker));
      });
      if(!richHistoryId)throw Error('Fixture could not find X native history');
      fixtureRequire.m[richHistoryId]=(module)=>{
        // Keep the real module's signature while substituting fixture history:
        // RichHistory goBackThroughModals initialRwebLocationKey
        module.exports={Ay:nativeHistory};
      };
      const modalHost=document.createElement('div');modalHost.id='native-modal';document.body.append(modalHost);
      const modalRoot=DOM.createRoot(modalHost);
      nativeHistory.listen(location=>{
        modalRoot.render(location.pathname.startsWith('/compose/')?
          R.createElement(RR.Router,{history:nativeHistory},R.createElement(Compose)):null);
      });
      window.fixtureNativeHistory=nativeHistory;
      const mainHistory=H.createMemoryHistory({initialEntries:[location.pathname]});
      window.fixtureMainHistory=mainHistory;
      const appTree=R.createElement(C.Provider,{value:'shared-context'},R.createElement(RR.Router,{history:mainHistory},R.createElement(RR.Switch,null,
        R.createElement(RR.Route,{path:['/notifications','/home'],exact:true,component:Notifications}),
        R.createElement(RR.Route,{path:'/compose/post',component:Compose}),
        R.createElement(RR.Route,{path:'/:screenName/status/:id',exact:true,component:StatusPage}),
        R.createElement(RR.Route,{path:'/:screenName',exact:true,component:ProfilePage}))));
      DOM.createRoot(document.querySelector('#app')).render(R.createElement(StoreContext.Provider,{value:{store:fakeStore}},appTree));
    });
    await page.locator('#increment').click();
    await page.evaluate(fs.readFileSync(path.join(__dirname,'bookmarklet.js'),'utf8'));
    await page.locator('#app [data-testid="UserAvatar-Container-alice"]').click();
    await page.getByRole('heading',{name:'alice shared-context'}).waitFor({timeout:3000}).catch(async e=>{console.error(await page.locator('#xqc-native-panel').innerText());throw e;});
    await page.locator('#xqc-native-panel #fixture-like').click();
    await page.waitForFunction(()=>document.querySelector('#xqc-native-panel #fixture-like')?.classList.contains('xqc-liked-from-store'));
    assert.equal(await page.locator('#xqc-native-panel #fixture-like svg').evaluate(el=>getComputedStyle(el).color),'rgb(249, 24, 128)');
    assert.equal(await page.locator('#xqc-native-panel #fixture-like').getAttribute('data-testid'),'like');
    assert.equal(await page.evaluate(()=>fixtureTweetStore.getState().entities.tweets.entities['123456789'].favorited),true);
    await page.evaluate(()=>fixtureTweetStore.setFavorited(false));
    await page.waitForFunction(()=>!document.querySelector('#xqc-native-panel #fixture-like')?.classList.contains('xqc-liked-from-store'));
    assert.deepEqual(JSON.parse(await page.locator('#query').innerText()),{search:''});
    await page.locator('#filter').click();
    assert.deepEqual(JSON.parse(await page.locator('#query').innerText()),{filter:'photo',sort:'popular',search:'?filter=photo&sort=popular'});
    await page.locator('#back').click();
    assert.deepEqual(JSON.parse(await page.locator('#query').innerText()),{search:''});
    await page.locator('#forward').click();
    assert.equal(JSON.parse(await page.locator('#query').innerText()).filter,'photo');
    await page.locator('#clear-filter').click();
    assert.deepEqual(JSON.parse(await page.locator('#query').innerText()),{search:''});
    await page.locator('#increment').click();
    assert.equal(await page.locator('#increment').innerText(),'count 2');
    await page.locator('#app [data-testid="UserAvatar-Container-bob"]').click();
    await page.getByRole('heading',{name:'bob shared-context'}).waitFor();
    assert.equal(await page.locator('#xqc-native-panel .xqc-footer .xqc-update').getAttribute('href'),'https://x.usdts.de/');
    assert.equal(await page.locator('#xqc-native-panel .xqc-footer .xqc-repo').getAttribute('href'),'https://github.com/ToTXoX/x-quick-comment');
    assert.equal(await page.locator('#xqc-native-panel .xqc-footer a[aria-label="dk021 的 X 主页"]').getAttribute('href'),'https://x.com/yygqdkqk');
    assert.equal((await page.locator('#xqc-native-panel .xqc-footer').innerText()).includes('by dk021'),false);
    assert.equal(await page.locator('#xqc-native-panel .xqc-footer-links a svg').count(),2);
    assert.equal(await page.locator('#xqc-native-panel .xqc-actions button').count(),2);
    assert.equal(await page.locator('#xqc-native-panel .xqc-footer-links a').first().evaluate(el=>getComputedStyle(el).width),'22px');
    assert.equal(await page.locator('#xqc-native-panel .xqc-version').innerText(),
      'v'+await page.locator('#xqc-native-panel').getAttribute('data-version'));
    assert.match((await page.locator('#xqc-native-panel .xqc-footer-note').innerText()).replace(/\s+/g,''),/更新请到官网重新获取书签/);
    assert.match(await page.locator('#xqc-native-panel .xqc-caption').innerText(),/整页刷新需要重新点击书签，开启侧边栏/);
    await page.setViewportSize({width:1120,height:900});
    assert.equal(await page.locator('#xqc-native-panel>header').evaluate(el=>el.scrollWidth>el.clientWidth),false);
    assert.equal(await page.locator('#xqc-native-panel .xqc-footer').evaluate(el=>Math.round(el.getBoundingClientRect().bottom)),900);
    assert.equal(await page.locator('#xqc-native-panel .xqc-footer').evaluate(el=>Math.abs(el.getBoundingClientRect().left-el.parentElement.getBoundingClientRect().left)<2),true);
    await page.setViewportSize({width:1400,height:900});
    await page.locator('#xqc-native-panel article').evaluate(el=>{window.fixtureBeforeReload=el;});
    await page.getByRole('button',{name:'重新加载侧栏'}).click();
    await page.waitForFunction(()=>document.querySelector('#xqc-native-panel article')!==window.fixtureBeforeReload);
    await page.getByRole('heading',{name:'bob shared-context'}).waitFor();
    await page.locator('#xqc-native-panel').evaluate(el=>{window.fixtureProfileNode=el.querySelector('article');});
    await page.locator('#xqc-native-panel').getByRole('link',{name:'Reply'}).click();
    await page.locator('#reply').fill('unsubmitted draft');
    assert.equal(await page.locator('#reply').inputValue(),'unsubmitted draft');
    assert.equal(new URL(page.url()).pathname,startPath);
    assert.equal(await page.evaluate(()=>notificationMounts),1);
    assert.equal(await page.locator('#xqc-native-panel').isVisible(),true);
    assert.equal(await page.locator('#xqc-native-panel #reply').count(),0);
    assert.equal(await page.locator('#native-modal #reply').count(),1);
    assert.equal(await page.evaluate(()=>document.querySelector('#xqc-native-panel article')===window.fixtureProfileNode),true);
    await page.locator('#close-compose').click();
    await page.getByRole('heading',{name:'bob shared-context'}).waitFor();
    assert.equal(await page.locator('#xqc-native-panel').isVisible(),true);
    assert.equal(await page.locator('#native-modal #reply').count(),0);
    assert.equal(await page.evaluate(()=>notificationMounts),1);
    // Native reply buttons carry their target in history state, not just the URL.
    await page.locator('#reply-state').click();
    await page.locator('#native-modal #reply').waitFor();
    assert.equal(await page.evaluate(()=>fixtureNativeHistory.location.state.inReplyToStatusId),'123456789');
    assert.equal(await page.locator('#xqc-native-panel #reply').count(),0);
    await page.locator('#close-compose').click();
    await page.getByRole('heading',{name:'bob shared-context'}).waitFor();
    // Native menus portal outside the panel must remain on top and clickable.
    await page.locator('#repost-menu').click();
    const repost=page.locator('#repost-confirm');
    const bounds=await repost.boundingBox();
    assert.equal(await page.evaluate(()=>document.getElementById('layers').parentElement===document.getElementById('xqc-native-panel').parentElement),true);
    assert.equal(await page.evaluate(({x,y})=>document.elementFromPoint(x,y)?.closest('#repost-confirm')?.id,
      {x:bounds.x+bounds.width/2,y:bounds.y+bounds.height/2}),'repost-confirm');
    await page.locator('#dismiss-repost').click();
    await page.locator('#repost-menu').click();
    await page.locator('#quote-menu').click();
    await page.locator('#native-modal #reply').waitFor();
    assert.equal(await page.evaluate(()=>fixtureNativeHistory.location.state.quotedStatus.id_str),'987654321');
    assert.equal(await page.locator('#xqc-native-panel').isVisible(),true);
    await page.locator('#close-compose').click();
    await page.getByRole('heading',{name:'bob shared-context'}).waitFor();
    // A React Link inside the panel must retain state too, with one navigation.
    const beforeIndex=await page.evaluate(()=>fixtureNativeHistory.index);
    await page.locator('#quote-link').click();
    await page.locator('#native-modal #reply').waitFor();
    assert.equal(await page.evaluate(()=>fixtureNativeHistory.location.state.quotedStatus.id_str),'111222333');
    assert.equal(await page.evaluate(()=>fixtureNativeHistory.index),beforeIndex+1);
    await page.locator('#close-compose').click();
    await page.getByRole('heading',{name:'bob shared-context'}).waitFor();
    assert.equal(await page.evaluate(()=>window.fixtureReposts||0),0);
    await page.getByRole('button',{name:'关闭𝕏侧栏'}).click();
    assert.equal(await page.locator('#xqc-native-panel').count(),0);
    assert.equal(await page.locator('#layers').evaluate(el=>getComputedStyle(el).zIndex),'3');
    await page.locator('#increment').click();
    assert.equal(await page.locator('#increment').innerText(),'count 3');
    await page.evaluate(fs.readFileSync(path.join(__dirname,'bookmarklet.js'),'utf8'));
    await page.locator('#app [data-testid="UserAvatar-Container-broken"]').click();
    const diagnostic=page.locator('#xqc-native-panel>[role=status]');
    await diagnostic.filter({hasText:'fixture: missing native profile context'}).waitFor();
    assert.equal(await diagnostic.isVisible(),true);
    assert.match(await diagnostic.innerText(),/BrokenProfile/);
    await page.locator('#app [data-testid="UserAvatar-Container-alice"]').click();
    assert.match(await diagnostic.innerText(),/fixture: missing native profile context/);
    await page.getByRole('button',{name:'关闭𝕏侧栏'}).click();
    assert.deepEqual(errors,[]);
    await page.clock.install();
    await page.evaluate(fs.readFileSync(path.join(__dirname,'bookmarklet.js'),'utf8'));
    await page.locator('#app [data-testid="UserAvatar-Container-hanging"]').click();
    await page.locator('#xqc-native-panel [role=progressbar]').waitFor({state:'attached'});
    await page.clock.fastForward(15000);
    await page.waitForFunction(()=>window.hangingMounts===2);
    await page.clock.fastForward(15000);
    await page.getByRole('button',{name:'重试侧栏'}).waitFor();
    assert.equal(await page.locator('#xqc-native-panel>[role=status] a').getAttribute('href'),'/hanging');
    await page.getByRole('button',{name:'关闭𝕏侧栏'}).click();
    for(const route of ['/MengShi63540','/MengShi63540/status/2118335318088876326']){
      await page.evaluate(path=>{window.history.replaceState({},'',path);fixtureMainHistory.push(path);},route);
      await page.locator('#app [data-testid="UserAvatar-Container-bob"]').waitFor();
      await page.evaluate(fs.readFileSync(path.join(__dirname,'bookmarklet.js'),'utf8'));
      await page.locator('#app [data-testid="UserAvatar-Container-bob"]').click();
      await page.locator('#xqc-native-panel article h2').filter({hasText:'bob shared-context'}).waitFor();
      await page.getByRole('button',{name:'关闭𝕏侧栏'}).click();
    }
    // Simulate a new X deployment that renumbers every module. Internal
    // dependencies still use the original fixture ids; the public runtime
    // surface exposed to the bookmarklet uses only the new ids.
    await page.evaluate(()=>{
      const chunks=window.webpackChunk_twitter_responsive_web;
      const modules=fixtureRequire.m;
      const offset=1000000;
      const shifted=id=>fixtureRequire(Number(id)-offset);
      shifted.m=Object.fromEntries(Object.entries(modules).map(([id,factory])=>[Number(id)+offset,factory]));
      chunks.push=chunk=>{
        Object.assign(modules,chunk[1]);
        if(String(chunk[0][0]).startsWith('xqc-'))chunk[2](shifted);
        return Array.prototype.push.call(chunks,chunk);
      };
      window.history.replaceState({},'','/notifications');
      fixtureMainHistory.push('/notifications');
    });
    await page.evaluate(fs.readFileSync(path.join(__dirname,'bookmarklet.js'),'utf8'));
    await page.locator('#app [data-testid="UserAvatar-Container-alice"]').click();
    await page.getByRole('heading',{name:'alice shared-context'}).waitFor();
    await page.getByRole('button',{name:'关闭𝕏侧栏'}).click();
    assert.deepEqual(errors,[]);
    console.log('PASS: renumbered modules; home, profile and status activation; native routing and composer; nested errors; stalled timeline retry and fallback. Native X profile still requires live validation.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
