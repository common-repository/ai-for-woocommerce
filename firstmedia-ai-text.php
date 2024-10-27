<?php
defined( 'ABSPATH' ) or die( 'No access' );
/**
 * Plugin Name:           AI for WooCommerce
 * Plugin URI:            https://www.aiflow.ai/
 * Description:           Allows you to generate Product Descriptions with AI.
 * Version:               1.0.5

 * Author:                FirstMedia Solutions GmbH
 * Author URI:            https://www.firstmedia.swiss
 * Text Domain:           firstmedia-ai-text
 * Domain Path:           /languages
 * WC requires at least:  3.7
 * WC tested up to:       8.1.0
 */

define( 'FIRSTMEDIA_AIFLOW_VER', '1.0.5' );
define( 'FIRSTMEDIA_AIFLOW_PLUGIN_BASEFILE', plugin_basename(__FILE__) );
define( 'FIRSTMEDIA_AIFLOW_PLUGIN_URL', plugin_dir_url(__FILE__) );


define( 'FIRSTMEDIA_AIFLOW_API', 'https://www.aiflow.ai/' );


function firstmedia_ai_load_textdomain() {
    load_plugin_textdomain( 'firstmedia-ai-text', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}
add_action( 'init', 'firstmedia_ai_load_textdomain' );


add_action( 'before_woocommerce_init', function() {
	if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
	}
} );


require_once 'backend/load.php';
