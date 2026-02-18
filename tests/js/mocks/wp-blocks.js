/**
 * Mock for @wordpress/blocks.
 */
module.exports = {
	createBlock: jest.fn( ( name, attrs ) => ( {
		name,
		attributes: attrs || {},
		innerBlocks: [],
		clientId: 'mock-' + Math.random().toString( 36 ).slice( 2, 9 ),
	} ) ),
	registerBlockType: jest.fn(),
	unregisterBlockType: jest.fn(),
	getBlockType: jest.fn(),
	getBlockTypes: jest.fn( () => [] ),
};
