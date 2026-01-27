#!/usr/bin/env node

/**
 * Environment Variables Checker für Bodenjäger
 *
 * Prüft ob alle erforderlichen ENV Vars gesetzt sind
 * Verwendung:
 *   node scripts/check-env.js
 *   npm run check-env (wenn in package.json hinzugefügt)
 */

const requiredEnvVars = {
  // WordPress & WooCommerce (KRITISCH)
  'NEXT_PUBLIC_WORDPRESS_URL': {
    required: true,
    description: 'WordPress Backend URL',
    example: 'https://plan-dein-ding.de',
    public: true,
  },
  'WC_CONSUMER_KEY': {
    required: true,
    description: 'WooCommerce Consumer Key',
    example: 'ck_...',
    public: false,
  },
  'WC_CONSUMER_SECRET': {
    required: true,
    description: 'WooCommerce Consumer Secret',
    example: 'cs_...',
    public: false,
  },

  // Site Config (KRITISCH)
  'NEXT_PUBLIC_SITE_URL': {
    required: true,
    description: 'Shop URL (localhost oder Vercel URL)',
    example: 'http://localhost:3000',
    public: true,
  },

  // Stripe (KRITISCH für Zahlungen)
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': {
    required: true,
    description: 'Stripe Publishable Key',
    example: 'pk_test_... oder pk_live_...',
    public: true,
  },
  'STRIPE_SECRET_KEY': {
    required: true,
    description: 'Stripe Secret Key',
    example: 'sk_test_... oder sk_live_...',
    public: false,
  },
  'STRIPE_WEBHOOK_SECRET': {
    required: false, // Optional bei erster lokaler Entwicklung
    description: 'Stripe Webhook Secret (für Zahlungsbestätigungen)',
    example: 'whsec_...',
    public: false,
    warning: 'Optional für lokale Entwicklung, PFLICHT für Produktion!',
  },

  // PayPal (OPTIONAL)
  'PAYPAL_CLIENT_ID': {
    required: false,
    description: 'PayPal Client ID',
    example: 'AYSq3RDGsmBLJE-otTkBtM-jBRd1TCQwFf9RGfwddNXWz0uFU9ztymylOhRS',
    public: false,
    warning: 'Optional - nur wenn PayPal aktiviert werden soll',
  },
  'PAYPAL_CLIENT_SECRET': {
    required: false,
    description: 'PayPal Client Secret',
    example: 'EGnHDxD_qRPdaLdZz8iCr8N7_MzF-YHPTkjs6NKYQvQSBngp4PTTVWkPZRbL',
    public: false,
    warning: 'Optional - nur wenn PayPal aktiviert werden soll',
  },

  // Security (KRITISCH)
  'REVALIDATE_SECRET': {
    required: true,
    description: 'Secret für Cache Revalidation',
    example: 'ein-starkes-geheimes-password',
    public: false,
  },

  // Vercel KV (OPTIONAL)
  'KV_REST_API_URL': {
    required: false,
    description: 'Vercel KV Database URL',
    example: 'https://...',
    public: false,
    warning: 'Optional - nur für Rate Limiting',
  },
  'KV_REST_API_TOKEN': {
    required: false,
    description: 'Vercel KV Auth Token',
    example: 'A...',
    public: false,
    warning: 'Optional - nur für Rate Limiting',
  },
};

