/**
 * WordPress dependencies
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { content } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<dt { ...blockProps }>
			<RichText.Content value={ content } />
		</dt>
	);
}
