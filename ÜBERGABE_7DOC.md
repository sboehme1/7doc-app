# Übergabe-Dokument: 7 Days of Change App

**Stand:** 04. April 2026  
**Live-URL:** https://app.sashandventures.com  
**Repo:** https://github.com/sboehme1/7doc-app  
**Branch:** `main`  
**Letzter Commit:** `312baba`

---

## Projektübersicht

Progressive Web App (PWA) für das 7-Tage-Selbstführungsprogramm "7 Days of Change" von Sascha Böhme / Sash & Ventures. Vollständig clientseitig (kein Backend), Datenhaltung per `localStorage`. Bilinguale UI (DE/EN). Offline-fähig via Service Worker.

**Dateien:**

| Datei | Zweck |
|---|---|
| `index.html` | Shell: Header, Nav, Footer, Overlays, SW-init |
| `app.js` | Gesamte App-Logik (~1080 Zeilen) |
| `style.css` | Styling (~1150 Zeilen) |
| `sw.js` | Service Worker: Cache, Offline, Update-Flow |
| `manifest.json` | PWA-Manifest |
| `CNAME` | Custom Domain: `app.sashandventures.com` |
| `img/` | logo.png, flag-de.svg, flag-en.svg |

---

## Aktiver Service Worker

| Parameter | Wert |
|---|---|
| **Cache-Name** | `7doc-v18` |
| **Strategie** | Cache First, Network Fallback |
| **skipWaiting** | Manuell (via Message `SKIP_WAITING`) |
| **Update-Flow** | Popup → Nutzer bestätigt → SW aktiviert → Reload |

> **Wichtig:** `self.skipWaiting()` ist seit v18 aus dem `install`-Handler entfernt. Neue SW-Versionen warten im `waiting`-State bis der Nutzer das Update-Popup bestätigt. Bei künftigen Cache-Bumps (`v19`, `v20`, ...) nur die `CACHE_NAME`-Konstante in `sw.js` hochzählen.

---

## Funktionsübersicht

### Zugangs- und Freischalt-Logik

- **Gate-Screen** beim ersten Aufruf: Eingabe eines Zugangscodes (case-insensitive, SHA-256-gehasht)
- 4 gültige Codes: `CHANGE7`, `CHANGE10`, `HEIMKEHR`, `7DOC`
- `CHANGE7` allein → 7 Tage freigeschaltet (`7days`)
- `CHANGE7` + `CHANGE10` oder `HEIMKEHR` oder `7DOC` → voller Zugang inkl. Bonus-Tage 8–10 (`full`)
- Gespeichert in `localStorage` (`7doc_codes`, `7doc_access`)

### Tagesstruktur

- 10 Tage (7 Kern + 3 Bonus), bilinguale Inhalte in `app.js` (`DAYS_DE` / `DAYS_EN`)
- Fortschritt in `localStorage` (`7doc_progress`)
- Slider-Scores (a/b/c/d = Klarheit, Ruhe, Energie, Selbstvertrauen) pro Tag gespeichert
- Notizen pro Tag und Schritt gespeichert

### Upsell-System

- **Progress-Upsell-Banner**: erscheint unter dem Fortschrittsbalken für `CHANGE7`-only Nutzer
- **Upsell-Karte**: im Journey-View nach Tag 7 wenn Bonus gesperrt
- **Upsell-Popup**: modal nach Abschluss Tag 7 wenn Bonus noch gesperrt
- Links: `sashandventures.gumroad.com/l/7doc-erweiterung-de` (DE) / `7doc-extension-en` (EN)

### Update-Benachrichtigungs-Popup (neu in v18)

- SW erkennt neue Version über `updatefound` + `statechange === "installed"`
- Popup (`#update-banner`) erscheint nur wenn ein alter Controller existiert (kein Erstaufruf)
- "Jetzt aktualisieren" → `postMessage({ type: "SKIP_WAITING" })` → SW aktiviert → `controllerchange` → `window.location.reload()`
- "Nicht jetzt" → Banner schließen, Update beim nächsten Tab-Start
- Text sprachabhängig via `T[LANG].updateMsg`

---

## Implementierte Änderungen (Session 04.04.2026)

### Commit `312baba` — Update-Banner + Tagesabschluss-UI

**TEIL 1: Update-Benachrichtigungs-Popup**

