/**
 * External dependencies
 */
import { render } from '@testing-library/react';

/**
 * Internal dependencies — components
 */
import DescriptionListEdit from '../../src/description-list/edit';
import DescriptionTermEdit from '../../src/description-term/edit';
import DescriptionDetailsEdit from '../../src/description-details/edit';

// All @wordpress/* mocks are handled via moduleNameMapper in jest.config.js.

describe( 'Edit components', () => {
	describe( 'DescriptionListEdit', () => {
		it( 'renders a <dl> element', () => {
			const { container } = render( <DescriptionListEdit /> );
			const dl = container.querySelector( 'dl' );
			expect( dl ).not.toBeNull();
		} );
	} );

	describe( 'DescriptionTermEdit', () => {
		const defaultProps = {
			attributes: { content: '' },
			setAttributes: jest.fn(),
			clientId: 'test-client-id-dt',
		};

		it( 'renders a <dt> element', () => {
			const { container } = render(
				<DescriptionTermEdit { ...defaultProps } />
			);
			const dt = container.querySelector( 'dt' );
			expect( dt ).not.toBeNull();
		} );

		it( 'contains a RichText component with placeholder', () => {
			const { container } = render(
				<DescriptionTermEdit { ...defaultProps } />
			);
			const richText = container.querySelector(
				'[data-testid="rich-text"]'
			);
			expect( richText ).not.toBeNull();
			expect( richText.getAttribute( 'data-placeholder' ) ).toBe(
				'Term...'
			);
		} );

		it( 'passes content value to RichText', () => {
			const props = {
				...defaultProps,
				attributes: { content: 'Hello Term' },
			};
			const { container } = render(
				<DescriptionTermEdit { ...props } />
			);
			const richText = container.querySelector(
				'[data-testid="rich-text"]'
			);
			expect( richText.getAttribute( 'data-value' ) ).toBe(
				'Hello Term'
			);
		} );
	} );

	describe( 'DescriptionDetailsEdit', () => {
		const defaultProps = {
			attributes: { content: '' },
			setAttributes: jest.fn(),
			clientId: 'test-client-id-dd',
		};

		it( 'renders a <dd> element', () => {
			const { container } = render(
				<DescriptionDetailsEdit { ...defaultProps } />
			);
			const dd = container.querySelector( 'dd' );
			expect( dd ).not.toBeNull();
		} );

		it( 'contains a RichText component with placeholder', () => {
			const { container } = render(
				<DescriptionDetailsEdit { ...defaultProps } />
			);
			const richText = container.querySelector(
				'[data-testid="rich-text"]'
			);
			expect( richText ).not.toBeNull();
			expect( richText.getAttribute( 'data-placeholder' ) ).toBe(
				'Description...'
			);
		} );

		it( 'passes content value to RichText', () => {
			const props = {
				...defaultProps,
				attributes: { content: 'Hello Description' },
			};
			const { container } = render(
				<DescriptionDetailsEdit { ...props } />
			);
			const richText = container.querySelector(
				'[data-testid="rich-text"]'
			);
			expect( richText.getAttribute( 'data-value' ) ).toBe(
				'Hello Description'
			);
		} );
	} );
} );
