# Bilder-Bedarf – Fachmarkt-Landingpage Hückelhoven

Die neue Landingpage (`/fachmarkt-hueckelhoven`) nutzt aktuell teils bestehende
Bilder (lokal bzw. aus dem WordPress-Medienarchiv). Für ein Premium-Ergebnis
sollten die mit **„NEU"** markierten Motive durch hochauflösende, eigens
fotografierte Bilder ersetzt werden.

Alle **lokalen** Bilder gehören nach `public/fachmarkt/` (bzw. bestehend unter
`public/images/fachmarkt-hueckelhoven/`). Externe URLs zeigen auf
`2025.bodenjaeger.de` (Domain ist in `next.config.ts` freigegeben).

| Sektion | Verwendung | Aktueller Pfad/Quelle | Status | Empf. Format | Min. Auflösung |
|---------|-----------|-----------------------|--------|--------------|----------------|
| 1 Hero | Vollbild-Hintergrund (Ken-Burns) | `public/images/fachmarkt-hueckelhoven/hero-DSCF2859.jpg` | vorhanden (ggf. NEU in höher) | JPG, quer | 2560×1707 |
| 3 Ausstellung | Immersives Vollbild **oder Video** | WP: `.../DSCF2023-...1024x683.jpg` | vorhanden (NEU/Video empfohlen) | JPG quer / MP4+WebM | 2560×1440 |
| 4 Warum Bodenjäger | Bild links | WP: `.../DSCF1968-...1024x683.jpg` | vorhanden (NEU empfohlen) | JPG, 4:5 | 1200×1500 |
| Angebote | beliebig viele Banner (CMS) | WP-Uploads (Mock) | **CMS-gepflegt** | JPG, 16:9 | 1600×900 |
| 7 Kategorien | 6 Bildkarten (Hochformat) | WP-Uploads | vorhanden (NEU empfohlen) | JPG, 4:5 | 1200×1500 |
| 9 Leistungen | **8 Motive** (Bild + Titel + Satz) | WP-Uploads (Interim) | **NEU empfohlen** (s. u.) | JPG, 4:3 | 1200×900 |
| 11 Team | großes Teamfoto (breit) | `public/fachmarkt/team-bodenjaeger-hueckelhoven.jpg` | **NEU – fehlt** | JPG, 21:9/16:9 | 2560×1097 |
| 12 Kontakt/Abschluss | dunkles Hintergrundbild | WP: `.../DSCF2046-...1024x683.jpg` | vorhanden (NEU empfohlen) | JPG, quer | 2560×1707 |

## Offene Muss-Lieferung
- **Team-Foto** (`public/fachmarkt/team-bodenjaeger-hueckelhoven.jpg`) – wird
  aktuell noch nicht angezeigt (Platzhalter/404), sobald die Datei liegt,
  erscheint sie automatisch. Zusätzlich echte Namen/Funktionen in
  `src/content/fachmarkt.ts` → `TEAM.mitglieder` eintragen.

## Sektion 9 – Leistungen: 8 Motive (NEU empfohlen)
Aktuell mit Interim-Fotos aus dem WP-Archiv belegt (`LEISTUNGEN.items[].bild`
in `src/content/fachmarkt.ts`). Für die Premium-Anmutung je Leistung ein eigenes,
zur Leistung passendes Motiv (Querformat 4:3, min. 1200×900):

1. **Verlegeservice** – Handwerker beim Verlegen (Klick-/Klebeboden)
2. **Lieferservice** – Lieferfahrzeug / Ware wird geliefert
3. **Anhängerverleih** – Bodenjäger-Anhänger / Beladung
4. **Warenlagerung** – Lager / gestapelte Paletten
5. **Fachberatung** – Beratungssituation am Ausstellungstisch
6. **Set-Angebote** – Boden + Dämmung + Sockelleiste als Paket
7. **Werkzeugverleih** – Verlege-Werkzeug / Ausleihtheke
8. **Schausonntag** – geöffnete Ausstellung mit Besuchern

## Empfohlen (Qualität)
- Hero, Ausstellung, Warum, Kategorien: eigene, hochauflösende Motive statt der
  auf 1024 px herunterskalierten Archiv-Bilder – für die „Premium-Autohaus"-Anmutung.

## Hinweise
- Alle Bilder werden über `next/image` (AVIF/WebP) ausgeliefert – Originale ruhig
  groß liefern, Next optimiert die Auslieferung.
- Seitenverhältnisse einhalten (Cropping erfolgt via `object-cover`).
