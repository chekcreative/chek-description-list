/**
 * Tests for the useTab hook.
 *
 * Tab on DT (cursor at start) → transform to DD.
 * Shift+Tab on DD (cursor at start) → transform to DT.
 */

const { useSelect, useDispatch } = require( '@wordpress/data' );
const { useRefEffect } = require( '@wordpress/compose' );
const { createBlock } = require( '@wordpress/blocks' );

jest.mock( '@wordpress/compose', () => ( {
	useRefEffect: jest.fn(),
	useMergeRefs: ( ...refs ) => () => {},
} ) );

const useTab = require( '../../src/shared/hooks/use-tab' ).default;

describe( 'useTab', () => {
	let element;
	let mockReplaceBlock;
	let mockSelectBlock;
	let mockGetBlock;

	const CLIENT_ID = 'tab-block-1';

	/**
	 * Place a collapsed selection at the very start of `element`.
	 */
	function placeCursorAtStart() {
		// Put a text node inside so there's something to select.
		if ( ! element.firstChild ) {
			element.appendChild( document.createTextNode( 'Hello' ) );
		}
		const range = document.createRange();
		range.setStart( element.firstChild, 0 );
		range.collapse( true );
		const sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange( range );
	}

	/**
	 * Place a collapsed selection in the middle of `element`.
	 */
	function placeCursorInMiddle() {
		if ( ! element.firstChild ) {
			element.appendChild( document.createTextNode( 'Hello' ) );
		}
		const range = document.createRange();
		range.setStart( element.firstChild, 3 ); // middle of "Hello"
		range.collapse( true );
		const sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange( range );
	}

	function setupMocks( { content = 'Some content' } = {} ) {
		mockReplaceBlock = jest.fn();
		mockSelectBlock = jest.fn();
		mockGetBlock = jest.fn( () => ( {
			attributes: { content },
		} ) );

		useSelect.mockImplementation( ( mapSelect ) => {
			if ( typeof mapSelect === 'function' ) {
				const mockSelect = () => ( {
					getBlock: mockGetBlock,
					getBlockIndex: jest.fn( () => 0 ),
					getBlockRootClientId: jest.fn( () => 'root-id' ),
					getBlockOrder: jest.fn( () => [] ),
					getPreviousBlockClientId: jest.fn( () => null ),
				} );
				return mapSelect( mockSelect );
			}
			return {};
		} );

		useDispatch.mockReturnValue( {
			insertBlock: jest.fn(),
			removeBlock: jest.fn(),
			selectBlock: mockSelectBlock,
			replaceBlock: mockReplaceBlock,
		} );

		useRefEffect.mockImplementation( ( callback ) => {
			return ( el ) => {
				if ( el ) {
					callback( el );
				}
			};
		} );
	}

	beforeEach( () => {
		element = document.createElement( 'div' );
		element.setAttribute( 'contenteditable', 'true' );
		document.body.appendChild( element );
	} );

	afterEach( () => {
		document.body.removeChild( element );
		jest.restoreAllMocks();
	} );

	function callHookAndAttach( blockName ) {
		const refCallback = useTab( CLIENT_ID, blockName );
		refCallback( element );
	}

	function pressTab( { shiftKey = false } = {} ) {
		const event = new KeyboardEvent( 'keydown', {
			key: 'Tab',
			shiftKey,
			bubbles: true,
			cancelable: true,
		} );
		element.dispatchEvent( event );
		return event;
	}

	// --- DT: Tab → DD ---

	it( 'transforms DT to DD on Tab when cursor is at start', () => {
		setupMocks( { content: 'My Term' } );
		callHookAndAttach( 'chek/description-term' );
		placeCursorAtStart();
		pressTab();

		expect( createBlock ).toHaveBeenCalledWith(
			'chek/description-details',
			{ content: 'My Term' }
		);
		expect( mockReplaceBlock ).toHaveBeenCalledWith(
			CLIENT_ID,
			expect.objectContaining( {
				name: 'chek/description-details',
			} )
		);
	} );

	it( 'does NOT transform DT on Tab when cursor is in the middle', () => {
		setupMocks( { content: 'My Term' } );
		callHookAndAttach( 'chek/description-term' );
		placeCursorInMiddle();
		pressTab();

		expect( mockReplaceBlock ).not.toHaveBeenCalled();
	} );

	it( 'does NOT transform DT on Shift+Tab', () => {
		setupMocks( { content: 'My Term' } );
		callHookAndAttach( 'chek/description-term' );
		placeCursorAtStart();
		pressTab( { shiftKey: true } );

		expect( mockReplaceBlock ).not.toHaveBeenCalled();
	} );

	// --- DD: Shift+Tab → DT ---

	it( 'transforms DD to DT on Shift+Tab when cursor is at start', () => {
		setupMocks( { content: 'My Description' } );
		callHookAndAttach( 'chek/description-details' );
		placeCursorAtStart();
		pressTab( { shiftKey: true } );

		expect( createBlock ).toHaveBeenCalledWith(
			'chek/description-term',
			{ content: 'My Description' }
		);
		expect( mockReplaceBlock ).toHaveBeenCalledWith(
			CLIENT_ID,
			expect.objectContaining( {
				name: 'chek/description-term',
			} )
		);
	} );

	it( 'does NOT transform DD on Shift+Tab when cursor is in the middle', () => {
		setupMocks( { content: 'My Description' } );
		callHookAndAttach( 'chek/description-details' );
		placeCursorInMiddle();
		pressTab( { shiftKey: true } );

		expect( mockReplaceBlock ).not.toHaveBeenCalled();
	} );

	it( 'does NOT transform DD on Tab (without shift)', () => {
		setupMocks( { content: 'My Description' } );
		callHookAndAttach( 'chek/description-details' );
		placeCursorAtStart();
		pressTab();

		expect( mockReplaceBlock ).not.toHaveBeenCalled();
	} );

	// --- General ---

	it( 'prevents default when transform happens', () => {
		setupMocks( { content: 'Term' } );
		callHookAndAttach( 'chek/description-term' );
		placeCursorAtStart();
		const event = pressTab();

		expect( event.defaultPrevented ).toBe( true );
	} );

	it( 'does NOT prevent default when no transform happens', () => {
		setupMocks( { content: 'Term' } );
		callHookAndAttach( 'chek/description-term' );
		placeCursorInMiddle();
		const event = pressTab();

		expect( event.defaultPrevented ).toBe( false );
	} );

	it( 'selects the new block at position 0 after transform', () => {
		setupMocks( { content: 'Term' } );
		callHookAndAttach( 'chek/description-term' );
		placeCursorAtStart();
		pressTab();

		// createBlock returns a mock with a clientId.
		const newBlock = createBlock.mock.results[ createBlock.mock.results.length - 1 ].value;
		expect( mockSelectBlock ).toHaveBeenCalledWith(
			newBlock.clientId,
			0
		);
	} );

	it( 'ignores non-Tab keys entirely', () => {
		setupMocks( { content: 'Term' } );
		callHookAndAttach( 'chek/description-term' );
		placeCursorAtStart();

		const event = new KeyboardEvent( 'keydown', {
			key: 'Enter',
			bubbles: true,
			cancelable: true,
		} );
		element.dispatchEvent( event );

		expect( mockReplaceBlock ).not.toHaveBeenCalled();
	} );
} );