- `sw.js`: `self.skipWaiting()` aus `install`-Handler entfernt; Message-Listener für `SKIP_WAITING` ergänzt; Cache `v17` → `v18`
- `app.js`: SW-Registrierung mit `updatefound`/`statechange`/`controllerchange`-Logik (war inline in `index.html`, jetzt am Ende von `app.js`); Übersetzungsschlüssel `updateMsg`, `updateConfirm`, `updateDismiss` in DE + EN ergänzt
- `index.html`: Inline-SW-Script entfernt; `#update-banner` Div (mit `#update-text`, `#update-confirm`, `#update-dismiss`) vor `</body>` eingefügt
- `style.css`: `#update-banner` fixed bottom-center, `#FAF8F3`, border-radius 16px, box-shadow, z-index 9999, max-width 320px; Confirm-Button Terrakotta `#c0845a`; Dismiss transparent mit underline

**TEIL 2: Tagesabschluss-UI (Day Compare Widget)**

| Nr | Änderung | Datei |
|---|---|---|
| 5 | Delta-Werte als farbige Pill-Badges (grün/rot/beige, font-weight 700) | style.css |
| 6 | Subtitle "Tag 2 — Tag 1" unter "Heute vs. Gestern" entfernt | app.js |
| 7 | Absoluter aktueller Wert (`.dc-abs`) klein grau links neben Delta-Pill | app.js + style.css |
| 8 | Motivationsbox: `dc-up` → `#f0f7f0`, `dc-down` → `#fdf6ee` | style.css |
| 9 | Progress-Bar-Höhe: 8px → 10px | style.css |
| 10 | Card-Padding: 1.2rem → 1.5rem (24px) | style.css |

### Commit `4c2c5fa` — Cleanup

- `sw.js`: Cache `v16` → `v17`
- `style.css`: ~70 Zeilen redundantes CSS entfernt

### Commit `6899c30` — Upsell + Code-Logik v15

- Multi-Code-System mit SHA-256-Hashing
- 3-stufiges Upsell-System (Progress-Banner, Journey-Karte, Modal-Popup)
- Bonus-Tage 8–10 mit Sperr-Logik

---

## Architektur-Entscheidungen

- **Kein Framework**: Vanilla JS, kein Build-Step — direktes Editieren und Deployen via GitHub Pages
- **Kein Backend**: `localStorage` für alles — bewusste Entscheidung für Einfachheit und Datenschutz
- **Audio**: Placeholder-Texte vorhanden, Audio-Hosting noch ausstehend
- **SHA-256 im Browser**: `crypto.subtle.digest()` — keine serverseitige Validierung
- **Bilingualität**: Alle Texte in `T = { de: {...}, en: {...} }` am Anfang von `app.js`

---

## Offene Punkte / Nächste Schritte

### Prio 1 — Funktional ausstehend

- [ ] **Audio-Hosting**: `audioHint`-Platzhalter in app.js durch echte Audio-URLs ersetzen (aktuell: "Audio nach Hosting verfügbar"). Pro Tag eine MP3-Datei (ca. 3 Min). Hosting-Optionen: GitHub Releases, Bunny CDN, oder eigener Server.
- [ ] **Audio-Player UI**: Entsprechende Player-Komponente aktivieren sobald URLs bekannt sind.

### Prio 2 — UX / Polish

- [ ] **Update-Banner Sprachaktualisierung**: Wenn der Nutzer nach Erscheinen des Banners die Sprache wechselt, sollte der Banner-Text mitaktualisiert werden (aktuell: statisch nach Anzeige).
- [ ] **Journey-View Zeitstempel**: Abgeschlossene Tage könnten Datum der Completion zeigen (wird derzeit nicht gespeichert).
- [ ] **Scroll-Position nach Reload**: Nach einem SW-Update-Reload landet der Nutzer oben; könnte verbessert werden.

### Prio 3 — Technisch / Wartung

- [ ] **Commit-Nachrichten**: Aussagekräftigere Messages statt "Update" für bessere Nachvollziehbarkeit im `git log`.
- [ ] **Cache-Strategie**: Fonts von Google Fonts werden nicht gecacht (external CDN). Bei Offline-Nutzung fallen Schriften zurück auf System-Fonts. Fonts lokal einbinden oder explizit in `FILES_TO_CACHE` aufnehmen.
- [ ] **iOS-Homescreen-Icon**: `apple-touch-icon` zeigt aktuell `img/logo.png` — Prüfen ob Größe (mind. 180×180px) korrekt ist.

---

## Lokale Entwicklung

Kein Build-Step. Direkt editieren, dann:

```bash
# Syntax-Check app.js
node --check app.js

# Deployen
git add .
git commit -m "Beschreibung"
git push
```

GitHub Pages deployed automatisch aus `main`. Live in ~1–2 Minuten unter https://app.sashandventures.com.

Bei Cache-Updates: `CACHE_NAME` in `sw.js` inkrementieren (`v18` → `v19` etc.).
