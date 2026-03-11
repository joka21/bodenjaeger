/**
 * Jaeger Product Calculations
 * Komplett überarbeitete Version v2.0.1
 * Behebt Probleme mit ungewollter Formatierung und Rundung
 */
jQuery(document).ready(function($) {
    // Referenzen zu den Eingabefeldern
    var $regularPrice = $('#_regular_price');
    var $salePrice = $('#_sale_price');
    var $uvp = $('#_uvp');
    var $paketinhalt = $('#_paketinhalt');
    
    var $paketpreis = $('#_paketpreis');
    var $paketpreisS = $('#_paketpreis_s');
    var $uvpPaketpreis = $('#_uvp_paketpreis');
    var $verschnitt = $('#_verschnitt');
    
    // Debug-Modus
    var DEBUG = true;
    
    // Flag für manuelle Eingabe - standardmäßig aktiviert, um sicherzustellen, 
    // dass Berechnungen immer ausgeführt werden
    var userInputActive = true;
    var originalValues = {};
    
    /**
     * Debug-Funktion
     */
    function debugLog(...args) {
        if (DEBUG) {
            console.log(...args);
        }
    }
    
    /**
     * Speichert den ursprünglichen Wert eines Feldes
     */
    function saveOriginalValue(field) {
        var $field = $(field);
        var id = $field.attr('id');
        if (id && !originalValues[id]) {
            originalValues[id] = $field.val();
            debugLog('Original Wert gespeichert für', id, ':', originalValues[id]);
        }
    }
    
    /**
     * Speichert die ursprünglichen Werte aller relevanten Felder
     */
    function saveAllOriginalValues() {
        var fields = [
            $regularPrice, $salePrice, $uvp, $paketinhalt,
            $paketpreis, $paketpreisS, $uvpPaketpreis, $verschnitt
        ];
        
        fields.forEach(function($field) {
            if ($field.length) {
                saveOriginalValue($field);
            }
        });
        
        debugLog('Alle ursprünglichen Werte gespeichert:', originalValues);
    }
    
    /**
     * Präzise Multiplikation
     */
    function preciseMultiply(a, b) {
        if (!a || !b) return 0;
        
        // Konvertiere zu Strings
        var strA = a.toString();
        var strB = b.toString();
        
        // Zähle Dezimalstellen
        var decimalPlacesA = (strA.split('.')[1] || '').length;
        var decimalPlacesB = (strB.split('.')[1] || '').length;
        
        // Faktor für präzise Multiplikation
        var factor = Math.pow(10, decimalPlacesA + decimalPlacesB);
        
        // Ganzzahlen für präzise Berechnung
        var intA = parseFloat(strA.replace('.', ''));
        var intB = parseFloat(strB.replace('.', ''));
        
        // Multiplikation und zurück zu Dezimalzahlen
        var result = (intA * intB) / factor;
        
        return result;
    }
    
    /**
     * Präzise Rundung
     */
    function preciseRound(value, decimals = 2) {
        if (!isFinite(value)) return 0;
        
        var factor = Math.pow(10, decimals);
        var rounded = Math.round(parseFloat((value * factor).toFixed(10))) / factor;
        
        return rounded;
    }
    
    /**
     * Konvertiert einen String in eine Zahl
     */
    function parsePrice(value) {
        if (!value) return 0;
        
        // String-Konvertierung
        if (typeof value === 'number') value = value.toString();
        
        // Bereinigen und Komma durch Punkt ersetzen
        value = value.replace(/[^\d,.-]/g, '').replace(',', '.');
        var parsedValue = parseFloat(value) || 0;
        
        debugLog('Parsed Price:', value, '->', parsedValue);
        
        return parsedValue;
    }
    
    /**
     * Berechnet alle Paketpreise
     * Wird jetzt sowohl bei manueller Eingabe als auch initial ausgeführt
     */
    function calculateAllPackagePrices() {
        debugLog('Berechne alle Paketpreise');
        
        var paketinhalt = parsePrice($paketinhalt.val());
        
        // Wenn kein Paketinhalt definiert ist, keine Berechnung durchführen
        if (paketinhalt <= 0) {
            debugLog('Kein gültiger Paketinhalt, Berechnung abgebrochen');
            return;
        }
        
        // Regulärer Preis berechnen
        if ($regularPrice.val()) {
            var regularPrice = parsePrice($regularPrice.val());
            var multiplication = preciseMultiply(regularPrice, paketinhalt);
            var paketpreis = preciseRound(multiplication, 2);
            
            debugLog('Berechnung Paketpreis:', regularPrice, 'x', paketinhalt, '=', paketpreis);
            $paketpreis.val(paketpreis.toFixed(2));
        }
        
        // Angebotspreis berechnen
        if ($salePrice.val()) {
            var salePrice = parsePrice($salePrice.val());
            debugLog('Sale Price Value:', $salePrice.val(), 'Parsed:', salePrice);
            
            var multiplication = preciseMultiply(salePrice, paketinhalt);
            var paketpreisS = preciseRound(multiplication, 2);
            
            debugLog('Berechnung Angebotspreis:', salePrice, 'x', paketinhalt, '=', paketpreisS);
            $paketpreisS.val(paketpreisS.toFixed(2));
        } else {
            debugLog('Kein Angebotspreis gesetzt, setze Paketpreis Sonderangebot auf leer');
            $paketpreisS.val('');
        }
        
        // UVP berechnen
        if ($uvp.val()) {
            var uvp = parsePrice($uvp.val());
            var multiplication = preciseMultiply(uvp, paketinhalt);
            var uvpPaketpreisValue = preciseRound(multiplication, 2);
            
            debugLog('Berechnung UVP-Paketpreis:', uvp, 'x', paketinhalt, '=', uvpPaketpreisValue);
            $uvpPaketpreis.val(uvpPaketpreisValue.toFixed(2));
        }
        
        // Preis pro Einheit berechnen
        calculatePricePerUnit();
    }
    
    /**
     * Berechnet die Paketpreise für einzelne Felder
     * Wird bei manueller Eingabe ausgeführt
     */
    function calculatePackagePrices(event) {
        // Identifizieren, welches Feld geändert wurde
        var $changedField = $(event.target);
        var fieldId = $changedField.attr('id');
        
        debugLog('Berechnung gestartet durch Änderung an Feld:', fieldId);
        
        // Eingabewerte erfassen
        var paketinhalt = parsePrice($paketinhalt.val());
        
        // Wenn kein Paketinhalt definiert ist, keine Berechnung durchführen
        if (paketinhalt <= 0) {
            debugLog('Kein gültiger Paketinhalt, Berechnung abgebrochen');
            return;
        }
        
        // Berechnung je nach geändertem Feld durchführen
        if (fieldId === '_regular_price' || fieldId === '_paketinhalt') {
            // Berechne regulären Preis pro Paket
            if ($regularPrice.val()) {
                var regularPrice = parsePrice($regularPrice.val());
                var multiplication = preciseMultiply(regularPrice, paketinhalt);
                var paketpreis = preciseRound(multiplication, 2);
                
                debugLog('Berechnung Paketpreis:', regularPrice, 'x', paketinhalt, '=', paketpreis);
                $paketpreis.val(paketpreis.toFixed(2));
            }
        }
        
        if (fieldId === '_sale_price' || fieldId === '_paketinhalt') {
            // Berechne Angebotspreis pro Paket
            debugLog('Sale Price Changed, Value:', $salePrice.val());
            
            if ($salePrice.val()) {
                var salePrice = parsePrice($salePrice.val());
                debugLog('Parsed Sale Price:', salePrice);
                
                var multiplication = preciseMultiply(salePrice, paketinhalt);
                debugLog('Multiplication Result:', multiplication);
                
                var paketpreisS = preciseRound(multiplication, 2);
                debugLog('Rounded Result:', paketpreisS);
                
                debugLog('Berechnung Angebotspreis:', salePrice, 'x', paketinhalt, '=', paketpreisS);
                $paketpreisS.val(paketpreisS.toFixed(2));
                debugLog('Paketpreis S gesetzt auf:', paketpreisS.toFixed(2));
            } else {
                debugLog('Kein Angebotspreis gesetzt, setze Paketpreis Sonderangebot auf leer');
                $paketpreisS.val('');
            }
        }
        
        if (fieldId === '_uvp' || fieldId === '_paketinhalt') {
            // Berechne UVP pro Paket
            if ($uvp.val()) {
                var uvp = parsePrice($uvp.val());
                var multiplication = preciseMultiply(uvp, paketinhalt);
                var uvpPaketpreisValue = preciseRound(multiplication, 2);
                
                debugLog('Berechnung UVP-Paketpreis:', uvp, 'x', paketinhalt, '=', uvpPaketpreisValue);
                $uvpPaketpreis.val(uvpPaketpreisValue.toFixed(2));
            }
        }
        
        // Berechne Preis pro Einheit nur wenn relevant
        if (fieldId === '_paketpreis' || fieldId === '_paketinhalt' || fieldId === '_verschnitt') {
            calculatePricePerUnit();
        }
    }
    
    /**
     * Berechnet den Preis pro Einheit (mit Verschnitt)
     */
    function calculatePricePerUnit() {
        var paketpreis = parsePrice($paketpreis.val());
        var paketinhalt = parsePrice($paketinhalt.val());
        var verschnitt = parsePrice($verschnitt.val());
        
        if (paketinhalt > 0) {
            // Preis pro Einheit ohne Verschnitt
            var division = paketpreis / paketinhalt;
            var pricePerUnit = preciseRound(division, 2);
            
            // Preis pro Einheit mit Verschnitt
            var wasteFactor = 1 + (verschnitt / 100);
            var priceWithWaste = preciseRound(pricePerUnit * wasteFactor, 2);
            
            debugLog('Preis pro Einheit (ohne Verschnitt):', pricePerUnit.toFixed(2), '€');
            debugLog('Verschnitt-Faktor:', wasteFactor.toFixed(2));
            debugLog('Preis pro Einheit (mit Verschnitt):', priceWithWaste.toFixed(2), '€');
        }
    }
    
    // Speichere ursprüngliche Werte beim Laden
    saveAllOriginalValues();
    
    // Initiale Berechnung durchführen (aber vorsichtig)
    setTimeout(function() {
        debugLog('Führe initiale Berechnung aus...');
        calculateAllPackagePrices();
    }, 500);
    
    // Event-Listener für Berechnungen
    var inputFields = [
        $regularPrice, $salePrice, $uvp, $paketinhalt, 
        $paketpreis, $paketpreisS, $uvpPaketpreis, $verschnitt
    ];
    
    inputFields.forEach(function($field) {
        if ($field.length) {
            $field.on('focus', function() {
                saveOriginalValue(this);
            });
            
            $field.on('input', function(e) {
                calculatePackagePrices(e);
            });
        }
    });
    
    // Zusätzlichen Event-Listener für den Angebotspreis hinzufügen
    $salePrice.on('change', function() {
        debugLog('Sale Price Change Event:', $(this).val());
        // Explizit den Angebotspreis-Paket bei Änderung neu berechnen
        var paketinhalt = parsePrice($paketinhalt.val());
        var salePrice = parsePrice($(this).val());
        
        if (salePrice > 0 && paketinhalt > 0) {
            var result = preciseMultiply(salePrice, paketinhalt);
            var rounded = preciseRound(result, 2);
            $paketpreisS.val(rounded.toFixed(2));
            debugLog('Sonderangebotspaket explizit neu berechnet:', rounded.toFixed(2));
        } else {
            $paketpreisS.val('');
            debugLog('Sonderangebotspaket zurückgesetzt (kein gültiger Preis)');
        }
    });
    
    debugLog("Jaeger Product Calculations v2.0.1 - Fehler bei Sonderangebot behoben");
});