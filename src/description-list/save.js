/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save() {
	const blockProps = useBlockProps.save();

	return (
		<dl { ...blockProps }>
			<InnerBlocks.Content />
		</dl>
	);
}
