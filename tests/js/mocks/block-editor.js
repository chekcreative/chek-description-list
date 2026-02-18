/**
 * Mock for @wordpress/block-editor used in tests.
 *
 * Provides minimal implementations of the APIs our blocks use.
 */
const React = require( 'react' );

const useBlockProps = ( additionalProps = {} ) => ( {
	...additionalProps,
	className: 'wp-block-mock',
} );

useBlockProps.save = ( additionalProps = {} ) => ( {
	...additionalProps,
	className: 'wp-block-mock',
} );

const useInnerBlocksProps = ( blockProps = {}, options = {} ) => ( {
	...blockProps,
} );

// Strip non-DOM props to avoid React warnings in tests.
const RichText = ( {
	value,
	onChange,
	placeholder,
	allowedFormats,
	identifier,
	...props
} ) =>
	React.createElement( 'div', {
		'data-testid': 'rich-text',
		'data-placeholder': placeholder,
		'data-value': typeof value === 'string' ? value : '',
	} );

RichText.Content = ( { value } ) => {
	if ( ! value ) {
		return null;
	}
	// For string HTML content, render it via dangerouslySetInnerHTML
	if ( typeof value === 'string' ) {
		return React.createElement( 'span', {
			dangerouslySetInnerHTML: { __html: value },
		} );
	}
	return React.createElement( 'span', null, String( value ) );
};

const InnerBlocks = () => null;
InnerBlocks.Content = () => null;

module.exports = {
	useBlockProps,
	useInnerBlocksProps,
	RichText,
	InnerBlocks,
};
