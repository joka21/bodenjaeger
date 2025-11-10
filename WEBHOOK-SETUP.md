# WordPress Webhook Setup für Echtzeit-Synchronisation

Dieses Dokument beschreibt, wie Sie WordPress so konfigurieren, dass Produktänderungen sofort im Frontend sichtbar werden.

## 🎯 Ziel

Wenn Sie im WordPress Backend ein Produkt ändern (z.B. Zusatzprodukte bei Set-Angeboten), soll die Änderung **sofort** im Frontend erscheinen - ohne 5 Minuten Wartezeit.

## 🔧 Technische Lösung

**Webhook-System:**
```
WordPress Backend Änderung
    ↓
Webhook wird ausgelöst
    ↓
POST Request an /api/revalidate
    ↓
Cache wird geleert (Vercel KV + Next.js ISR)
    ↓
Nächster Seitenaufruf lädt frische Daten
```

---

## 📋 Schritt-für-Schritt Anleitung

### Option 1: Custom Code in functions.php (100% KOSTENLOS ✅)

**Beste Lösung - Kein Plugin nötig!**

#### 1. Code in functions.php einfügen

**Zugriff:**
```
WordPress Admin → Design → Theme-Editor → functions.php
ODER: FTP/SFTP → /wp-content/themes/dein-theme/functions.php
```

**Code hinzufügen (am Ende der Datei):**

```php
<?php
/**
 * Bodenjäger: Webhook für Echtzeit-Synchronisation
 * Sendet automatisch einen Webhook bei Produktänderungen
 */

function bodenjager_send_revalidation_webhook($product_id, $product) {
    // Webhook URL mit Secret
    $webhook_url = 'https://bodenjaeger.vercel.app/api/revalidate?secret=T3njoka21!';

    // Payload vorbereiten
    $payload = array(
        'product_id' => $product_id,
        'product_slug' => $product->get_slug(),
        'action' => 'updated',
        'timestamp' => current_time('mysql'),
    );

    // Webhook senden (asynchron, blockiert nicht)
    wp_remote_post($webhook_url, array(
        'body' => json_encode($payload),
        'headers' => array('Content-Type' => 'application/json'),
        'timeout' => 5,
        'blocking' => false, // Wichtig: Nicht warten auf Antwort
    ));

    // Optional: Logging für Debugging
    error_log(sprintf(
        'Bodenjäger Webhook: Product %s (%s) updated - Cache revalidation triggered',
        $product_id,
        $product->get_slug()
    ));
}

// Webhook bei Produktaktualisierung auslösen
add_action('woocommerce_update_product', 'bodenjager_send_revalidation_webhook', 10, 2);

// Webhook bei neuem Produkt auslösen
add_action('woocommerce_new_product', 'bodenjager_send_revalidation_webhook', 10, 2);

// Optional: Webhook auch bei Meta-Änderungen (z.B. Zusatzprodukte)
add_action('updated_post_meta', function($meta_id, $object_id, $meta_key, $meta_value) {
    // Nur bei Produkten und relevanten Meta-Keys
    if (get_post_type($object_id) === 'product') {
        // Bei Änderung von Zusatzprodukten webhook senden
        $relevant_keys = array(
            '_standard_addition_daemmung',
            '_standard_addition_sockelleisten',
            '_option_products_daemmung',
            '_option_products_sockelleisten',
        );

        if (in_array($meta_key, $relevant_keys)) {
            $product = wc_get_product($object_id);
            if ($product) {
                bodenjager_send_revalidation_webhook($object_id, $product);
            }
        }
    }
}, 10, 4);
```

#### 2. Testen

1. Code speichern
2. Produkt im Backend ändern
3. WordPress Debug-Log prüfen (wp-content/debug.log)
4. Frontend prüfen → Änderung sofort sichtbar!

---

### Option 2: WordPress Plugin "WP Webhooks" (Kostenpflichtig)

**⚠️ Dieses Plugin kostet Geld in der Pro-Version**

#### 1. Plugin installieren

```bash
1. WordPress Admin → Plugins → Neu hinzufügen
2. Suche: "WP Webhooks"
3. Installieren + Aktivieren
```

#### 2. Webhook konfigurieren

**Navigation:** WordPress Admin → Einstellungen → WP Webhooks → Send Data

