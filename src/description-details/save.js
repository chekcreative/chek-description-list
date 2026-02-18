/**
 * WordPress dependencies
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { content } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<dd { ...blockProps }>
			<RichText.Content value={ content } />
		</dd>
	);
}
