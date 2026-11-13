(() => {
  'use strict';
  const host=document.getElementById('xqc-native-panel');
  if(!host){alert('请先启用 Peekala 书签并点击头像，出现错误后再点“Peekala 侧栏诊断”。');return;}
  const mount=host.querySelector('.xqc-root');
  const key=mount&&Object.keys(mount).find(k=>k.startsWith('__reactContainer$'));
  const raw=key&&mount[key], root=raw?.stateNode?.current||raw;
  const found=[], boundaries=[], paths=new Set(), seen=new Set(), stack=[root];
  let visited=0;
  function record(value,label) {
    if(!value||typeof value!=='object'||seen.has(value))return;
    seen.add(value);
    if(typeof value.message==='string')found.push(label+': '+value.message.slice(0,1400)+(typeof value.stack==='string'?'\n'+value.stack.slice(0,2600):''));
  }
  while(stack.length&&visited++<20000){
    const f=stack.pop();if(!f)continue;
    const name=f.type?.displayName||f.type?.name||'anonymous';
    const instance=f.stateNode;
    if(instance&&typeof instance.componentDidCatch==='function')boundaries.push(name);
    const state=f.memoizedState, props=f.memoizedProps;
    record(state,name+'.state');
    for(const obj of [state,props,instance]) {
      if(!obj||typeof obj!=='object')continue;
      for(const field of Object.keys(obj).filter(k=>/error|exception/i.test(k)).slice(0,12)) {
        // Only surface error messages/stacks, never serialize stores or contexts.
        record(obj[field],name+'.'+field);
      }
    }
    if(props?.path)for(const p of [].concat(props.path))if(typeof p==='string')paths.add(p);
    if(f.child)stack.push(f.child);if(f.sibling)stack.push(f.sibling);
  }
  const text=['Peekala 侧栏诊断 v1','右侧 React 根：'+Boolean(root),'扫描组件：'+visited,
    '错误边界：'+(boundaries.join(', ')||'无'),
    '路径模板：'+([...paths].slice(0,15).join(', ')||'无'),
    ...(found.length?found.slice(0,4):['原生错误边界没有保留可读取的异常；还不能确定具体原因。'])].join('\n\n');
  let out=host.querySelector('#xqc-diagnostic');
  if(!out){out=document.createElement('textarea');out.id='xqc-diagnostic';out.readOnly=true;out.setAttribute('aria-label','双栏错误诊断');out.style.cssText='display:block;box-sizing:border-box;width:100%;height:360px;padding:12px;font:12px monospace;white-space:pre-wrap';host.insertBefore(out,mount);}
  out.value=text;out.focus();out.select();
})();
