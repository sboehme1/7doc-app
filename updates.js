/* Automatic update coordination. No personal data is sent between tabs. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SevenUpdates=api;})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const BUILD_ID='7doc-shell-89c1285413c10a',VERSION='2.3';
 function create(options){
  const win=options.window||window,doc=options.document||document,nav=options.navigator||navigator;
  const now=options.now||Date.now,delay=options.setTimeout||setTimeout,cancel=options.clearTimeout||clearTimeout;
  const quiet=options.quietMs??5000,poll=options.pollMs??5000,interval=options.checkMs??300000;
  let reg=null,stopped=false,prepared=false,reloading=false,lastInput=now(),composing=false,lastCheck=0,checking=false,lastStatus='',tickTimer=null,leaseTimer=null,reloadTimer=null,requestAt=-Infinity;
  const listeners=[],watched=new WeakSet();let hadController=!!nav.serviceWorker?.controller;
  function listen(target,event,fn){target.addEventListener(event,fn);listeners.push(()=>target.removeEventListener?.(event,fn));}
  function status(value){if(value!==lastStatus){lastStatus=value;options.status?.(value);}}
  function safe(){return !stopped&&!prepared&&!composing&&now()-lastInput>=quiet&&options.safe();}
  function activity(){lastInput=now();}
  function release(){if(!prepared)return;prepared=false;cancel(leaseTimer);options.unlock?.();}
  function finish(){if(reloading)return;reloading=true;cancel(leaseTimer);cancel(reloadTimer);options.reload();}
  function workerAllowed(source){return source&&typeof source.scriptURL==='string'&&source.scriptURL===new URL('./OneSignalSDKWorker.js',win.location.href).href;}
  function onMessage(event){
   const data=event.data;if(!data||!workerAllowed(event.source))return;
   if((data.type==='7DOC_PREPARE_UPDATE'||data.type==='7DOC_ABORT_UPDATE')&&typeof data.requestId!=='string')return;
   if(data.type==='7DOC_PREPARE_UPDATE'){
    const duplicate=prepared&&data.requestId===prepared;
    let ready=duplicate;
    if(!prepared&&safe()){try{ready=options.prepare()===true;}catch{ready=false;}}
    if(ready&&!duplicate){prepared=data.requestId;status('applying');leaseTimer=delay(()=>{release();status('queued');},15000);}
    event.source.postMessage({type:'7DOC_UPDATE_READY',requestId:data.requestId,build:data.build,ready});
   }else if(data.type==='7DOC_ABORT_UPDATE'&&prepared===data.requestId){release();status('queued');}
  }
  function onControllerChange(){
   if(!hadController&&!prepared){hadController=true;return;}hadController=true;
   if(prepared){finish();return;}
   // Another supported tab, or an older installation, may activate the worker.
   // Delay this tab's reload until it can safely freeze; never write a stale state.
   recheckReload();
  }
  function recheckReload(){
   if(stopped||reloading)return;
   if(safe()){let ok=false;try{ok=options.prepare()===true;}catch{}if(ok){prepared='controllerchange';finish();return;}}
   reloadTimer=delay(recheckReload,poll);
  }
  function observe(){
   if(stopped||!reg)return;
   if(reg.waiting){status('queued');return;}
   const worker=reg.installing;
   if(worker&&!watched.has(worker)){watched.add(worker);listen(worker,'statechange',observe);}
  }
  async function check(force=false){
   if(stopped||!reg||checking||nav.onLine===false||!force&&now()-lastCheck<interval)return;
   checking=true;lastCheck=now();try{await reg.update();observe();}catch{/* Retry online or on the next periodic check. */}finally{checking=false;}
  }
  function tick(){
   if(stopped)return;
   check();
   if(safe()){
    if(!reg?.waiting)options.idle?.();
    if(reg?.waiting&&safe()&&now()-requestAt>=10000){requestAt=now();try{reg.waiting.postMessage({type:'7DOC_REQUEST_UPDATE'});}catch{status('queued');}}
   }
   tickTimer=delay(tick,poll);
  }
  async function start(){
   for(const event of ['input','keydown','pointerdown','focusin'])listen(doc,event,activity);
   listen(doc,'scroll',activity);
   listen(doc,'compositionstart',()=>{composing=true;activity();});listen(doc,'compositionend',()=>{composing=false;activity();});
   if(!('serviceWorker'in nav)){tick();return;}
   listen(nav.serviceWorker,'message',onMessage);listen(nav.serviceWorker,'controllerchange',onControllerChange);
   listen(win,'online',()=>check(true));listen(win,'focus',()=>check());listen(doc,'visibilitychange',()=>{if(!doc.hidden)check();});
   try{
    reg=await nav.serviceWorker.register('./OneSignalSDKWorker.js',{updateViaCache:'none'});
    if(stopped)return;listen(reg,'updatefound',observe);observe();await check(true);
   }catch{status('unavailable');}
   if(!stopped)tick();
  }
  function stop(){stopped=true;cancel(tickTimer);cancel(reloadTimer);release();listeners.forEach(fn=>fn());}
  return {start,check,stop};
 }
 return {BUILD_ID,VERSION,create};
});
