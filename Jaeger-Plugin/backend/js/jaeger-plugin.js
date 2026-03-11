jQuery(document).ready(function($) {
    // Check if elements and data exist
    const daemmungSelect = $('#_option_products_daemmung');
    const sockelleistenSelect = $('#_option_products_sockelleisten');

    if (typeof JaegerData !== 'undefined') {
        if (daemmungSelect.length && JaegerData.selectedDaemmung) {
            daemmungSelect.val(Array.isArray(JaegerData.selectedDaemmung) ? JaegerData.selectedDaemmung : []);
        }
        
        if (sockelleistenSelect.length && JaegerData.selectedSockelleisten) {
            sockelleistenSelect.val(Array.isArray(JaegerData.selectedSockelleisten) ? JaegerData.selectedSockelleisten : []);
        }
    }
});