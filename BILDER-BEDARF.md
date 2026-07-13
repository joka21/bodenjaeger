# Bilder-Bedarf – Landingpages (Fachmarkt, Service, Verlegeservice & Service-Unterseiten)

## Fachmarkt-Service-Unterseiten (`/fachmarkt-hueckelhoven/service/<slug>`)
Je Seite ein Hero-Bild. Aktuell **sichtbare Platzhalter** (4:3, Label „Platzhalter — Bild folgt").
Finale Motive nach `public/service/` (JPG, quer, min. 1600×1200):

| Seite | Ziel-Datei | Motiv |
|---|---|---|
| Fachberatung | `public/service/fachberatung.jpg` | Fachberater betrachtet mit Kunden große Bodenmuster im Fachmarkt |
| Musterservice | `public/service/musterservice.jpg` | Kunde betrachtet großes Bodenmuster im Wohnraum neben Möbeln/Wandfarben |
| Set-Angebote | `public/service/set-angebote.jpg` | Bodenpaket mit Bodenbelag, Sockelleisten, Dämmung und Zubehör |
| Lieferung & Abholung | `public/service/lieferung-abholung.jpg` | Bodenjäger-Lieferfahrzeug / Vorbereitung der Übergabe |
| Einlagerung | `public/service/einlagerung.jpg` | Sauber eingelagerte Bodenpakete im Lager |
| Werkzeugverleih | `public/service/werkzeugverleih.jpg` | Verlegewerkzeug + professionelle Bodenschneidemaschine |

---

# Bilder-Bedarf – Landingpages (Fachmarkt, Service & Verlegeservice)

## Unterseite Verlegeservice (`/fachmarkt-hueckelhoven/service/verlegeservice`)
Auf der Seite sind aktuell **sichtbare Platzhalter** (gestrichelter Rahmen,
Label „Platzhalter — Bild folgt", korrektes Seitenverhältnis) eingebaut, damit
Format und Bildbedarf beurteilbar sind. Finale Motive nach `public/verlegeservice/`:

| Verwendung | Ziel-Datei | Format | Min. Auflösung | Motiv |
|---|---|---|---|---|
| Hero rechts | `public/verlegeservice/hero-verlegung.jpg` | 4:3 | 1600×1200 | Bodenleger bei der Verlegung – echt/handwerklich, keine Stockbilder |
| Ablauf-Block (dunkler Hintergrund) | `public/verlegeservice/ablauf-hintergrund.jpg` | quer 16:9 | 2000×1125 | Verlegung im Detail, dunkel überlagerbar |
| Referenz 1 (Vorher/Nachher) | `public/verlegeservice/referenz-klickvinyl-wohnzimmer.jpg` | 4:3 | 1200×900 | Klick-Vinyl im Wohnzimmer |
| Referenz 2 | `public/verlegeservice/referenz-klebevinyl-kueche-flur.jpg` | 4:3 | 1200×900 | Klebe-Vinyl in Küche und Flur |
| Referenz 3 | `public/verlegeservice/referenz-parkett-wohnbereich.jpg` | 4:3 | 1200×900 | Parkett im Wohnbereich |
| Referenz 4 | `public/verlegeservice/referenz-treppe.jpg` | 4:3 | 1200×900 | Treppenrenovierung mit Bodenbelag |

Vorher/Nachher wo vorhanden (Split oder zwei Bilder je Karte). 3–6 Referenzen möglich.

---

# Bilder-Bedarf – Landingpages (Fachmarkt & Service)

## Service-Übersichtsseite (`/service`)
Aktuell mit Interim-Fotos aus dem WP-Bestand belegt (in `content/service.ts`
verlinkt). Finale, eigens fotografierte Motive gehören nach `public/service/`:

| Verwendung | Ziel-Datei | Interim aktuell | Motiv |
|---|---|---|---|
| Hero rechts | `public/service/beratung-fachmarkt.jpg` | WP `DSCF1968` | Beratungssituation: Mitarbeiter zeigt Kundin Bodenmuster, Musterbox/Dekorbrett sichtbar |
| Verlegeservice-Block (dunkler Hintergrund) | `public/service/verlegung-hintergrund.jpg` | WP `DSCF1962` | Verlegung eines Bodens (quer, dunkel überlagerbar) |
| (optional) Musterbox/Musterbretter | `public/service/musterbox.jpg` | — | Musterbox / Musterbretter, für spätere `/service/musterbox` |
| (optional) Ausstellung | `public/service/ausstellung.jpg` | — | Ausstellung im Fachmarkt, für spätere Unterseiten |

Empf. Format: JPG quer, min. 1600×1200 (Hero/Verlegung 2000×1333+). Auslieferung
via `next/image` (AVIF/WebP).

---

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
| Angebote (Slider) | beliebig viele Banner (CMS) | WP-Uploads (Mock) | **CMS-gepflegt** | JPG, **7:3** | **2800×1200** |
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
