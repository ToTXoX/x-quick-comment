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
    await page.route('https://x.com/**',route=>route.fulfill({
      headers:{'content-security-policy':"img-src 'self' data: blob: https://*.twimg.com"},
      contentType:'text/html',body:'<style>body{margin:0}main{width:1400px}[data-testid=primaryColumn]{width:800px}</style><div id="app"></div>'
    }));
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
      const ModalContext=R.createContext({isModal:false});
      fixtureRequire.m[999998]=module=>{
        // createContext({isModal:!1})
        module.exports={A:ModalContext};
      };
      Navigation.Configure=props=>R.useContext(ModalContext).isModal?props.children:R.createElement(originalConfigure,props);
      const CachedProfileConfigure=Navigation.Configure;
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
          '222':{id_str:'222',user:'alice',favorited:false,full_text:'这个方法很有用',in_reply_to_status_id_str:'111',in_reply_to_user_id_str:'me',in_reply_to_screen_name:'owner',conversation_id_str:'111'},
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
          R.createElement('div',{role:'group',style:{display:'flex',justifyContent:'space-between',maxWidth:425,marginTop:12}},
            ...[['reply','♡',3],['retweet','⇄',1],['like','♥',8],['views','▥',12],['bookmark','♧',''],['share','↥','']].map(([testId,icon,count])=>{
              const tweet=state.entities.tweets.entities[id];
              const liked=testId==='like' && tweet.favorited;
              return R.createElement('div',{key:testId,style:{flex:1}},R.createElement('button',{key:liked?'unlike':testId,
                'data-testid':liked?'unlike':testId,'aria-label':testId==='like'?(liked?'Unlike notification':'Like notification'):testId,
                style:{border:0,background:'transparent',padding:4,minWidth:28,color:'#536471'},
                onClick:event=>{
                  event.stopPropagation();
                  if(testId!=='like')return;
                  if(!liked)window.fixtureNotificationLikes=(window.fixtureNotificationLikes||0)+1;
                  fakeStore.updateNotifications({[id]:{...tweet,favorited:!liked}});
                }},icon+' '+count));
            }))));
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
          R.createElement(CachedProfileConfigure,{composeOptions:{defaultText:'@'+params.screenName+' '}},R.createElement('span',{id:'configuration-child'},'Profile content')),
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
    await page.evaluate(()=>{
      const sidebar=document.createElement('aside');
      sidebar.dataset.testid='sidebarColumn';
      sidebar.style.cssText='position:absolute;top:8px;right:32px;width:320px;z-index:1';
      sidebar.innerHTML='<form role="search" style="position:relative;height:44px">'+
        '<input aria-label="Search X" role="combobox" aria-owns="typeaheadDropdown-fixture" style="width:95%;height:36px"></form>';
      const search=sidebar.querySelector('form');
      search.querySelector('input').addEventListener('focus',()=>{
        const suggestions=document.createElement('div');
        suggestions.id='typeaheadDropdown-fixture';
        suggestions.style.cssText='position:absolute;top:100%;width:100%;height:170px;background:white;display:flex;align-items:end';
        const result=document.createElement('a');
        result.href='/searchresult';
        result.innerHTML='<span data-testid="UserAvatar-Container-searchresult">Use search suggestion</span>';
        result.onclick=event=>{event.preventDefault();search.dataset.selected='true';suggestions.remove();};
        suggestions.append(result);
        search.append(suggestions);
      });
      document.body.style.minHeight='1400px';
      document.querySelector('#app main').append(sidebar);
    });
    const installPage=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
    const {path:packPath,catalog}=JSON.parse(installPage.match(/const stickerPack = (.*);/)[1]);
    const pack=fs.readFileSync(path.join(__dirname,packPath)).toString('base64');
    const source=fs.readFileSync(path.join(__dirname,'bookmarklet.js'),'utf8');
    const launch=()=>page.evaluate(({source,catalog,pack})=>{
      const token=crypto.randomUUID();
      window.__xqcStickerPack={token,catalog};
      (0,eval)(source);
      window.dispatchEvent(new MessageEvent('message',{
        origin:'https://x.usdts.de',
        data:{kind:'xqc-assets',token,pack:Uint8Array.from(atob(pack),char=>char.charCodeAt(0)).buffer}
      }));
    },{source,catalog,pack});
    const featureMenu=page.getByRole('group',{name:'Peekala 功能开关'});
    const buddy=page.getByRole('button',{name:'展开 Peekala 侧栏'});
    const closeSidebar=page.getByRole('button',{name:'收起侧栏',exact:true});
    const exit=page.getByRole('button',{name:'退出 Peekala'});
    const effectsSwitch=featureMenu.getByRole('switch',{name:'点赞特效',exact:true});
    const playEffect=featureMenu.getByRole('button',{name:'播放当前点赞特效'});
    const headerEffect=featureMenu.locator('.xqc-like-effect');
    await launch();
    await featureMenu.waitFor();
    assert.equal(await featureMenu.evaluate(el=>el.parentElement.matches('#xqc-native-panel > header > .xqc-actions')),true);
    const refreshButton=page.getByRole('button',{name:'重新加载侧栏'});
    assert.equal(await closeSidebar.innerText(),'收起侧栏');
    assert.equal(await closeSidebar.locator('svg').isVisible(),true);
    const switchBounds=await featureMenu.boundingBox();
    const refreshBounds=await refreshButton.boundingBox();
    assert.ok(switchBounds.x+switchBounds.width < refreshBounds.x);
    assert.ok(Math.abs(switchBounds.y+switchBounds.height/2-refreshBounds.y-refreshBounds.height/2)<1);
    assert.equal(await featureMenu.getByRole('switch').count(),1);
    assert.equal(await buddy.isVisible(),false);
    assert.equal(await effectsSwitch.isChecked(),true);
    await launch();
    assert.equal(await effectsSwitch.evaluate(el=>el===document.activeElement),true);
    const search=page.getByRole('combobox',{name:'Search X'});
    const panel=page.locator('#xqc-native-panel');
    await page.waitForFunction(()=>document.querySelector('#xqc-native-panel').getBoundingClientRect().top >=
      document.querySelector('[role="search"]').getBoundingClientRect().bottom);
    const panelTop=(await panel.boundingBox()).y;
    await search.click({timeout:2000});
    await search.fill('fixture query');
    assert.equal(await search.inputValue(),'fixture query');
    const suggestions=page.locator('#typeaheadDropdown-fixture');
    await suggestions.evaluate(el=>el.style.height='230px');
    await page.waitForFunction(()=>{
      const popup=document.querySelector('#typeaheadDropdown-fixture');
      const panel=document.querySelector('#xqc-native-panel');
      const popupRect=popup.getBoundingClientRect();
      const panelRect=panel.getBoundingClientRect();
      const insideY=popupRect.bottom-10;
      return popup.contains(document.elementFromPoint(popupRect.left+10,insideY)) &&
        panel.contains(document.elementFromPoint(panelRect.left+10,insideY)) &&
        panel.contains(document.elementFromPoint(popupRect.left+10,popupRect.bottom+10));
    });
    assert.equal((await panel.boundingBox()).y,panelTop);
    await page.getByRole('link',{name:'Use search suggestion'}).click({timeout:2000});
    assert.equal(await page.locator('[role="search"]').getAttribute('data-selected'),'true');
    await page.waitForFunction(()=>!document.querySelector('#xqc-native-panel').style.clipPath);
    assert.equal((await panel.boundingBox()).y,panelTop);
    await page.evaluate(()=>window.scrollTo(0,100));
    await page.waitForFunction(()=>document.querySelector('#xqc-native-panel').getBoundingClientRect().top===0);
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.waitForFunction(()=>document.querySelector('#xqc-native-panel').getBoundingClientRect().top>0);
    await page.locator('aside[data-testid="sidebarColumn"]').evaluate(el=>{el.remove();document.body.style.minHeight='';});
    await page.waitForFunction(()=>document.querySelector('#xqc-native-panel').getBoundingClientRect().top===0);
    assert.equal(await panel.isVisible(),true);
    await page.locator('#app [data-testid="UserAvatar-Container-alice"]').click();
    await page.getByRole('heading',{name:'alice shared-context'}).waitFor({timeout:3000}).catch(async e=>{console.error(await page.locator('#xqc-native-panel').innerText());throw e;});
    assert.equal(await page.locator('#xqc-native-panel #context-route').innerText(),'/alice');
    await page.waitForFunction(()=>document.querySelector('#xqc-native-panel>[role=status]')?.hidden);
    await page.locator('#app [data-testid="UserAvatar-Container-alice"]').click();
    assert.equal(await page.locator('#xqc-native-panel>[role=status]').isHidden(),true);
    const likeEffect=page.locator('.xqc-like-effect');
    const likeSticker=likeEffect.locator('img');
    const panelLike=page.locator('#xqc-native-panel #fixture-like');
    await panelLike.click();
    await page.waitForFunction(()=>document.querySelector('#xqc-native-panel #fixture-like')?.classList.contains('xqc-liked-from-store'));
    assert.equal(await page.locator('#xqc-native-panel #fixture-like svg').evaluate(el=>getComputedStyle(el).color),'rgb(249, 24, 128)');
    assert.equal(await page.locator('#xqc-native-panel #fixture-like').getAttribute('data-testid'),'like');
    assert.equal(await page.evaluate(()=>fixtureTweetStore.getState().entities.tweets.entities['123456789'].favorited),true);
    await page.waitForFunction(()=>document.querySelector('.xqc-like-effect img')?.naturalWidth===64);
    const firstSticker=await likeSticker.getAttribute('src');
    const iconBounds=await panelLike.locator('svg').boundingBox();
    const effectBounds=await likeEffect.boundingBox();
    assert.equal(effectBounds.x,iconBounds.x+iconBounds.width/2);
    assert.equal(effectBounds.y,iconBounds.y+iconBounds.height/2);
    await likeEffect.waitFor({state:'detached'});
    assert.equal(await panelLike.locator('svg').evaluate(el=>getComputedStyle(el).visibility),'visible');
    await page.evaluate(()=>fixtureTweetStore.setFavorited(false));
    await page.waitForFunction(()=>!document.querySelector('#xqc-native-panel #fixture-like')?.classList.contains('xqc-liked-from-store'));
    await panelLike.press('Enter');
    await likeSticker.waitFor();
    assert.notEqual(await likeSticker.getAttribute('src'),firstSticker);
    await page.evaluate(()=>fixtureTweetStore.setFavorited(false));
    await likeEffect.waitFor({state:'detached'});
    await page.emulateMedia({reducedMotion:'reduce'});
    await panelLike.click();
    await page.waitForFunction(()=>document.querySelector('#fixture-like')?.classList.contains('xqc-liked-from-store'));
    assert.equal(await likeEffect.count(),0);
    await page.evaluate(()=>fixtureTweetStore.setFavorited(false));
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.waitForFunction(()=>!document.querySelector('#fixture-like')?.classList.contains('xqc-liked-from-store'));
    await effectsSwitch.uncheck();
    assert.equal(await panel.isVisible(),true);
    await panelLike.click();
    await page.waitForFunction(()=>document.querySelector('#fixture-like')?.classList.contains('xqc-liked-from-store'));
    assert.equal(await likeEffect.count(),0);
    await page.evaluate(()=>fixtureTweetStore.setFavorited(false));
    await effectsSwitch.check();
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
    assert.equal(await page.locator('#xqc-native-panel .xqc-actions > button').count(),2);
    assert.equal(await page.locator('#xqc-native-panel .xqc-footer-links a').first().evaluate(el=>getComputedStyle(el).width),'22px');
    assert.equal(await page.locator('#xqc-native-panel .xqc-version').innerText(),
      'v'+await page.locator('#xqc-native-panel').getAttribute('data-version'));
    assert.match((await page.locator('#xqc-native-panel .xqc-footer-note').innerText()).replace(/\s+/g,''),/动态书签自动获取更新/);
    assert.equal(await page.locator('#xqc-native-panel .xqc-caption').innerText(),'刷新后点击书签恢复设置');
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
    if (startPath==='/home') {
      // Simulate native modal navigation and an imprecise scroll restoration.
      await page.evaluate(()=>{
        document.body.style.minHeight='1600px';
        document.querySelector('#app main').style.paddingTop='250px';
        window.scrollTo(0,180);
        const reply=document.querySelector('[data-notification-id="222"] [data-testid="reply"]');
        reply.addEventListener('click',()=>{
          history.pushState({},'', '/compose/post');
          const modal=document.createElement('button');
          modal.id='fixture-home-send';
          modal.textContent='Send reply';
          modal.style.cssText='position:fixed;top:30px;left:30px';
          modal.onclick=()=>{
            history.replaceState({},'', '/home');
            modal.remove();
            requestAnimationFrame(()=>{
              window.scrollBy(0,-12);
              window.fixtureHomeReplySent=true;
            });
          };
          document.body.append(modal);
        },{once:true});
      });
      const post=page.locator('[data-notification-id="222"]');
      const before=(await post.boundingBox()).y;
      await post.locator('[data-testid="reply"]').click();
      await page.waitForURL('**/compose/post');
      await page.locator('#fixture-home-send').click();
      await page.waitForURL('**/home');
      await page.waitForFunction(top=>window.fixtureHomeReplySent &&
        Math.abs(document.querySelector('[data-notification-id="222"]').getBoundingClientRect().top-top)<1,before,{timeout:3000});
      await page.evaluate(()=>{
        document.body.style.minHeight='';
        document.querySelector('#app main').style.paddingTop='';
        window.scrollTo(0,0);
      });
    }
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
    await closeSidebar.click();
    assert.equal(await page.evaluate(()=>fixtureNavigation.Configure===fixtureOriginalConfigure),true);
    assert.equal(await page.locator('#xqc-native-panel').count(),0);
    assert.equal(await page.locator('#layers').evaluate(el=>getComputedStyle(el).zIndex),'3');
    await page.locator('#increment').click();
    assert.equal(await page.locator('#increment').innerText(),'count 3');
    if(/^\/notifications(?:\/|$)/.test(startPath)) {
      const previewSubscribers=await page.evaluate(()=>fixtureTweetStore.subscriberCount());
      await buddy.click();
      const firstCard=page.locator('[data-notification-id="222"] .xqc-reply-context');
      await firstCard.waitFor();
      assert.equal(await firstCard.locator('.xqc-reply-label').innerText(),'原帖：');
      assert.equal(await firstCard.getAttribute('title'),null);
      assert.match(await firstCard.innerText(),/今天分享一个提高工作效率的方法/);
      assert.equal(await firstCard.getAttribute('href'),null);
      // Native composer overlays retain the timeline but change the browser
      // URL. Background store updates must not remove/recreate preview rows.
      const beforeModal=await firstCard.evaluate(card=>{
        window.fixtureRetainedPreview=card;
        return card.closest('article').getBoundingClientRect().height;
      });
      await page.evaluate(()=>{
        window.history.replaceState({},'', '/compose/post');
        const overlay=document.createElement('div');overlay.id='preview-compose-overlay';
        overlay.setAttribute('role','dialog');document.body.append(overlay);
        fixtureTweetStore.updateNotifications({'111':{id_str:'111',isDeleted:true}});
      });
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      assert.equal(await firstCard.evaluate(card=>card===fixtureRetainedPreview),true);
      assert.equal(await firstCard.evaluate(card=>card.closest('article').getBoundingClientRect().height),beforeModal);
      await page.evaluate(()=>{
        fixtureTweetStore.updateNotifications({'111':{id_str:'111',user:'me',full_text:'今天分享一个提高工作效率的方法。先整理任务，再集中处理通知。'}});
        window.history.replaceState({},'', '/notifications');
        document.getElementById('preview-compose-overlay').remove();
      });
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      assert.equal(await firstCard.evaluate(card=>card===fixtureRetainedPreview),true);
      assert.equal(await firstCard.evaluate(card=>card.closest('article').getBoundingClientRect().height),beforeModal);
      const commentCard=page.locator('[data-notification-id="333"] .xqc-reply-context');
      assert.equal(await commentCard.locator('.xqc-reply-label').innerText(),'原帖：');
      assert.equal(await commentCard.getAttribute('href'),null);
      assert.equal(await commentCard.locator('.xqc-reply-text').innerText(),'这个方法很有用');
      assert.equal(await page.locator('[data-notification-id="555"] .xqc-reply-context').count(),0);
      const missingCard=page.locator('[data-notification-id="444"] .xqc-reply-context');
      assert.equal(await missingCard.count(),0);
      // Preview sits below the comment without changing native action layout.
      for(const width of [600,375,320]) {
        await page.locator('#app [data-testid="primaryColumn"]').evaluate((el,width)=>el.style.width=width+'px',width);
        assert.equal(await firstCard.evaluate(card=>card.previousElementSibling?.dataset.testid),'tweetText');
        assert.equal(await firstCard.evaluate(card=>card.closest('[role="group"]')),null);

        assert.equal(await firstCard.evaluate(card=>card.getBoundingClientRect().height),18);
      }
      await page.locator('#app [data-testid="primaryColumn"]').evaluate(el=>el.style.width='600px');
      // Long text plus media remains truncated on one line.
      await page.evaluate(()=>fixtureTweetStore.updateNotifications({'111':{id_str:'111',user:'me',
        full_text:('整理任务，集中处理通知。\n').repeat(30)+' https://t.co/media',
        extended_entities:{media:[{type:'photo',url:'https://t.co/media'},{type:'photo'}]}}}));
      await firstCard.locator('.xqc-reply-text').filter({hasText:'图片 2 张'}).waitFor();
      assert.equal((await firstCard.innerText()).includes('https://t.co/media'),false);
      assert.equal(await firstCard.evaluate(el=>getComputedStyle(el).textOverflow),'ellipsis');
      assert.equal(await firstCard.evaluate(el=>el.getBoundingClientRect().height),18);
      // New data enriches the card, but never switches to conversation_id_str.
      await page.evaluate(()=>fixtureTweetStore.updateNotifications({'777':{id_str:'777',user:'me',in_reply_to_status_id_str:'111',full_text:'<img src=x onerror=alert(1)> 这是直接回复对象'}}));
      await missingCard.locator('.xqc-reply-text').filter({hasText:'这是直接回复对象'}).waitFor();
      assert.equal(await missingCard.getAttribute('href'),null);
      assert.match(await missingCard.locator('.xqc-reply-text').innerText(),/<img src=x/);
      assert.equal(await missingCard.locator('img').count(),0);
      if(process.env.XQC_PREVIEW_SCREENSHOT) await page.screenshot({path:process.env.XQC_PREVIEW_SCREENSHOT});
      // Plain text bubbles to the native notification route.
      await firstCard.click();
      await page.waitForFunction(()=>fixtureMainHistory.location.pathname==='/alice/status/222');
      assert.equal(await page.evaluate(()=>fixtureNativeNotificationClicks),1);
      await page.evaluate(()=>fixtureMainHistory.goBack());
      await firstCard.waitFor();
      await page.locator('[data-notification-id="222"]').getByRole('button',{name:'Like notification'}).click();
      assert.equal(await page.evaluate(()=>fixtureNotificationLikes),1);
      await likeSticker.waitFor();
      await page.locator('[data-notification-id="222"]').getByRole('button',{name:'Unlike notification'}).click();
      await likeEffect.waitFor({state:'detached'});
      // Virtualized row reuse must replace the old reply target, not duplicate it.
      await page.evaluate(()=>fixtureTweetStore.updateNotifications({},['333','444','555']));
      await page.waitForFunction(()=>document.querySelector('[data-notification-id="333"] .xqc-reply-text')?.textContent==='这个方法很有用');
      assert.equal(await page.locator('[data-notification-id="333"] .xqc-reply-context').count(),1);
      await page.evaluate(()=>fixtureTweetStore.updateNotifications({'777':{id_str:'777',isDeleted:true,full_text:'Do not expose stale deleted content'}}));
      await page.waitForFunction(()=>!document.querySelector('[data-notification-id="444"] .xqc-reply-context'));
      // Clicking the original notification still runs X's original route.
      await page.locator('[data-notification-id="333"] > [data-testid="tweetText"]').click();
      await page.waitForFunction(()=>fixtureMainHistory.location.pathname==='/alice/status/333');
      assert.equal(await page.evaluate(()=>fixtureNativeNotificationClicks),2);
      assert.equal(await page.locator('#xqc-native-panel .xqc-root').innerText(),'');
      await page.evaluate(()=>fixtureMainHistory.goBack());
      await page.locator('[data-notification-id="333"] .xqc-reply-context').waitFor();
      await closeSidebar.click();
      assert.equal(await page.locator('.xqc-reply-context').count(),0);
      assert.equal(await page.locator('.xqc-reply-actions').count(),0);
      assert.equal(await page.evaluate(()=>fixtureTweetStore.subscriberCount()),previewSubscribers);
      assert.equal(await featureMenu.count(),0);
      assert.equal(await buddy.isVisible(),true);
      const mainLike=page.locator('[data-notification-id="333"]').getByRole('button',{name:'Like notification'});
      await mainLike.click();
      await likeSticker.waitFor();
      assert.equal(await panel.count(),0);
      await likeEffect.waitFor({state:'detached'});
    }
    // Freeze the sidebar's 3-second recovery so a rebuild cannot mask a lost
    // subscription. Both useSelector() and connect() must see completed data.
    await page.clock.install();
    const baselineSubscribers=await page.evaluate(()=>fixtureTweetStore.subscriberCount());
    await buddy.click();
    await page.locator('#app [data-testid="UserAvatar-Container-updates"]').click();
    await page.locator('#xqc-native-panel [role=progressbar]').waitFor({state:'attached'});
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
    await closeSidebar.click();
    assert.equal(await page.evaluate(()=>fixtureTweetStore.subscriberCount()),baselineSubscribers);
    await page.evaluate(()=>fixtureTweetStore.dispatch({revision:3}));
    await page.waitForFunction(()=>document.querySelector('#main-store-state')?.textContent==='3');
    await buddy.click();
    await page.locator('#app [data-testid="UserAvatar-Container-broken"]').click();
    const diagnostic=page.locator('#xqc-native-panel>[role=status]');
    await diagnostic.filter({hasText:'fixture: missing native profile context'}).waitFor();
    assert.equal(await diagnostic.isVisible(),true);
    assert.match(await diagnostic.innerText(),/BrokenProfile/);
    await page.locator('#app [data-testid="UserAvatar-Container-alice"]').click();
    assert.match(await diagnostic.innerText(),/fixture: missing native profile context/);
    await closeSidebar.click();
    assert.deepEqual(errors,[]);
    await buddy.click();
    await page.locator('#app [data-testid="UserAvatar-Container-slow"]').click();
    const skeleton=panel.locator('.xqc-profile-skeleton');
    await skeleton.waitFor();
    assert.equal(await panel.locator('.xqc-root').getAttribute('aria-busy'),'true');
    assert.match(await diagnostic.textContent(),/正在加载 @slow/);
    assert.equal(await skeleton.locator('.xqc-skeleton-line').first().evaluate(el=>getComputedStyle(el).animationName),'xqc-loader-sweep');
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await skeleton.locator('.xqc-skeleton-line').first().evaluate(el=>getComputedStyle(el).animationName),'none');
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.clock.fastForward(3000);
    await page.waitForFunction(()=>window.slowMounts===2);
    assert.match(await diagnostic.textContent(),/正在重试 @slow/);
    assert.equal(await skeleton.isVisible(),true);
    await page.clock.fastForward(1000);
    await page.getByRole('heading',{name:'slow shared-context'}).waitFor();
    assert.equal(await skeleton.isHidden(),true);
    assert.equal(await panel.locator('.xqc-root').getAttribute('aria-busy'),null);
    assert.equal(await page.evaluate(()=>window.slowMounts),2);
    assert.equal(await page.locator('#xqc-native-panel>[role=status]').isHidden(),true);
    await closeSidebar.click();
    await buddy.click();
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
    assert.equal(await skeleton.isHidden(),true);
    assert.equal(await page.locator('#xqc-native-panel>[role=status] a').getAttribute('href'),'/hanging');
    await closeSidebar.click();
    for(const route of ['/MengShi63540','/MengShi63540/status/2118335318088876326']){
      await page.evaluate(path=>{window.history.replaceState({},'',path);fixtureMainHistory.push(path);},route);
      await page.locator('#app [data-testid="UserAvatar-Container-bob"]').waitFor();
      await buddy.click();
      await page.locator('#app [data-testid="UserAvatar-Container-bob"]').click();
      await page.locator('#xqc-native-panel article h2').filter({hasText:'bob shared-context'}).waitFor();
      await closeSidebar.click();
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
    await buddy.click();
    await page.locator('#app [data-testid="UserAvatar-Container-alice"]').click();
    await page.getByRole('heading',{name:'alice shared-context'}).waitFor();
    await closeSidebar.click();
    assert.deepEqual(errors,[]);
    assert.equal(await page.evaluate(()=>fixtureTweetStore.subscriberCount()),baselineSubscribers);
    const savedFeatures=JSON.parse(await page.evaluate(()=>localStorage.getItem('xqc-features')));
    assert.deepEqual(savedFeatures,{likeEffects:true});
    await page.evaluate(()=>localStorage.setItem('xqc-features',JSON.stringify({likeEffects:true,sidebar:false})));
    await page.reload();
    await launch();
    assert.equal(await panel.isVisible(),true);
    assert.equal(await buddy.isVisible(),false);
    await page.evaluate(()=>{
      document.querySelector('#app').innerHTML=`
        <main data-testid="primaryColumn"><article data-testid="tweet">
          <a href="/alice/status/123"><time>now</time></a>
          <button id="sticker-like" data-testid="like">♥</button>
        </article></main>`;
      const button=document.querySelector('#sticker-like');
      button.onclick=()=>button.dataset.testid=button.dataset.testid==='like'?'unlike':'like';
    });
    const manage=page.getByRole('button',{name:'换表情',exact:true});
    const manager=page.getByRole('region',{name:'点赞特效',exact:true});
    const builtInTile=manager.getByRole('button',{name:'冒冒探头，使用中'});
    const fileInput=manager.locator('input[type=file]');
    const preview=manager.locator('.xqc-like-effect img');
    const tabs=manager.getByRole('tab');
    const customTab=manager.getByRole('tab',{name:'自定义',exact:true});
    const header=panel.locator('header').first();
    const heightBefore=(await header.boundingBox()).height;
    await manage.click();
    await builtInTile.waitFor();
    const activeSticker=manager.locator('[data-active-sticker]');
    const activeThumbnail=manager.locator('[data-active-thumbnail]');
    assert.equal(await activeSticker.textContent(),'冒冒探头');
    await page.waitForFunction(()=>document.querySelector('[data-active-thumbnail]')?.naturalWidth===52);
    const builtInTiles=manager.locator('.xqc-sticker-grid [data-sticker-id]');
    assert.deepEqual(await builtInTiles.evaluateAll(tiles=>tiles.map(tile=>tile.getAttribute('aria-label'))),
      ['冒冒探头，使用中','奶龙','老黄','老马','小肥鱼','大肥鱼','芥末辣']);
    const originalThumbnail=await activeThumbnail.getAttribute('src');
    await manager.getByRole('button',{name:'奶龙',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('#xqc-sticker-manager .xqc-like-effect img')?.naturalWidth===48);
    assert.equal(await activeSticker.textContent(),'冒冒探头');
    assert.equal(await activeThumbnail.getAttribute('src'),originalThumbnail);
    await manager.getByRole('button',{name:'使用此特效'}).click();
    await manager.getByRole('button',{name:'奶龙，使用中'}).waitFor();
    assert.equal(await activeSticker.textContent(),'奶龙');
    assert.notEqual(await activeThumbnail.getAttribute('src'),originalThumbnail);
    await manager.getByRole('button',{name:'老黄',exact:true}).click();
    await page.waitForFunction(()=>{
      const image=document.querySelector('#xqc-sticker-manager .xqc-like-effect img');
      return image?.naturalWidth===64 && image.parentElement.style.getPropertyValue('--xqc-like-duration')==='1080ms';
    });
    await manager.getByRole('button',{name:'使用此特效'}).click();
    await manager.getByRole('button',{name:'老黄，使用中'}).waitFor();
    assert.equal(await activeSticker.textContent(),'老黄');
    await manager.getByRole('button',{name:'老马',exact:true}).click();
    await page.waitForFunction(()=>{
      const image=document.querySelector('#xqc-sticker-manager .xqc-like-effect img');
      return image?.naturalWidth===64 && image.parentElement.style.getPropertyValue('--xqc-like-duration')==='1170ms';
    });
    await manager.getByRole('button',{name:'使用此特效'}).click();
    await manager.getByRole('button',{name:'老马，使用中'}).waitFor();
    assert.equal(await activeSticker.textContent(),'老马');
    const fishTile=manager.getByRole('button',{name:'小肥鱼',exact:true});
    assert.equal(await fishTile.locator(':scope > img').evaluate(el=>getComputedStyle(el).width),'38px');
    await fishTile.click();
    await page.waitForFunction(()=>{
      const image=document.querySelector('#xqc-sticker-manager .xqc-like-effect img');
      return image?.naturalWidth===64 && getComputedStyle(image).width==='38px' &&
        image.parentElement.style.getPropertyValue('--xqc-like-duration')==='1440ms';
    });
    await manager.getByRole('button',{name:'使用此特效'}).click();
    await manager.getByRole('button',{name:'小肥鱼，使用中'}).waitFor();
    assert.equal(await activeSticker.textContent(),'小肥鱼');
    assert.equal(await activeThumbnail.evaluate(el=>getComputedStyle(el).width),'22px');
    await page.locator('#sticker-like').click();
    await manager.waitFor({state:'hidden'});
    await page.waitForFunction(()=>{
      const image=document.querySelector('.xqc-like-effect img');
      return image?.naturalWidth===64 && getComputedStyle(image).width==='38px' &&
        image.parentElement.style.getPropertyValue('--xqc-like-duration')==='1440ms';
    });
    await page.locator('#sticker-like').click();
    await likeEffect.waitFor({state:'detached'});
    await manage.click();
    await manager.getByRole('button',{name:'大肥鱼',exact:true}).click();
    await page.waitForFunction(()=>{
      const image=document.querySelector('#xqc-sticker-manager .xqc-like-effect img');
      return image?.naturalWidth===58 && getComputedStyle(image).width==='38px' &&
        image.parentElement.style.getPropertyValue('--xqc-like-duration')==='1440ms';
    });
    await manager.getByRole('button',{name:'使用此特效'}).click();
    await manager.getByRole('button',{name:'大肥鱼，使用中'}).waitFor();
    assert.equal(await activeSticker.textContent(),'大肥鱼');
    await manager.getByRole('button',{name:'芥末辣',exact:true}).click();
    await page.waitForFunction(()=>{
      const image=document.querySelector('#xqc-sticker-manager .xqc-like-effect img');
      return image?.naturalWidth===64 &&
        image.parentElement.style.getPropertyValue('--xqc-like-duration')==='3100ms';
    });
    await manager.getByRole('button',{name:'使用此特效'}).click();
    await manager.getByRole('button',{name:'芥末辣，使用中'}).waitFor();
    assert.equal(await activeSticker.textContent(),'芥末辣');
    await page.keyboard.press('Escape');
    await manager.waitFor({state:'hidden'});
    await page.locator('#sticker-like').click();
    await page.waitForFunction(()=>{
      const image=document.querySelector('.xqc-like-effect img');
      return image?.naturalWidth===64 &&
        image.parentElement.style.getPropertyValue('--xqc-like-duration')==='3100ms';
    });
    await page.locator('#sticker-like').click();
    await likeEffect.waitFor({state:'detached'});
    await manage.click();
    await manager.getByRole('button',{name:'冒冒探头',exact:true}).click();
    await manager.getByRole('button',{name:'使用此特效'}).click();
    await builtInTile.waitFor();
    assert.equal(await manager.getByRole('button',{name:'新建表情包'}).count(),0);
    assert.equal((await header.boundingBox()).height,heightBefore);
    assert.equal(await manager.evaluate(el=>el.matches(':popover-open')),true);
    const managerBounds=await manager.boundingBox();
    const manageBounds=await manage.boundingBox();
    assert.ok(managerBounds.y>=manageBounds.y+manageBounds.height);
    await page.keyboard.press('Escape');
    await manager.waitFor({state:'hidden'});
    await manage.click();
    assert.deepEqual(await tabs.allTextContents(),['系统内置','自定义']);
    assert.equal(await manager.getByRole('button',{name:'上传 GIF',exact:true}).count(),0);
    await customTab.click();
    assert.equal(await activeSticker.textContent(),'冒冒探头');
    assert.equal(await tabs.nth(1).getAttribute('aria-selected'),'true');
    const upload=manager.getByRole('button',{name:'上传 GIF',exact:true});
    assert.equal(await upload.evaluate(el=>el.parentElement===el.closest('ul').firstElementChild),true);
    const [chooser]=await Promise.all([page.waitForEvent('filechooser'),upload.click()]);
    assert.equal(await chooser.isMultiple(),false);
    await fileInput.setInputFiles({name:'坏文件.gif',mimeType:'image/gif',buffer:Buffer.from('not a GIF')});
    await manager.getByText('无法读取这张 GIF。').waitFor();
    // Three frames with distinct delays and a loop extension.
    const buffer=Buffer.from('R0lGODlhEAAKAIEAAPmEKAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQAGAAAACwAAAAAEAAKAAAIFwABCBxIsKDBgwgTKlzIsKHDhxAjHgwIACH5BAEkAAEALAAAAAAQAAoAgSCASgAAAAAAAAAAAAgXAAEIHEiwoMGDCBMqXMiwocOHECMeDAgAIfkEATIAAQAsAAAAABAACgCBVDO7AAAAAAAAAAAACBcAAQgcSLCgwYMIEypcyLChw4cQIx4MCAA7','base64');
    await fileInput.setInputFiles({name:'我的小动画.gif',mimeType:'image/gif',buffer});
    const custom=manager.getByRole('button',{name:/^我的小动画/});
    assert.equal(await manager.getByRole('button',{name:'预览',exact:true}).count(),0);
    await custom.click();
    const removeCustom=manager.getByRole('button',{name:'删除 我的小动画',exact:true});
    const tileBounds=await custom.boundingBox();
    const removeBounds=await removeCustom.boundingBox();
    assert.ok(removeBounds.x<tileBounds.x+tileBounds.width/2 && removeBounds.y<tileBounds.y+tileBounds.height/2);
    await page.waitForFunction(()=>document.querySelector('#xqc-sticker-manager .xqc-like-effect img')?.naturalWidth===16);
    assert.equal(await preview.evaluate(el=>el.parentElement.style.getPropertyValue('--xqc-like-duration')),'1100ms');
    assert.equal(await preview.evaluate(async el=>(await (await fetch(el.src)).text()).includes('NETSCAPE2.0')),false);
    assert.equal(await custom.getAttribute('aria-label'),'我的小动画');
    await manager.getByRole('button',{name:'使用此特效'}).click();
    await manager.getByRole('button',{name:'我的小动画，使用中'}).waitFor();
    await manager.getByText('使用中',{exact:true}).waitFor();
    await customTab.press('Home');
    assert.equal(await custom.count(),0);
    assert.equal(await tabs.first().getAttribute('aria-selected'),'true');
    await tabs.first().press('ArrowRight');
    await manager.getByRole('button',{name:'我的小动画，使用中'}).waitFor();
    await customTab.press('ArrowLeft');
    assert.equal(await manager.getByRole('button',{name:'上传 GIF',exact:true}).count(),0);
    await page.keyboard.press('Escape');
    await manager.waitFor({state:'hidden'});
    await effectsSwitch.uncheck();
    const tweetLike=page.locator('#sticker-like');
    const likeState=await tweetLike.getAttribute('data-testid');
    await playEffect.click();
    const headerImage=headerEffect.locator('img');
    await page.waitForFunction(()=>document.querySelector('#xqc-feature-controls .xqc-like-effect img')?.naturalWidth===16);
    const headerSource=await headerImage.getAttribute('src');
    await playEffect.press('Enter');
    await playEffect.click();
    assert.equal(await headerEffect.count(),1);
    assert.notEqual(await headerImage.getAttribute('src'),headerSource);
    assert.equal(await tweetLike.getAttribute('data-testid'),likeState);
    await page.clock.runFor(1100);
    await headerEffect.waitFor({state:'detached'});
    await effectsSwitch.check();
    await playEffect.click();
    await headerImage.waitFor();
    await closeSidebar.click();
    await headerEffect.waitFor({state:'detached'});
    await buddy.click();
    await manage.click();
    await page.locator('#sticker-like').click();
    await manager.waitFor({state:'hidden'});
    await page.waitForFunction(()=>document.querySelector('.xqc-like-effect img')?.naturalWidth===16);
    await closeSidebar.click();
    await page.mouse.move(20,20);
    assert.equal(await exit.evaluate(el=>getComputedStyle(el).opacity),'0');
    const buddyBounds=await buddy.boundingBox();
    assert.ok(buddyBounds.width>60 && buddyBounds.width<70);
    assert.equal(buddyBounds.x+buddyBounds.width,1400);
    await buddy.hover();
    assert.equal(await exit.evaluate(el=>getComputedStyle(el).opacity),'1');
    await page.mouse.move(20,20);
    assert.equal(await exit.evaluate(el=>getComputedStyle(el).opacity),'0');
    await buddy.press('Tab');
    assert.equal(await exit.evaluate(el=>el===document.activeElement && getComputedStyle(el).opacity==='1'),true);
    await exit.evaluate(el=>el.blur());
    await buddy.hover();
    await exit.hover();
    assert.equal(await exit.evaluate(el=>{
      const {x,y,width,height}=el.getBoundingClientRect();
      return getComputedStyle(el).opacity==='1' && el.contains(document.elementFromPoint(x+width/2,y+height/2));
    }),true);
    await exit.click();
    await likeEffect.waitFor({state:'detached'});
    assert.equal(await buddy.count(),0);
    assert.equal(await panel.count(),0);
    assert.equal(await page.evaluate(()=>window.__xQuickComment),undefined);
    await page.locator('#sticker-like').click();
    await page.locator('#sticker-like').click();
    await page.clock.runFor(100);
    assert.equal(await likeEffect.count(),0);

    await page.reload();
    await launch();
    assert.equal(await panel.isVisible(),true);
    await manage.click();
    await manager.getByRole('button',{name:'我的小动画，使用中'}).waitFor();
    assert.deepEqual(await tabs.allTextContents(),['系统内置','自定义']);
    assert.equal(await customTab.getAttribute('aria-selected'),'true');
    await fileInput.setInputFiles({name:'单独删除.gif',mimeType:'image/gif',buffer});
    const removeOther=manager.getByRole('button',{name:'删除 单独删除',exact:true});
    await removeOther.waitFor();
    const grid=manager.locator('.xqc-sticker-grid');
    const gridBefore=await grid.boundingBox();
    const confirmation=manager.getByRole('dialog');
    await removeOther.click();
    await confirmation.getByText('删除 GIF「单独删除」？').waitFor();
    assert.equal(await confirmation.getByRole('button',{name:'继续'}).count(),0);
    assert.deepEqual(await grid.boundingBox(),gridBefore);
    await removeOther.waitFor();
    await page.keyboard.press('Escape');
    await confirmation.waitFor({state:'hidden'});
    assert.equal(await manager.isVisible(),true);
    await removeOther.click();
    await confirmation.getByRole('button',{name:'删除',exact:true}).click();
    await removeOther.waitFor({state:'detached'});
    await manager.getByRole('button',{name:'我的小动画，使用中'}).waitFor();
    await removeCustom.click();
    await confirmation.getByText('删除 GIF「我的小动画」？').waitFor();
    await confirmation.getByRole('button',{name:'删除',exact:true}).click();
    await custom.waitFor({state:'detached'});
    assert.equal(await activeSticker.textContent(),'冒冒探头');
    await tabs.first().click();
    await builtInTile.waitFor();
    assert.deepEqual(await tabs.allTextContents(),['系统内置','自定义']);
    assert.deepEqual(errors,[]);
    console.log('PASS: two-tab GIF library, upload, preview, playback, persistence and deletion; switches, native sidebar search, reply previews, subscriptions, routing, composer and stalled timeline recovery. Real X DOM still requires live validation.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
