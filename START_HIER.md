# 7DOC 2.1 – Start und Hosting

Diese Version überarbeitet die Oberfläche und Nutzerführung der bereitgestellten 7DOC-App. Sie bleibt eine statische App aus HTML, CSS und JavaScript. Du brauchst für das Hosting keinen Build und keinen neuen Dienst.

**Stand:** Code- und Funktionstests bestanden; visuelle Browser- und Geräteabnahme noch offen. Die Vorschau-Infrastruktur dieser Sitzung stand nicht zur Verfügung. Lies vor der Veröffentlichung `PRUEFUNG.md`.

## 1. Was im Paket liegt

- `index.html`: schlanke App-Hülle, lokale Skripte, PWA-Verknüpfung.
- `style.css`: responsive Oberfläche, heller/dunkler Modus, Tastaturfokus, reduzierte Bewegung, Drucklayout.
- `content.js`: alle zehn Tagesinhalte auf Deutsch und Englisch.
- `core.js`: Datenmodell, Zugang, Migration, Auswertung, Sicherung und Kalendertermine.
- `interactions.js`: die zehn interaktiven Tagesübungen, deren Zustände und persönliche Fundstücke.
- `app.js`: Ansichten, Formulare, Audio, Dialoge und Interaktionen.
- `OneSignalSDKWorker.js`: Offline- und Update-Worker. Der bisherige Dateiname bleibt für bestehende Installationen erhalten. Der unsichere Push-Versand ist entfernt.
- `manifest.json`, `img/`, `CNAME`, die zwei Routine-Sheet-PDFs.
- `scripts/`, `tests/`: Prüfungen und automatische Cache-Versionierung. Node.js ab Version 18 erforderlich; empfohlen ist eine aktuelle LTS-Version.

## 2. Wichtig: deine Audios ergänzen oder beibehalten

Die hochgeladenen Ausgangsdateien enthielten keine MP3s. Deshalb enthält auch dieses Paket keine erfundenen Ersatz-Audios. Deine bisherigen Pfade bleiben bestehen:

```text
audio/de/audio-tag-1-de.mp3
...
audio/de/audio-tag-10-de.mp3

audio/en/audio-tag-1-en.mp3
...
audio/en/audio-tag-10-en.mp3
```

Wenn du die Dateien in dein bestehendes Repository übernimmst, **behalte dessen `audio/`-Ordner**. Wenn du einen neuen Hosting-Ordner anlegst, kopiere die bisherigen Audios hinein.

Danach kannst du prüfen:

```text
node scripts/check-assets.cjs
```

Diese Prüfung meldet fehlende Dateien und beendet sich dann bewusst mit einem Fehlerstatus. Sie prüft Dateipfade, nicht Klang oder Inhalt.

## 3. In drei kleinen Schritten lokal vorbereiten

### Schritt A: Kopie und Dateien

1. Sichere deinen bisherigen Projektordner bzw. den bisherigen Git-Stand.
2. Entpacke dieses Paket in einen eigenen Ordner. Für dein bestehendes Repository übernimmst du anschließend den **Inhalt** von `7DOC_App_v2_1` in dessen bisheriges App-Hauptverzeichnis.
3. Behalte bzw. ergänze die ursprünglichen `audio/de`- und `audio/en`-Verzeichnisse.

### Schritt B: Prüfen

Öffne dein Terminal im neuen App-Verzeichnis:

```text
node scripts/test.cjs
node scripts/check-assets.cjs
node scripts/update-cache.cjs
```

Der erste Befehl benötigt keine zusätzlichen Pakete. Er prüft die JavaScript-Syntax und startet die mitgelieferten Tests. Die Tests enthalten zusätzlich 114 lokalisierte Zustandsansichten der Tagesinteraktionen. Der dritte Befehl berechnet die Cache-Version aus den tatsächlichen Dateien. Führe ihn nach späteren Änderungen vor jedem Upload erneut aus.

### Schritt C: Im Browser ansehen

Deine bisherige Vorgehensweise funktioniert weiterhin:

```text
npx serve .
```

Öffne die im Terminal angegebene lokale Adresse. Öffne `index.html` für vollständige Tests über HTTP/HTTPS: Offline-Worker und Code-Prüfung brauchen einen unterstützten sicheren Browserkontext. `localhost` ist in üblichen Entwicklungsbrowsern dafür vorgesehen.

Teste zuerst die Punkte in `PRUEFUNG.md`, besonders Smartphone-Ansicht, Audio, Import, Druck/PDF und Zertifikat.

## 4. Zugangscodes und Rechte

Die bisherigen öffentlichen Produktcodes bleiben bestehen:

