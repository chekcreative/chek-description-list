/**
 * Tests for the useBackspace hook.
 *
 * Since useRefEffect / useSelect / useDispatch are all mocked, we test the
 * hook's logic by:
 *   1. Temporarily making `useRefEffect` invoke the callback with a real DOM
 *      element so the keydown listener is actually attached.
 *   2. Configuring the `useSelect` / `useDispatch` mocks to return
 *      controlled values for each scenario.
 *   3. Dispatching keyboard events on the element.
 */

const { useSelect, useDispatch } = require( '@wordpress/data' );
const { useRefEffect } = require( '@wordpress/compose' );

// We need to override the compose mock for these tests so that
// useRefEffect actually calls the callback.
jest.mock( '@wordpress/compose', () => ( {
	useRefEffect: jest.fn(),
	useMergeRefs: ( ...refs ) => () => {},
} ) );

// The hook lives inside src/ — adjust relative path from tests/js/.
const useBackspace = require( '../../src/shared/hooks/use-backspace' ).default;

describe( 'useBackspace', () => {
	let element;
	let mockRemoveBlock;
	let mockSelectBlock;
	let mockGetBlock;
	let mockGetBlockIndex;
	let mockGetBlockRootClientId;
	let mockGetBlockOrder;
	let mockGetPreviousBlockClientId;

	const CLIENT_ID = 'block-1';
	const PARENT_ID = 'dl-parent';

	function setupMocks( {
		content = '',
		blockOrder = [ CLIENT_ID ],
		previousSibling = null,
		dlPrevious = null,
	} = {} ) {
		mockRemoveBlock = jest.fn();
		mockSelectBlock = jest.fn();
		mockGetBlock = jest.fn( () => ( {
			attributes: { content },
		} ) );
		mockGetBlockIndex = jest.fn( () => 0 );
		mockGetBlockRootClientId = jest.fn( () => PARENT_ID );
		mockGetBlockOrder = jest.fn( () => blockOrder );
		mockGetPreviousBlockClientId = jest.fn( ( id ) => {
			if ( id === CLIENT_ID ) return previousSibling;
			if ( id === PARENT_ID ) return dlPrevious;
			return null;
		} );

		useSelect.mockImplementation( ( mapSelect ) => {
			if ( typeof mapSelect === 'function' ) {
				const mockSelect = () => ( {
					getBlock: mockGetBlock,
					getBlockIndex: mockGetBlockIndex,
					getBlockRootClientId: mockGetBlockRootClientId,
					getBlockOrder: mockGetBlockOrder,
					getPreviousBlockClientId: mockGetPreviousBlockClientId,
				} );
				return mapSelect( mockSelect );
			}
			return {};
		} );

		useDispatch.mockReturnValue( {
			removeBlock: mockRemoveBlock,
			selectBlock: mockSelectBlock,
			insertBlock: jest.fn(),
		} );

		// Make useRefEffect actually invoke the callback so the listener
		// gets registered on our element.
		useRefEffect.mockImplementation( ( callback ) => {
			// Return a ref callback that attaches the listener.
			return ( el ) => {
				if ( el ) {
					callback( el );
				}
			};
		} );
	}

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );
	} );

	afterEach( () => {
		document.body.removeChild( element );
		jest.restoreAllMocks();
	} );

	function callHookAndAttach() {
		const refCallback = useBackspace( CLIENT_ID );
		// Simulate React attaching the ref.
		refCallback( element );
	}

	function pressBackspace() {
		const event = new KeyboardEvent( 'keydown', {
			key: 'Backspace',
			bubbles: true,
			cancelable: true,
		} );
		element.dispatchEvent( event );
		return event;
	}

	it( 'does nothing when content is not empty', () => {
		setupMocks( { content: 'Some text' } );
		callHookAndAttach();
		pressBackspace();

		expect( mockRemoveBlock ).not.toHaveBeenCalled();
	} );

	it( 'removes the block when content is empty (string)', () => {
		setupMocks( {
			content: '',
			blockOrder: [ CLIENT_ID, 'other-block' ],
		} );
		callHookAndAttach();
		pressBackspace();

		expect( mockRemoveBlock ).toHaveBeenCalledWith( CLIENT_ID );
	} );

	it( 'removes the block when content is null', () => {
		setupMocks( {
			content: null,
			blockOrder: [ CLIENT_ID, 'other-block' ],
		} );
		callHookAndAttach();
		pressBackspace();

		expect( mockRemoveBlock ).toHaveBeenCalledWith( CLIENT_ID );
	} );

	it( 'removes the block when content is a rich-text object with empty text', () => {
		setupMocks( {
			content: { text: '' },
			blockOrder: [ CLIENT_ID, 'other-block' ],
		} );
		callHookAndAttach();
		pressBackspace();

		expect( mockRemoveBlock ).toHaveBeenCalledWith( CLIENT_ID );
	} );

	it( 'selects the previous sibling after removal', () => {
		setupMocks( {
			content: '',
			blockOrder: [ 'sibling-1', CLIENT_ID ],
			previousSibling: 'sibling-1',
		} );
		callHookAndAttach();
		pressBackspace();

		expect( mockRemoveBlock ).toHaveBeenCalledWith( CLIENT_ID );
		expect( mockSelectBlock ).toHaveBeenCalledWith( 'sibling-1', -1 );
	} );

	it( 'removes the parent DL when this is the last child', () => {
		setupMocks( {
			content: '',
			blockOrder: [ CLIENT_ID ], // only child
			previousSibling: null,
			dlPrevious: 'paragraph-before-dl',
		} );
		callHookAndAttach();
		pressBackspace();

		// Should remove the block itself.
		expect( mockRemoveBlock ).toHaveBeenCalledWith( CLIENT_ID );
		// Should also remove the parent DL.
		expect( mockRemoveBlock ).toHaveBeenCalledWith( PARENT_ID );
		// Should select the block before the DL, at end of content.
		expect( mockSelectBlock ).toHaveBeenCalledWith(
			'paragraph-before-dl',
			-1
		);
	} );

	it( 'removes the parent DL even when there is no block before it', () => {
		setupMocks( {
			content: '',
			blockOrder: [ CLIENT_ID ], // only child
			previousSibling: null,
			dlPrevious: null, // DL is the first block in the editor
		} );
		callHookAndAttach();
		pressBackspace();

		expect( mockRemoveBlock ).toHaveBeenCalledWith( CLIENT_ID );
		expect( mockRemoveBlock ).toHaveBeenCalledWith( PARENT_ID );
		// No block to select, so selectBlock should not have been called
		// for a null value.
		expect( mockSelectBlock ).not.toHaveBeenCalled();
	} );

	it( 'prevents default browser behavior when content is empty', () => {
		setupMocks( {
			content: '',
			blockOrder: [ CLIENT_ID, 'other' ],
		} );
		callHookAndAttach();
		const event = pressBackspace();

		expect( event.defaultPrevented ).toBe( true );
	} );

	it( 'does not prevent default when content is not empty', () => {
		setupMocks( { content: 'Has content' } );
		callHookAndAttach();
		const event = pressBackspace();

		expect( event.defaultPrevented ).toBe( false );
	} );

	it( 'ignores non-Backspace keys', () => {
		setupMocks( { content: '' } );
		callHookAndAttach();

		const event = new KeyboardEvent( 'keydown', {
			key: 'Delete',
			bubbles: true,
			cancelable: true,
		} );
		element.dispatchEvent( event );

		expect( mockRemoveBlock ).not.toHaveBeenCalled();
	} );
} );
