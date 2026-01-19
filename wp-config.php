<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Datenbank-Einstellungen ** //
define('DB_NAME', 'wp_mwdhg');
define('DB_USER', 'wp_qllz7');
define('DB_PASSWORD', 'Ee?Jy9$Glm2$*3lR');
define('DB_HOST', 'localhost:3306');
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');

// ** Authentifizierungs-Schlüssel und Salts ** //
define('AUTH_KEY',         'DL9GE4-3W8Z[~oS9B_ZJ[_!cG1xgyAHBx)[U8N@KO6Shh]LO%JVgtPsw2%B&7X4L');
define('SECURE_AUTH_KEY',  '|S+bpvr;opd@[U9y+17Sw8d]M!/8Q9;F/r;)0qw4!@O)BL*n4y5~9_MowdDt!S(y');
define('LOGGED_IN_KEY',    'nt[/md~q9vR8@#i]eO1zoL1o5I68t26%32:p1W0~G)TMWW+3r-;+#_!jl941d@iE');
define('NONCE_KEY',        'K1s9%!)98nCpD/45[#trR;r[SohQ4g[61~ar!A-2E!Bi5i612/dEA~9c8KJiy!hW');
define('AUTH_SALT',        '];7|a/K[C24G0|35)d+gd9w~9E-KpCMW7p149i]!Q&(xQLVw!xA9S#6_~hi)24u~');
define('SECURE_AUTH_SALT', 'TT2#1Y-8Q)0u~C269!1);gs3my7L6-Uo#)3P-SWaK#+0gt7]ge8NIzo3kvmGn7&h');
define('LOGGED_IN_SALT',   'Aw)t(61)7HWzPh:0@ByM#p@a|4qf65f70s6vV-S1q8aAV232W4xuNyPo@:)v27(|');
define('NONCE_SALT',       '_7-7!I06;)H@|QA|F)h;e8p16[(6)zO_Kk79+3/68HY!EwS+t5Gj3!2N1D(5Co~8');

// Tabellenpräfix
$table_prefix = 'BGzfzr_';
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '256M');

// ⚠️ MULTISITE deaktiviert
// define('WP_ALLOW_MULTISITE', true); // entfernt

// Debug-Modus
define('WP_DEBUG', false);
define('WP_DEBUG_DISPLAY', false);
define('WP_DEBUG_LOG', true);


// Sonstige Einstellungen
define('WC_GZD_ENCRYPTION_KEY', 'bd90f86dbdb267f6354ab21c45bcf8209a9fbece3d01a5300afd5cc6e9b203c6');
define('WP_CACHE_KEY_SALT', '8283498650bbd4c9c6c7f70a53a72dde');
define('WP_AUTO_UPDATE_CORE', false);

/** Absoluter Pfad */
if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', __DIR__ . '/' );
}

/** WordPress einbinden */
require_once ABSPATH . 'wp-settings.php';