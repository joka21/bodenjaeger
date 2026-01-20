<?php
/**
 * MINIMAL wp-config.php - Cache komplett deaktiviert
 */

// Database settings
define( 'DB_NAME', 'usr_p257860_1' );
define( 'DB_USER', 'p257860' );
define( 'DB_PASSWORD', 'T3njoka21!' );
define( 'DB_HOST', 'db002599.mydbserver.com' );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

// Authentication Keys
define( 'AUTH_KEY',          'HG+x^HlL 1D|b_y~.e`RZ%119nos1QMy4@QV|;K/&F]?h(7]:o~;N][TI`2 ]9 _' );
define( 'SECURE_AUTH_KEY',   'Ag**YTSwXFGfkmqrAZFy;BO+DTJVP7]}~?TlE?&01TG8fZN;cT6r4~|@os5DDCqo' );
define( 'LOGGED_IN_KEY',     'AokbmhAE2a`9)amBMAk76NuIp:ti${_I2,F|3E[Z|EgZxNY?>#/Zn@Ky//OoPVRQ' );
define( 'NONCE_KEY',         '>/b3&`cX{;Gh4ltZxM;mua8ndm<FU?+R%y!mB@C${~rbqhCRA7frqFlmSqJv^AXX' );
define( 'AUTH_SALT',         'E{kpJxg,8C;nE9 ^R9FWjpIcByw?P!u(r*W-5SO+Re]QzS6BuA> U@~Qcn<zSf>5' );
define( 'SECURE_AUTH_SALT',  'c8L$r)|0HY)1}]Dw;DV@vgGF #U7XP#f?@h}!_i]+~%-V$J36`SrNlr!^cU7=^Zj' );
define( 'LOGGED_IN_SALT',    'M(T8=3M,w9>}iF3kN#JIwr_1}w-+.xZKOxLhT=my$r3HF_+jYyz-]3FoO5:bOI5~' );
define( 'NONCE_SALT',        'OQDehGk$>:3=:yB5rQcxW=K3QK+0X^9|@<73(OuQ3t^d~ZIXy<]NW818XH&4L[R5' );
define( 'WP_CACHE_KEY_SALT', '[n-coCKw:=n(!wP,Nl Zt&aJiL)us+l9mdp!Y=QPviWpd#GGvV3}|Zb+Gt]%bNz)' );

// Table prefix
$table_prefix = 'wp_';

// CACHE KOMPLETT DEAKTIVIEREN
define( 'WP_CACHE', false );
define( 'ENABLE_CACHE', false );
define( 'WP_CACHE_PHASE', false );
define( 'DONOTCACHEPAGE', true );
define( 'DONOTCACHEDB', true );
define( 'DONOTMINIFY', true );
define( 'DONOTCDN', true );
define( 'DONOTCACHEOBJECT', true );

// Object Cache deaktivieren
define( 'WP_REDIS_DISABLED', true );
define( 'WP_OBJECT_CACHE_DISABLED', true );

// Browser Cache Headers verhindern
if (!defined('DONOTCACHEPAGE')) {
    define('DONOTCACHEPAGE', true);
}

// Cache Konstanten auf false setzen
define( 'WP_CACHE_SALT_PATH', false );
define( 'WPCACHEHOME', false );

// Basic Debug (sicher)
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', true );

// Memory
define( 'WP_MEMORY_LIMIT', '256M' );

// German
define( 'WPLANG', 'de_DE' );

// WooCommerce
define( 'WC_GZD_ENCRYPTION_KEY', 'b8ebce214be2046409fff6e0834a7b60b5c1e51a4b80116af5e0df630e40e5ba' );

// No-Cache Headers setzen (für alle Seiten)
if (!headers_sent()) {
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
}

// WordPress setup
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

require_once ABSPATH . 'wp-settings.php';