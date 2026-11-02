# 7DOC 2.1 – Variante B und zehn interaktive Tagesübungen

Diese Version setzt die gemeinsam ausgewählte Richtung „warm und reduziert“ um. Sie ist ein vollständiges Codepaket für dein bisheriges statisches Hosting. Die Live-App und dein Windows-Ordner wurden nicht verändert.

## Die zehn kleinen Übungen

| Tag | Interaktion | Persönliches Fundstück |
|---|---|---|
| 1 | 4/6-Atembegleitung und freie Wahrnehmungsauswahl | Ein Wort zu deiner Atemwahrnehmung |
| 2 | Bis zu drei Werte auswählen und paarweise betrachten; eigenes Wort möglich | Dein Wert und eine Alltagshandlung |
| 3 | Vorhaben verkleinern, konkreten Anfang formulieren, freiwilliger 30-Sekunden-Timer | Dein kleinster Anfang |
| 4 | Kamera, Geschichte und hilfreiche Sicht einzeln bearbeiten und nebeneinander betrachten | Deine hilfreiche Perspektive |
| 5 | Person und Verbindung wählen, Nachricht selbst kopieren oder Gespräch/stillen Wunsch wählen | Dein Verbindungsmoment |
| 6 | Körper/Raum, Gedanken oder Verbindung betrachten; einen Hebel und seinen Rahmen bestimmen | Dein konkreter Hebel |
| 7 | Eigene Einträge der ersten sechs Tage auswählen und in bis zu zwei Werkzeuge überführen | Deine persönlichen Alltagshandlungen |
| 8 | Satzbausteine für Zeitgewinn, Absage oder Zusage mit Rahmen; frei editierbar | Dein eigener Grenzsatz |
| 9 | Strenge und freundliche Stimme betrachten; eigener Satz als Bildkarte exportierbar | Dein freundlicher Satz |
| 10 | Szene in sechs Monaten, Zukunftsbrief, Werkzeug aus Tag 7 und kleiner Schritt heute | Deine persönliche Postkarte, erneut öffnend und als Bild exportierbar |

Die Übungen sind freiwillig und in der vollständigen Praxis jeweils beim zweiten Übungsschritt erreichbar. Die vorhandenen kurzen Varianten von Tag 1–6 bleiben erhalten. Bei Papierwahl können die digitalen Übungen weiterhin freiwillig verwendet werden. Überspringen setzt keinen falschen Übungserfolg.

Alle Eingaben bleiben lokal, werden durch dieselbe Sicherung erfasst und stehen bei Rückkehr wieder zur Verfügung. Die Fundstück-Sammlung auf Heute zeigt die letzten drei Ergebnisse; Meine Reise zeigt die vorhandene Sammlung vollständig. Manche Interaktionen halten ihr Ergebnis bewusst erst mit „mitnehmen“ fest. Nachrichten werden ausschließlich auf eigenen Tastendruck kopiert, niemals automatisch versendet. Die Postkarte speichert sich lokal; sie wird nicht zeitversetzt verschickt.

## Feinheiten der Oberfläche

- Warmer Creme-Hintergrund bleibt; Karten werden klarer und heller.
- Terracotta `#A6533C`, Haupttext `#2C2824`, sekundärer Text `#68655F`, Salbei `#5C6C55`.
- Systemschrift für Bedienung und lesbare Anleitungen; Serifenschrift für ausgewählte persönliche Überschriften.
- Wichtige Beschriftungen größer; weniger verschachtelte Flächen und konsistente Radien.
- Dezente durchscheinende Navigation und Bedienflächen. Schreibflächen bleiben deckend.
- Systemwunsch nach weniger Transparenz und mehr Kontrast wird zusätzlich berücksichtigt.
- Eine kontextabhängige Weiter-Aktion führt durch die Praxis.
- Übungsschritte aktualisieren ihren Bereich statt der ganzen Seite. Der Audio-Bereich wird dabei nicht ersetzt.
- Die globale Navigation merkt sich die Scrollposition pro geöffnetem Bereich während dieser Sitzung.
- Bei erkannter Bildschirmtastatur wird die untere Navigation ausgeblendet; die Weiter-Leiste steht dann im normalen Dokumentfluss.
- Timer können pausiert werden und pausieren bei Hintergrundwechsel bzw. Öffnen eines Dialogs.

