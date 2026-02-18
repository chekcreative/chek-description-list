/**
 * Internal dependencies — metadata (block.json files)
 */
import descriptionListMeta from '../../src/description-list/block.json';
import descriptionTermMeta from '../../src/description-term/block.json';
import descriptionDetailsMeta from '../../src/description-details/block.json';

describe( 'Block metadata', () => {
	describe( 'chek/description-list', () => {
		it( 'has the correct block name', () => {
			expect( descriptionListMeta.name ).toBe(
				'chek/description-list'
			);
		} );

		it( 'has apiVersion 3', () => {
			expect( descriptionListMeta.apiVersion ).toBe( 3 );
		} );

		it( 'is in the text category', () => {
			expect( descriptionListMeta.category ).toBe( 'text' );
		} );

		it( 'only allows description-term and description-details as children', () => {
			expect( descriptionListMeta.allowedBlocks ).toEqual( [
				'chek/description-term',
				'chek/description-details',
			] );
		} );

		it( 'supports color, spacing, and typography', () => {
			expect( descriptionListMeta.supports.color ).toBeTruthy();
			expect( descriptionListMeta.supports.spacing ).toBeTruthy();
			expect( descriptionListMeta.supports.typography ).toBeTruthy();
		} );

		it( 'disables raw HTML editing', () => {
			expect( descriptionListMeta.supports.html ).toBe( false );
		} );

		it( 'supports anchor', () => {
			expect( descriptionListMeta.supports.anchor ).toBe( true );
		} );

		it( 'has the correct text domain', () => {
			expect( descriptionListMeta.textdomain ).toBe(
				'chek-description-list'
			);
		} );

		it( 'includes relevant keywords', () => {
			expect( descriptionListMeta.keywords ).toContain( 'definition' );
			expect( descriptionListMeta.keywords ).toContain( 'dl' );
			expect( descriptionListMeta.keywords ).toContain( 'dt' );
			expect( descriptionListMeta.keywords ).toContain( 'dd' );
		} );
	} );

	describe( 'chek/description-term', () => {
		it( 'has the correct block name', () => {
			expect( descriptionTermMeta.name ).toBe(
				'chek/description-term'
			);
		} );

		it( 'can only be placed inside a description-list', () => {
			expect( descriptionTermMeta.parent ).toEqual( [
				'chek/description-list',
			] );
		} );

		it( 'has a rich-text content attribute targeting <dt>', () => {
			const { content } = descriptionTermMeta.attributes;
			expect( content.type ).toBe( 'rich-text' );
			expect( content.source ).toBe( 'rich-text' );
			expect( content.selector ).toBe( 'dt' );
		} );

		it( 'is not reusable', () => {
			expect( descriptionTermMeta.supports.reusable ).toBe( false );
		} );
	} );

	describe( 'chek/description-details', () => {
		it( 'has the correct block name', () => {
			expect( descriptionDetailsMeta.name ).toBe(
				'chek/description-details'
			);
		} );

		it( 'can only be placed inside a description-list', () => {
			expect( descriptionDetailsMeta.parent ).toEqual( [
				'chek/description-list',
			] );
		} );

		it( 'has a rich-text content attribute targeting <dd>', () => {
			const { content } = descriptionDetailsMeta.attributes;
			expect( content.type ).toBe( 'rich-text' );
			expect( content.source ).toBe( 'rich-text' );
			expect( content.selector ).toBe( 'dd' );
		} );

		it( 'is not reusable', () => {
			expect( descriptionDetailsMeta.supports.reusable ).toBe( false );
		} );
	} );

	describe( 'Block relationships', () => {
		it( 'term and details both reference description-list as parent', () => {
			expect( descriptionTermMeta.parent ).toContain(
				'chek/description-list'
			);
			expect( descriptionDetailsMeta.parent ).toContain(
				'chek/description-list'
			);
		} );

		it( 'description-list allows exactly the term and details blocks', () => {
			expect( descriptionListMeta.allowedBlocks ).toHaveLength( 2 );
			expect( descriptionListMeta.allowedBlocks ).toContain(
				'chek/description-term'
			);
			expect( descriptionListMeta.allowedBlocks ).toContain(
				'chek/description-details'
			);
		} );
	} );
} );
