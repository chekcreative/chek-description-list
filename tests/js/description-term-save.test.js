/**
 * External dependencies
 */
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import save from '../../src/description-term/save';

describe( 'chek/description-term save', () => {
	it( 'renders a <dt> element', () => {
		const { container } = render(
			save( { attributes: { content: 'Test Term' } } )
		);
		const dt = container.querySelector( 'dt' );
		expect( dt ).not.toBeNull();
		expect( dt.textContent ).toContain( 'Test Term' );
	} );

	it( 'renders empty <dt> when content is empty', () => {
		const { container } = render(
			save( { attributes: { content: '' } } )
		);
		const dt = container.querySelector( 'dt' );
		expect( dt ).not.toBeNull();
	} );

	it( 'preserves inline HTML formatting in content', () => {
		const { container } = render(
			save( {
				attributes: { content: '<strong>Bold Term</strong>' },
			} )
		);
		const strong = container.querySelector( 'strong' );
		expect( strong ).not.toBeNull();
		expect( strong.textContent ).toBe( 'Bold Term' );
	} );

	it( 'snapshot matches expected output', () => {
		const { container } = render(
			save( { attributes: { content: 'Snapshot Term' } } )
		);
		expect( container.innerHTML ).toMatchSnapshot();
	} );
} );