**Webhook erstellen:**
```
Webhook URL: https://bodenjaeger.vercel.app/api/revalidate?secret=T3njoka21!

Trigger: "WooCommerce Product Updated"
```

**Zusätzliche Trigger (optional):**
- "WooCommerce Product Created"
- "WooCommerce Product Deleted"
- "WooCommerce Product Meta Updated"

#### 3. Webhook Payload konfigurieren

**Body (JSON):**
```json
{
  "product_id": "{{product_id}}",
  "product_slug": "{{product_slug}}",
  "action": "updated"
}
```

**Headers:**
```
Content-Type: application/json
```

#### 4. Testen

1. Produkt im Backend ändern
2. WP Webhooks → Logs prüfen
3. Frontend prüfen (Änderung sollte sofort sichtbar sein)

---

### Option 3: WooCommerce Native Webhooks (100% KOSTENLOS ✅)

**Eingebaut in WooCommerce - Kein Plugin nötig!**

#### 1. Webhook erstellen

```
WordPress Admin → WooCommerce → Einstellungen → Erweitert → Webhooks → Webhook hinzufügen
```

#### 2. Konfiguration

**Name:** Bodenjäger Cache Revalidation

**Status:** Aktiv

**Topic:** Product updated

**Delivery URL:**
```
https://bodenjaeger.vercel.app/api/revalidate?secret=T3njoka21!
```

**API Version:** WP REST API Integration v3

**Secret:** (leer lassen - Secret ist in der URL)

#### 3. Speichern & Testen

1. Webhook speichern
2. Produkt ändern
3. WooCommerce → Einstellungen → Erweitert → Webhooks → Logs prüfen

**Hinweis:** WooCommerce sendet automatisch alle Produktdaten. Die API extrahiert:
- `id` → wird zu `product_id`
- `slug` → wird zu `product_slug`

#### 4. Zusätzliche Webhooks (Optional)

Für komplette Abdeckung weitere Webhooks erstellen:
- **Product created** → Bei neuen Produkten
- **Product deleted** → Bei gelöschten Produkten
- **Product restored** → Bei wiederhergestellten Produkten

---

### Option 4: Plugin "Webhook Netlify Deploy" (Kostenlos, anpassbar)

**100% KOSTENLOS auf WordPress.org**

#### 1. Plugin installieren

```
WordPress Admin → Plugins → Neu hinzufügen
Suche: "Webhook Netlify Deploy"
Installieren + Aktivieren
```

#### 2. Konfiguration

```
Einstellungen → Webhook Deploy

Build Hook URL: https://bodenjaeger.vercel.app/api/revalidate?secret=T3njoka21!
```

**Deploy on:**
- ✅ Product Updated
- ✅ Product Created

**Vorteil:** Sehr einfach, UI-basiert, kostenlos

---

## 🧪 Manuelles Testen

### Test 1: GET Request (Endpoint-Info)

```bash
curl "https://bodenjaeger.vercel.app/api/revalidate?secret=T3njoka21!"
```

**Erwartete Antwort:**
```json
{
  "message": "Revalidation webhook endpoint is ready",
  "usage": {...}
}
```

### Test 2: POST Request (Spezifisches Produkt)

```bash
curl -X POST "https://bodenjaeger.vercel.app/api/revalidate?secret=T3njoka21!" \
  -H "Content-Type: application/json" \
  -d '{
    "product_slug": "vinylboden-eiche-natur",
    "product_id": 123
  }'
```

**Erwartete Antwort:**
```json
{
  "success": true,
  "message": "Cache cleared and pages revalidated successfully",
  "revalidated": ["/products/vinylboden-eiche-natur", "/"],
  "product_slug": "vinylboden-eiche-natur"
}
```

### Test 3: POST Request (Alle Caches leeren)

```bash
curl -X POST "https://bodenjaeger.vercel.app/api/revalidate?secret=T3njoka21!" \
  -H "Content-Type: application/json" \
  -d '{"clear_all": true}'
```

**Erwartete Antwort:**
```json
{
  "success": true,
  "message": "Cache cleared and pages revalidated successfully",
  "revalidated": ["/products/*", "/category/*", "/"]
}
```

---

## 🔍 Debugging

### Server Logs prüfen

