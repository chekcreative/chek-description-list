/**
 * External dependencies
 */
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import save from '../../src/description-details/save';

describe( 'chek/description-details save', () => {
	it( 'renders a <dd> element', () => {
		const { container } = render(
			save( { attributes: { content: 'Test Description' } } )
		);
		const dd = container.querySelector( 'dd' );
		expect( dd ).not.toBeNull();
		expect( dd.textContent ).toContain( 'Test Description' );
	} );

	it( 'renders empty <dd> when content is empty', () => {
		const { container } = render(
			save( { attributes: { content: '' } } )
		);
		const dd = container.querySelector( 'dd' );
		expect( dd ).not.toBeNull();
	} );

	it( 'preserves inline HTML formatting in content', () => {
		const { container } = render(
			save( {
				attributes: {
					content: 'A <em>detailed</em> <a href="#">description</a>',
				},
			} )
		);
		const em = container.querySelector( 'em' );
		expect( em ).not.toBeNull();
		expect( em.textContent ).toBe( 'detailed' );
		const link = container.querySelector( 'a' );
		expect( link ).not.toBeNull();
		expect( link.getAttribute( 'href' ) ).toBe( '#' );
	} );

	it( 'snapshot matches expected output', () => {
		const { container } = render(
			save( { attributes: { content: 'Snapshot Description' } } )
		);
		expect( container.innerHTML ).toMatchSnapshot();
	} );
} );
