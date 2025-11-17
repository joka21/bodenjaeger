const fs = require('fs');

const data = JSON.parse(fs.readFileSync(0, 'utf-8'));
const product = data.products[0];

console.log('=== OPTION_PRODUCTS FELDER (Zubehör-Kategorien) ===\n');

const optionFields = [
  'option_products_untergrundvorbereitung',
  'option_products_werkzeug',
  'option_products_kleber',
  'option_products_montagekleber_silikon',
  'option_products_montagekleber-silikon',
  'option_products_zubehoer_fuer_sockelleisten',
  'option_products_zubehoer-fuer-sockelleisten',
  'option_products_schienen_profile',
  'option_products_schienen-profile',
  'option_products_reinigung_pflege',
  'option_products_reinigung-pflege'
];

let foundOnRoot = 0;

optionFields.forEach(field => {
  const value = product[field];
  if (value !== undefined && value !== null && value !== '') {
    console.log(`✅ ROOT: ${field} = ${JSON.stringify(value)}`);
    foundOnRoot++;
  }
});

console.log(`\nFelder auf Root-Level: ${foundOnRoot}/${optionFields.length}`);

console.log('\n=== JAEGER_META ===');
if (product.jaeger_meta && Object.keys(product.jaeger_meta).length > 0) {
  console.log('Keys:', Object.keys(product.jaeger_meta));
  Object.keys(product.jaeger_meta).forEach(key => {
    if (key.startsWith('option_products')) {
      console.log(`  ${key}: ${JSON.stringify(product.jaeger_meta[key])}`);
    }
  });
} else {
  console.log('jaeger_meta ist leer oder undefined');
}
