/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';

/**
 * The default template gives the user one DT + one DD to start editing.
 */
const TEMPLATE = [
	[ 'chek/description-term', {} ],
	[ 'chek/description-details', {} ],
];

const ALLOWED_BLOCKS = [
	'chek/description-term',
	'chek/description-details',
];

export default function Edit( { clientId } ) {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: TEMPLATE,
	} );

	const innerBlockIds = useSelect(
		( select ) => select( blockEditorStore ).getBlockOrder( clientId ),
		[ clientId ]
	);
	const { selectBlock } = useDispatch( blockEditorStore );

	// Track whether we've already auto-focused so we only do it once.
	const hasFocused = useRef( false );

	useEffect( () => {
		if (
			! hasFocused.current &&
			innerBlockIds &&
			innerBlockIds.length > 0
		) {
			hasFocused.current = true;
			selectBlock( innerBlockIds[ 0 ], 0 );
		}
	}, [ innerBlockIds, selectBlock ] );

	return <dl { ...innerBlocksProps } />;
}
