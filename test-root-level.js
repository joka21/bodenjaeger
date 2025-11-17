const fs = require('fs');

const data = JSON.parse(fs.readFileSync(0, 'utf-8'));
const product = data.products[0];

console.log('=== ROOT-LEVEL FELDER TEST ===\n');

const rootFields = [
  'einheit_short',
  'einheit',
  'paketinhalt',
  'paketpreis',
  'paketpreis_s',
  'verpackungsart',
  'verpackungsart_short',
  'verschnitt',
  'show_uvp',
  'uvp',
  'uvp_paketpreis',
  'show_text_produktuebersicht',
  'text_produktuebersicht',
  'artikelbeschreibung',
  'show_setangebot',
  'setangebot_titel',
  'setangebot_rabatt',
  'setangebot_einzelpreis',
  'setangebot_gesamtpreis',
  'setangebot_ersparnis_euro',
  'setangebot_ersparnis_prozent',
  'daemmung_id',
  'sockelleisten_id',
  'daemmung_option_ids',
  'sockelleisten_option_ids',
  'show_aktion',
  'aktion',
  'show_angebotspreis_hinweis',
  'angebotspreis_hinweis',
  'show_lieferzeit',
  'lieferzeit'
];

let rootCount = 0;
let missingCount = 0;

rootFields.forEach(field => {
  const value = product[field];
  if (value !== undefined && value !== null && value !== '') {
    console.log(`✅ ${field}: ${JSON.stringify(value)}`);
    rootCount++;
  } else {
    console.log(`❌ ${field}: undefined/null/empty`);
    missingCount++;
  }
});

console.log(`\n=== STATISTIK ===`);
console.log(`✅ Auf Root-Level: ${rootCount}/${rootFields.length}`);
console.log(`❌ Fehlen: ${missingCount}/${rootFields.length}`);

console.log('\n=== JAEGER_META FELDER ===\n');
if (product.jaeger_meta) {
  Object.keys(product.jaeger_meta).forEach(key => {
    console.log(`   ${key}: ${JSON.stringify(product.jaeger_meta[key])}`);
  });
}