- `CHANGE7`: Tage 1–7.
- `CHANGE10`: Tage 8–10. Dieser Code gewährt jetzt tatsächlich die Erweiterung, auch als eigenständigen Bereich.
- `CHANGE7` plus `CHANGE10`: Tage 1–10.
- `HOMECOMING`: Tage 1–10; der Hash-Fehler ist behoben.
- Der bisherige Eigentümercode bleibt kompatibel.

Die Eingabe ist unabhängig von Groß-/Kleinschreibung; Leerzeichen außen werden entfernt. Beide Code-Eingabewege nutzen dieselbe Prüfung.

**Schutzumfang:** Die App ist weiterhin vollständig clientseitig. Der Code-Zugang ordnet den normalen Bedienweg und die gekauften Bereiche. Er ist kein serverseitiger Lizenzschutz; die Inhaltsdatei wird wie bisher an den Browser ausgeliefert.

## 5. Bisherige Nutzerdaten

Die neue Version übernimmt beim ersten Start auf derselben Origin (Protokoll, Domain und Port) die bisherigen Zugangshashes, Notizen, Abschlüsse, Bewertungen, den Namen, die Sprache, die Theme-Wahl, die Werteauswahl und vorhandene Stimmungs-Check-ins.

Alte Bewertungen werden sichtbar als übernommene Werte behalten. Sie werden nicht rückwirkend als bestätigte neue Check-ins ausgegeben, weil die bisherige App auch automatische Startwerte verwendete. Neue Vergleiche beruhen auf bewusst bestätigten Check-ins.

Der neue Hauptspeicher heißt `7doc_state_v2`. Die alten Nutzdaten-Schlüssel werden bei der Übernahme nicht entfernt. Der alte Schlüssel `7doc_os_key` wird gezielt entfernt, da private OneSignal-Schlüssel nicht im Browser bleiben sollen.

Wenn du die Domain wechselst, kann der neue Browserkontext den bisherigen Speicher nicht automatisch lesen. Führe die Migration zunächst auf der bisherigen Domain aus und nutze danach die neue Sicherungsdatei für den Geräte-/Domainwechsel.

Bei einem beschädigten neuen Hauptspeicher überschreibt die App die Originaldaten nicht automatisch. Unter Einstellungen bietet sie deren Download und die Wiederherstellung an. Bei knappem bzw. gesperrtem Browser-Speicher erscheint eine sichtbare Meldung; aktuelle Texte bleiben im geöffneten App-Zustand für eine Sicherung verfügbar.

## 6. Wie die neuen Funktionen arbeiten

**Heute:** zeigt den begonnenen offenen Tag oder den nächsten freigeschalteten Tag. Nach dem tatsächlichen Programmabschluss führt die Hauptaktion zum Rückblick.

**Session:** Ankommen → Praxis → Reflexion → Ausklang. Die drei Praxisschritte sind einzeln wählbar. Eine einzige Weiter-Aktion führt zunächst durch die Praxisschritte und danach zur Reflexion. Der Audiobereich bleibt beim Wechsel zwischen Praxisschritten eingebunden. Tageswahl, Wiederholen und Pausieren bleiben frei.

**Schreiben:** Jede Texteingabe wird synchron auf diesem Gerät gespeichert. Für die Übungen gibt es passende digitale Felder. Alternativ lässt sich unter Einstellungen der Papiermodus wählen.

**Check-ins:** Regler starten sichtbar bei 5. Änderungen bleiben als getrennte Entwürfe auch nach Navigation oder Reload erhalten. Diese Startwerte zählen erst nach einer bewussten Bestätigung. 0 bleibt ein gültiger Wert. Geänderte Regler werden vor einem Abschnittswechsel innerhalb der Session zur Bestätigung angeboten. Ein Check-in bleibt freiwillig.

**Stimmung:** freiwillig auf der Heute-Seite, mit benannten Auswahlmöglichkeiten. Der jüngste Wert eines Kalendertages wird gespeichert. Die letzten 14 Einträge sind unter Meine Reise sichtbar; alle gespeicherten Einträge kommen in die Sicherung.

**Abschluss:** zählt alle freigeschalteten Tage des aktuellen Umfangs. Ein einzelner Tag 7/10 bestätigt nicht das ganze Programm. Der Tagesabschluss lässt sich zurücknehmen. Ein Zertifikat ist auch nach sieben Kerntagen bzw. einem separat freigeschalteten, vollständig absolvierten Bonusbereich möglich.

