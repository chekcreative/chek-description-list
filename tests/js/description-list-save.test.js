/**
 * External dependencies
 */
import { render } from '@testing-library/react';

/**
 * Internal dependencies — save function
 */
import save from '../../src/description-list/save';

describe( 'chek/description-list save', () => {
	it( 'renders a <dl> element', () => {
		const { container } = render( save( { attributes: {} } ) );
		const dl = container.querySelector( 'dl' );
		expect( dl ).not.toBeNull();
	} );

	it( 'has the block class name', () => {
		const { container } = render( save( { attributes: {} } ) );
		const dl = container.querySelector( 'dl' );
		expect( dl.className ).toContain( 'wp-block-mock' );
	} );

	it( 'snapshot matches expected output', () => {
		const { container } = render( save( { attributes: {} } ) );
		expect( container.innerHTML ).toMatchSnapshot();
	} );
} );
