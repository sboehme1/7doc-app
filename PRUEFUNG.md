# 7DOC 2.1 – Prüfstand und Abnahme

## Durchgeführt

- JavaScript-Syntaxprüfung für `app.js`, `core.js`, `content.js`, `interactions.js` und Worker bestanden.
- **87 automatisierte Tests bestanden**, keine fehlgeschlagenen oder übersprungenen Tests im abschließenden Lauf.
- Darunter 80 Tages-/Abschnittskombinationen (zehn Tage × vier Abschnitte × zwei Sprachen) und alle drei Praxisschritte je Tag in beiden Sprachen als erzeugte Templates geprüft.
- 27 Tests der Datenfunktionen zusätzlich unter `Asia/Bangkok` und `America/Los_Angeles` erfolgreich.
- Cache-Version zweimal berechnet: identisches Ergebnis bei unveränderten Dateien.
- Alle im Worker genannten Dateien vorhanden; alle Manifest-Icon-Abmessungen anhand der PNG-Header passend.
- Wesentliche Farbpaare für normalen Text rechnerisch auf mindestens 4,5:1 geprüft.

Zusätzlich: 114 interaktive Zustandsansichten in DE/EN, alle zehn Übungsergebnisse, Übernahme alter Werteauswahl, Timer-Pause/Fortsetzen, Reglerentwürfe über Navigation/Backup, Speicherfehler beim Stimmungs-Check-in und Zurücknehmen eines Abschlusses, eine eindeutige Weiter-Aktion und der Erhalt des Audiobereichs im partiellen Aktualisierungspfad.

### Welche Fehlerfälle geprüft wurden

Zugang ohne Code; Kern-/Bonus-/Bundle-/Kombinationsrechte; einzelner Tag 10; 7/7 gegenüber 7/10; 0/5/10; fehlende/einzelne/stabile/steigende/fallende/gemischte Messungen; zeitliche Messreihenfolge; Fortsetzen; Sicherung von Entwürfen/Archiven/Stimmung; Import unter Erhalt des Gerätezugangs; ungültige Dateien; Prototype-Felder; HTML als Notiztext; Migration alter Notizen und Bewertungen; fehlender Speicher; Rücknahme eines fehlgeschlagenen Abschluss-Speichervorgangs; Archivierung; Labels und eindeutige Feld-IDs; Kalenderdatum und Zahl der Termine; Offline-Media-Teilbereiche; ungültige Range-Anfragen; Schonung fremder Caches; bestätigtes Update; keine Interzeption fremder Netzwerkanfragen; Entfernung der unsicheren Push- und Debug-Elemente.

## Klare Aussagegrenzen

Die Template-Prüfungen verwenden eine simulierte Dokumentumgebung in Node.js. Sie prüfen erzeugte Ausgabe und Programmpfade, **keine echte Browserdarstellung**, keinen echten Layoutfluss und keine vollständige DOM-/Assistenztechnik-Interaktion.

Die Browser-Vorschau konnte in dieser Sitzung nicht gestartet werden: Der erforderliche Vorschau-Dienst war nicht verfügbar. Deshalb gibt es für diese neue Version keine visuelle Browserabnahme und keine echten Browser-Ende-zu-Ende-Tests. Insbesondere Audio, Medienfortsetzen, native Dialoge, Canvas-Download und Drucklayout müssen in realen Browsern geprüft werden.

Die 20 Audiodateien fehlen im Ausgangspaket. Die neue Offline-Logik wurde mit simulierten Antworten geprüft. Das ist kein Nachweis, dass reale Dateien vollständig geladen oder auf einem iPhone abgespielt wurden.

Die bestehende Live-App und reale Nutzerdaten wurden bei dieser Umsetzung nicht geändert. Es wurde kein Deployment vorgenommen.

## Lokal erneut prüfen

```text
node scripts/test.cjs
node scripts/check-assets.cjs
node scripts/update-cache.cjs
```

Die Audio-Dateiprüfung soll bis zum Ergänzen der Original-MP3s fehlschlagen. Alle übrigen Prüfungen brauchen keine externen Pakete oder Konten.

## Vor dem Hosting auf einer Testkopie abnehmen

