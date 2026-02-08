const https = require('https');

const footerPages = [
  { name: 'Impressum', slug: 'impressum' },
  { name: 'Datenschutz', slug: 'datenschutzerklaerung-2' },
  { name: 'AGB', slug: 'allgemeine-geschaeftsbedingungen' },
  { name: 'Widerruf', slug: 'widerrufsbelehrung-widerrufsformular' },
  { name: 'Versand & Lieferzeit', slug: 'versandkosten-lieferzeit' },
  { name: 'Kontakt', slug: 'beratung' },
  { name: 'Karriere', slug: 'karriere' },
  { name: 'Service', slug: 'servicebereich-bodenjaeger' },
];

async function analyzePage(slug, name) {
  return new Promise((resolve) => {
    https.get(`https://plan-dein-ding.de/wp-json/wp/v2/pages?slug=${slug}&_embed=true`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.length === 0) {
            console.log(`\n❌ ${name} (${slug}): NOT FOUND`);
            resolve();
            return;
          }

          const page = json[0];
          const content = page.content.rendered;

          // Check if it's an Elementor page
          const isElementor = content.includes('elementor');

          // Extract images
          const imgMatches = content.match(/src="(https:\/\/[^"]+\.(jpg|jpeg|png|webp))"/g) || [];
          const images = imgMatches.map(m => m.match(/src="([^"]+)"/)[1]);

          // Check for featured image
          const featuredImage = page._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

          // Extract headings
          const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/g) || [];
          const h3Matches = content.match(/<h3[^>]*>(.*?)<\/h3>/g) || [];

          console.log(`\n✅ ${name} (${slug})`);
          console.log(`   ID: ${page.id}`);
          console.log(`   Elementor: ${isElementor ? 'YES' : 'NO'}`);
          console.log(`   Featured Image: ${featuredImage ? 'YES' : 'NO'}`);
          console.log(`   Images in content: ${images.length}`);
          console.log(`   H2 headings: ${h2Matches.length}`);
          console.log(`   H3 headings: ${h3Matches.length}`);
          console.log(`   Content length: ${content.length} chars`);

          if (featuredImage) {
            console.log(`   Featured: ${featuredImage}`);
          }

          resolve();
        } catch (e) {
          console.log(`\n❌ ${name} (${slug}): ERROR - ${e.message}`);
          resolve();
        }
      });
    }).on('error', (e) => {
      console.log(`\n❌ ${name} (${slug}): ERROR - ${e.message}`);
      resolve();
    });
  });
}

(async () => {
  console.log('=== ANALYZING ALL FOOTER PAGES ===\n');

  for (const page of footerPages) {
    await analyzePage(page.slug, page.name);
  }

  console.log('\n\n=== ANALYSIS COMPLETE ===');
})();
