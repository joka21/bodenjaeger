# Vercel KV Cache Setup

## Was ist Vercel KV?
Vercel KV ist ein Redis-basierter Key-Value Store, der extrem schnelles Caching ermöglicht.

**Vorteile:**
- ⚡ **50-200ms** statt 2-3 Sekunden für gecachte Produkte
- 🚀 Automatische Skalierung
- 💰 Kostenlos für kleine bis mittlere Projekte
- 🌍 Global verfügbar (Edge-optimiert)

---

## Setup-Anleitung (5 Minuten)

### 1. Vercel KV Datenbank erstellen

1. Gehe zu [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Wähle dein Projekt **bodenjäger** aus
3. Klicke auf **Storage** Tab
4. Klicke auf **Create Database**
5. Wähle **KV (Redis)** aus
6. Gib einen Namen ein: `bodenjager-cache`
7. Wähle Region: **Frankfurt (fra1)** (nächste Region zu Deutschland)
8. Klicke auf **Create**

### 2. Environment Variables verbinden

Nach der Erstellung werden automatisch 3 Environment Variables hinzugefügt:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

Diese werden automatisch in dein Vercel Project eingetragen.

### 3. Testen

Pushe den Code und deploye:
```bash
git push
```

Vercel wird automatisch neu deployen. Beim ersten Aufruf einer Produktseite wird der Cache gefüllt:
```
❌ Cache MISS for product: laminat-espresso-carpenter-oak
✅ Cached product: laminat-espresso-carpenter-oak
```

Beim zweiten Aufruf (innerhalb 5 Minuten):
```
💾 Cache HIT for product: laminat-espresso-carpenter-oak
```

---

## Performance-Vergleich

### Ohne Cache:
- **Erste Anfrage**: 3-4 Sekunden
- **Folgende Anfragen**: 3-4 Sekunden (wenn ISR abgelaufen)

### Mit Vercel KV Cache:
- **Erste Anfrage**: 3-4 Sekunden (Cache wird gefüllt)
- **Folgende Anfragen**: **50-200ms** 🚀

### Mit ISR + KV Cache:
- **Erste Anfrage**: 3-4 Sekunden
- **Folgende Anfragen**: **<100ms** ⚡

---

## Lokale Entwicklung (optional)

Wenn du den Cache auch lokal testen willst:

1. Installiere Vercel CLI:
```bash
npm install -g vercel
```

2. Logge dich ein:
```bash
vercel login
```

3. Link das Projekt:
```bash
vercel link
```

4. Lade die Environment Variables:
```bash
vercel env pull .env.local
```

5. Starte den Dev Server:
```bash
npm run dev
```

Der Cache funktioniert jetzt auch lokal!

---

## Cache-Verhalten

### Cache TTL (Time To Live):
- **5 Minuten** (300 Sekunden)
- Nach 5 Minuten wird der Cache automatisch gelöscht
- Beim nächsten Aufruf wird neu gecacht

### Was wird gecacht?
- ✅ Einzelne Produkte (nach Slug)
- ✅ Produkt-Batches (mehrere Produkte nach IDs)

### Cache-Keys:
```
product:laminat-espresso-carpenter-oak
products:batch:1246,1665,1242,1245,...
```

---

## Monitoring & Debugging

### Vercel Dashboard:
1. Gehe zu **Storage** → **bodenjager-cache**
2. Du siehst:
   - Anzahl der Keys
   - Speicherverbrauch
   - Request-Statistiken

### Console Logs:
Die App loggt alle Cache-Operationen:
- `💾 Cache HIT` - Produkt aus Cache geladen
- `❌ Cache MISS` - Produkt nicht im Cache, wird von API geladen
- `✅ Cached product` - Produkt wurde gecacht

---

## Troubleshooting

### "Cache not available, fetching from API"
**Problem:** KV Environment Variables sind nicht gesetzt.

**Lösung:**
1. Überprüfe in Vercel Dashboard → Settings → Environment Variables
2. Stelle sicher, dass alle 3 KV Variables vorhanden sind
3. Redeploy das Projekt

### Cache funktioniert nicht lokal
**Problem:** `.env.local` fehlt oder ist veraltet.

**Lösung:**
```bash
vercel env pull .env.local
```

### Cache ist zu alt / falsche Daten
**Problem:** Produkt wurde in WooCommerce geändert, aber Cache zeigt alte Daten.

**Lösung:**
Warte 5 Minuten (TTL) oder clear den Cache manuell:
1. Gehe zu Vercel Dashboard → Storage → bodenjager-cache
2. Klicke auf **Flush All** (nur für Notfälle!)

---

## Kosten

### Vercel KV Pricing:

**Hobby Plan (Kostenlos):**
- 256 MB Speicher
- 30.000 Commands pro Monat
- Reicht für **kleine bis mittlere Shops**

**Pro Plan ($20/Monat):**
- 512 MB Speicher
- 500.000 Commands pro Monat
- Reicht für **große Shops**

**Estimation für Bodenjäger:**
- 500 Produkte × 5 KB = ~2.5 MB
- Weit unter dem Free-Limit!

---

## Nächste Schritte

Nach dem Setup solltest du **massive Performance-Verbesserungen** sehen:

1. **Erste Anfrage**: Normal (3-4s)
2. **Zweite Anfrage**: Blitzschnell (<200ms)
3. **ISR greift nach 5 Minuten**: Cached (<100ms)

**Tipp:** Öffne die Browser Developer Tools (F12) → Network Tab und sieh dir die Ladezeiten an!
