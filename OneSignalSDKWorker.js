importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

var CACHE_NAME = "7doc-v115";
var FILES_TO_CACHE = [
  "./","./index.html","./style.css","./app.js","./manifest.json",
  "./img/logo.png","./img/flag-de.svg","./img/flag-en.svg",
  "./Daily%20Routine%20Sheet%20-%20DE.pdf","./Daily%20Routine%20Sheet%20-%20EN.pdf"
];
self.addEventListener("install", function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) { return cache.addAll(FILES_TO_CACHE); }));
  self.skipWaiting();
});
self.addEventListener("activate", function(event) {
  event.waitUntil(caches.keys().then(function(names) {
    return Promise.all(names.map(function(name) { if (name !== CACHE_NAME) return caches.delete(name); }));
  }));
  self.clients.claim();
});
self.addEventListener("message", function(event) {
  if (event.data && event.data.type === "SKIP_WAITING") { self.skipWaiting(); }
});
self.addEventListener("fetch", function(event) {
  if(event.request.method !== "GET") return;
  if(event.request.url.indexOf("onesignal.com") > -1) return;
  if(event.request.url.startsWith("chrome-extension://")) return;
  event.respondWith(caches.match(event.request).then(function(cached) {
    if (cached) return cached;
    return fetch(event.request).then(function(response) {
      if (!response || response.status !== 200) return response;
      var responseToCache = response.clone();
      caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, responseToCache); });
      return response;
    });
  }));
});
