<?php
/**
 * PHPUnit tests for block registration.
 *
 * Run with: wp-env run phpunit "phpunit --configuration ..."
 * or with a standard WP test bootstrap.
 *
 * These tests verify that the plugin correctly registers all three blocks
 * and that the block metadata is as expected.
 *
 * @package ChekDescriptionList
 */

/**
 * Tests for the chek-description-list plugin block registration.
 */
class Test_Block_Registration extends WP_UnitTestCase {

	/**
	 * Set up: load the plugin.
	 */
	public function set_up() {
		parent::set_up();

		// Ensure the plugin file is loaded.
		require_once dirname( __DIR__, 2 ) . '/chek-description-list.php';

		// Fire the init action to trigger block registration.
		do_action( 'init' );
	}

	/**
	 * Test that chek/description-list block is registered.
	 */
	public function test_description_list_block_is_registered() {
		$registry = WP_Block_Type_Registry::get_instance();
		$this->assertTrue(
			$registry->is_registered( 'chek/description-list' ),
			'chek/description-list block should be registered.'
		);
	}

	/**
	 * Test that chek/description-term block is registered.
	 */
	public function test_description_term_block_is_registered() {
		$registry = WP_Block_Type_Registry::get_instance();
		$this->assertTrue(
			$registry->is_registered( 'chek/description-term' ),
			'chek/description-term block should be registered.'
		);
	}

	/**
	 * Test that chek/description-details block is registered.
	 */
	public function test_description_details_block_is_registered() {
		$registry = WP_Block_Type_Registry::get_instance();
		$this->assertTrue(
			$registry->is_registered( 'chek/description-details' ),
			'chek/description-details block should be registered.'
		);
	}

	/**
	 * Test that the description-list block is in the "text" category.
	 */
	public function test_description_list_category() {
		$registry   = WP_Block_Type_Registry::get_instance();
		$block_type = $registry->get_registered( 'chek/description-list' );
		$this->assertEquals( 'text', $block_type->category );
	}

	/**
	 * Test that child blocks declare the correct parent.
	 */
	public function test_child_blocks_have_correct_parent() {
		$registry = WP_Block_Type_Registry::get_instance();

		$term_block = $registry->get_registered( 'chek/description-term' );
		$this->assertContains( 'chek/description-list', $term_block->parent );

		$details_block = $registry->get_registered( 'chek/description-details' );
		$this->assertContains( 'chek/description-list', $details_block->parent );
	}

	/**
	 * Test that the description-list block only allows specific child blocks.
	 */
	public function test_description_list_allowed_blocks() {
		$registry   = WP_Block_Type_Registry::get_instance();
		$block_type = $registry->get_registered( 'chek/description-list' );

		$this->assertIsArray( $block_type->allowed_blocks );
		$this->assertContains( 'chek/description-term', $block_type->allowed_blocks );
		$this->assertContains( 'chek/description-details', $block_type->allowed_blocks );
		$this->assertCount( 2, $block_type->allowed_blocks );
	}
}
