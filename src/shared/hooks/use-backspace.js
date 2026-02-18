/**
 * WordPress dependencies
 */
import { useRefEffect } from '@wordpress/compose';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * When Backspace is pressed on an empty DT or DD:
 *   1. Remove the block.
 *   2. Move focus to the previous sibling (if any).
 *   3. If the parent DL has no children left, remove the DL too.
 *
 * @param {string} clientId The block's client ID.
 */
export default function useBackspace( clientId ) {
	const {
		getBlock,
		getBlockIndex,
		getBlockRootClientId,
		getBlockOrder,
		getPreviousBlockClientId,
	} = useSelect( ( select ) => select( blockEditorStore ), [] );

	const { removeBlock, selectBlock } = useDispatch( blockEditorStore );

	return useRefEffect( ( element ) => {
		function onKeyDown( event ) {
			if ( event.key !== 'Backspace' ) {
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

			if ( ! isEmpty ) {
				return;
			}

			event.preventDefault();

			const parentClientId = getBlockRootClientId( clientId );

			// Find a block to select after removal.
			const previousSibling = getPreviousBlockClientId( clientId );

			// Remove this DT/DD.
			removeBlock( clientId );

			// Check if the parent DL is now empty.
			// After removeBlock, getBlockOrder returns the updated list.
			// We need to check if this was the last child. Since removeBlock
			// is dispatched asynchronously, we check the count before removal.
			const siblings = getBlockOrder( parentClientId );
			const remainingCount = siblings.filter(
				( id ) => id !== clientId
			).length;

			if ( remainingCount === 0 && parentClientId ) {
				// The DL is now empty — find what's before the DL and remove it.
				const dlPrevious =
					getPreviousBlockClientId( parentClientId );
				removeBlock( parentClientId );
				if ( dlPrevious ) {
					selectBlock( dlPrevious, -1 );
				}
			} else if ( previousSibling ) {
				selectBlock( previousSibling, -1 );
			}
		}

		element.addEventListener( 'keydown', onKeyDown );
		return () => element.removeEventListener( 'keydown', onKeyDown );
	}, [ clientId ] );
}
