# 7DOC – Update 2.1.2

Ergänzung für deine bereits installierte Version 2.1 oder 2.1.1. Das Paket enthält die geänderten App-Dateien und die aktuellen Tests. Die Kontrast- und Neulade-Korrekturen aus 2.1.1 sind enthalten.

## Was du jetzt bekommst

- Neben dem Sprachbutton steht eine Schaltfläche mit Sonne/Mond und „Hell“ oder „Dunkel“. Der Text bezeichnet die Ansicht, zu der du wechseln kannst.
- Die Wahl wird auf deinem Gerät gespeichert. Die geöffnete Übung wird beim Wechsel nicht neu aufgebaut; Eingaben, Audio-Bereich und Timer bleiben eingebunden.
- Unter Einstellungen → Darstellung kannst du weiterhin „Wie mein Gerät“ auswählen. Ein direkter Wechsel über den Kopfbereich wählt anschließend ausdrücklich Hell oder Dunkel.
- Im zweiten Praxisschritt von Tag 2 steht unter dem Schreibfeld ein sichtbarer Hinweis: „Welche kleine Handlung passt für dich zu diesem Wort? Zum Beispiel: ‚Geduld‘ → ‚Ich lasse jemanden ausreden, bevor ich antworte.‘ Dein Satz darf ganz einfach sein.“
- Der Hinweis ist auch auf Englisch vorhanden, bleibt während des Schreibens sichtbar und ist für Screenreader mit dem Feld verknüpft. Er wird nicht als persönliche Antwort gespeichert.
- Auf schmalen Bildschirmen kann der Kopfbereich zweizeilig werden, damit Sprach- und Darstellungswechsel Platz haben.

## Dateien übernehmen

1. Entpacke die ZIP über „Alle extrahieren“.
2. Öffne darin `7DOC_Update_2_1_2` und kopiere dessen Inhalt in:

   `C:\Users\thriv\OneDrive\Desktop\7DaysOf Change\7DaysOfChange - APP`

3. Ersetze die gleichnamigen Dateien und führe den Ordner `tests` mit dem vorhandenen zusammen. Deine übrigen Dateien und Audios bleiben bestehen.
4. Lass deinen bisherigen lokalen Server geöffnet. Öffne die App weiterhin unter `http://localhost:3000`.
5. Lade die Seite neu. Wenn die App „Eine neue App-Version ist bereit“ anzeigt, wähle „Jetzt aktualisieren“. Die neue Version steht unter Einstellungen als 7DOC 2.1.2.

Falls die alte Ansicht bleibt, lade nochmals neu und warte auf den Aktualisierungshinweis. Als gezielter Ersatzweg: F12 → Application → Service workers → beim Eintrag localhost:3000 auf Unregister klicken, alle lokalen App-Tabs schließen und die Adresse neu öffnen. Deine persönlichen Einträge liegen getrennt im Local Storage. Verwende für diesen Schritt ausschließlich Unregister.

Falls du den Server beendet hast, öffne PowerShell und führe die beiden Befehle einzeln aus:

```powershell
Set-Location -LiteralPath "C:\Users\thriv\OneDrive\Desktop\7DaysOf Change\7DaysOfChange - APP"
npx.cmd serve . -l 3000
```

Lass dieses Fenster geöffnet, während du die App testest.

## Prüfung

Im App-Ordner kannst du erneut prüfen:

```powershell
node scripts/test.cjs
node scripts/check-assets.cjs
node scripts/update-cache.cjs
```

96 automatisierte Tests sind bestanden. Drei neue Tests prüfen den Darstellungswechsel einschließlich gespeicherter Einstellung, unveränderter Übungsansicht und System-/Englisch-Variante sowie den Beispielhinweis mit bereits ausgefülltem Feld in beiden Sprachen. Die früheren Kontrast- und Worker-Tests bestehen weiterhin.

Diese Tests verwenden simulierte Dokumente und prüfen keine echte Browserdarstellung. Bitte prüfe kurz:

- Hell/Dunkel über den Button neben DE/EN; Auswahl bleibt nach Neuladen erhalten.
- Tag 2 → Praxis → zweiter Schritt → Wert wählen → Beispiel unter dem Schreibfeld lesen.
- Einen eigenen Satz schreiben; die Ansicht umschalten und neu laden; eigener Satz bleibt erhalten.
- Auf schmalem Fenster: beide Kopf-Buttons erreichbar und Beschriftungen lesbar.

Danach geht die Prüfung mit Tag 3 weiter: Vorhaben, kleinere Version, konkreter Anfang und optionaler 30-Sekunden-Timer. Anschließend Tag 4: Beobachtung, eigene Geschichte und hilfreiche Sicht.

Cache-Version: 7doc-shell-c0105519ed9b9a. Die echten Audios liegen weiterhin nur in deinem Projektordner. Dieses Update veröffentlicht deine App noch nicht.