## Korrigierte Randfälle aus der Nachprüfung

1. Stimmungs-Check-in meldet bei einem Speicherfehler keinen Erfolg mehr.
2. Ein fehlgeschlagenes Zurücknehmen des Tagesabschlusses wird im App-Zustand zurückgerollt.
3. Unbestätigte Reglerwerte bleiben als Entwurf erhalten, werden aber nicht als bestätigte Messung ausgewertet.
4. Weiter-Aktionen überspringen nicht mehr versehentlich die übrigen Praxisschritte.
5. Schrittwechsel aktualisieren nur den Session-Inhalt und die zugehörigen Bedienelemente.
6. Export und Import verwenden dieselbe Größenbegrenzung; einzelne Durchläufe sind separat sicherbar.
7. Einzelne Archive lassen sich nach eigener Sicherung entfernen, um einen neuen Durchlauf zu ermöglichen.
8. Audio-Ereignisse nach einem Zurücksetzen werden gegen eine fehlende aktive Tagesnummer abgesichert.

## Übernahme aus früheren Versionen

Der Speicherschlüssel `7doc_state_v2` bleibt unverändert, das Datenformat bleibt kompatibel zur gelieferten Version 2.0. Neue Übungsdaten werden innerhalb der bestehenden Tagesnotizen abgelegt; technische Zustände erscheinen nicht als Rohtext im persönlichen Rückblick oder Druckexport. Das neue Feld `ratingDraft` wird bei früheren Datensätzen leer ergänzt. Die bisherige Werteauswahl aus Tag 2 wird in der neuen Übung weiterverwendet.

## Was vor dem Veröffentlichen noch abzunehmen ist

Die Vorschau-Infrastruktur dieser Sitzung ist weiterhin nicht verfügbar. Daher wurden weder die Apple-inspirierte Gestaltung noch native Browserinteraktionen hier visuell abgenommen. Die automatisierten Tests prüfen Daten, Zustandswechsel und erzeugte Vorlagen; sie ersetzen keinen realen Browser.

Bitte prüfe auf deinem Smartphone und Desktop insbesondere:

- Navigation, Glasflächen, Schriftgrößen, Kontrast und Hell-/Dunkelmodus.
- Alle zehn Übungen einschließlich Pause, Wiederöffnen und geänderter Sprache.
- Bildschirmtastatur, Fokus und Screenreader-Reihenfolge.
- Audio während eines Praxisschrittwechsels und nach Verlassen einer Session.
- Zwischenablage und Export der beiden Bildkarten; bei sehr langen Texten enthält die Bildkarte einen Ausschnitt mit Hinweis auf die vollständigen gespeicherten Einträge.
- JSON-Sicherung und Wiederherstellung; keine Übertragung persönlicher Einträge an einen Server.
- Offline-Audio und Worker-Update mit den echten Audiodateien.

Die ursprünglichen MP3s fehlen weiterhin im bereitgestellten Material und müssen beim Hosting beibehalten oder ergänzt werden. Push bleibt deaktiviert; die Kalender-Erinnerung ist weiter nutzbar.

## Dein Windows-Ordner

Im Bild ist `Desktop\7DaysOf Change\7DaysOfChange - APP` zu sehen. Für den vollständigen Pfad öffnest du den Ordner im Explorer, drückst `Strg + L` und dann `Strg + C`. Dadurch lässt sich später eine genaue Terminal-Anleitung formulieren. Dieses Paket liest oder verändert deinen Windows-Rechner nicht.

Übernimm den Inhalt von `7DOC_App_v2_1` erst in eine gesicherte Kopie deines App-Ordners. Behalte `audio/de` und `audio/en`. `START_HIER.md` erklärt die Prüf- und Hostingbefehle.