**Sicherung:** JSON-Datei mit aktuellen und archivierten Einträgen sowie Einstellungen. Persönliche Zugangshashes und alte API-Schlüssel werden nicht exportiert. Beim Import bleibt der Zugang dieses Geräts erhalten. Export und Import verwenden dieselbe Grenze von 32 MiB. Übersteigt eine Gesamtsicherung diese Grenze, bietet die App die Sicherung einzelner Durchläufe unter Meine Reise an. Einzelne Archive lassen sich dort nach eigener Sicherung gezielt entfernen. Die Importgrenze beträgt 32 MiB; sehr große Sicherungen brauchen bei Bedarf eine technische Einzelfallprüfung. Die Datei enthält persönliche Texte: privat aufbewahren.

**PDF:** Unter Meine Reise → „Drucken / als PDF speichern“ öffnet sich der Druckdialog des Browsers. Wähle dort „Als PDF speichern“, sofern angeboten. Auch Entwürfe und lange Antworten werden in das Druckdokument aufgenommen. Die konkrete Seitendarstellung ist im Geräte-/Browser-Test abzunehmen.

**Neuer Durchlauf:** archiviert den bisherigen Stand und startet mit leeren Tagen. Bis zu 20 Archive sind vorgesehen. Einstellungen und Zugang bleiben erhalten. Archive sind in Meine Reise auswählbar. Die gesamte Sicherung enthält sie ebenfalls.

**Datenlöschung:** eigener Vorgang mit klarer Bestätigung. Entfernt die 7DOC-Nutzerdaten und Offline-Audios aus diesem Browser. Die Programmhülle kann im Offline-Cache bleiben; sie enthält keine persönlichen Einträge.

**Erinnerung:** Kalenderdatei mit täglich wiederkehrenden Terminen für die Zahl der noch offenen freigeschalteten Tage. Du importierst sie selbst. Änderungen, Pausen, Berechtigungen und bereits importierte Termine verwaltest du anschließend in deiner Kalender-App. Die Datei bleibt nicht mit der App synchronisiert.

**Offline-Audio:** ausdrücklich pro Tag und Sprache speichern. Die App meldet Erfolg erst nach dem vollständigen Download. Der Worker unterstützt Teilanfragen (Range Requests). Geänderte Audios bei Bedarf erneut herunterladen. Audio kann Speicherplatz brauchen; dessen Umfang wird nach dem Download angezeigt.

## 7. Push-Nachrichten

Automatische OneSignal-Pushes sind in dieser Version bewusst deaktiviert. Es gibt keinen Browser-Versand mit privatem REST-Key und keinen Fallback an sämtliche Abonnenten. Es wird auch kein OneSignal-Skript beim App-Start geladen.

Wenn ein produktiver REST-Key bisher im Browser verwendet wurde, erneuere ihn im OneSignal-Dashboard. Prüfe dort auch alte Kampagnen bzw. Automationen und pausiere diejenigen, die nicht mehr zu dieser Version passen.

Eine spätere sichere Integration kann mit einer klaren Zustimmung im UI und passenden Journeys im bestehenden OneSignal-Konto erfolgen. Das erfordert einen gesonderten Zustelltest auf echten Geräten. Die Kalenderfunktion ist bereits ohne zusätzliche Konten nutzbar.

## 8. GitHub Pages / bestehendes Hosting

1. Übernimm die Dateien in den bisherigen App-Hauptordner, inklusive `core.js`, `content.js` und `interactions.js`. Behalte die Audios. `index.html`, CSS, App-Logik, Worker und Manifest müssen zusammen ausgerollt werden.
2. Führe nach allen Änderungen `node scripts/test.cjs`, `node scripts/check-assets.cjs` und `node scripts/update-cache.cjs` aus.
3. Committe und pushe wie bisher. Die bereitgestellte `CNAME` bleibt auf die ursprüngliche App-Domain ausgerichtet.

Die Dokumentations- und Testdateien können im Repository bleiben. Für einen besonders schlanken öffentlichen Upload reichen die App-Dateien, der Worker, das Manifest, die Bilder, die beiden PDFs und die Audios. `.openai` ist nur eine Vorschau-Konfiguration dieser Arbeitsumgebung und wird im Liefer-ZIP nicht benötigt.

Ein Update soll anschließend regulär über den Hinweis in der App bestätigt werden. Das Löschen aller Browserdaten ist dafür nicht nötig und würde die persönlichen Daten entfernen. Prüfe diesen Updateweg auf einer Testinstallation, bevor du ihn allen Käufern bereitstellst.

## 9. Rückkehr zur vorherigen Version

Die hochgeladenen Ausgangsdateien wurden nicht verändert. Dein gesicherter bisheriger Git-Stand bleibt der technische Rückweg. Die neue Version schreibt neue Notizen in ihr neues Datenmodell; die alte Version kann diese Einträge nicht selbst lesen. Sichere deshalb vor einem Rückwechsel die neue JSON-Datei. Frühere Nutzdaten-Schlüssel bleiben bis zur ausdrücklichen Datenlöschung erhalten.
