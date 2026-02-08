const https = require('https');

https.get('https://plan-dein-ding.de/wp-json/wp/v2/pages/3846', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const content = json.content.rendered;

    // Extract service cards with their background images
    const ctaRegex = /<div class="elementor-cta">[\s\S]*?<h3[^>]*>(.*?)<\/h3>[\s\S]*?(?:background-image: url\((.*?)\))?[\s\S]*?<\/div>/g;

    const services = [];
    let match;

    while ((match = ctaRegex.exec(content)) !== null) {
      const title = match[1].trim();
      const bgImage = match[2] || 'NO_IMAGE';

      if (title.includes('service') || title.includes('verleih') || title.includes('lagerung') || title.includes('beratung') || title.includes('Set-Angebote') || title.includes('Schausonntag')) {
        services.push({ title, bgImage });
      }
    }

    console.log('Service Cards with Background Images:\n');
    services.forEach((s, i) => {
      console.log(`${i + 1}. ${s.title}`);
      console.log(`   Image: ${s.bgImage}\n`);
    });
  });
});