| Test | Erwartung |
|---|---|
| 320, 375, 390 und 768 Pixel Breite; Desktop; 200 % Zoom | Texte und Hauptaktionen erreichbar, keine abgeschnittenen Felder oder horizontale Seitenscroller. Die kleine Tagesleiste darf horizontal scrollen. |
| DE und EN, heller/dunkler/Systemmodus | Alle Bedienelemente lesbar; Sprache bleibt nach Reload erhalten. |
| Tab, Enter, Space, Escape; Screenreader | Reihenfolge sinnvoll, Slider benannt, Dialog allein aktiv, Schließen und Fokus-Rückkehr funktionieren. |
| Erster Besuch ohne Zugang | Kein Inhalt über Hauptnavigation freigeschaltet; Einstellungen und Hilfe erreichbar. |
| Alle Produktcodes und zusätzlicher Code | Exakt passende Tage; HOMECOMING unabhängig von Groß-/Kleinschreibung. |
| Migration mit einer Kopie alter Browserdaten | Notizen, Abschlüsse, Name, Werte und alte Bewertungen erhalten. Neue Vergleiche trennen bestätigte Check-ins. |
| Tippen, sofort Reload, später Wiederöffnen | Letzter Text bleibt; Speicherblockade ergibt sichtbare Fehlermeldung und Sicherungsmöglichkeit. |
| Regler 0/5/10; Änderung und Weiter | Korrekter Wert, bewusste Bestätigung; übersprungener Check-in bleibt optional. |
| Tag 7/10 zuerst abschließen | Nur dieser Tag zählt. Gesamtrückblick und Zertifikat erst bei vollständigem eigenen Programm. |
| Neuer Durchlauf | Alte Einträge im Archiv, neue Tage leer, Zugang/Einstellungen vorhanden. |
| JSON-Export/Import auf zweitem Browser | Aktuelle Einträge, Entwürfe und Archive wieder da; Zielgerät behält seinen Zugang. |
| Ungültiges JSON, falsche Version, zu große Datei | Verständliche Ablehnung; aktueller Stand bleibt erhalten. |
| Reales Audio in DE und EN | Richtiger Tag, Play/Pause/Seek funktionieren, Fehler verständlich, Fortsetzen sinnvoll. |
| 4/6-Atemhilfe, Pause, Hintergrundwechsel, reduzierte Bewegung | Genau fünf Zyklen ohne Haltephase; Pause funktioniert, Hintergrund pausiert, Abschluss bleibt erreichbar. |
| Offline herunterladen, dann Flugmodus | Hülle startet, gewünschtes Audio spielt/seekt; fehlendes Audio zeigt ehrlichen Zustand. |
| Zertifikat, langer Name, Umlaute, iPhone-/Android-Download | Bild vollständig, passender Programmumfang und Name; Download bzw. Speichern über Browser möglich. |
| PDF mit langer Notiz und Sonderzeichen | Alle Texte enthalten, Seitenumbrüche und Druckdialog verständlich. |
| Kalenderdatei in deiner Kalender-App | Gewünschte lokale Uhrzeit, richtige Wiederholungszahl, Hinweis auf Verwaltung im Kalender verstanden. |
| Update während laufender Installation | Neuer Worker wartet auf Bestätigung; Eingaben bleiben; Offline-Audios bleiben erhalten. |
| Datenlöschung in einem eigens vorbereiteten Testprofil | Nur 7DOC-Daten des Profils entfernt; Zugang lässt sich anschließend erneut eingeben. |

## Noch getrennt erforderlich

- Alle 20 MP3s inhaltlich und klanglich anhören.
- Sicheren Push-Betrieb bei Bedarf im tatsächlichen OneSignal-Konto neu einrichten.
- Vollständige wissenschaftliche/redaktionelle Prüfung der Buchaussagen und finalen Anbieter-/Datenschutzinformationen.
- Kurzer Nutzertest mit neuen Nutzern, besonders bei Fortsetzen, Schreibmodus und Rückblick.

## Technische Referenzen

- Service Worker: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
- Native Dialoge: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal
- Druck/PDF: https://developer.mozilla.org/en-US/docs/Web/API/Window/print
- Cache: https://developer.mozilla.org/en-US/docs/Web/API/Cache/put
- Media-Ranges: https://web.dev/articles/sw-range-requests

Die Referenzen erklären die verwendeten Browserfunktionen; sie ersetzen den konkreten Gerätetest dieser App nicht.
