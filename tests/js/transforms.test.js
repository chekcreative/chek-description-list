/**
 * Tests for block transforms (DT ↔ DD).
 *
 * Since registerBlockType is mocked, we import the index files and then
 * inspect what was passed to registerBlockType to verify transforms.
 */
import { registerBlockType, createBlock } from '@wordpress/blocks';

// Import the index files — this triggers registerBlockType calls.
beforeAll( () => {
	registerBlockType.mockClear();
} );

describe( 'DT ↔ DD transforms', () => {
	let dtRegistration;
	let ddRegistration;

	beforeAll( () => {
		// Import in order so registerBlockType is called.
		require( '../../src/description-term/index' );
		require( '../../src/description-details/index' );

		// registerBlockType is called twice: once for DT, once for DD.
		const calls = registerBlockType.mock.calls;

		dtRegistration = calls.find(
			( call ) => call[ 0 ] === 'chek/description-term'
		);
		ddRegistration = calls.find(
			( call ) => call[ 0 ] === 'chek/description-details'
		);
	} );

	describe( 'Description Term (DT)', () => {
		it( 'has a transforms.to config targeting chek/description-details', () => {
			const config = dtRegistration[ 1 ];
			expect( config.transforms ).toBeDefined();
			expect( config.transforms.to ).toHaveLength( 1 );
			expect( config.transforms.to[ 0 ].type ).toBe( 'block' );
			expect( config.transforms.to[ 0 ].blocks ).toContain(
				'chek/description-details'
			);
		} );

		it( 'has a transforms.from config targeting chek/description-details', () => {
			const config = dtRegistration[ 1 ];
			expect( config.transforms.from ).toHaveLength( 1 );
			expect( config.transforms.from[ 0 ].type ).toBe( 'block' );
			expect( config.transforms.from[ 0 ].blocks ).toContain(
				'chek/description-details'
			);
		} );

		it( 'to-transform passes content attribute to the new block', () => {
			const config = dtRegistration[ 1 ];
			const transform = config.transforms.to[ 0 ].transform;
			const result = transform( { content: 'My Term' } );

			expect( createBlock ).toHaveBeenCalledWith(
				'chek/description-details',
				{ content: 'My Term' }
			);
			expect( result.name ).toBe( 'chek/description-details' );
			expect( result.attributes.content ).toBe( 'My Term' );
		} );

		it( 'from-transform passes content attribute to the new DT block', () => {
			const config = dtRegistration[ 1 ];
			const transform = config.transforms.from[ 0 ].transform;
			const result = transform( { content: 'My Description' } );

			expect( createBlock ).toHaveBeenCalledWith(
				'chek/description-term',
				{ content: 'My Description' }
			);
			expect( result.name ).toBe( 'chek/description-term' );
			expect( result.attributes.content ).toBe( 'My Description' );
		} );
	} );

	describe( 'Description Details (DD)', () => {
		it( 'has a transforms.to config targeting chek/description-term', () => {
			const config = ddRegistration[ 1 ];
			expect( config.transforms ).toBeDefined();
			expect( config.transforms.to ).toHaveLength( 1 );
			expect( config.transforms.to[ 0 ].type ).toBe( 'block' );
			expect( config.transforms.to[ 0 ].blocks ).toContain(
				'chek/description-term'
			);
		} );

		it( 'has a transforms.from config targeting chek/description-term', () => {
			const config = ddRegistration[ 1 ];
			expect( config.transforms.from ).toHaveLength( 1 );
			expect( config.transforms.from[ 0 ].type ).toBe( 'block' );
			expect( config.transforms.from[ 0 ].blocks ).toContain(
				'chek/description-term'
			);
		} );

		it( 'to-transform passes content attribute to the new DT block', () => {
			const config = ddRegistration[ 1 ];
			const transform = config.transforms.to[ 0 ].transform;
			const result = transform( { content: 'My Description' } );

			expect( createBlock ).toHaveBeenCalledWith(
				'chek/description-term',
				{ content: 'My Description' }
			);
			expect( result.name ).toBe( 'chek/description-term' );
		} );

		it( 'from-transform passes content attribute to the new DD block', () => {
			const config = ddRegistration[ 1 ];
			const transform = config.transforms.from[ 0 ].transform;
			const result = transform( { content: 'Some Term' } );

			expect( createBlock ).toHaveBeenCalledWith(
				'chek/description-details',
				{ content: 'Some Term' }
			);
			expect( result.name ).toBe( 'chek/description-details' );
		} );
	} );
} );
