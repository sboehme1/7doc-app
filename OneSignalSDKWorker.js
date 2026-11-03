/* Keep this URL for existing installations. Push is deliberately inactive.
   Run `node scripts/update-cache.cjs` before uploading a changed version. */
'use strict';
const CACHE_NAME = '7doc-shell-f813b7b6693882';
const MEDIA_CACHE = '7doc-media-v2';
const SHELL = [
  './', './index.html', './style.css', './mobile.css', './core.js', './content.js', './interactions.js', './app.js', './manifest.json',
  './img/logo.png', './img/icon-192.png', './img/icon-512.png', './img/icon-maskable.png', './img/apple-touch-icon.png',
  './Daily%20Routine%20Sheet%20-%20DE.pdf', './Daily%20Routine%20Sheet%20-%20EN.pdf'
];
const shellURLs = new Set(SHELL.map(path => new URL(path, self.location.href).href));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL.map(path => new Request(new URL(path,self.location.href),{cache:'reload'})))));
  // Updating users decide when to activate; the first installation activates normally.
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('7doc-') && name !== CACHE_NAME && name !== MEDIA_CACHE).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
// A cached index.html may have followed the host's redirect to ./.
// Navigation requests can reject that response's redirect flag on reload.
function navigationResponse(response) {
  return response.redirected ? new Response(response.body, {
    status:response.status, statusText:response.statusText, headers:response.headers
  }) : response;
}
async function serveNavigation(request) {
  try {
    const cache=await caches.open(CACHE_NAME);
    const cached=await cache.match(new URL('./index.html',self.location.href).href);
    if(cached?.ok)return navigationResponse(cached);
  } catch { /* A cache failure must still allow an online page load. */ }
  try { return navigationResponse(await fetch(request)); }
  catch {
    return new Response('<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>7 Days of Change</title><body><h1>Deine App ist gerade nicht erreichbar.</h1><p>Prüfe deine Verbindung. Beim lokalen Test muss der Server in PowerShell weiterlaufen. Lade die Seite anschließend erneut.</p><p>Your app is temporarily unavailable. Check your connection. For local tests, keep the server running, then reload this page.</p></body></html>',{
      status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}
    });
  }
}
async function rangedResponse(response, range) {
  const data = await response.arrayBuffer(), size = data.byteLength;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range || '');
  const invalid = () => new Response(null,{status:416,headers:{'Content-Range':'bytes */'+size,'Accept-Ranges':'bytes'}});
  if(!match || (!match[1]&&!match[2]))return invalid();
  let start,end;
  if(!match[1]){const suffix=Number(match[2]);if(!suffix)return invalid();start=Math.max(0,size-suffix);end=size-1;}
  else{start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),size-1):size-1;}
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start)return invalid();
  const headers=new Headers(response.headers);headers.set('Content-Range',`bytes ${start}-${end}/${size}`);headers.set('Content-Length',String(end-start+1));headers.set('Accept-Ranges','bytes');
  return new Response(data.slice(start,end+1),{status:206,statusText:'Partial Content',headers});
}
self.addEventListener('fetch', event => {
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;
  if(/\/audio\/(de|en)\/audio-tag-\d+-(de|en)\.mp3$/.test(url.pathname)){
    event.respondWith((async()=>{const media=await caches.open(MEDIA_CACHE),cached=await media.match(request.url);if(cached)return request.headers.has('Range')?rangedResponse(cached,request.headers.get('Range')):cached;try{return await fetch(request);}catch{return new Response('Audio unavailable offline',{status:503,headers:{'Content-Type':'text/plain'}});}})());return;
  }
  if(request.mode==='navigate'){
    event.respondWith(serveNavigation(request));return;
  }
  if(shellURLs.has(request.url))event.respondWith((async()=>{const cache=await caches.open(CACHE_NAME);return await cache.match(request)||fetch(request);})());
});
