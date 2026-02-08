const https = require('https');

https.get('https://plan-dein-ding.de/wp-json/wp/v2/pages/3846', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const content = json.content.rendered;

    console.log('=== ELEMENTOR STRUCTURE ===\n');

    // Extract all headings
    const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/g) || [];
    const h3Matches = content.match(/<h3[^>]*>(.*?)<\/h3>/g) || [];

    console.log('H2 Headings:');
    h2Matches.forEach(h => console.log('  -', h.replace(/<[^>]+>/g, '').trim()));

    console.log('\nH3 Headings:');
    h3Matches.forEach(h => console.log('  -', h.replace(/<[^>]+>/g, '').trim()));

    // Extract all images
    const imgMatches = content.match(/src="(https:\/\/[^"]+\.(jpg|jpeg|png|webp))"/g) || [];
    console.log('\n\nImages found:', imgMatches.length);
    imgMatches.forEach(img => console.log('  -', img.match(/src="([^"]+)"/)[1]));
  });
});
