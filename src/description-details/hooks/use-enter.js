/**
 * WordPress dependencies
 */
import { useRefEffect } from '@wordpress/compose';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * When Enter is pressed at the end of a DD:
 *   - If the DD is empty, replace it with a new DT (start a new term group).
 *   - Otherwise, insert another DD after it (supports multiple DD per DT).
 *
 * @param {string} clientId The block's client ID.
 */
export default function useEnter( clientId ) {
	const {
		getBlock,
		getBlockIndex,
		getBlockRootClientId,
	} = useSelect( ( select ) => select( blockEditorStore ), [] );

	const { insertBlock, removeBlock } = useDispatch( blockEditorStore );

	return useRefEffect( ( element ) => {
		function onKeyDown( event ) {
			if ( event.key !== 'Enter' || event.shiftKey ) {
				return;
			}

			const block = getBlock( clientId );
			if ( ! block ) {
				return;
			}

			const content = block.attributes.content;
			const isEmpty =
				! content ||
				( typeof content === 'string' && content.trim() === '' ) ||
				( typeof content === 'object' &&
					( content.text || '' ).trim() === '' );

			const rootClientId = getBlockRootClientId( clientId );
			const currentIndex = getBlockIndex( clientId );

			// If DD is empty, replace with a new DT (start a new term group).
			if ( isEmpty ) {
				event.preventDefault();
				const newBlock = createBlock( 'chek/description-term', {} );
				insertBlock( newBlock, currentIndex + 1, rootClientId, true );
				removeBlock( clientId );
				return;
			}

			// Prevent the default Enter behavior.
			event.preventDefault();

			// Insert another DD after this one (multiple descriptions per term).
			const newBlock = createBlock( 'chek/description-details', {} );
			insertBlock( newBlock, currentIndex + 1, rootClientId, true );
		}

		element.addEventListener( 'keydown', onKeyDown );
		return () => element.removeEventListener( 'keydown', onKeyDown );
	}, [ clientId ] );
}
