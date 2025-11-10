# ⚡ Schnellstart: WordPress Webhook (5 Minuten)

## 🎯 Ziel
Produktänderungen im Backend werden **sofort** im Frontend sichtbar - ohne Wartezeit!

---

## ✅ KOSTENLOSE Lösung: WooCommerce Native Webhooks

**Kein Plugin nötig - WooCommerce hat Webhooks bereits eingebaut!**

---

## 📝 Schritt-für-Schritt Anleitung

### Schritt 1: WordPress Admin öffnen

```
https://plan-dein-ding.de/wp-admin
```

### Schritt 2: Zu Webhooks navigieren

```
WooCommerce → Einstellungen → Erweitert → Webhooks
```

### Schritt 3: Neuen Webhook hinzufügen

**Button klicken:** "Webhook hinzufügen"

### Schritt 4: Webhook konfigurieren

Folgende Felder ausfüllen:

| Feld | Wert |
|------|------|
| **Name** | `Bodenjäger Cache Revalidation` |
| **Status** | `Aktiv` ✅ |
| **Topic** | `Product updated` |
| **Delivery URL** | `https://bodenjaeger.vercel.app/api/revalidate?secret=T3njoka21!` |
| **Secret** | (leer lassen) |
| **API Version** | `WP REST API Integration v3` |

### Schritt 5: Speichern

**Button klicken:** "Webhook speichern"

---

## 🧪 Testen

### Test 1: Produkt ändern

1. **Produkt öffnen** (z.B. ein Bodenprodukt mit Set-Angebot)
2. **Zusatzprodukt ändern** (Dämmung oder Sockelleiste)
3. **Speichern**

### Test 2: Webhook Log prüfen

```
WooCommerce → Einstellungen → Erweitert → Webhooks → "Bodenjäger Cache Revalidation" → Logs
```

**Erfolgreiche Log-Einträge sehen so aus:**
```
✅ Status: 200 OK
Response: {"success":true,"message":"Cache cleared..."}
```

### Test 3: Frontend prüfen

1. **Produktseite aufrufen** (Frontend)
2. **Hard Refresh** (Strg + F5)
3. ✅ **Änderung ist sofort sichtbar!**

---

## 🔥 Bonus: Mehrere Webhooks für volle Abdeckung

**Optional:** Weitere Webhooks hinzufügen für:

| Topic | Wann ausgelöst |
|-------|----------------|
| `Product created` | Neues Produkt erstellt |
| `Product deleted` | Produkt gelöscht |
| `Product restored` | Produkt aus Papierkorb wiederhergestellt |

**URL für alle:** `https://bodenjaeger.vercel.app/api/revalidate?secret=T3njoka21!`

---

## ❓ Häufige Fragen

### Kostet das etwas?
**Nein!** WooCommerce Webhooks sind 100% kostenlos und eingebaut.

### Brauche ich ein Plugin?
**Nein!** Funktioniert ohne zusätzliche Plugins.

### Wie schnell werden Änderungen sichtbar?
**Sofort!** Der Webhook wird innerhalb von 1-2 Sekunden nach dem Speichern ausgelöst.

### Was passiert bei Fehlern?
Der Webhook-Versuch wird geloggt. Bei Fehlern können Sie die Logs in WooCommerce → Webhooks → Logs prüfen.

### Funktioniert das mit allen Produktfeldern?
**Ja!** Bei jeder Produktänderung wird der Cache geleert:
- ✅ Preise
- ✅ Bilder
- ✅ Beschreibungen
- ✅ Zusatzprodukte (Set-Angebote)
- ✅ Custom Meta-Felder

---

## 🆘 Probleme?

### Webhook wird nicht ausgelöst

**Prüfen:**
1. Status ist auf "Aktiv" gesetzt ✅
2. URL ist korrekt (inkl. `?secret=T3njoka21!`)
3. WooCommerce ist aktuell (min. Version 3.0)

**Lösung:**
```
WooCommerce → Einstellungen → Erweitert → Webhooks → Logs prüfen
```

### Änderung nicht sichtbar

**Browser-Cache leeren:**
- Windows: `Strg + F5`
- Mac: `Cmd + Shift + R`

**Oder Inkognito-Modus testen:**
- Chrome: `Strg + Shift + N`
- Firefox: `Strg + Shift + P`

### 401 Unauthorized Fehler

**Problem:** Falsches Secret

**Lösung:**
```
URL prüfen: ...?secret=T3njoka21!
(Ausrufezeichen am Ende nicht vergessen!)
```

---

## 🎉 Fertig!

Sie haben jetzt ein vollautomatisches Echtzeit-Synchronisations-System:

```
Produkt ändern → Webhook → Cache leeren → ⚡ Sofort live!
```

**Keine Wartezeit mehr!** 🚀

---

## 📚 Weitere Informationen

Für fortgeschrittene Optionen (Custom Code, andere Plugins, Debugging) siehe:
- `WEBHOOK-SETUP.md` (Vollständige Dokumentation)
