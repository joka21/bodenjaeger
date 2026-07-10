# Separater Backend-Task: CPT `filial_banner` (Sektion 6 – Filialangebote)

> **Abgegrenzt vom Frontend-Branch `neueSeiten`.** Dieser Task betrifft
> ausschließlich WordPress/PHP (Jäger-Plugin bzw. kleines Mini-Plugin). Erst wenn
> der Endpoint live ist, wird das Frontend von Mock-Daten auf den echten Fetch
> umgestellt (siehe unten „Frontend-Umstellung").

## Ziel
Der Kunde soll die Angebots-Banner der Fachmarkt-Landingpage **ohne Deployment**
austauschen können. Dafür ein Custom Post Type `filial_banner` mit REST-Ausgabe.

## Feld-Vertrag (muss mit `src/types/fachmarkt.ts` → `FilialBanner` übereinstimmen)

| Feld (Frontend) | WP-Feld | Typ | Pflicht |
|-----------------|---------|-----|---------|
| `titel` | Post-Titel | text | ✅ |
| `untertitel` | `untertitel` | text | – |
| `bild` | Featured Image (source_url) | image | ✅ |
| `bildAlt` | Alt-Text des Bildes | text | – |
| `ctaLabel` | `cta_label` | text | – |
| `ctaUrl` | `cta_url` | url | – |
| `aktiv` | `aktiv` | bool | ✅ |
| `reihenfolge` | `reihenfolge` / `menu_order` | int | ✅ |
| `gueltigBis` | `gueltig_bis` | date (ISO) | – |

## PHP-Snippet (CPT + REST-Felder)

```php
add_action('init', function () {
  register_post_type('filial_banner', [
    'label'        => 'Filialangebote',
    'public'       => false,
    'show_ui'      => true,
    'show_in_rest' => true,           // /wp-json/wp/v2/filial_banner
    'supports'     => ['title', 'thumbnail', 'page-attributes'], // page-attributes = menu_order
    'menu_icon'    => 'dashicons-megaphone',
  ]);

  // Meta-Felder REST-fähig registrieren
  foreach ([
    'untertitel'  => 'string',
    'cta_label'   => 'string',
    'cta_url'     => 'string',
    'aktiv'       => 'boolean',
    'reihenfolge' => 'integer',
    'gueltig_bis' => 'string',
  ] as $key => $type) {
    register_post_meta('filial_banner', $key, [
      'show_in_rest' => true,
      'single'       => true,
      'type'         => $type,
      'auth_callback'=> fn() => current_user_can('edit_posts'),
    ]);
  }
});
```

> Für komfortable Pflege: **ACF** verwenden (Feldgruppe an `filial_banner`
> binden, „Show in REST API" aktivieren). Featured Image + `menu_order`
> reichen sonst über die WP-Standard-UI.

## REST-Ausgabe testen
```bash
curl "https://2025.bodenjaeger.de/wp-json/wp/v2/filial_banner?_embed=true&per_page=20"
```
Erwartet: Array mit `title.rendered`, `menu_order`, `meta.*` und
`_embedded['wp:featuredmedia'][0].source_url` (+ `alt_text`).

## Frontend-Umstellung (nach Go-live des Endpoints)
1. In `src/lib/wordpress.ts` eine Methode `getFilialBanners()` ergänzen
   (analog `getPageBySlug`, Mapping WP → `FilialBanner`, ISR `revalidate: 300–900`).
2. In `src/app/fachmarkt-hueckelhoven/page.tsx` `FILIAL_BANNER_MOCK` durch das
   Fetch-Ergebnis ersetzen; `activeBanners()` bleibt (Filter aktiv + gültig_bis + Sortierung).
3. Fallback ist bereits umgesetzt: 0 aktive Banner → Sektion wird ausgeblendet.
