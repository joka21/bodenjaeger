# Produktdetailseite - Struktur & Bereiche

## Übersicht
Die Einzelproduktansicht ist in 3 Hauptbereiche unterteilt (Desktop-Ansicht):

---

## 1. Linker Bereich - Bildergalerie
**Komponente:** `ImageGallery`
**Position:** Links (Desktop) / Oben (Mobile)

### Funktionalität:
- Hauptbild-Anzeige (groß)
- Thumbnail-Navigation
- Bildwechsel per Klick
- Responsive Darstellung

### Daten benötigt:
- `images`: Array von Bild-URLs
- Bild-Alt-Texte für Accessibility

### Status:
- [ ] Zu bearbeiten

---

## 2. Rechter Bereich - Produktinformationen
**Komponente:** `ProductInfo`
**Position:** Rechts (Desktop) / Mitte (Mobile)

### Funktionalität:
- Produktname
- Preis-Anzeige (inkl. Rabatt falls vorhanden)
- Produktbeschreibung
- Technische Details / Spezifikationen
- In den Warenkorb Button
- Verfügbarkeits-Status
- Varianten-Auswahl (falls zutreffend)

### Daten benötigt:
- `name`: Produktname
- `price`: Aktueller Preis
- `originalPrice`: Original-Preis (für Sale)
- `description`: Produktbeschreibung
- `specifications`: Technische Details
- `inStock`: Verfügbarkeit
- `variants`: Varianten (z.B. Größen, Farben)

### Status:
- [ ] Zu bearbeiten

---

## 3. Bottom Bereich - Zusätzliche Informationen
**Komponente:** Noch zu erstellen
**Position:** Unten (volle Breite)

### Mögliche Inhalte:
- Detaillierte Produktbeschreibung (Tabs oder Accordion)
- Technische Spezifikationen
- Pflegehinweise
- Lieferinformationen
- Ähnliche Produkte / Empfehlungen
- Kundenbewertungen (falls gewünscht)

### Daten benötigt:
- `detailedDescription`: Ausführliche Beschreibung
- `careInstructions`: Pflegehinweise
- `deliveryInfo`: Lieferinformationen
- `relatedProducts`: Ähnliche Produkte
- `specifications`: Vollständige technische Details

### Status:
- [ ] Zu bearbeiten

---

## Aktuelle Implementierung
**Datei:** `app/products/[id]/page.tsx`

### Bereits vorhanden:
- Grundstruktur mit linkem und rechtem Bereich
- ImageGallery Komponente (links)
- ProductInfo Komponente (rechts)
- Responsive Layout mit Tailwind Grid

### Noch zu implementieren:
- Bottom Bereich mit zusätzlichen Informationen
- Backend-Integration für Produktdaten
- Dynamisches Laden der Daten per API

---

## Reihenfolge der Bearbeitung (Vorschlag)
1. **Linker Bereich** - ImageGallery optimieren/finalisieren
2. **Rechter Bereich** - ProductInfo erweitern
3. **Bottom Bereich** - Zusätzliche Infos implementieren

---

## Notizen
- Alle 3 Bereiche sollten Daten aus dem Backend laden
- Mobile-Ansicht: Reihenfolge von oben nach unten (Bilder → Info → Details)
- Responsive Breakpoints beachten
