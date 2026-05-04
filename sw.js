/* Service Worker für 7 Days of Change
   =====================================
   Dieser "unsichtbare Assistent" speichert alle App-Dateien
   auf dem Gerät, damit die App auch offline funktioniert.
   
   Strategie: "Cache First, Network Fallback"
   = Zuerst aus dem Tresor liefern (schnell),
     nur bei Bedarf aus dem Internet nachladen.
   
   Bei einem Update: Versionsnummer unten hochzählen (z.B. v2, v3),
   dann werden beim nächsten Öffnen automatisch alle Dateien
   neu heruntergeladen.
*/

importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

var CACHE_NAME = "7doc-v104";

/* Alle Dateien, die offline verfügbar sein sollen */
var FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./img/logo.png",
  "./img/flag-de.svg",
  "./img/flag-en.svg",
  "./Daily%20Routine%20Sheet%20-%20DE.pdf",
  "./Daily%20Routine%20Sheet%20-%20EN.pdf"
];

/* INSTALL: Wird einmalig beim ersten Besuch ausgeführt.
   Lädt alle Dateien herunter und speichert sie im Cache. */
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

/* ACTIVATE: Wird ausgeführt wenn eine neue Version bereitsteht.
   Löscht alte Cache-Versionen automatisch. */
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(name) {
          if (name !== CACHE_NAME) {
            /* Alte Version löschen */
            return caches.delete(name);
          }
        })
      );
    })
  );
  /* Sofort alle offenen Tabs übernehmen */
  self.clients.claim();
});

/* MESSAGE: Manuelle Aktivierung durch Update-Popup */
self.addEventListener("message", function(event) {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/* FETCH: Wird bei JEDER Netzwerk-Anfrage ausgeführt.
   Schaut zuerst im Cache nach — nur wenn nichts da ist,
   wird aus dem Internet geladen. */
self.addEventListener("fetch", function(event) {
  /* POST-Requests und OneSignal-API nie cachen */
  if(event.request.method !== "GET") return;
  if(event.request.url.indexOf("onesignal.com") > -1) return;
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200) {
          return response;
        }
        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
