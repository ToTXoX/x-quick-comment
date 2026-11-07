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
    for(const file of [`${bundle}-vendor.js`,`${bundle}-main.js`,'x-app-modules.js'])await page.addScriptTag({content:fs.readFileSync(path.join(dir,file),'utf8')});
    await page.evaluate(()=>{
      const R=fixtureRequire(174394),DOM=fixtureRequire(214659),RR=fixtureRequire(518756),H=fixtureRequire(533418);
      const Redux=fixtureRequire(777407);
      const C=R.createContext('missing'),StoreContext=R.createContext(null);let mounts=0;
      // Use X's real module-level configuration queue. Main route remounts must
      // never promote the sidebar's profile configuration to the native nav.
      const configureId=Object.keys(fixtureRequire.m).find(id=>String(fixtureRequire.m[id]).includes('Only one Configuration for this component can be mounted at a time'));
      // This module only reports duplicate-registration diagnostics to X.
      fixtureRequire.m[212400]=module=>{module.exports={default:()=>{window.fixtureConfigWarnings=(window.fixtureConfigWarnings||0)+1;}};};
      const makeConfigured=fixtureRequire(configureId).A;
      const Navigation=makeConfigured(({composeOptions})=>R.createElement('button',{id:'main-post',onClick:()=>window.fixtureNativeHistory.push({pathname:'/compose/post',state:composeOptions})},'New post'));
      const originalConfigure=Navigation.Configure;
      // X's header wraps its memo Configure in a modal-aware function.
      Navigation.Configure=props=>R.createElement(originalConfigure,props);
      window.fixtureNavigation=Navigation;
      window.fixtureOriginalConfigure=Navigation.Configure;
      fixtureRequire.m[999999]=module=>{
        // _renderSideNav sideNavWrapper configMounted Configure
        module.exports={default:Navigation};
      };
      function MainConfig(){
        const [epoch,setEpoch]=R.useState(0);
        window.fixtureRemountConfig=()=>setEpoch(v=>v+1);
        return R.createElement(Navigation.Configure,{key:epoch,composeOptions:window.fixtureMainComposeOptions||{}});
      }
      const navHost=document.createElement('div');document.body.append(navHost);
      DOM.createRoot(navHost).render(R.createElement(R.Fragment,null,R.createElement(MainConfig),R.createElement(Navigation)));
      let storeState={timelineRevision:0,notificationIds:['222','333','444','555'],entities:{
        users:{entities:{me:{id_str:'me',screen_name:'owner'},alice:{id_str:'alice',screen_name:'alice'}}},
        tweets:{entities:{'123456789':{favorited:false},
          '111':{id_str:'111',user:'me',full_text:'今天分享一个提高工作效率的方法。先整理任务，再集中处理通知。'},
          '222':{id_str:'222',user:'alice',full_text:'这个方法很有用',in_reply_to_status_id_str:'111',in_reply_to_user_id_str:'me',in_reply_to_screen_name:'owner',conversation_id_str:'111'},
          '333':{id_str:'333',user:'me',full_text:'谢谢，我也这样做',in_reply_to_status_id_str:'222',in_reply_to_user_id_str:'alice',in_reply_to_screen_name:'alice',conversation_id_str:'111'},
          '444':{id_str:'444',full_text:'有一个补充问题',in_reply_to_status_id_str:'777',conversation_id_str:'111'},
          '555':{id_str:'555',full_text:'This is a quote, not a reply',quoted_status:'111'}
        }}}};
      const listeners=new Set();
      const fakeStore={getState:()=>storeState,subscribe:fn=>{listeners.add(fn);return ()=>listeners.delete(fn);},
        dispatch:action=>{storeState={...storeState,timelineRevision:action.revision};for(const fn of [...listeners])fn();return action;},
        subscriberCount:()=>listeners.size,
        updateNotifications:(tweets,ids)=>{
          storeState={...storeState,notificationIds:ids || storeState.notificationIds,
            entities:{...storeState.entities,tweets:{entities:{...storeState.entities.tweets.entities,...tweets}}}};
          for(const fn of [...listeners])fn();
        },
        setFavorited:value=>{storeState.entities.tweets.entities['123456789'].favorited=value;for(const fn of listeners)fn();}};
      window.fixtureTweetStore=fakeStore;
      function NotificationRows(){
        const state=Redux.d4(state=>state),history=RR.useHistory();
        return state.notificationIds.map((id,index)=>R.createElement('article',{'data-testid':'tweet','data-notification-id':id,key:index,onClick:()=>{
          window.fixtureNativeNotificationClicks=(window.fixtureNativeNotificationClicks||0)+1;history.push('/alice/status/'+id);
        },style:{padding:'16px',borderBottom:'1px solid #ddd'}},
          R.createElement('div',{'data-testid':'quoteTweet'},R.createElement('a',{href:'/quoted/status/987'},R.createElement('time',null,'Quoted time'))),
          R.createElement('a',{href:'/alice/status/'+id},R.createElement('time',null,'通知 · 刚刚')),
          R.createElement('div',{'data-testid':'tweetText'},state.entities.tweets.entities[id]?.full_text),
          R.createElement('button',{onClick:event=>{event.stopPropagation();window.fixtureNotificationLikes=(window.fixtureNotificationLikes||0)+1;}},'Like notification')));
      }
      function NotificationsContent(){const [count,set]=R.useState(0);R.useEffect(()=>{mounts++;window.notificationMounts=mounts;},[]);return R.createElement('main',null,R.createElement('section',{'data-testid':'primaryColumn'},
        R.createElement('button',{id:'increment',onClick:()=>set(count+1)},'count '+count),
        R.createElement('output',{id:'main-store-state'},Redux.d4(state=>state.timelineRevision)),
        R.createElement(NotificationRows),
        ...['alice','bob','broken','hanging','slow','updates'].map(name=>R.createElement('a',{href:'/'+name,key:name},R.createElement('span',{'data-testid':'UserAvatar-Container-'+name},name)))));}
      // Real connect() inserts a nested subscription into the context copied
      // by the sidebar. Unmounting its owner must not strand the sidebar.
      const ConnectedNotifications=Redux.Ng(()=>({}))(NotificationsContent);
      function Notifications(){
        const [epoch,setEpoch]=R.useState(0);
        window.fixtureRemountNotifications=()=>setEpoch(value=>value+1);
        return R.createElement(ConnectedNotifications,{key:epoch});
      }
      const ConnectedRevision=Redux.Ng(state=>({revision:state.timelineRevision}))(
        ({revision})=>R.createElement('output',{id:'connected-state'},revision));
      function StoreProfile(){
        const revision=Redux.d4(state=>state.timelineRevision);
        R.useEffect(()=>{window.storeProfileMounts=(window.storeProfileMounts||0)+1;},[]);
        return R.createElement('article',null,
          R.createElement('h2',null,'Profile header loaded'),
          R.createElement('output',{id:'hook-state'},revision),R.createElement(ConnectedRevision),
          revision?R.createElement('div',{'data-testid':'tweet'},'Loaded post '+revision):
            R.createElement('div',{role:'progressbar'},'Timeline waiting'));
      }
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
        const contextHistory=R.useContext(StoreContext)?.history;
        // Exact failure reported from the real X profile bundle.
        const {filter,sort}=location.query || {};
        if(params.screenName==='broken')return R.createElement(SilentBoundary,null,R.createElement(BrokenProfile));
        if(params.screenName==='hanging')return R.createElement(HangingProfile);
        if(params.screenName==='slow')return R.createElement(SlowProfile);
        if(params.screenName==='updates')return R.createElement(StoreProfile);
        return R.createElement('article',null,
          R.createElement(Navigation.Configure,{composeOptions:{defaultText:'@'+params.screenName+' '}},R.createElement('span',{id:'configuration-child'},'Profile content')),
          R.createElement('h2',null,params.screenName+' '+value),
          R.createElement('output',{id:'context-route'},contextHistory?.location.pathname),
          R.createElement('div',{'data-testid':'UserName'},'@reposted-author'),
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
          R.createElement('article',null,'Profile placeholder'),
          R.createElement('div',{role:'progressbar','aria-label':'正在加载 @hanging 的帖子'}));
      }
      function SlowProfile(){
        const [loaded,setLoaded]=R.useState(false);
        R.useEffect(()=>{
          window.slowMounts=(window.slowMounts||0)+1;
          const timer=setTimeout(()=>setLoaded(true),window.slowMounts===1?6000:1000);
          return ()=>clearTimeout(timer);
        },[]);
        return loaded?R.createElement('article',null,
          R.createElement('h2',null,'slow shared-context'),
          R.createElement('div',{'data-testid':'tweet'},'slow post')):
          R.createElement('div',{role:'progressbar','aria-label':'正在加载 @slow 的帖子'});
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
          R.createElement('label',null,'Reply text',R.createElement('textarea',{id:'reply',defaultValue:this.props.location.state?.defaultText||''})),
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
      DOM.createRoot(document.querySelector('#app')).render(R.createElement(Redux.Kq,{store:fakeStore},
        R.createElement(StoreContext.Provider,{value:{store:fakeStore,history:nativeHistory,viewerUserId:'me'}},appTree)));
    });
    await page.locator('#increment').click();
    await page.evaluate(fs.readFileSync(path.join(__dirname,'bookmarklet.js'),'utf8'));
    await page.locator('#app [data-testid="UserAvatar-Container-alice"]').click();
    await page.getByRole('heading',{name:'alice shared-context'}).waitFor({timeout:3000}).catch(async e=>{console.error(await page.locator('#xqc-native-panel').innerText());throw e;});
    assert.equal(await page.locator('#xqc-native-panel #context-route').innerText(),'/alice');
    await page.waitForFunction(()=>document.querySelector('#xqc-native-panel>[role=status]')?.hidden);
    await page.locator('#app [data-testid="UserAvatar-Container-alice"]').click();
    assert.equal(await page.locator('#xqc-native-panel>[role=status]').isHidden(),true);
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
    assert.equal(await page.locator('#xqc-native-panel #context-route').innerText(),'/bob');
    assert.equal(await page.locator('#xqc-native-panel .xqc-footer .xqc-update').getAttribute('href'),'https://x.usdts.de/');
    assert.equal(await page.locator('#xqc-native-panel .xqc-footer .xqc-repo').getAttribute('href'),'https://github.com/ToTXoX/x-quick-comment');
    assert.equal(await page.locator('#xqc-native-panel .xqc-footer a[aria-label="dk021 的 X 主页"]').getAttribute('href'),'https://x.com/yygqdkqk');
    assert.equal((await page.locator('#xqc-native-panel .xqc-footer').innerText()).includes('by dk021'),false);
    assert.equal(await page.locator('#xqc-native-panel .xqc-footer-links a svg').count(),2);
    assert.equal(await page.locator('#xqc-native-panel .xqc-actions button').count(),2);
    assert.equal(await page.locator('#xqc-native-panel .xqc-footer-links a').first().evaluate(el=>getComputedStyle(el).width),'22px');
    assert.equal(await page.locator('#xqc-native-panel .xqc-version').innerText(),
      'v'+await page.locator('#xqc-native-panel').getAttribute('data-version'));
    assert.match((await page.locator('#xqc-native-panel .xqc-footer-note').innerText()).replace(/\s+/g,''),/动态书签自动获取更新/);
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
    // Recreate the native page configuration after several sidebar replies.
    // Without isolation, the still-mounted @bob config becomes first in X's
    // queue and contaminates the otherwise ordinary native Post button.
    await page.evaluate(()=>fixtureRemountConfig());
    await page.locator('#main-post').click();
    await page.locator('#reply').waitFor();
    assert.equal(await page.locator('#reply').inputValue(),'');
    await page.locator('#close-compose').click();
    assert.equal(await page.locator('#configuration-child').innerText(),'Profile content');
    // Genuine main-page prefills are preserved, including intentional mentions.
    await page.evaluate(()=>{window.fixtureMainComposeOptions={defaultText:'@intentional saved text'};fixtureRemountConfig();});
    await page.locator('#main-post').click();
    await page.locator('#reply').waitFor();
    assert.equal(await page.locator('#reply').inputValue(),'@intentional saved text');
    await page.locator('#close-compose').click();
    await page.getByRole('button',{name:'关闭𝕏侧栏'}).click();
    assert.equal(await page.evaluate(()=>fixtureNavigation.Configure===fixtureOriginalConfigure),true);
    assert.equal(await page.locator('#xqc-native-panel').count(),0);
    assert.equal(await page.locator('#layers').evaluate(el=>getComputedStyle(el).zIndex),'3');
    await page.locator('#increment').click();
    assert.equal(await page.locator('#increment').innerText(),'count 3');
    if(/^\/notifications(?:\/|$)/.test(startPath)) {
      const previewSubscribers=await page.evaluate(()=>fixtureTweetStore.subscriberCount());
      await page.evaluate(fs.readFileSync(path.join(__dirname,'bookmarklet.js'),'utf8'));
      const firstCard=page.locator('[data-notification-id="222"] .xqc-reply-context');
      await firstCard.waitFor();
      assert.equal(await firstCard.locator('.xqc-reply-label').innerText(),'回复你的帖子');
      assert.equal(await firstCard.locator('.xqc-reply-author').innerText(),'@owner');
      assert.match(await firstCard.innerText(),/今天分享一个提高工作效率的方法/);
      assert.equal(await firstCard.getAttribute('href'),'/owner/status/111');
      const commentCard=page.locator('[data-notification-id="333"] .xqc-reply-context');
      assert.equal(await commentCard.locator('.xqc-reply-label').innerText(),'回复的评论');
      assert.equal(await commentCard.getAttribute('href'),'/alice/status/222');
      assert.equal(await commentCard.locator('.xqc-reply-text').innerText(),'这个方法很有用');
      assert.equal(await page.locator('[data-notification-id="555"] .xqc-reply-context').count(),0);
      const missingCard=page.locator('[data-notification-id="444"] .xqc-reply-context');
      assert.equal(await missingCard.locator('.xqc-reply-text').innerText(),'查看回复的帖子');
      assert.equal(await missingCard.getAttribute('href'),'/i/web/status/777');
      // New data enriches the card, but never switches to conversation_id_str.
      await page.evaluate(()=>fixtureTweetStore.updateNotifications({'777':{id_str:'777',user:'me',in_reply_to_status_id_str:'111',full_text:'<img src=x onerror=alert(1)> 这是直接回复对象'}}));
      await missingCard.locator('.xqc-reply-label').filter({hasText:'回复你的评论'}).waitFor();
      assert.equal(await missingCard.getAttribute('href'),'/owner/status/777');
      assert.match(await missingCard.locator('.xqc-reply-text').innerText(),/<img src=x/);
      assert.equal(await missingCard.locator('img').count(),0);
      assert.equal(await firstCard.locator('.xqc-reply-text').evaluate(el=>getComputedStyle(el).webkitLineClamp),'2');
      if(process.env.XQC_PREVIEW_SCREENSHOT) await page.screenshot({path:process.env.XQC_PREVIEW_SCREENSHOT});
      // Preserve the link default (including modifiers); suppress only the
      // surrounding notification's click. The test cancels actual navigation.
      await firstCard.evaluate(link=>{
        link.addEventListener('click',event=>{
          window.fixturePreviewLinkDefault=!event.defaultPrevented;
          event.preventDefault();
        });
      });
      await firstCard.click();
      assert.equal(await page.evaluate(()=>fixturePreviewLinkDefault),true);
      assert.equal(await page.evaluate(()=>window.fixtureNativeNotificationClicks||0),0);
      await page.locator('[data-notification-id="222"]').getByRole('button',{name:'Like notification'}).click();
      assert.equal(await page.evaluate(()=>fixtureNotificationLikes),1);
      // Virtualized row reuse must replace the old reply target, not duplicate it.
      await page.evaluate(()=>fixtureTweetStore.updateNotifications({},['333','444','555']));
      await page.waitForFunction(()=>document.querySelector('[data-notification-id="333"] .xqc-reply-context')?.getAttribute('href')==='/alice/status/222');
      assert.equal(await page.locator('[data-notification-id="333"] .xqc-reply-context').count(),1);
      await page.evaluate(()=>fixtureTweetStore.updateNotifications({'777':{id_str:'777',isDeleted:true,full_text:'Do not expose stale deleted content'}}));
      await page.waitForFunction(()=>document.querySelector('[data-notification-id="444"] .xqc-reply-text')?.textContent==='查看回复的帖子');
      // Clicking the original notification still runs X's original route.
      await page.locator('[data-notification-id="333"] > [data-testid="tweetText"]').click();
      await page.waitForFunction(()=>fixtureMainHistory.location.pathname==='/alice/status/333');
      assert.equal(await page.evaluate(()=>fixtureNativeNotificationClicks),1);
      assert.equal(await page.locator('#xqc-native-panel .xqc-root').innerText(),'');
      await page.evaluate(()=>fixtureMainHistory.goBack());
      await page.locator('[data-notification-id="333"] .xqc-reply-context').waitFor();
      await page.getByRole('button',{name:'关闭𝕏侧栏'}).click();
      assert.equal(await page.locator('.xqc-reply-context').count(),0);
      assert.equal(await page.evaluate(()=>fixtureTweetStore.subscriberCount()),previewSubscribers);
    }
    // Freeze the sidebar's 3-second recovery so a rebuild cannot mask a lost
    // subscription. Both useSelector() and connect() must see completed data.
    await page.clock.install();
    const baselineSubscribers=await page.evaluate(()=>fixtureTweetStore.subscriberCount());
    await page.evaluate(fs.readFileSync(path.join(__dirname,'bookmarklet.js'),'utf8'));
    await page.locator('#app [data-testid="UserAvatar-Container-updates"]').click();
    await page.locator('#xqc-native-panel [role=progressbar]').waitFor();
    for(const revision of [1,2]) {
      const beforeMounts=await page.evaluate(()=>notificationMounts);
      await page.evaluate(()=>fixtureRemountNotifications());
      await page.waitForFunction(before=>notificationMounts>before,beforeMounts);
      await page.evaluate(revision=>fixtureTweetStore.dispatch({revision}),revision);
      await page.waitForFunction(revision=>
        document.querySelector('#xqc-native-panel #hook-state')?.textContent===String(revision) &&
        document.querySelector('#xqc-native-panel #connected-state')?.textContent===String(revision),revision,{timeout:2000});
      assert.equal(await page.locator('#main-store-state').innerText(),String(revision));
      assert.equal(await page.locator('#xqc-native-panel [role=progressbar]').count(),0);
      assert.equal(await page.locator('#xqc-native-panel [data-testid=tweet]').innerText(),'Loaded post '+revision);
      assert.equal(await page.evaluate(()=>storeProfileMounts),1);
    }
    await page.getByRole('button',{name:'关闭𝕏侧栏'}).click();
    assert.equal(await page.evaluate(()=>fixtureTweetStore.subscriberCount()),baselineSubscribers);
    await page.evaluate(()=>fixtureTweetStore.dispatch({revision:3}));
    await page.waitForFunction(()=>document.querySelector('#main-store-state')?.textContent==='3');
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
    await page.evaluate(fs.readFileSync(path.join(__dirname,'bookmarklet.js'),'utf8'));
    await page.locator('#app [data-testid="UserAvatar-Container-slow"]').click();
    await page.locator('#xqc-native-panel [role=progressbar]').waitFor({state:'attached'});
    await page.clock.fastForward(3000);
    await page.waitForFunction(()=>window.slowMounts===2);
    await page.clock.fastForward(1000);
    await page.getByRole('heading',{name:'slow shared-context'}).waitFor();
    assert.equal(await page.evaluate(()=>window.slowMounts),2);
    assert.equal(await page.locator('#xqc-native-panel>[role=status]').isHidden(),true);
    await page.getByRole('button',{name:'关闭𝕏侧栏'}).click();
    await page.evaluate(fs.readFileSync(path.join(__dirname,'bookmarklet.js'),'utf8'));
    await page.locator('#app [data-testid="UserAvatar-Container-hanging"]').click();
    await page.locator('#xqc-native-panel [role=progressbar]').waitFor({state:'attached'});
    await page.clock.fastForward(2000);
    await page.locator('#app [data-testid="UserAvatar-Container-hanging"]').click();
    await page.clock.fastForward(500);
    assert.equal(await page.evaluate(()=>window.hangingMounts),1);
    await page.clock.fastForward(500);
    await page.waitForFunction(()=>window.hangingMounts===2);
    await page.clock.fastForward(4000);
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
    assert.equal(await page.evaluate(()=>fixtureTweetStore.subscriberCount()),baselineSubscribers);
    console.log('PASS: direct-reply notification previews, missing/deleted data, recycled rows, native clicks and cleanup; independent subscriptions across main-page remounts; renumbered modules; native routing and composer; stalled timeline recovery. Real X DOM still requires live validation.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
