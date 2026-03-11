jQuery(document).ready(function($) {
    // Nur ausführen, wenn wir auf der Produktseite im Admin-Bereich sind
    if (!$('#setangebot_product_data').length) {
        return;
    }

    // Formatierung für Euro-Beträge
    function formatEuro(value) {
        return parseFloat(value).toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Initiale Anzeige der Zusatzprodukte
    function displaySelectedProducts() {
        var html = '<ul style="margin-left: 20px;">';
        
        // Produktpreis mit UVP/Sale/Regular Preisen
        var productPriceHtml = '';
        if (setangebotData.show_uvp && setangebotData.uvp_price > 0) {
            productPriceHtml = '<li><strong>Hauptprodukt:</strong> UVP € ' + 
                formatEuro(setangebotData.uvp_price) + 
                (setangebotData.sale_price ? ' <span style="color:red;">(Angebotspreis: € ' + 
                formatEuro(setangebotData.sale_price) + ')</span>' : '') + '</li>';
        } else if (setangebotData.regular_price > 0) {
            productPriceHtml = '<li><strong>Hauptprodukt:</strong> Regulär € ' + 
                formatEuro(setangebotData.regular_price) + 
                (setangebotData.sale_price ? ' <span style="color:red;">(Angebotspreis: € ' + 
                formatEuro(setangebotData.sale_price) + ')</span>' : '') + '</li>';
        } else {
            productPriceHtml = '<li><strong>Hauptprodukt:</strong> € ' + 
                formatEuro(setangebotData.product_price) + '</li>';
        }
        
        html += productPriceHtml;
        
        // Dämmung
        if (setangebotData.daemmung_id) {
            html += '<li><strong>Dämmung:</strong> ' + 
                    setangebotData.daemmung_name + ' - <span style="color: #28a745; font-weight: bold;">kostenlos im Set</span> ' +
                    '<span style="color: #666; text-decoration: line-through;">(Einzelpreis: € ' + 
                    formatEuro(setangebotData.daemmung_price) + ')</span></li>';
        } else {
            html += '<li><strong>Dämmung:</strong> Keine ausgewählt</li>';
        }
        
        // Sockelleisten
        if (setangebotData.sockelleisten_id) {
            html += '<li><strong>Sockelleisten:</strong> ' + 
                    setangebotData.sockelleisten_name + ' - <span style="color: #28a745; font-weight: bold;">kostenlos im Set</span> ' +
                    '<span style="color: #666; text-decoration: line-through;">(Einzelpreis: € ' + 
                    formatEuro(setangebotData.sockelleisten_price) + ')</span></li>';
        } else {
            html += '<li><strong>Sockelleisten:</strong> Keine ausgewählt</li>';
        }
        
        html += '</ul>';
        
        $('#setangebot_selected_products').html(html);
    }

    // Preisberechnung durchführen
    function calculatePrices() {
        var rabatt = parseFloat($('#_setangebot_rabatt').val()) || 0;
        
        // Produkte-IDs aus Dropdown-Feldern holen
        var daemmungId = $('#_standard_addition_daemmung').val() || setangebotData.daemmung_id || 0;
        var sockelleistenId = $('#_standard_addition_sockelleisten').val() || setangebotData.sockelleisten_id || 0;
        
        // Debug-Ausgabe im Browser-Konsole (kann später entfernt werden)
        console.log('Aktuelle Preise:', {
            daemmungId: daemmungId,
            daemmungPrice: setangebotData.daemmung_price,
            sockelleistenId: sockelleistenId,
            sockelleistenPrice: setangebotData.sockelleisten_price
        });
        
        // AJAX-Anfrage für Preisberechnung
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'jaeger_calculate_setangebot',
                nonce: setangebotData.nonce,
                product_id: setangebotData.product_id,
                daemmung_id: daemmungId,
                sockelleisten_id: sockelleistenId,
                rabatt: rabatt
            },
            success: function(response) {
                if (response.success) {
                    var data = response.data;
                    
                    // Aktualisiere die globalen Daten
                    setangebotData.daemmung_id = daemmungId;
                    setangebotData.sockelleisten_id = sockelleistenId;
                    setangebotData.daemmung_price = data.daemmung_price;
                    setangebotData.daemmung_name = data.daemmung_name;
                    setangebotData.sockelleisten_price = data.sockelleisten_price;
                    setangebotData.sockelleisten_name = data.sockelleisten_name;
                    
                    // Zeige ausgewählte Produkte an
                    displaySelectedProducts();
                    
                    // Aktualisiere die Preisanzeigen
                    $('#setangebot_einzelpreis').text(data.formatted.einzelpreis);
                    $('#_setangebot_einzelpreis').val(data.einzelpreis);
                    
                    $('#setangebot_gesamtpreis').text(data.formatted.gesamtpreis);
                    $('#_setangebot_gesamtpreis').val(data.gesamtpreis);
                    
                    $('#setangebot_ersparnis_euro').text(data.formatted.ersparnis_euro);
                    $('#_setangebot_ersparnis_euro').val(data.ersparnis_euro);
                    
                    $('#setangebot_ersparnis_prozent').text(data.formatted.ersparnis_prozent);
                    $('#_setangebot_ersparnis_prozent').val(data.ersparnis_prozent);
                }
            },
            error: function() {
                alert('Fehler bei der Preisberechnung. Bitte versuchen Sie es erneut.');
            }
        });
    }

    // Event-Listener für Änderungen an den relevanten Feldern
    $('#_standard_addition_daemmung, #_standard_addition_sockelleisten, #_setangebot_rabatt').on('change', function() {
        calculatePrices();
    });

    // Initiale Anzeige
    displaySelectedProducts();
    calculatePrices();
    
    // Wenn der Tab "Setangebot" gewählt wird, Berechnung aktualisieren
    $('.product_data_tabs .setangebot_tab a').on('click', function() {
        setTimeout(calculatePrices, 100);
    });
});