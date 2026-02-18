/**
 * WordPress dependencies
 */
import { useRefEffect } from '@wordpress/compose';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * Check whether the caret is collapsed at the very start of the editable
 * content inside `element`.
 *
 * @param {HTMLElement} element The block wrapper element.
 * @return {boolean} True when caret is at offset 0 of the first text node.
 */
function isCursorAtStart( element ) {
	const selection = element.ownerDocument.defaultView.getSelection();

	if ( ! selection || selection.rangeCount === 0 ) {
		return false;
	}

	// Must be a collapsed selection (no range selected).
	if ( ! selection.isCollapsed ) {
		return false;
	}

	const range = selection.getRangeAt( 0 );

	// Offset must be 0.
	if ( range.startOffset !== 0 ) {
		return false;
	}

	// Walk up from the range's start container to verify nothing
	// precedes it within the editable element. Every ancestor up to
	// `element` must be the first child of its parent.
	let node = range.startContainer;
	while ( node && node !== element ) {
		const parent = node.parentNode;
		if ( ! parent ) {
			break;
		}
		if ( parent.firstChild !== node ) {
			return false;
		}
		node = parent;
	}

	return true;
}

/**
 * Tab / Shift+Tab to transform between DT and DD.
 *
 *   - Tab on a DT (cursor at start) → transform to DD.
 *   - Shift+Tab on a DD (cursor at start) → transform to DT.
 *
 * @param {string} clientId  The block's client ID.
 * @param {string} blockName The current block name ('chek/description-term'
 *                           or 'chek/description-details').
 */
export default function useTab( clientId, blockName ) {
	const {
		getBlock,
		getBlockIndex,
		getBlockRootClientId,
	} = useSelect( ( select ) => select( blockEditorStore ), [] );

	const { replaceBlock, selectBlock } = useDispatch( blockEditorStore );

	return useRefEffect( ( element ) => {
		function onKeyDown( event ) {
			if ( event.key !== 'Tab' ) {
				return;
			}

			const isDT = blockName === 'chek/description-term';
			const isDD = blockName === 'chek/description-details';

			// Tab (no shift) on DT → DD.
			// Shift+Tab on DD → DT.
			const shouldTransform =
				( isDT && ! event.shiftKey ) ||
				( isDD && event.shiftKey );

			if ( ! shouldTransform ) {
				return;
			}

			if ( ! isCursorAtStart( element ) ) {
				return;
			}

			event.preventDefault();

			const block = getBlock( clientId );
			if ( ! block ) {
				return;
			}

			const targetBlockName = isDT
				? 'chek/description-details'
				: 'chek/description-term';

			const newBlock = createBlock( targetBlockName, {
				content: block.attributes.content,
			} );

			replaceBlock( clientId, newBlock );

			// Focus the new block at the start (position 0) to keep the
			// caret where the user expects it.
			selectBlock( newBlock.clientId, 0 );
		}

		element.addEventListener( 'keydown', onKeyDown );
		return () => element.removeEventListener( 'keydown', onKeyDown );
	}, [ clientId, blockName ] );
}
