<?php
/**
 * Plugin Name:       Chek Description List
 * Description:       Gutenberg blocks for semantic description lists (dl/dt/dd).
 * Version:           1.0.1
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Chek
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       chek-description-list
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register all three blocks from their compiled build metadata.
 */
function chek_description_list_register_blocks() {
	register_block_type( __DIR__ . '/build/description-list' );
	register_block_type( __DIR__ . '/build/description-term' );
	register_block_type( __DIR__ . '/build/description-details' );
}
add_action( 'init', 'chek_description_list_register_blocks' );
