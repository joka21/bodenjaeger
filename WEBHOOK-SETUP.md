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

### Option 1: WordPress Plugin "WP Webhooks" (Empfohlen)

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

### Option 2: WooCommerce Native Webhooks

#### 1. Webhook erstellen

```bash
WordPress Admin → WooCommerce → Einstellungen → Erweitert → Webhooks → Webhook hinzufügen
```

#### 2. Konfiguration

**Name:** Product Cache Revalidation

**Status:** Aktiv

**Topic:** Product updated

**Delivery URL:**
```
https://bodenjaeger.vercel.app/api/revalidate?secret=T3njoka21!
```

**API Version:** WP REST API Integration v3

#### 3. Payload anpassen (Optional)

WooCommerce sendet automatisch alle Produktdaten. Die API extrahiert automatisch:
- `id` → wird zu `product_id`
- `slug` → wird zu `product_slug`

---

### Option 3: Custom Code (functions.php)

Wenn Sie kein Plugin verwenden möchten:

```php
<?php
// Theme functions.php oder Custom Plugin

/**
 * Send webhook when product is updated
 */
function bodenjager_product_webhook($product_id, $product) {
    // Webhook URL with secret
    $webhook_url = 'https://bodenjaeger.vercel.app/api/revalidate?secret=T3njoka21!';

    // Payload
    $payload = [
        'product_id' => $product_id,
        'product_slug' => $product->get_slug(),
        'action' => 'updated',
    ];

    // Send async webhook (non-blocking)
    wp_remote_post($webhook_url, [
        'body' => json_encode($payload),
        'headers' => ['Content-Type' => 'application/json'],
        'timeout' => 5,
        'blocking' => false, // Don't wait for response
    ]);

    error_log("Bodenjäger: Cache revalidation triggered for product {$product_id}");
}

// Hook into product save
add_action('woocommerce_update_product', 'bodenjager_product_webhook', 10, 2);
add_action('woocommerce_new_product', 'bodenjager_product_webhook', 10, 2);
```

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

**Schnellste Lösung (5 Minuten):**

1. **Plugin installieren:**
   - WP Webhooks Plugin

2. **Webhook erstellen:**
   - URL: `https://bodenjaeger.vercel.app/api/revalidate?secret=T3njoka21!`
   - Trigger: Product Updated

3. **Testen:**
   - Produkt ändern
   - Frontend prüfen
   - ✅ Fertig!

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
