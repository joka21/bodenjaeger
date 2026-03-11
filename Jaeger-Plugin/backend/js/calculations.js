jQuery(document).ready(function($) {
    console.log('jQuery Calculations.js loaded');

    const $paketpreis = $('#_paketpreis');
    const $verschnitt = $('#_verschnitt');

    if ($paketpreis.length && $verschnitt.length) {
        $paketpreis.on('change', function() {
            console.log('Paketpreis changed:', $(this).val());
            alert('Paketpreis wurde geändert auf: ' + $(this).val() + '€');
        });
    }
});