**Vercel Dashboard:**
```
1. Vercel.com → Dein Projekt
2. Deployments → Latest
3. Functions → /api/revalidate
4. Logs prüfen
```

**Erwartete Log-Ausgabe:**
```
✅ Webhook authenticated successfully
📦 Webhook payload: { product_slug: "...", product_id: ... }
🗑️ Clearing KV cache for product: ...
🔄 Revalidating product page: /products/...
╔════════════════════════════════════════╗
║  CACHE REVALIDATION SUCCESSFUL         ║
╚════════════════════════════════════════╝
```

### WordPress Logs prüfen

```php
// functions.php - Debug logging
add_action('woocommerce_update_product', function($product_id) {
    error_log("Product updated: " . $product_id);
}, 5, 1);
```

### Häufige Probleme

#### Problem: 401 Unauthorized

**Ursache:** Falsches Secret

**Lösung:**
```bash
# .env.local prüfen
REVALIDATE_SECRET=T3njoka21!

# URL prüfen
?secret=T3njoka21!  ✅
?secret=falsches-secret  ❌
```

#### Problem: Änderung nicht sichtbar

**Ursache:** Browser-Cache

**Lösung:**
1. Hard Refresh (Ctrl+F5)
2. Inkognito-Modus testen
3. Cache leeren: `curl ... -d '{"clear_all": true}'`

#### Problem: Webhook wird nicht ausgelöst

**Ursache:** Plugin-Konfiguration

**Lösung:**
1. WP Webhooks → Logs prüfen
2. Status auf "Aktiv" prüfen
3. Trigger korrekt konfiguriert?

---

## 🎬 Quick Start

### Empfohlene Lösung: Custom Code (100% KOSTENLOS)

**⏱️ Setup in 5 Minuten:**

1. **WordPress Admin öffnen:**
   ```
   Design → Theme-Editor → functions.php
   ```

2. **Code hinzufügen (siehe Option 1 oben):**
   - 30 Zeilen PHP Code kopieren
   - Am Ende der functions.php einfügen
   - Speichern

3. **Testen:**
   - Produkt ändern (z.B. Zusatzprodukt bei Set-Angebot)
   - Frontend aufrufen
   - ✅ Änderung ist sofort sichtbar!

### Alternative: WooCommerce Webhooks (auch kostenlos)

**⏱️ Setup in 3 Minuten:**

1. **WooCommerce → Einstellungen → Erweitert → Webhooks**
2. **Webhook hinzufügen:**
   - URL: `https://bodenjaeger.vercel.app/api/revalidate?secret=T3njoka21!`
   - Topic: Product updated
3. **Testen:** Produkt ändern → Sofort live!

---

## 💰 Kostenvergleich

| Option | Kosten | Setup-Zeit | Vorteile |
|--------|--------|------------|----------|
| **Custom Code (Option 1)** | ✅ KOSTENLOS | 5 Min | Volle Kontrolle, keine Dependencies |
| **WooCommerce Webhooks (Option 3)** | ✅ KOSTENLOS | 3 Min | UI-basiert, einfach |
| **Webhook Netlify Deploy (Option 4)** | ✅ KOSTENLOS | 3 Min | Plugin-UI, einfach |
| **WP Webhooks Plugin (Option 2)** | ❌ €49-99/Jahr | 2 Min | Premium Features |

**🏆 Empfehlung:** Option 1 (Custom Code) oder Option 3 (WooCommerce Webhooks)

---

## 📞 Support

Bei Problemen:
1. Server-Logs prüfen (Vercel Dashboard)
2. WordPress-Logs prüfen (WP Webhooks)
3. Manual Test durchführen (curl)

**Webhook Endpoint:**
```
POST https://bodenjaeger.vercel.app/api/revalidate?secret=T3njoka21!
```

**Secret ist in .env.local gespeichert:**
```
REVALIDATE_SECRET=T3njoka21!
```

---

## 🔐 Sicherheit

**Secret Token:**
- Niemals im Code committen
- Nur in `.env.local` speichern
- Bei Kompromittierung sofort ändern

**Rate Limiting:**
- WordPress sollte nicht zu viele Webhooks senden
- Bei Bedarf: Rate Limiting in API implementieren

**Logging:**
- Alle Webhook-Calls werden geloggt
- Bei verdächtiger Aktivität Secret ändern