// Farben für Terminal Output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function checkEnvVars() {
  console.log('\n' + colors.bright + colors.cyan + '🔍 Environment Variables Check' + colors.reset);
  console.log('='.repeat(60) + '\n');

  let missingRequired = [];
  let missingOptional = [];
  let presentVars = [];
  let warnings = [];

  // Check each variable
  for (const [varName, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[varName];
    const isSet = value && value.trim() !== '';

    if (isSet) {
      // Variable ist gesetzt
      presentVars.push({
        name: varName,
        value: maskValue(value, config.public),
        description: config.description,
        public: config.public,
      });

      // Check for placeholder values
      if (value.includes('DEIN_') || value.includes('_HIER')) {
        warnings.push({
          name: varName,
          message: 'Sieht aus wie ein Platzhalter - bitte mit echtem Wert ersetzen!',
        });
      }

      // Check Stripe mode
      if (varName.includes('STRIPE') && value.includes('_test_')) {
        warnings.push({
          name: varName,
          message: 'Test Mode - OK für Entwicklung, für Produktion Live Keys verwenden!',
        });
      }
    } else {
      // Variable fehlt
      if (config.required) {
        missingRequired.push({
          name: varName,
          description: config.description,
          example: config.example,
        });
      } else {
        missingOptional.push({
          name: varName,
          description: config.description,
          example: config.example,
          warning: config.warning,
        });
      }
    }
  }

  // Output: Vorhandene Variablen
  if (presentVars.length > 0) {
    console.log(colors.bright + colors.green + '✅ Gesetzte Variablen:' + colors.reset);
    presentVars.forEach(v => {
      const badge = v.public ? colors.cyan + '[PUBLIC]' + colors.reset : colors.yellow + '[SECRET]' + colors.reset;
      console.log(`  ${badge} ${colors.bright}${v.name}${colors.reset}`);
      console.log(`      ${v.description}`);
      console.log(`      Wert: ${v.value}`);
    });
    console.log('');
  }

  // Output: Fehlende PFLICHT-Variablen
  if (missingRequired.length > 0) {
    console.log(colors.bright + colors.red + '❌ FEHLENDE PFLICHT-Variablen:' + colors.reset);
    missingRequired.forEach(v => {
      console.log(`  ${colors.bright}${v.name}${colors.reset}`);
      console.log(`      ${v.description}`);
      console.log(`      Beispiel: ${colors.cyan}${v.example}${colors.reset}`);
    });
    console.log('');
  }

  // Output: Fehlende optionale Variablen
  if (missingOptional.length > 0) {
    console.log(colors.bright + colors.yellow + '⚠️  Fehlende OPTIONALE Variablen:' + colors.reset);
    missingOptional.forEach(v => {
      console.log(`  ${colors.bright}${v.name}${colors.reset}`);
      console.log(`      ${v.description}`);
      if (v.warning) {
        console.log(`      ℹ️  ${v.warning}`);
      }
    });
    console.log('');
  }

  // Output: Warnungen
  if (warnings.length > 0) {
    console.log(colors.bright + colors.yellow + '⚠️  Warnungen:' + colors.reset);
    warnings.forEach(w => {
      console.log(`  ${colors.bright}${w.name}${colors.reset}: ${w.message}`);
    });
    console.log('');
  }

  // Summary
  console.log('='.repeat(60));
  console.log(colors.bright + 'Zusammenfassung:' + colors.reset);
  console.log(`  Gesetzt: ${colors.green}${presentVars.length}${colors.reset} / ${Object.keys(requiredEnvVars).length}`);
  console.log(`  Fehlende Pflicht-Vars: ${colors.red}${missingRequired.length}${colors.reset}`);
  console.log(`  Fehlende Optional-Vars: ${colors.yellow}${missingOptional.length}${colors.reset}`);
  console.log(`  Warnungen: ${colors.yellow}${warnings.length}${colors.reset}`);

  // Exit status
  if (missingRequired.length > 0) {
    console.log('\n' + colors.red + '❌ Fehler: Pflicht-Variablen fehlen!' + colors.reset);
    console.log('Siehe: .env.example für Template\n');
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log('\n' + colors.yellow + '⚠️  Achtung: Es gibt Warnungen!' + colors.reset + '\n');
    process.exit(0);
  } else {
    console.log('\n' + colors.green + '✅ Alle Pflicht-Variablen gesetzt!' + colors.reset + '\n');
    process.exit(0);
  }
}

function maskValue(value, isPublic) {
  if (isPublic) {
    // Public vars zeigen (z.B. URLs)
    return colors.cyan + value + colors.reset;
  } else {
    // Secret vars maskieren
    if (value.length <= 8) {
      return colors.yellow + '***' + colors.reset;
    }
    const visible = value.substring(0, 8);
    const masked = '*'.repeat(Math.min(value.length - 8, 20));
    return colors.yellow + visible + masked + colors.reset;
  }
}

// Run check
checkEnvVars();
