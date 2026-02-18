/**
 * WordPress dependencies
 */
import { useRefEffect } from '@wordpress/compose';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * When Enter is pressed at the end of a DT:
 *   - If the DT is empty, remove it (standard "exit" behavior).
 *   - Otherwise, insert a DD block after it (DT → DD flow).
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

			// If DT is empty, remove it (lets users "exit" the list).
			if ( isEmpty ) {
				return;
			}

			// Prevent the default Enter behavior (splitting the block).
			event.preventDefault();

			const rootClientId = getBlockRootClientId( clientId );
			const currentIndex = getBlockIndex( clientId );

			// Insert a DD block after this DT.
			const newBlock = createBlock( 'chek/description-details', {} );
			insertBlock( newBlock, currentIndex + 1, rootClientId, true );
		}

		element.addEventListener( 'keydown', onKeyDown );
		return () => element.removeEventListener( 'keydown', onKeyDown );
	}, [ clientId ] );
}
