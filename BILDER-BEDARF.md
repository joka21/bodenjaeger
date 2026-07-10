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
| 1 Hero | Vollbild-Hintergrund | `public/images/fachmarkt-hueckelhoven/hero-DSCF2859.jpg` | vorhanden (ggf. NEU in höher) | JPG, quer | 2560×1707 |
| 3 Ausstellung | Bild neben Text | WP: `.../DSCF2023-...1024x683.jpg` | vorhanden (NEU empfohlen) | JPG, 4:3 | 1600×1200 |
| 4 Warum Bodenjäger | Bild links | WP: `.../DSCF1968-...1024x683.jpg` | vorhanden (NEU empfohlen) | JPG, 4:5 | 1200×1500 |
| 6 Filialangebote | 2 Banner (CMS) | WP-Uploads (Mock) | **CMS-gepflegt** | JPG, 16:9 | 1600×900 |
| 7 Kategorien | 6 Bildkarten | WP-Uploads | vorhanden (NEU empfohlen) | JPG, 4:3 | 1200×900 |
| 11 Team | Teamfoto | `public/fachmarkt/team-bodenjaeger-hueckelhoven.jpg` | **NEU – fehlt** | JPG, 4:3 | 1600×1200 |

## Offene Muss-Lieferung
- **Team-Foto** (`public/fachmarkt/team-bodenjaeger-hueckelhoven.jpg`) – wird
  aktuell noch nicht angezeigt (Platzhalter/404), sobald die Datei liegt,
  erscheint sie automatisch. Zusätzlich echte Namen/Funktionen in
  `src/content/fachmarkt.ts` → `TEAM.mitglieder` eintragen.

## Empfohlen (Qualität)
- Hero, Ausstellung, Warum, Kategorien: eigene, hochauflösende Motive statt der
  auf 1024 px herunterskalierten Archiv-Bilder – für die „Premium-Autohaus"-Anmutung.

## Hinweise
- Alle Bilder werden über `next/image` (AVIF/WebP) ausgeliefert – Originale ruhig
  groß liefern, Next optimiert die Auslieferung.
- Seitenverhältnisse einhalten (Cropping erfolgt via `object-cover`).
